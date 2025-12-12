export default class ProviderService {
  async sendEmail(payload: any) {
    console.log("Email sent:", payload);
    return true;
  }

  async sendSMS(payload: any) {
    console.log("SMS sent:", payload);
    return true;
  }

  async sendPush(payload: any) {
    console.log("Push sent:", payload);
    return true;
  }
}
