const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure transporter using .env variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo'
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email service is ready to send emails');
  }
});

// Send email function
const sendEmail = async (to, subject, htmlContent, textContent) => {
  try {
    const mailOptions = {
      from: `"NurtureOrphan" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: textContent || '',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

// Send volunteer contact email
const sendVolunteerContactEmail = async (volunteerEmail, volunteerName, senderName, senderEmail, subject, message) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Volunteer Opportunity</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2c7a4d, #1e5a3a); padding: 30px; text-align: center; border-radius: 20px 20px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .header p { color: #e8f3ed; margin: 10px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 20px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .message-box { background: #f0f7f3; padding: 20px; border-radius: 15px; margin: 20px 0; border-left: 4px solid #2c7a4d; }
        .info-box { background: #fff8f0; padding: 15px; border-radius: 15px; margin: 20px 0; }
        .button { display: inline-block; background: #2c7a4d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #8a9a9a; border-top: 1px solid #e8ecef; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤝 NurtureOrphan</h1>
          <p>Volunteer Opportunity</p>
        </div>
        <div class="content">
          <p style="font-size: 16px; color: #333;">Dear <strong>${volunteerName}</strong>,</p>
          
          <p>Someone from NurtureOrphan is interested in connecting with you regarding volunteer opportunities.</p>
          
          <div class="message-box">
            <p style="margin: 0 0 10px;"><strong>📝 Message from ${senderName}:</strong></p>
            <p style="margin: 0; color: #444; line-height: 1.5;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div class="info-box">
            <p style="margin: 0 0 5px;"><strong>👤 From:</strong> ${senderName}</p>
            <p style="margin: 0 0 5px;"><strong>📧 Reply to:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
            <p style="margin: 0;"><strong>📅 Sent on:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <a href="mailto:${senderEmail}" class="button">📧 Reply Now</a>
          
          <div class="footer">
            <p>This email was sent from NurtureOrphan. We believe in making a difference in children's lives.</p>
            <p>© 2025 NurtureOrphan | Bringing hope to orphan children worldwide</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    NurtureOrphan - Volunteer Opportunity
    
    Dear ${volunteerName},
    
    
    Message from ${senderName}:
    ${message}
    
    Reply to: ${senderEmail}
    Sent on: ${new Date().toLocaleString()}
    
    ---
    This email was sent from NurtureOrphan.
  `;

  return await sendEmail(volunteerEmail, subject || 'Volunteer Opportunity from NurtureOrphan', htmlContent, textContent);
};

// Send adoption status email
const sendAdoptionStatusEmail = async (userEmail, userName, childName, status) => {
  const statusText = status === 'approved' ? 'Approved ✅' : status === 'rejected' ? 'Rejected ❌' : 'Pending Review';
  const statusColor = status === 'approved' ? '#2c7a4d' : status === 'rejected' ? '#e74c3c' : '#e67e22';
  const statusMessage = status === 'approved' 
    ? 'Congratulations! Please contact the orphanage to complete the adoption process.'
    : status === 'rejected'
    ? 'We encourage you to look at other children who are waiting for a loving home.'
    : 'We will notify you once there is an update on your request.';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Adoption Request Update</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2c7a4d, #1e5a3a); padding: 30px; text-align: center; border-radius: 20px 20px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 20px 20px; }
        .status { display: inline-block; padding: 8px 20px; border-radius: 50px; font-weight: bold; margin: 15px 0; }
        .button { display: inline-block; background: #2c7a4d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #8a9a9a; border-top: 1px solid #e8ecef; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 Adoption Request Update</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Your adoption request for <strong>${childName}</strong> has been updated.</p>
          <div style="text-align: center;">
            <div class="status" style="background: ${statusColor}20; color: ${statusColor}; border: 1px solid ${statusColor}40;">
              ${statusText}
            </div>
          </div>
          <p>${statusMessage}</p>
          <a href="http://localhost:5173/adoption" class="button">📋 View My Requests</a>
          <div class="footer">
            <p>© 2025 NurtureOrphan | Bringing hope to orphan children worldwide</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, `Adoption Request ${statusText}`, htmlContent);
};

// Send story approval email
const sendStoryApprovalEmail = async (userEmail, userName, storyTitle) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your Story Published</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e25c2c, #c24418); padding: 30px; text-align: center; border-radius: 20px 20px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 20px 20px; }
        .button { display: inline-block; background: #e25c2c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #8a9a9a; border-top: 1px solid #e8ecef; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Your Story Has Been Published!</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>We are happy to inform you that your story "<strong>${storyTitle}</strong>" has been reviewed and published on our platform.</p>
          <p>Thank you for sharing your inspiring journey with us. Your story will motivate and encourage others to make a difference.</p>
          <a href="http://localhost:5173/stories" class="button">📖 Read Your Story</a>
          <div class="footer">
            <p>© 2025 NurtureOrphan | Bringing hope to orphan children worldwide</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, 'Your Story Has Been Published!', htmlContent);
};

module.exports = {
  sendEmail,
  sendVolunteerContactEmail,
  sendAdoptionStatusEmail,
  sendStoryApprovalEmail
};