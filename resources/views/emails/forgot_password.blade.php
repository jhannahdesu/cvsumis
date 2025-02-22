<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
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
  
  /* Content styling */
  .content {
    padding: 20px;
    font-size: 16px;
    line-height: 1.6;
  }
  
  .content p {
    margin: 0 0 10px;
  }
  
  /* Button styling */
  .reset-button {
    display: inline-block;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
    font-weight: bold;
    border-radius: 5px;
    text-align: center;
    margin-top: 20px;
  }
  
  .reset-button:hover {
    background-color: #0056b3;
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
    <div class="header">Reset Your Password</div>
    <div class="content">
      <p>Hi [{{ $email }}],</p>
      <p>We received a request to reset your password. Click the button below to reset your password:</p>
      <a href="{{ $reset_link }}" class="reset-button">Reset Password</a>
      <p>If you did not request this reset, please ignore this email or contact our support team if you have any concerns.</p>
    </div>
    <div class="footer">
      &copy; 2024 CEIT. All rights reserved.
    </div>
  </div>
</body>
</html>
