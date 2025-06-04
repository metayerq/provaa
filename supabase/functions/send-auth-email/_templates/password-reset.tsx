
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PasswordResetEmailProps {
  email: string;
  token_hash: string;
  redirect_to: string;
  site_url: string;
}

export const PasswordResetEmail = ({
  email,
  token_hash,
  redirect_to,
  site_url,
}: PasswordResetEmailProps) => {
  const resetUrl = `${site_url}/auth/update-password?token_hash=${token_hash}&type=recovery&redirect_to=${redirect_to}`;

  return (
    <Html>
      <Head />
      <Preview>Reset your Provaa password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          <Text style={text}>
            Hello,
          </Text>
          <Text style={text}>
            We received a request to reset the password for your Provaa account ({email}).
          </Text>
          <Text style={text}>
            Click the button below to reset your password. This link will expire in 24 hours for security reasons.
          </Text>
          
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
          
          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>
          <Link href={resetUrl} style={link}>
            {resetUrl}
          </Link>
          
          <Hr style={hr} />
          
          <Text style={footerText}>
            If you didn't request this password reset, you can safely ignore this email. 
            Your password will remain unchanged.
          </Text>
          
          <Text style={footer}>
            Best regards,<br />
            The Provaa Team
          </Text>
          
          <Text style={footerSmall}>
            This email was sent by Provaa - Your Culinary Experience Platform<br />
            If you have any questions, contact us at support@provaa.co
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
};

const button = {
  backgroundColor: '#059669',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '32px 40px',
};

const link = {
  color: '#059669',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  margin: '0 40px',
  display: 'block',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 40px',
};

const footer = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 40px 0',
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 40px',
};

const footerSmall = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '32px 40px 0',
  textAlign: 'center' as const,
};
