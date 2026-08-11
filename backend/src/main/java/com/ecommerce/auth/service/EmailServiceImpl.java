package com.ecommerce.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationCode(String toEmail, String fullName, String code) {
        String subject = "Verify Your Account - Aura E-Shop";
        String htmlContent = buildHtmlEmailContent(fullName, code, "account registration", "5 minutes");
        
        // SECURE LOGGING: Never log OTPs in production code
        logger.info("[EmailService] Triggered sendVerificationCode to: {}", toEmail);
        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendPasswordResetOtp(String toEmail, String fullName, String otp) {
        String subject = "Password Reset OTP - Aura E-Shop";
        String htmlContent = buildHtmlEmailContent(fullName, otp, "password reset request", "5 minutes");
        
        // SECURE LOGGING: Never log OTPs in production code
        logger.info("[EmailService] Triggered sendPasswordResetOtp to: {}", toEmail);
        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        logger.info("[EmailService] Preparing HTML email to: '{}' | Subject: '{}'", toEmail, subject);

        // 1. Validate credentials
        if (fromEmail == null || fromEmail.contains("YOUR_GMAIL_USERNAME") || fromEmail.trim().isEmpty()) {
            logger.warn("[EmailService] SMTP configurations are not fully set up. spring.mail.username is using default placeholder: '{}'", fromEmail);
            return;
        }

        // 2. Build MimeMessage
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true sets it as HTML!

            logger.info("[EmailService] Dispatching SMTP HTML request via JavaMailSender...");
            mailSender.send(mimeMessage);
            logger.info("[EmailService] Email successfully delivered to: {}", toEmail);
        } catch (MessagingException | MailException e) {
            logger.error("[EmailService] CRITICAL: SMTP delivery failed to '{}'. Exception: {}", toEmail, e.getMessage());
            logger.error("[EmailService] Exception details: ", e);
            
            if (e.getMessage().contains("AuthenticationFailedException") || e.getMessage().contains("535 5.7.8")) {
                logger.error("[EmailService] HINT: Username/Password authentication rejected by SMTP server. " +
                        "If using Gmail SMTP, you must configure a 16-character 'App Password' instead of your regular account password. " +
                        "Make sure Google 2-Step Verification is active on the account.");
            } else if (e.getMessage().contains("Connection refused") || e.getMessage().contains("MailConnectException")) {
                logger.error("[EmailService] HINT: Connection refused. Check if your mail port (e.g. 587) or SMTP host is correct, " +
                        "or check your local network connection/firewall settings.");
            }
        }
    }

    private String buildHtmlEmailContent(String fullName, String otp, String actionText, String validityText) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "<meta charset=\"UTF-8\">\n" +
                "<style>\n" +
                "  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; color: #333333; }\n" +
                "  .email-container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e1e4e8; }\n" +
                "  .email-header { background-color: #4f46e5; padding: 30px; text-align: center; color: #ffffff; }\n" +
                "  .email-header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }\n" +
                "  .email-body { padding: 40px 30px; line-height: 1.6; }\n" +
                "  .email-body p { margin-top: 0; margin-bottom: 20px; font-size: 16px; color: #4a5568; }\n" +
                "  .otp-box { background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; border: 1px dashed #cbd5e1; }\n" +
                "  .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #4f46e5; margin: 0; font-family: monospace; }\n" +
                "  .validity-note { font-weight: 600; color: #ef4444; }\n" +
                "  .security-notice { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin-top: 30px; font-size: 14px; color: #991b1b; }\n" +
                "  .email-footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }\n" +
                "</style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"email-container\">\n" +
                "    <div class=\"email-header\">\n" +
                "      <h1>Aura E-Shop</h1>\n" +
                "    </div>\n" +
                "    <div class=\"email-body\">\n" +
                "      <p>Dear " + fullName + ",</p>\n" +
                "      <p>Thank you for choosing Aura E-Shop. Please use the following One-Time Password (OTP) to complete your " + actionText + ":</p>\n" +
                "      <div class=\"otp-box\">\n" +
                "        <h2 class=\"otp-code\">" + otp + "</h2>\n" +
                "      </div>\n" +
                "      <p>This OTP is valid for <span class=\"validity-note\">" + validityText + "</span>. After this period, you will need to request a new one.</p>\n" +
                "      <div class=\"security-notice\">\n" +
                "        <strong>Security Notice:</strong> Do not share this OTP with anyone, including Aura E-Shop staff. We will never ask for your password or OTP.\n" +
                "      </div>\n" +
                "    </div>\n" +
                "    <div class=\"email-footer\">\n" +
                "      <p>&copy; 2026 Aura E-Shop. All rights reserved.</p>\n" +
                "      <p>This is an automated security message. Please do not reply to this email.</p>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
    }
}
