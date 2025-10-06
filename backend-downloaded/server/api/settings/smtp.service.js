const nodemailer = require('nodemailer');
const common = require('../../util/common');
const constant = require('../../util/constant');
const settingsDAL = require('./settings.helper');

/**
 * Test SMTP connection
 * POST /api/settings/test-smtp
 */
const testSmtpConnection = async (req, res) => {
  try {
    const smtpConfig = req.body;
    
    // Validate required fields
    if (!smtpConfig.smtp_host || !smtpConfig.smtp_port || !smtpConfig.smtp_auth_user || !smtpConfig.smtp_auth_pass) {
      return common.sendResponse(res, constant.requestMessages.SMTP_MISSING_FIELDS, false, 400);
    }

    // Create transporter configuration
    const transporterConfig = {
      host: smtpConfig.smtp_host,
      port: smtpConfig.smtp_port,
      secure: smtpConfig.smtp_secure || false, // true for SSL, false for TLS
      auth: {
        user: smtpConfig.smtp_auth_user,
        pass: smtpConfig.smtp_auth_pass
      },
      connectionTimeout: smtpConfig.smtp_connection_timeout || 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    };

    // Handle different encryption types
    if (smtpConfig.smtp_encryption === 'tls') {
      transporterConfig.requireTLS = true;
      transporterConfig.secure = false;
    } else if (smtpConfig.smtp_encryption === 'ssl') {
      transporterConfig.secure = true;
    } else if (smtpConfig.smtp_encryption === 'none') {
      transporterConfig.secure = false;
      transporterConfig.requireTLS = false;
    }

    // Log configuration for debugging (remove in production)
    console.info('SMTP Test Configuration:', {
      host: transporterConfig.host,
      port: transporterConfig.port,
      secure: transporterConfig.secure,
      requireTLS: transporterConfig.requireTLS,
      user: transporterConfig.auth.user,
      hasPassword: !!transporterConfig.auth.pass
    });

    // Create transporter
    const transporter = nodemailer.createTransport(transporterConfig);
    
    // Verify connection
    await transporter.verify();
    
    // Send success response
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SMTP_TEST_SUCCESS.message,
      details: {
        server: smtpConfig.smtp_host,
        port: smtpConfig.smtp_port,
        encryption: smtpConfig.smtp_encryption || 'none'
      }
    }, true, 200);

  } catch (error) {
    console.error('SMTP connection test failed:', error);
    
    // Parse specific SMTP errors
    let errorMessage = constant.requestMessages.SMTP_TEST_FAILED;
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      errorMessage = constant.requestMessages.SMTP_AUTH_ERROR;
    } else if (error.code === 'ECONNECTION' || error.code === 'ENOTFOUND') {
      errorMessage = constant.requestMessages.SMTP_CONNECTION_ERROR;
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      errorMessage = constant.requestMessages.SMTP_TIMEOUT_ERROR;
    }
    
    // Send error response with additional details
    common.sendResponse(res, {
      ...errorMessage,
      details: {
        error: error.message,
        errorCode: error.code,
        command: error.command
      }
    }, false, 400);
  }
};

/**
 * Send test email
 * POST /api/settings/test-smtp/send
 */
const sendTestEmail = async (req, res) => {
  try {
    const { to, subject, message, isHtml } = req.body;
    
    // Validate required fields
    if (!to) {
      return common.sendResponse(res, constant.requestMessages.SMTP_RECIPIENT_REQUIRED, false, 400);
    }

    // Get SMTP settings from database
    const settings = await settingsDAL.getSettings(1);
    
    if (!settings || !settings.smtp_enabled) {
      return common.sendResponse(res, constant.requestMessages.SMTP_DISABLED, false, 400);
    }

    // Create transporter configuration
    const transporterConfig = {
      host: settings.smtp_host,
      port: settings.smtp_port,
      secure: settings.smtp_secure || false,
      auth: {
        user: settings.smtp_auth_user,
        pass: settings.smtp_auth_pass
      },
      connectionTimeout: settings.smtp_connection_timeout || 5000
    };

    // Handle encryption
    if (settings.smtp_encryption === 'tls') {
      transporterConfig.requireTLS = true;
      transporterConfig.secure = false;
    } else if (settings.smtp_encryption === 'ssl') {
      transporterConfig.secure = true;
    } else if (settings.smtp_encryption === 'none') {
      transporterConfig.secure = false;
      transporterConfig.requireTLS = false;
    }

    // Create transporter
    const transporter = nodemailer.createTransport(transporterConfig);
    
    // Prepare email options
    const mailOptions = {
      from: settings.smtp_from_name 
        ? `"${settings.smtp_from_name}" <${settings.smtp_from_email}>` 
        : settings.smtp_from_email,
      to: to,
      subject: subject || 'Test Email from Duetto Analytics',
      [isHtml ? 'html' : 'text']: message || 'This is a test email to verify SMTP configuration.'
    };
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    // Send success response
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SMTP_EMAIL_SENT.message,
      details: {
        messageId: result.messageId,
        response: result.response,
        to: to
      }
    }, true, 200);

  } catch (error) {
    console.error('Failed to send test email:', error);
    
    // Send error response
    common.sendResponse(res, {
      ...constant.requestMessages.SMTP_EMAIL_FAILED,
      error: error.message
    }, false, 500);
  }
};

module.exports = {
  testSmtpConnection,
  sendTestEmail
};