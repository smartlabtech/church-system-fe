import React from "react"
import {Container, Title, Text, List, Anchor} from "@mantine/core"

const PrivacyPolicy = () => {
  return (
    <Container size="sm" padding="md">
      <Title order={1} align="center" mt="lg" mb="sm">
        Privacy Policy
      </Title>
      <Text color="dimmed" align="center" mb="xl">
        Last Updated: 30-10-2024
      </Text>

      <Text>
        Smart Lab Tec ("we," "us," or "our") is committed to protecting your
        privacy. This Privacy Policy explains how we collect, use, share, and
        protect information about you when you use our application and any other
        services we provide (collectively, the "Services").
      </Text>

      <Text mt="md">
        By using our Services, you agree to the collection and use of
        information in accordance with this policy.
      </Text>

      <Title order={2} mt="lg" mb="sm">
        1. Information We Stacklect
      </Title>
      <Text>
        We collect different types of information to provide and improve our
        Services to you:
      </Text>
      <List mt="sm">
        <List.Item>
          <strong>Personal Information:</strong> Information that can be used to
          identify you, such as your name, email address, phone number, and
          other similar information, when you voluntarily provide it to us.
        </List.Item>
        <List.Item>
          <strong>Usage Data:</strong> Information about how you use our
          Services, such as the pages you visit, the time and date of your
          visit, and other diagnostic data.
        </List.Item>
        <List.Item>
          <strong>Device Information:</strong> Information about the device you
          use to access our Services, such as your device’s IP address,
          operating system, and browser type.
        </List.Item>
      </List>

      <Title order={2} mt="lg" mb="sm">
        2. How We Use Your Information
      </Title>
      <Text>We may use the information we collect in the following ways:</Text>
      <List mt="sm">
        <List.Item>To provide, maintain, and improve our Services</List.Item>
        <List.Item>
          To communicate with you, including responding to your requests or
          inquiries
        </List.Item>
        <List.Item>
          To analyze how you use our Services and improve user experience
        </List.Item>
        <List.Item>
          To comply with legal obligations and enforce our policies
        </List.Item>
      </List>

      <Title order={2} mt="lg" mb="sm">
        3. Sharing Your Information
      </Title>
      <Text>
        We do not sell or rent your information to third parties. However, we
        may share your information in the following circumstances:
      </Text>
      <List mt="sm">
        <List.Item>
          <strong>With Service Providers:</strong> We may share your information
          with third-party service providers who assist us in providing the
          Services (e.g., hosting, data analysis, customer support).
        </List.Item>
        <List.Item>
          <strong>For Legal Reasons:</strong> We may disclose your information
          if required by law or in response to valid requests by public
          authorities.
        </List.Item>
      </List>

      <Title order={2} mt="lg" mb="sm">
        4. Data Security
      </Title>
      <Text>
        We take appropriate security measures to protect your information from
        unauthorized access or disclosure. However, please note that no method
        of transmission over the internet or electronic storage is completely
        secure, and we cannot guarantee absolute security.
      </Text>

      <Title order={2} mt="lg" mb="sm">
        5. Your Data Rights
      </Title>
      <Text>
        Depending on your location, you may have certain rights regarding your
        personal data:
      </Text>
      <List mt="sm">
        <List.Item>
          <strong>Access:</strong> You can request to access the personal
          information we hold about you.
        </List.Item>
        <List.Item>
          <strong>Correction:</strong> You may request that we correct any
          inaccurate or incomplete information.
        </List.Item>
        <List.Item>
          <strong>Deletion:</strong> You can request that we delete your
          personal information, subject to certain exceptions.
        </List.Item>
        <List.Item>
          <strong>Opt-Out:</strong> You may opt-out of certain communications
          from us by following the unsubscribe instructions in the messages we
          send.
        </List.Item>
      </List>
      <Text>
        If you wish to exercise any of these rights, please contact us at{" "}
        <Anchor href="mailto:support@smartlabtec.com">
          support@smartlabtec.com
        </Anchor>
        .
      </Text>

      <Title order={2} mt="lg" mb="sm">
        6. Third-Party Links
      </Title>
      <Text>
        Our Services may contain links to third-party sites. We are not
        responsible for the privacy practices or content of these external
        sites. We encourage you to review the privacy policies of any sites you
        visit.
      </Text>

      <Title order={2} mt="lg" mb="sm">
        7. Children’s Privacy
      </Title>
      <Text>
        Our Services are not directed to children under the age of 13. We do not
        knowingly collect personal information from children under 13. If we
        become aware that we have collected information from a child under 13
        without verification of parental consent, we will take steps to remove
        that information from our servers.
      </Text>

      <Title order={2} mt="lg" mb="sm">
        8. Changes to This Privacy Policy
      </Title>
      <Text>
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page. We
        encourage you to review this Privacy Policy periodically for any
        changes.
      </Text>

      <Title order={2} mt="lg" mb="sm">
        9. Contact Us
      </Title>
      <Text>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:
      </Text>
      <Text>
        **Email**:{" "}
        <Anchor href="mailto:support@smartlabtec.com">
          support@smartlabtec.com
        </Anchor>
      </Text>
      <Text>
        **Website**:{" "}
        <Anchor href="https://www.smartlabtec.com">
          https://www.smartlabtec.com
        </Anchor>
      </Text>
    </Container>
  )
}

export default PrivacyPolicy
