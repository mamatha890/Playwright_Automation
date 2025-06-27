const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const archiver = require('archiver');
const CustomReport=require('./Utils/Custome.js')

class CustomReporter {
  constructor() {
    this.errors = []; // Store errors during test execution
  }

  // Collect errors for failed tests
  onTestEnd(test, result) {
    if (result.status === 'failed') {
      const errorDetails = result.errors.map((err) => err.message).join('\n');
      console.error(`Test failed: ${test.title}\nError: ${errorDetails}`);
      this.errors.push({ title: test.title, error: errorDetails });
    }
  }

  // Function to execute at the end of tests
  async onEnd() {
    console.log('Test execution completed. Preparing report folder...');

    const reportFolder = path.join(__dirname, 'report', 'html-report');
    const zipFilePath = path.join(__dirname, 'html-report.zip'); // Ensure zip file is created outside the 'report' folder

    // Verify report folder exists
    if (!fs.existsSync(reportFolder)) {
      console.error('Report folder not found:', reportFolder);
      return;
    }

    // Zip the report folder
    await this.zipFolder(reportFolder, zipFilePath);

    console.log('Report folder zipped successfully:', zipFilePath);

    // Send the zipped report via email
    await this.sendEmail(zipFilePath);
  }

  // Function to zip the folder
  async zipFolder(folderPath, zipFilePath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });
  
      output.on('close', () => {
        console.log(`${archive.pointer()} total bytes`);
        console.log('Zipping has been finalized.');
        resolve();
      });

      archive.on('error', (err) => {
        console.error('Error during zipping:', err);
        reject(err);
      });

      archive.pipe(output);
      archive.directory(folderPath, false); // Add all files and subfolders
      archive.finalize();
    });
  }

  // Function to send the zipped report via email
  async sendEmail(zipFilePath) {
    // SMTP configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com', // Change to your SMTP server
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: 'test.automation@ideabytes.com', // Your email
        pass: '@bytes28901', // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: 'test.automation@ideabytes.com', // Sender address
      to: 'mamatha.sangana@ideabytes.com', // Recipient address
      subject: 'Automated Test Report',
      text: 'Test execution completed. Please find the attached zipped test report.',
      attachments: [
        {
          filename: 'html-report.zip',
          path: zipFilePath,
          contentType: 'application/zip',
        },
      ],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  }
}

module.exports = CustomReporter;
