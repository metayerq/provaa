
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

interface EventUpdateEmailProps {
  guestName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  bookingReference: string
  hostName: string
  updateMessage: string
  changedFields: string[]
}

export const EventUpdateEmail = ({
  guestName,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  bookingReference,
  hostName,
  updateMessage,
  changedFields,
}: EventUpdateEmailProps) => (
  <Html>
    <Head />
    <Preview>Important update for {eventTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Event Update 📝</Heading>
        
        <Text style={text}>
          Hi {guestName},
        </Text>
        
        <Text style={text}>
          Your host <strong>{hostName}</strong> has made some updates to your upcoming event 
          <strong> {eventTitle}</strong>. Please review the changes below.
        </Text>

        <Section style={updateSection}>
          <Heading style={h2}>What's Changed</Heading>
          <Text style={updateMessage}>{updateMessage}</Text>
          
          {changedFields.length > 0 && (
            <div>
              <Text style={changedFieldsLabel}>Updated fields:</Text>
              <ul style={fieldsList}>
                {changedFields.map((field, index) => (
                  <li key={index} style={fieldItem}>{field}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section style={eventDetails}>
          <Heading style={h2}>Current Event Details</Heading>
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
              <Text style={detailLabel}>Your Booking Reference:</Text>
              <Text style={detailValue}>{bookingReference}</Text>
            </Column>
          </Row>
        </Section>

        <Text style={text}>
          If you have any questions about these changes, please don't hesitate to contact your host or our support team.
        </Text>

        <Text style={text}>
          We look forward to seeing you at this amazing event!
        </Text>

        <Text style={footer}>
          Best regards,<br />
          The Tastee Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EventUpdateEmail

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

const updateSection = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  borderLeft: '4px solid #f59e0b',
}

const updateMessage = {
  color: '#92400e',
  fontSize: '16px',
  margin: '10px 0',
  lineHeight: '1.5',
  fontStyle: 'italic',
}

const changedFieldsLabel = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '15px 0 5px 0',
}

const fieldsList = {
  margin: '5px 0 0 20px',
  padding: '0',
}

const fieldItem = {
  color: '#92400e',
  fontSize: '14px',
  margin: '2px 0',
}

const eventDetails = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
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
