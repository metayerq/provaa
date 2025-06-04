
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface EventReminderEmailProps {
  guestName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  bookingReference: string
  hostName: string
  meetingPointDetails?: string
}

export const EventReminderEmail = ({
  guestName,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  bookingReference,
  hostName,
  meetingPointDetails,
}: EventReminderEmailProps) => (
  <Html>
    <Head />
    <Preview>Reminder: {eventTitle} is tomorrow!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your Event is Tomorrow! ⏰</Heading>
        
        <Text style={text}>
          Hi {guestName},
        </Text>
        
        <Text style={text}>
          This is a friendly reminder that you have an upcoming event tomorrow. 
          We're excited to see you at <strong>{eventTitle}</strong>!
        </Text>

        <Section style={eventDetails}>
          <Heading style={h2}>Event Details</Heading>
          <Row>
            <Column>
              <Text style={detailLabel}>Event:</Text>
              <Text style={detailValue}>{eventTitle}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={detailLabel}>Date & Time:</Text>
              <Text style={detailValue}>{eventDate} at {eventTime}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={detailLabel}>Location:</Text>
              <Text style={detailValue}>{eventLocation}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={detailLabel}>Host:</Text>
              <Text style={detailValue}>{hostName}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={detailLabel}>Booking Reference:</Text>
              <Text style={detailValue}>{bookingReference}</Text>
            </Column>
          </Row>
        </Section>

        {meetingPointDetails && (
          <Section style={meetingDetails}>
            <Heading style={h2}>Meeting Point Information</Heading>
            <Text style={text}>{meetingPointDetails}</Text>
          </Section>
        )}

        <Section style={reminderSection}>
          <Text style={reminderText}>
            📍 <strong>What to bring:</strong> Just yourself and your appetite for a great experience!
          </Text>
          <Text style={reminderText}>
            🕐 <strong>Arrival time:</strong> Please arrive 10 minutes early to ensure a smooth start.
          </Text>
          <Text style={reminderText}>
            📱 <strong>Contact:</strong> If you're running late or need assistance, please contact your host.
          </Text>
        </Section>

        <Text style={text}>
          Looking forward to seeing you tomorrow! If you have any last-minute questions, 
          please don't hesitate to reach out.
        </Text>

        <Text style={footer}>
          Best regards,<br />
          The Tastee Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EventReminderEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
}

const h2 = {
  color: '#059669',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  margin: '24px 0',
  lineHeight: '1.5',
}

const eventDetails = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const meetingDetails = {
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const reminderSection = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const reminderText = {
  color: '#92400e',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.5',
}

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
}

const detailValue = {
  color: '#111827',
  fontSize: '16px',
  margin: '0 0 16px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  marginTop: '32px',
}
