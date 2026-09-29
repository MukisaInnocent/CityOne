import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let transporter;

function createTransporter() {
  if (transporter) return transporter;

  const isDev = process.env.NODE_ENV !== 'production';
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER;

  if (!hasSmtp) {
    // Dev mode: log emails to console
    logger.info('Email: No SMTP configured — emails will be logged to console');
    transporter = {
      sendMail: async (options) => {
        logger.info('═══ EMAIL (dev mode) ═══');
        logger.info(`To: ${options.to}`);
        logger.info(`Subject: ${options.subject}`);
        logger.info(`Body: ${options.text || '(HTML only)'}`);
        logger.info('════════════════════════');
        return { messageId: `dev-${Date.now()}` };
      }
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  if (isDev) {
    transporter.verify()
      .then(() => logger.info('Email: SMTP connection verified'))
      .catch(err => logger.warn('Email: SMTP verification failed —', err.message));
  }

  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const mailer = createTransporter();
  const from = process.env.EMAIL_FROM || 'City One Adventures <noreply@cityoneadventure.com>';

  try {
    const info = await mailer.sendMail({ from, to, subject, html, text });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Email failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

export default { sendEmail };
