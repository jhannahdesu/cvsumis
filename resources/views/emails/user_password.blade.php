<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Information</title>
<style>
  /* Container styling */
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  /* Header styling */
  .header {
    background-color: #007bff;
    color: #fff;
    padding: 15px;
    text-align: center;
    font-size: 24px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  
  /* Body styling */
  .content {
    padding: 20px;
    font-size: 16px;
    line-height: 1.6;
  }
  
  .content p {
    margin: 0 0 10px;
  }
  
  /* Password box styling */
  .password-box {
    background-color: #f8f9fa;
    color: #007bff;
    font-weight: bold;
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 15px 0;
  }
  
  /* Footer styling */
  .footer {
    background-color: #f1f1f1;
    padding: 15px;
    text-align: center;
    font-size: 14px;
    color: #555;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
</style>
</head>
<body>
  <div class="email-container">
    <div class="header">Your Account Password</div>
    <div class="content">
      <p>Hi {{ $email }},</p>
      <p>Your account password is:</p>
      <div class="password-box">[{{ $password }}]</div>
      <p>Please keep this password secure and do not share it with anyone.</p>
      <p>If you did not request this email, please contact our support team immediately.</p>
    </div>
    <div class="footer">
      &copy; 2024 CEIT. All rights reserved.
    </div>
  </div>
</body>
</html>
