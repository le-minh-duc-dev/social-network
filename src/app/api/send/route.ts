import AccountApprovedEmail from "@/email/AccountApprovedEmail"
import { EmailService } from "@/service/EmailService"

export async function GET() {
  try {
    const { data, error } = await EmailService.send(
      AccountApprovedEmail({ name: "Duc" }),
      ["minhduc8a2.clone@gmail.com"],
      "Welcome"
    )

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json(data)
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
