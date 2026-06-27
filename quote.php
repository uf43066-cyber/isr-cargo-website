<?php
/**
 * MAMO Cargo - Quote Form Handler
 * Processes quote requests from customers
 */

header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
error_reporting(0);
ini_set('display_errors', 0);

// Configuration
$to = 'info@mamocargo.com';
$subject = 'New Quote Request - MAMO Cargo Website';

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

// Response array
$response = ['success' => false, 'message' => ''];

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get and sanitize form data
    $name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
    $origin = isset($_POST['origin']) ? sanitize($_POST['origin']) : '';
    $destination = isset($_POST['destination']) ? sanitize($_POST['destination']) : '';
    $weight = isset($_POST['weight']) ? sanitize($_POST['weight']) : '';
    $dimensions = isset($_POST['dimensions']) ? sanitize($_POST['dimensions']) : '';
    $service = isset($_POST['service']) ? sanitize($_POST['service']) : '';
    $message = isset($_POST['message']) ? sanitize($_POST['message']) : '';
    
    // Validate required fields
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (empty($email) || !validateEmail($email)) {
        $errors[] = 'Valid email is required';
    }
    
    if (empty($phone)) {
        $errors[] = 'Phone number is required';
    }
    
    if (empty($origin)) {
        $errors[] = 'Origin is required';
    }
    
    if (empty($destination)) {
        $errors[] = 'Destination is required';
    }
    
    if (empty($weight)) {
        $errors[] = 'Weight is required';
    }
    
    if (empty($service)) {
        $errors[] = 'Service type is required';
    }
    
    if (empty($errors)) {
        // Prepare email content
        $emailContent = "
<html>
<head>
    <title>New Quote Request - MAMO Cargo</title>
</head>
<body>
    <h2>New Quote Request from MAMO Cargo Website</h2>
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
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Service Type</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$service</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Origin</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$origin</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Destination</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$destination</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Weight (kg)</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$weight</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Dimensions</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$dimensions</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd;'><strong>Additional Message</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>$message</td>
        </tr>
    </table>
    <p style='margin-top: 20px; color: #666;'>
        This quote request was submitted from the MAMO Cargo website.
    </p>
</body>
</html>
";
        
        // Email headers
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: MAMO Cargo Website <noreply@mamocargo.com>" . "\r\n";
        $headers .= "Reply-To: $email" . "\r\n";
        
        // Send email
        if (mail($to, $subject, $emailContent, $headers)) {
            $response['success'] = true;
            $response['message'] = 'Quote request submitted successfully!';
            
            // Also send confirmation to customer
            $confirmSubject = 'Quote Request Received - MAMO Cargo';
            $confirmContent = "
<html>
<body>
    <h2>Thank you for your quote request!</h2>
    <p>Dear $name,</p>
    <p>We have received your quote request. Our team will review your requirements and get back to you within 24 hours with a competitive quote.</p>
    <p><strong>Your Request Details:</strong></p>
    <ul>
        <li>Origin: $origin</li>
        <li>Destination: $destination</li>
        <li>Service: $service</li>
        <li>Weight: $weight kg</li>
    </ul>
    <p>If you have any urgent inquiries, please contact us directly at +971 58 919 5672.</p>
    <p>Best regards,<br>MAMO Cargo Team</p>
</body>
</html>
";
            $confirmHeaders = "MIME-Version: 1.0\r\n";
            $confirmHeaders .= "Content-type:text/html;charset=UTF-8\r\n";
            $confirmHeaders .= "From: MAMO Cargo <noreply@mamocargo.com>\r\n";
            
            mail($email, $confirmSubject, $confirmContent, $confirmHeaders);
            
        } else {
            $response['message'] = 'Failed to send quote request. Please try again or contact us directly.';
        }
    } else {
        $response['message'] = implode(', ', $errors);
    }
} else {
    $response['message'] = 'Invalid request method';
}

echo json_encode($response);
exit;
