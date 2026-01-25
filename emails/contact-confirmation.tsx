import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ContactConfirmationEmailProps {
  name: string
  email: string
  message: string
}

export const ContactConfirmationEmail = ({
  name,
}: ContactConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for contacting THC Plus</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Contacting Us!</Heading>

          <Text style={greeting}>Hi {name},</Text>

          <Text style={text}>
            Thank you for reaching out to THC Plus. We&apos;ve received your message and
            appreciate you taking the time to contact us.
          </Text>

          <Text style={text}>
            Our team will review your inquiry and get back to you within 24-48 hours. If
            your matter is urgent, please feel free to call us directly at{' '}
            <Link href="tel:+13462063949" style={link}>
              (346) 206-3949
            </Link>
            .
          </Text>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Heading style={h2}>Visit Us</Heading>
            <Text style={infoText}>
              <strong>THC Plus</strong>
              <br />
              123 Main Street
              <br />
              Houston, TX 77001
            </Text>

            <Text style={infoText}>
              <strong>Hours:</strong>
              <br />
              Monday - Saturday: 10:00 AM - 9:00 PM
              <br />
              Sunday: 12:00 PM - 6:00 PM
            </Text>

            <Text style={infoText}>
              <strong>Contact:</strong>
              <br />
              Phone:{' '}
              <Link href="tel:+13462063949" style={link}>
                (346) 206-3949
              </Link>
              <br />
              Email:{' '}
              <Link href="mailto:info@thcplus.com" style={link}>
                info@thcplus.com
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This is an automated confirmation email. Please do not reply to this message.
            <br />
            <br />
            &copy; {new Date().getFullYear()} THC Plus. All rights reserved.
            <br />
            Houston&apos;s premier destination for premium hemp products.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ContactConfirmationEmail

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
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#1A3A1A',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
}

const greeting = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
  marginTop: '24px',
}

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  padding: '0 40px',
  marginTop: '16px',
}

const infoSection = {
  padding: '0 40px',
  marginTop: '24px',
}

const infoText = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '12px',
}

const link = {
  color: '#D4AF37',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
  marginTop: '32px',
  padding: '0 40px',
}
