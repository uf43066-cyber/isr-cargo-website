<?php
/**
 * MAMO Cargo - Contact Form Handler
 * Processes contact form submissions
 */

header('Content-Type: application/json');

error_reporting(0);
ini_set('display_errors', 0);

// Configuration
$to = 'info@mamocargo.com';
$subject = 'New Contact Message - MAMO Cargo Website';

// Sanitize and validate input
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
    $subject_msg = isset($_POST['subject']) ? sanitize($_POST['subject']) : '';
    $message = isset($_POST['message']) ? sanitize($_POST['message']) : '';
    
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (empty($email) || !validateEmail($email)) {
        $errors[] = 'Valid email is required';
    }
    
    if (empty($subject_msg)) {
        $errors[] = 'Subject is required';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    }
    
    if (empty($errors)) {
        
        $subject_map = [
            'quote' => 'Quote Request',
            'tracking' => 'Shipment Tracking Inquiry',
            'general' => 'General Inquiry',
            'complaint' => 'Complaint',
            'partnership' => 'Business Partnership'
        ];
        
        $subject_type = isset($subject_map[$subject_msg]) ? $subject_map[$subject_msg] : 'General Inquiry';
        
        $emailContent = "
<html>
<head>
    <title>New Contact Message - MAMO Cargo</title>
</head>
<body>
    <h2>New Contact Message from MAMO Cargo Website</h2>
    <table style='border-collapse: collapse; width: 100%; max-width: 600px;'>
        <tr>
            <th style='text-align: left; padding: 10px; border: 1px solid #ddd; background-color: #f5f5f5;'>Field</th>
            <th style='text-align: left; padding: 10px; border: 1px solid #ddd;'>Details</th>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Name</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$name</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Email</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$email</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Phone</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$phone</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Subject</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$subject_type</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Message</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$message</td>
        </tr>
    </table>
    <p style='margin-top: 20px; color: #666;'>
        This message was submitted from the MAMO Cargo website.
    </p>
</body>
</html>
";
        
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8\r\n";
        $headers .= "From: MAMO Cargo Website <noreply@mamocargo.com>\r\n";
        $headers .= "Reply-To: $email\r\n";
        
        if (mail($to, $subject . ' - ' . $subject_type, $emailContent, $headers)) {
            $response['success'] = true;
            $response['message'] = 'Message sent successfully!';
            
            // Send confirmation
            $confirmSubject = 'We Received Your Message - MAMO Cargo';
            $confirmContent = "
<html>
<body>
    <h2>Thank you for contacting MAMO Cargo!</h2>
    <p>Dear $name,</p>
    <p>We have received your message. Our team will get back to you as soon as possible, typically within 24 hours.</p>
    <p><strong>Your Message Summary:</strong></p>
    <p>$message</p>
    <p>If you have urgent inquiries, please contact us directly at +971 58 919 5672.</p>
    <p>Best regards,<br>MAMO Cargo Team</p>
</body>
</html>
";
            $confirmHeaders = "MIME-Version: 1.0\r\n";
            $confirmHeaders .= "Content-type:text/html;charset=UTF-8\r\n";
            $confirmHeaders .= "From: MAMO Cargo <noreply@mamocargo.com>\r\n";
            
            mail($email, $confirmSubject, $confirmContent, $confirmHeaders);
            
        } else {
            $response['message'] = 'Failed to send message. Please try again.';
        }
    } else {
        $response['message'] = implode(', ', $errors);
    }
} else {
    $response['message'] = 'Invalid request';
}

echo json_encode($response);
exit;
