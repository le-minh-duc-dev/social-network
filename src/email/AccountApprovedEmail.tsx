// components/emails/AccountApprovedEmail.tsx

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
} from "@react-email/components"
import * as React from "react"

interface AccountApprovedEmailProps {
  name: string
}

export default function AccountApprovedEmail({
  name,
}: Readonly<AccountApprovedEmailProps>) {
  return (
    <Html>
      <Head />
      <Preview>Your account has been approved - welcome aboard!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>You&apos;re In, {name} 🎉</Heading>

          <Text style={text}>
            Good news! Your account has been approved by our administrator.
          </Text>

          <Text style={text}>
            You can now access the full features of our social network platform.
          </Text>

          <Section style={{ textAlign: "center", marginTop: "30px" }}>
            <Button href="https://social.ducle.online" style={button}>
              Visit Social Network
            </Button>
          </Section>

          <Text style={footerText}>
            Thanks for joining us, and we hope you enjoy your time here!
            <br />— The ducle.online Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Helvetica, Arial, sans-serif",
  padding: "40px 0",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "40px",
  maxWidth: "600px",
  margin: "0 auto",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#333333",
}

const text = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#555555",
}

const button = {
  backgroundColor: "#0070f3",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
}

const footerText = {
  fontSize: "14px",
  color: "#999999",
  marginTop: "40px",
  lineHeight: "1.4",
}
