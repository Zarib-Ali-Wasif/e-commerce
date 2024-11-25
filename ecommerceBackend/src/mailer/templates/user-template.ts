export const otpSendTemplate = (email: string, otp: string) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <title>Email Template</title>
    
        <!-- Include Bootstrap CSS from a CDN (Content Delivery Network) -->
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
    
        <style>
          /* Add custom styles for the email template here */
          body {
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px !important;
            margin: 0 auto !important;
            padding: 20px !important;
            background-color: #fff !important;
            border-radius: 5px !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
          }
          .outerbox {
            background-color: #000000 !important;
            width: 100% !important; /* Adjusted to 100% for responsiveness */
            margin: 0 auto !important;
          }
          .logo {
            display: flex !important;
            margin:10px auto !important;
            width:max-content !important;
            margin-bottom: 20px !important;
            padding-top: 10px !important;
          }
          .btn {
            margin-top: 60px !important;
            background-color: #186f65 !important;
            border-radius: 48px !important;
            width: 100%; /* Adjusted to 100% for responsiveness */
            color: #fff !important;
            padding: 10px 20px !important;
            text-decoration: none !important;
            transition: background-color 0.3s ease !important;
          }
          .btn:hover,
          .btn:active {
            background-color: #FF8500 !important;
          }

          .footerLogos {
            display: flex !important;
            margin:0 auto !important;
            width:max-content !important;
            gap: 20px !important;
            margin-top: 50px !important;
            margin-bottom: 50px !important;
            padding-bottom: 50px !important;
            padding:20px !important;
            padding-top: 5px !important;
          }
    
          .resetImage {
            display: flex !important;
            margin: 0 auto !important;

            width:max-content !important;
            align-items: center !important;
            height: 18rem !important; /* Adjusted to "auto" for responsiveness */
          }
          .resetImage img {
            max-width: 100% !important; /* Adjusted to "100%" for responsiveness */
            height: auto !important; /* Adjusted to "auto" for responsiveness */
          }
          .content {
            margin-top: 60px !important;
            color: #000 !important;
            font-family: Inter !important;
            font-size: 20px !important;
            font-weight: 400 !important;
            line-height: normal !important;
          }
          .footer-content {
            margin-top: 30px; /* Adjusted for responsiveness */
            color: #000 !important;
            text-align: center !important;
            font-family: Inter !important;
            font-size: 20px !important;
            font-style: normal !important;
            font-weight: 400 !important;
            line-height: normal !important;
            justify-content: center !important;
          }
          .footer-content a{
            color: #186F65 !important;
          }
          .heading {
            color: #000 !important;
            font-family: Inter !important;
            font-size: 26px !important;
            font-style: normal !important;
            font-weight: 600 !important;
            line-height: normal !important;
            text-transform: uppercase !important;
          }
          .greeting-section {
            color: #000 !important;
            font-family: Inter !important;
            font-size: 24px !important;
            font-style: normal !important;
            font-weight: 400 !important;
            line-height: normal !important;
            text-transform: capitalize !important;
            text-align: center !important;
          }
  
          .text-center {
            text-align:center !important
          }
  
          .anchor{
            margin:10px !important;
          }
        </style>
      </head>
      <body>
        <div class="outerbox">
          <div class="logo">
            <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715358093/ECHELON/xe4aichwbvwm4cd32psb.png" alt="ECHELON" srcset="" style="width: 100px;" />
          </div>
          <div class="container innerContainer">
            <!-- Header -->
            <div class="resetImage">
              <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715358530/ECHELON/mvrnugynop5a5s8tvzfp.png" alt="verify email image" />
            </div>
            <header class="heading">
              <p class="text-center" style="margin-bottom: 0;" >VERIFY YOUR EMAIL</p>
            </header>

            <!-- Content -->
            <div class="greeting-section"><p><span style="color:#ff8500">Hi</span> &nbsp;${email.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())},</p></div>

            <div class="container" style="padding-top: 0;">
                 <h4 style="font-family: Inter !important;">Welcome to ECHELON! Your OTP code is below:</h4>
                

                 <!-- Styled OTP Text -->
                 <p class="text-center" style="background-color: none; color: #FF8500; font-size: xx-large; font-weight: 700;  align-items: center !important;  margin-top: 0;">
                ${otp}
                 </p>
             
             </div>
    
            <!-- Footer -->
          </div>
          <div class="footerLogos" style="display: flex; justify-content: center;">
            <a class="anchor" href="#">
              <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715357875/ECHELON/p95ntolj40tzdqklzbl5.jpg"
              } alt="Facebook" style="width: 15px;" /> 
              </a>
              <a class="anchor" href="#">
              <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715357986/ECHELON/ivw9bnu7wadljg7im75o.jpg" alt="Twitter" style="width: 31px;"/>
              </a>
  
              <a class="anchor" href="#">
                <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715358022/ECHELON/zesz61mh0zehcbrvac91.jpg" alt="Instagram" style="width: 25px; "/>
             </a>
          </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>`;
};

export const forgetPasswordTemplate = (email: string, otp: string) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <title>Email Template</title>
    
        <!-- Include Bootstrap CSS from a CDN (Content Delivery Network) -->
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
    
        <style>
          /* Add custom styles for the email template here */
          body {
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px !important;
            margin: 0 auto !important;
            padding: 20px !important;
            background-color: #fff !important;
            border-radius: 5px !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
          }
          .outerbox {
            background-color: #000000 !important;
            width: 100% !important; /* Adjusted to 100% for responsiveness */
            margin: 0 auto !important;
          }
          .logo {
            display: flex !important;
            margin:10px auto !important;
            width:max-content !important;
            margin-bottom: 20px !important;
            padding-top: 10px !important;
          }
          .btn {
            margin-top: 60px !important;
            background-color: #186f65 !important;
            border-radius: 48px !important;
            width: 100%; /* Adjusted to 100% for responsiveness */
            color: #fff !important;
            padding: 10px 20px !important;
            text-decoration: none !important;
            transition: background-color 0.3s ease !important;
          }
          .btn:hover,
          .btn:active {
            background-color: #FF8500 !important;
          }

          .footerLogos {
            display: flex !important;
            margin:0 auto !important;
            width:max-content !important;
            gap: 20px !important;
            margin-top: 50px !important;
            margin-bottom: 50px !important;
            padding-bottom: 50px !important;
            padding:20px !important;
            padding-top: 5px !important;
          }
    
          .resetImage {
            display: flex !important;
            margin: 0 auto !important;

            width:max-content !important;
            align-items: center !important;
            height: 18rem !important; /* Adjusted to "auto" for responsiveness */
          }
          .resetImage img {
            max-width: 100% !important; /* Adjusted to "100%" for responsiveness */
            height: auto !important; /* Adjusted to "auto" for responsiveness */
          }
          .content {
            margin-top: 60px !important;
            color: #000 !important;
            font-family: Inter !important;
            font-size: 20px !important;
            font-weight: 400 !important;
            line-height: normal !important;
          }
          .footer-content {
            margin-top: 30px; /* Adjusted for responsiveness */
            color: #000 !important;
            text-align: center !important;
            font-family: Inter !important;
            font-size: 20px !important;
            font-style: normal !important;
            font-weight: 400 !important;
            line-height: normal !important;
            justify-content: center !important;
          }
          .footer-content a{
            color: #186F65 !important;
          }
          .heading {
            color: #000 !important;
            font-family: Inter !important;
            font-size: 26px !important;
            font-style: normal !important;
            font-weight: 600 !important;
            line-height: normal !important;
            text-transform: uppercase !important;
          }
          .greeting-section {
            color: #000 !important;
            font-family: Inter !important;
            font-size: 24px !important;
            font-style: normal !important;
            font-weight: 400 !important;
            line-height: normal !important;
            text-transform: capitalize !important;
            text-align: center !important;
          }
  
          .text-center {
            text-align:center !important
          }
  
          .anchor{
            margin:10px !important;
          }
        </style>
      </head>
      <body>
        <div class="outerbox">
          <div class="logo">
            <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715358093/ECHELON/xe4aichwbvwm4cd32psb.png" alt="ECHELON" srcset="" style="width: 100px;" />
          </div>
          <div class="container innerContainer">
            <!-- Header -->
            <div class="resetImage">
            <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715358625/ECHELON/sdrpth64moo0za573mdj.png" alt="Reset password image" />
            </div>
            <header class="heading">
              <p class="text-center" style="margin-bottom: 0;" >ESET YOUR PASSWORD</p>
            </header>

            <!-- Content -->
            <div class="greeting-section"><p><span style="color:#ff8500">Hi</span> &nbsp;${email.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())},</p></div>

            <div class="container" style="padding-top: 0;">
                 <p style="font-family: Inter !important; font-size: 16px !important;
                 font-weight: 400 !important;">It seems you've requested a password reset. No worries, we are here
                 to help! Your OTP code is below:</p>
                

                 <!-- Styled OTP Text -->
                 <p class="text-center" style="background-color: none; color: #FF8500; font-size: xx-large; font-weight: 700;  align-items: center !important;  margin-top: 0;">
                ${otp}
                 </p>
            </div>

            <!-- Footer -->
            <div class="footer-content">
              <p style="font-family: Inter !important; font-size: 16px !important;
              font-weight: 400 !important;">
                If you didn't request this, please ignore this email or contact our
                support for assistance.
              </p>
            </div>
    
            <!-- Footer -->
          </div>
          <div class="footerLogos" style="display: flex; justify-content: center;">
            <a class="anchor" href="#">
              <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715357875/ECHELON/p95ntolj40tzdqklzbl5.jpg"
              } alt="Facebook" style="width: 15px;" /> 
              </a>
              <a class="anchor" href="#">
              <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715357986/ECHELON/ivw9bnu7wadljg7im75o.jpg" alt="Twitter" style="width: 31px;"/>
              </a>
  
              <a class="anchor" href="#">
                <img src="https://res.cloudinary.com/ddsbuybfm/image/upload/v1715358022/ECHELON/zesz61mh0zehcbrvac91.jpg" alt="Instagram" style="width: 25px; "/>
             </a>
          </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>`;
};
