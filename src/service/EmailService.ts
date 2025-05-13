import { ReactNode } from "react"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export class EmailService {
  static async send(template: ReactNode, to: string[], subject: string) {
    return await resend.emails.send({
      from: "Admin <admin@ducle.online>",
      to,
      subject,
      react: template,
    })
  }

 


}
