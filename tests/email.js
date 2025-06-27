const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Function to send email
async function sendEmailWithReport() {
  // Create a transporter using your SMTP configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.your-email-provider.com', // Replace with your SMTP server
    port: 587, // SMTP port (use 465 for secure)
    secure: false, // Set to true for port 465
    auth: {
      user: 'your-email@example.com', // Your email
      pass: 'your-email-password',   // Your email password
    },
  });

  // Read the generated HTML report
  const reportPath = path.join(__dirname, 'playwright-report', 'index.html');
  const reportHtml = fs.readFileSync(reportPath, 'utf-8');

  // Define the email options
  const mailOptions = {
    from: '"Automation Reports" <your-email@example.com>',
    to: 'recipient@example.com', // Recipient email(s)
    subject: 'Playwright Test Report',
    html: '<p>Please find the attached Playwright test report.</p>',
    attachments: [
      {
        filename: 'Playwright_Report.html',
        content: reportHtml,
        contentType: 'text/html',
      },
    ],
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully with the HTML report.');
}
