// screens/Client/TermsAndConditionsScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import CustomHeader from '../../../components/CustomHeader';
import styles from './style';

// ① Define Props so we can accept hideHeader
type Props = {
  hideHeader?: boolean;
};

// ② Tell React.FC about Props
const TermsAndConditionsScreen: React.FC<Props> = ({ hideHeader = false }) => {
  return (
    <View style={styles.container}>
      {/* ② Only render the header if hideHeader is false */}
      {!hideHeader && <CustomHeader title="Terms & Conditions" showMenuButton />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Eligibility */}
        <Text style={styles.sectionTitle}>1. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be at least 18 years old and provide accurate, current, and complete information during registration and in any service requests. You are responsible for maintaining the confidentiality of your account credentials.
        </Text>

        {/* 2. Services Provided */}
        <Text style={styles.sectionTitle}>2. Services Provided</Text>
        <Text style={styles.paragraph}>
          Towly™ is a technology platform that enables you to request towing and roadside assistance services from independent truckers and garages. Towly™ does not perform these services itself and is not a direct service provider.
        </Text>

        {/* 3. Booking & Requests */}
        <Text style={styles.sectionTitle}>3. Booking & Requests</Text>
        <Text style={styles.paragraph}>
          • You submit pickup and drop-off details, preferred service time, and any special instructions.{'\n'}
          • Once a trucker accepts your request, you will receive a confirmation with estimated arrival time and cost.{'\n'}
          • You may cancel or modify a request through the app according to the policy displayed at booking.
        </Text>

        {/* 4. Payments & Fees */}
        <Text style={styles.sectionTitle}>4. Payments & Fees</Text>
        <Text style={styles.paragraph}>
          • You pay the trucker directly through approved payment methods (in-app wallet or external).{'\n'}
          • If using the Towly™ wallet, ensure sufficient balance before booking.{'\n'}
          • Towly™ does not charge Clients a fee; any platform fees are taken from the trucker’s payout.{'\n'}
          • Refunds for cancellations or failed service attempts follow the refund policy displayed at the time of booking.
        </Text>

        {/* 5. Client Obligations */}
        <Text style={styles.sectionTitle}>5. Client Obligations</Text>
        <Text style={styles.paragraph}>
          • Provide truthful and complete information in all communications.{'\n'}
          • Be present and accessible at the agreed pickup location and time.{'\n'}
          • Treat truckers and their equipment with respect.{'\n'}
          • Adhere to all applicable laws and regulations.
        </Text>

        {/* 6. Trucker Responsibilities */}
        <Text style={styles.sectionTitle}>6. Trucker Responsibilities</Text>
        <Text style={styles.paragraph}>
          Truckers are fully responsible for the client’s vehicle from pickup to drop-off. Any damage, loss, or incident during recovery is the trucker’s responsibility.
        </Text>

        {/* 7. Account Suspension & Termination */}
        <Text style={styles.sectionTitle}>7. Account Suspension & Termination</Text>
        <Text style={styles.paragraph}>
          Towly™ reserves the right to suspend or terminate your account if you:{'\n'}
          • Violate these Terms or applicable laws.{'\n'}
          • Engage in fraudulent, abusive, or harmful behavior.{'\n'}
          • Fail to pay for accepted services.
        </Text>

        {/* 8. Limitation of Liability */}
        <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          Towly™ provides the Platform “as is” and “as available.” Towly™ is not responsible for the actions, errors, or omissions of independent truckers or garages. In no event will Towly™ be liable for indirect, incidental, special, or consequential damages arising out of your use of the Platform.
        </Text>

        {/* 9. Privacy & Data */}
        <Text style={styles.sectionTitle}>9. Privacy & Data</Text>

        <Text style={styles.subSectionTitle}>9.1 What Information We Collect</Text>
        <Text style={styles.paragraph}>
          • Information you provide: Name, phone number, email, pickup/drop-off locations, payment and deposit proofs.{'\n'}
          • For truckers: vehicle details, license info, and photos.{'\n'}
          • Automatically collected: IP address, device details, app activity logs, live location during service (with permission).{'\n'}
          • From others: ratings, reviews, and references.
        </Text>

        <Text style={styles.subSectionTitle}>9.2 How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          • To provide, manage, and improve our services.{'\n'}
          • To process transactions, payments, and deposits.{'\n'}
          • To track live locations for service delivery, safety, and records.{'\n'}
          • To communicate about your account, requests, or offers.{'\n'}
          • To detect fraud, ensure security, and prevent misuse.{'\n'}
          • To comply with legal obligations.
        </Text>

        <Text style={styles.subSectionTitle}>9.3 How We Share Your Information</Text>
        <Text style={styles.paragraph}>
          • We do not sell your personal data.{'\n'}
          • May share with service providers (hosting, payment processors).{'\n'}
          • With truckers, garages, or partners to fulfill requests.{'\n'}
          • With legal authorities when required.
        </Text>

        <Text style={styles.subSectionTitle}>9.4 Data Collaboration</Text>
        <Text style={styles.paragraph}>
          To ensure smooth service, we securely share necessary data (including location during a job) among Towly™ clients, truckers, and partners.
        </Text>

        <Text style={styles.subSectionTitle}>9.5 Your Rights & Choices</Text>
        <Text style={styles.paragraph}>
          You have the right to access, correct, or request deletion of your data. We retain data only as long as needed for service, legal, or operational purposes.
        </Text>

        <Text style={styles.subSectionTitle}>9.6 Legal Requirements & Security</Text>
        <Text style={styles.paragraph}>
          We may disclose data to comply with the law or to protect Towly™ and users from fraud, abuse, or harm.
        </Text>

        <Text style={styles.subSectionTitle}>9.7 Data Storage</Text>
        <Text style={styles.paragraph}>
          Your data may be stored securely on servers (including cloud) outside your country. We apply strong global safeguards.
        </Text>

        <Text style={styles.subSectionTitle}>9.8 Updates to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy section when necessary. Significant changes will be communicated via the app or email.
        </Text>

        {/* 10. Changes to These Terms */}
        <Text style={styles.sectionTitle}>10. Changes to These Terms</Text>
        <Text style={styles.paragraph}>
          We may amend these Terms at any time. Significant changes will be highlighted in-app or via email. Continued use after such notice constitutes acceptance.
        </Text>

        {/* 11. Contact Us */}
        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions or need assistance, please contact us at:{'\n'}
          📧 Towly@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditionsScreen;
