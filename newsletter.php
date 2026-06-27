<?php
/**
 * MAMO Cargo - Newsletter Subscription Handler
 */

header('Content-Type: application/json');

error_reporting(0);
ini_set('display_errors', 0);

// Configuration
$to = 'info@mamocargo.com';
$subject = 'New Newsletter Subscription - MAMO Cargo';

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
    
    $email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
    
    if (empty($email) || !validateEmail($email)) {
        $response['message'] = 'Please enter a valid email address';
    } else {
        
        // Log subscription to file (or database in production)
        $logFile = __DIR__ . '/../data/newsletter.txt';
        $data = date('Y-m-d H:i:s') . ' - ' . $email . "\n";
        
        // Create data directory if it doesn't exist
        if (!is_dir(dirname($logFile))) {
            mkdir(dirname($logFile), 0755, true);
        }
        
        file_put_contents($logFile, $data, FILE_APPEND);
        
        // Send notification email
        $emailContent = "
<html>
<head>
    <title>New Newsletter Subscription</title>
</head>
<body>
    <h2>New Newsletter Subscription</h2>
    <p>A new user has subscribed to the MAMO Cargo newsletter.</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Date:</strong> " . date('Y-m-d H:i:s') . "</p>
</body>
</html>
";
        
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8\r\n";
        $headers .= "From: MAMO Cargo Website <noreply@mamocargo.com>\r\n";
        
        mail($to, $subject, $emailContent, $headers);
        
        $response['success'] = true;
        $response['message'] = 'Thank you for subscribing!';
    }
} else {
    $response['message'] = 'Invalid request';
}

echo json_encode($response);
exit;
