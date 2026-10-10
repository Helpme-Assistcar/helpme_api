const nodemailer = require("nodemailer");

class EmailService {
  #transporter;

  #getTransporter() {
    if (!this.#transporter) {
      this.#transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return this.#transporter;
  }

  async sendReferralPayoutEmail({
    to,
    clientName,
    referralCount,
    totalAmount,
    test = false,
  }) {
    const formattedAmount = totalAmount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    await this.#getTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `${test ? "[TESTE] " : ""}Você tem indicações a receber no Helpme!`,
      html: `
        <p>Olá, ${clientName}!</p>
        <p>Você indicou ${referralCount} novo(s) profissional(is) que já pagaram a primeira mensalidade no Helpme. Isso te dá direito a <strong>${formattedAmount}</strong>.</p>
        <p>Para receber o pagamento, responda este e-mail com os seguintes dados:</p>
        <ul>
          <li>Nome completo</li>
          <li>Chave PIX (ou dados bancários)</li>
        </ul>
        <p>Obrigado por fazer parte do Helpme!</p>
      `,
    });
  }
}

module.exports = new EmailService();
