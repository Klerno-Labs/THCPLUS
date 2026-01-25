import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ContactNotificationEmailProps {
  name: string
  email: string
  message: string
  submittedAt: Date
  id: string
}

export const ContactNotificationEmail = ({
  name,
  email,
  message,
  submittedAt,
  id,
}: ContactNotificationEmailProps) => {
  const formattedDate = new Date(submittedAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  })

  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>

          <Text style={text}>
            You&apos;ve received a new message from your THC Plus website contact form.
          </Text>

          <Section style={infoSection}>
            <Text style={label}>From:</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email:</Text>
            <Text style={value}>
              <a href={`mailto:${email}`} style={link}>
                {email}
              </a>
            </Text>

            <Text style={label}>Submitted:</Text>
            <Text style={value}>{formattedDate}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={messageSection}>
            <Text style={label}>Message:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Submission ID: {id}
            <br />
            View in admin dashboard to reply or mark as read.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ContactNotificationEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#1A3A1A',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  padding: '0 40px',
}

const infoSection = {
  padding: '0 40px',
}

const label = {
  color: '#1A3A1A',
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '4px',
  marginTop: '16px',
}

const value = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '4px',
}

const link = {
  color: '#D4AF37',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
}

const messageSection = {
  padding: '0 40px',
}

const messageText = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '8px',
  padding: '16px',
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  border: '1px solid #e6ebf1',
  whiteSpace: 'pre-wrap' as const,
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '32px',
}
