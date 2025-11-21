const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const validator = require('email-validator');

const router = express.Router();

// Rate limiting - prevent spam
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: 'Too many email requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input sanitization function
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000); // Limit length
};

// Email validation function
const validateEmailData = (data) => {
  const errors = [];

  // Validate name
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  // Validate email
  if (!data.email || !validator.validate(data.email)) {
    errors.push('Valid email address is required');
  }

  // Validate message
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }
  if (data.message && data.message.length > 5000) {
    errors.push('Message must be less than 5000 characters');
  }

  return errors;
};

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
};

// POST /api/contact - Send email
router.post('/contact', emailLimiter, async (req, res) => {
  try {
    // Extract and sanitize input
    const { name, email, message } = req.body;

    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message),
    };

    // Validate input
    const validationErrors = validateEmailData(sanitizedData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    // Check required environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return res.status(500).json({
        success: false,
        message: 'Email service not configured. Please contact the administrator.',
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return res.status(500).json({
        success: false,
        message: 'Email service is temporarily unavailable. Please try again later.',
      });
    }

    // Email to site owner
    const ownerMailOptions = {
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'lokeshtrivedi2004@gmail.com',
      replyTo: sanitizedData.email,
      subject: `Portfolio Contact from ${sanitizedData.name}`,
      text: `
Name: ${sanitizedData.name}
Email: ${sanitizedData.email}

Message:
${sanitizedData.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A192F; color: #CCD6F6;">
          <div style="background: linear-gradient(135deg, #64FFDA 0%, #112240 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; color: #0A192F; font-size: 24px;">New Contact Message</h1>
          </div>
          
          <div style="background-color: #112240; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="margin-bottom: 20px;">
              <p style="color: #64FFDA; margin: 0 0 5px 0; font-weight: bold;">From:</p>
              <p style="margin: 0; font-size: 16px;">${sanitizedData.name}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="color: #64FFDA; margin: 0 0 5px 0; font-weight: bold;">Email:</p>
              <p style="margin: 0;">
                <a href="mailto:${sanitizedData.email}" style="color: #CCD6F6; text-decoration: none;">
                  ${sanitizedData.email}
                </a>
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="color: #64FFDA; margin: 0 0 10px 0; font-weight: bold;">Message:</p>
              <div style="background-color: #0A192F; padding: 15px; border-radius: 5px; border-left: 3px solid #64FFDA;">
                <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${sanitizedData.message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #64FFDA;">
              <p style="margin: 0; font-size: 12px; color: #8892B0;">
                This message was sent from your portfolio contact form.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send email to owner
    const info = await transporter.sendMail(ownerMailOptions);
    console.log('Email sent successfully:', info.messageId);

    // Optional: Send auto-reply to sender
    const autoReplyOptions = {
      from: `"Lokesh Trivedi" <${process.env.SMTP_USER}>`,
      to: sanitizedData.email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A192F; color: #CCD6F6;">
          <div style="text-align: center; padding: 20px;">
            <h1 style="color: #64FFDA; margin-bottom: 10px;">Thank You!</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              Hi ${sanitizedData.name},
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for reaching out! I've received your message and will get back to you as soon as possible.
            </p>
            <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
              Best regards,<br>
              <strong style="color: #64FFDA;">Lokesh Trivedi</strong><br>
              Frontend Developer
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #64FFDA;">
              <p style="font-size: 12px; color: #8892B0;">
                📧 lokeshtrivedi2004@gmail.com<br>
                💼 <a href="https://linkedin.com/in/lokesh-trivedi" style="color: #64FFDA; text-decoration: none;">LinkedIn</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(autoReplyOptions);

    // Success response
    res.status(200).json({
      success: true,
      message: 'Email sent successfully! I will get back to you soon.',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Send generic error to client (don't expose internal details)
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later or contact me directly.',
    });
  }
});

// GET /api/contact/test - Test endpoint (development only)
if (process.env.NODE_ENV === 'development') {
  router.get('/test', (req, res) => {
    res.json({
      status: 'Email route is working',
      smtp: {
        configured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
        host: process.env.SMTP_HOST || 'not set',
      },
    });
  });
}

module.exports = router;
