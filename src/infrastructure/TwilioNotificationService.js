//MADE BY AI!
class TwilioNotificationService {
  constructor(accountSid = process.env.TWILIO_ACCOUNT_SID, authToken = process.env.TWILIO_AUTH_TOKEN) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
  }

  async sendSms(phoneNumber, message) {
    if (!this.accountSid || !this.authToken) {
      console.log(`[Mock SMS] To: ${phoneNumber}, Message: ${message}`);
      return { sid: 'mock-sid', status: 'sent' };
    }

    try {
      const twilio = require('twilio');
      const client = twilio(this.accountSid, this.authToken);

      const result = await client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber
      });

      return result;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  }

  async sendEmail(email, subject, body) {
    console.log(`[Mock Email] To: ${email}, Subject: ${subject}`);
    return { status: 'sent' };
  }
}

module.exports = TwilioNotificationService;
