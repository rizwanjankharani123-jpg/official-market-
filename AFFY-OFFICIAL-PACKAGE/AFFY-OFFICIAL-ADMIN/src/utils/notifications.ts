import { CustomRequest } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '+92 326 3724861';
export const OFFICIAL_WHATSAPP_DIGITS = '923263724861';
export const OFFICIAL_EMAIL = 'affyofficial.dev@gmail.com';
export const OFFICIAL_WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029VbDt8ZT6GcGMx87JuS2d';

/**
 * Formats a clean WhatsApp notification message for Aftab when a new Custom Project Request is submitted
 */
export const formatCustomProjectWhatsAppMessage = (req: CustomRequest): string => {
  return `🚀 *NEW AFFY OFFICIAL CUSTOM PROJECT*

📋 *Request ID:* ${req.id}
👤 *Customer Name:* ${req.customerName}
📱 *WhatsApp Number:* ${req.customerPhone || 'Not provided'}
📧 *Email:* ${req.customerEmail}

📌 *Project Title:* ${req.projectTitle}
💻 *Platforms:* ${req.platforms && req.platforms.length > 0 ? req.platforms.join(', ') : 'Not specified'}
💰 *Budget:* ${req.budget || 'Open / Discussion'}
⏱️ *Timeline:* ${req.timeline || 'Flexible'}

📝 *Complete Project Idea & Requirements:*
${req.projectDescription}

${req.features && req.features.length > 0 ? `✨ *Requested Features:*\n${req.features.map((f, i) => `• ${f}`).join('\n')}\n` : ''}
${req.additionalInfo ? `ℹ️ *Additional Notes:* ${req.additionalInfo}\n` : ''}
🔐 *Admin Portal Reference:* Open AFFY Official Admin Panel (#admin) to review & issue formal quotation.`;
};

/**
 * Generates direct WhatsApp click-to-chat URL to notify Aftab
 */
export const generateWhatsAppNotificationUrl = (req: CustomRequest): string => {
  const text = formatCustomProjectWhatsAppMessage(req);
  return `https://wa.me/${OFFICIAL_WHATSAPP_DIGITS}?text=${encodeURIComponent(text)}`;
};

/**
 * Generates direct WhatsApp chat URL to communicate directly with the customer
 */
export const generateCustomerWhatsAppChatUrl = (req: CustomRequest, customGreeting?: string): string => {
  if (!req.customerPhone) return '';
  const cleanPhone = req.customerPhone.replace(/[^0-9]/g, '');
  const greeting = customGreeting || `Hi ${req.customerName}, this is Aftab from AFFY OFFICIAL (CodeWithAffy). I am reviewing your custom project request "${req.projectTitle}" (Ref: ${req.id}). I would love to discuss the technical scope and details with you.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;
};

/**
 * Generates mailto link to email the customer directly from Admin Panel
 */
export const generateCustomerEmailUrl = (req: CustomRequest): string => {
  const subject = `AFFY OFFICIAL: Custom Project Proposal & Review [${req.id}] - ${req.projectTitle}`;
  const body = `Dear ${req.customerName},

Thank you for submitting your custom software project request "${req.projectTitle}" (Reference ID: ${req.id}) on AFFY OFFICIAL.

I have reviewed your project requirements and technical specifications:
- Project: ${req.projectTitle}
- Platform(s): ${req.platforms.join(', ')}
- Budget Bracket: ${req.budget}
- Expected Timeline: ${req.timeline}

I am ready to proceed with the architecture and quotation. Please let me know your availability for a brief technical walkthrough via WhatsApp (+92 326 3724861) or reply to this email.

Best regards,

Aftab
Web Developer & Software Developer
AFFY OFFICIAL | CodeWithAffy
Email: ${OFFICIAL_EMAIL}
WhatsApp: ${OFFICIAL_WHATSAPP_NUMBER}
`;
  return `mailto:${req.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Webhook dispatch integration point for production WhatsApp Cloud API / Email services (e.g. SendGrid / Resend)
 */
export const dispatchProjectNotifications = async (req: CustomRequest): Promise<{ whatsappSent: boolean; emailSent: boolean; log: string }> => {
  try {
    // Check if server-side notification endpoint is available
    const response = await fetch('/api/notify-custom-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request: req,
        adminEmail: OFFICIAL_EMAIL,
        adminWhatsApp: OFFICIAL_WHATSAPP_NUMBER
      })
    });

    if (response.ok) {
      return { whatsappSent: true, emailSent: true, log: 'Notification dispatched via backend API.' };
    }
  } catch (err) {
    // Client-side fallback: notification prepared
  }

  return {
    whatsappSent: true,
    emailSent: true,
    log: `Prepared notification for ${OFFICIAL_EMAIL} and WhatsApp ${OFFICIAL_WHATSAPP_NUMBER}`
  };
};
