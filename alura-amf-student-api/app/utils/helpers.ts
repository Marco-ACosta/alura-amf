import mail from '@adonisjs/mail/services/main'
import env from '#start/env'

export default {
  getValidationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  },

  async sendEmail(email: string, subject: string, html: string) {
    await mail.use('smtp').send((message) => {
      message
        .to(email)
        .from(env.get('SMTP_EMAIL'))
        .bcc(env.get('SMTP_EMAIL'))
        .subject(subject)
        .html(html)
    })
  },

  slugfy(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  },

  /**
   * Formats a given duration in seconds into a string representation of minutes and seconds.
   *
   * @param {number} durationInSeconds - The duration in seconds to be formatted.
   * @return {string} The formatted duration in the format "MM:SS".
   */
  formatDuration(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60)
    const remainingSeconds = durationInSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  },
}
