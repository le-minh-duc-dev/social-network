// components/emails/WelcomeEmailTemplate.tsx

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components"
import * as React from "react"

interface WelcomeEmailTemplateProps {
  name: string
}

export default function WelcomeEmailTemplate({
  name,
}: Readonly<WelcomeEmailTemplateProps>) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ducle.online Social Network!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Welcome to Social Network on ducle.online, {name}!
          </Heading>
          <Section>
            <Text style={text}>
              Your account has been successfully created, but requires
              administrator approval before full access.
            </Text>
            <Text style={text}>
              We’ll notify you by email once the approval is completed. Thanks
              for joining us!
            </Text>
          </Section>
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
  marginBottom: "24px",
  color: "#333333",
}

const text = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#555555",
}
