
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface BookingConfirmationEmailProps {
  guestName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  numberOfTickets: number
  totalAmount: number
  bookingReference: string
  hostName: string
  dietaryRestrictions?: string
  specialRequests?: string
}

export const BookingConfirmationEmail = ({
  guestName,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  numberOfTickets,
  totalAmount,
  bookingReference,
  hostName,
  dietaryRestrictions,
  specialRequests,
}: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your booking for {eventTitle} is confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Booking Confirmed! 🎉</Heading>
        
        <Text style={text}>
          Hi {guestName},
        </Text>
        
        <Text style={text}>
          Great news! Your booking for <strong>{eventTitle}</strong> has been confirmed. 
          We can't wait to see you there!
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
        </Section>

        <Section style={bookingDetails}>
          <Heading style={h2}>Booking Details</Heading>
          <Row>
            <Column>
              <Text style={detailLabel}>Booking Reference:</Text>
              <Text style={detailValue}>{bookingReference}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={detailLabel}>Number of Tickets:</Text>
              <Text style={detailValue}>{numberOfTickets}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={detailLabel}>Total Amount:</Text>
              <Text style={detailValue}>€{totalAmount.toFixed(2)}</Text>
            </Column>
          </Row>
        </Section>

        {(dietaryRestrictions || specialRequests) && (
          <Section style={specialInfo}>
            <Heading style={h2}>Special Information</Heading>
            {dietaryRestrictions && (
              <Row>
                <Column>
                  <Text style={detailLabel}>Dietary Restrictions:</Text>
                  <Text style={detailValue}>{dietaryRestrictions}</Text>
                </Column>
              </Row>
            )}
            {specialRequests && (
              <Row>
                <Column>
                  <Text style={detailLabel}>Special Requests:</Text>
                  <Text style={detailValue}>{specialRequests}</Text>
                </Column>
              </Row>
            )}
          </Section>
        )}

        <Text style={text}>
          You'll receive a reminder email 24 hours before the event. 
          If you have any questions, please don't hesitate to contact us.
        </Text>

        <Text style={footer}>
          Best regards,<br />
          The Tastee Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default BookingConfirmationEmail

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

const bookingDetails = {
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const specialInfo = {
  backgroundColor: '#fef3c7',
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
