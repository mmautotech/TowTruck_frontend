// screens/Truck/TermsAndConditionsScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import CustomHeader from '../../../components/CustomHeader';
import styles from './style';

type Props = {
  hideHeader?: boolean;
};

const TermsAndConditionsScreen: React.FC<Props> = ({ hideHeader = false }) => {
  return (
    <View style={styles.container}>
      {!hideHeader && <CustomHeader title="Terms & Conditions" showMenuButton />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>1. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be at least 18 years old, hold a valid driving license, and have all necessary insurances. You are responsible for maintaining the confidentiality of your account credentials.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of Services</Text>
        <Text style={styles.paragraph}>
          Towly™ is a technology platform that connects you with clients needing towing or roadside assistance. You agree to use the app responsibly, provide accurate service details, and follow all applicable laws and regulations.
        </Text>

        <Text style={styles.sectionTitle}>3. Trucker Responsibilities</Text>
        <Text style={styles.paragraph}>
          Truckers are fully responsible for the client’s vehicle from pickup to drop-off. Any damage, loss, or incident during recovery is the trucker’s responsibility.
        </Text>

        <Text style={styles.sectionTitle}>4. Payments, Fees & Deposits</Text>
        <Text style={styles.paragraph}>
          • Before accepting jobs, you must deposit credit into your Towly™ wallet.{'\n'}
          • Example: A £250 deposit allocates £100 as a security fee and £150 as wallet credit.{'\n'}
          • Towly™ charges a 10% platform fee on each accepted job, deducted from your wallet balance.{'\n'}
          • You must maintain a positive wallet balance at all times to continue receiving and accepting jobs.{'\n'}
          • ⏱ Top-up approval requests may take up to 24 hours to be processed and approved.
        </Text>

        <Text style={styles.sectionTitle}>5. Account Suspension & Termination</Text>
        <Text style={styles.paragraph}>
          Towly™ may suspend or terminate your account if you:{'\n'}
          • Violate these Terms or applicable laws.{'\n'}
          • Engage in fraudulent, abusive, or harmful behavior.{'\n'}
          • Fail to maintain the required wallet balance.
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          Towly™ provides the Platform “as is” and “as available.” Towly™ is not responsible for the actions, errors, or omissions of clients or garages. In no event will Towly™ be liable for indirect, incidental, special, or consequential damages arising out of your use of the Platform.
        </Text>

        <Text style={styles.sectionTitle}>7. Privacy & Data</Text>

        <Text style={styles.subSectionTitle}>7.1 What Information We Collect</Text>
        <Text style={styles.paragraph}>
          • Information you provide: Name, phone number, email, vehicle details, license info, photos.{'\n'}
          • Automatically collected: IP address, device details, app activity logs, live location data (with permission).{'\n'}
          • From others: ratings, reviews, and references.
        </Text>

        <Text style={styles.subSectionTitle}>7.2 How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          • To provide, manage, and improve services.{'\n'}
          • To process transactions, payments, and deposits.{'\n'}
          • To track live locations for service delivery, safety, and record-keeping.{'\n'}
          • To communicate about your account, requests, or offers.{'\n'}
          • To detect fraud, ensure security, and prevent misuse.{'\n'}
          • To comply with legal obligations.
        </Text>

        <Text style={styles.subSectionTitle}>7.3 How We Share Your Information</Text>
        <Text style={styles.paragraph}>
          • We do not sell your personal data.{'\n'}
          • May share with service providers (hosting, payment processors).{'\n'}
          • With clients, garages, or partners to fulfill requests.{'\n'}
          • With legal authorities when required.
        </Text>

        <Text style={styles.subSectionTitle}>7.4 Data Collaboration</Text>
        <Text style={styles.paragraph}>
          To ensure smooth service, we securely share necessary data (including location during a job) among Towly™ clients, truckers, and partners.
        </Text>

        <Text style={styles.subSectionTitle}>7.5 Your Rights & Choices</Text>
        <Text style={styles.paragraph}>
          You have the right to access, correct, or request deletion of your data. We retain data only as long as needed for service, legal, or operational purposes.
        </Text>

        <Text style={styles.subSectionTitle}>7.6 Legal Requirements & Security</Text>
        <Text style={styles.paragraph}>
          We may disclose data to comply with the law or to protect Towly™ and users from fraud, abuse, or harm.
        </Text>

        <Text style={styles.subSectionTitle}>7.7 Data Storage</Text>
        <Text style={styles.paragraph}>
          Your data may be stored securely on servers (including cloud) outside your country. We apply strong global safeguards.
        </Text>

        <Text style={styles.subSectionTitle}>7.8 Updates to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy section when necessary. Significant changes will be communicated via the app or email.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to These Terms</Text>
        <Text style={styles.paragraph}>
          We may amend these Terms at any time. Significant changes will be communicated via the app or email. Continued use constitutes acceptance of the updated Terms.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or need support, please contact us at:{'\n'}
          📧 Towly@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditionsScreen;
