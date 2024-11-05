import mail from '@adonisjs/mail/services/main'
import env from '#start/env'

export default {
  getValidationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  },

  async sendEmail(email: string, subject: string, html: string) {
    console.log(email, subject, html)
    await mail.use('smtp').send((message) => {
      message
        .to(email)
        .from(env.get('SMTP_EMAIL'))
        .bcc(env.get('SMTP_EMAIL'))
        .subject(subject)
        .html(html)
    })
  },
}
