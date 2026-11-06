import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, button } from "./layout";
import { SITE } from "@/config/site";

export default function EligibleEmail({
  firstName = "there",
  donorType = "egg",
  portalUrl = "https://example.com/portal",
}: {
  firstName?: string;
  donorType?: "egg" | "sperm";
  portalUrl?: string;
}) {
  return (
    <EmailLayout preview="You pre-qualified! Here are your next steps.">
      <Heading as="h1" style={{ fontSize: 24 }}>
        Great news, {firstName}!
      </Heading>
      <Text>
        Based on your answers, you pre-qualify for our {donorType} donor program. Thank you for
        considering this generous gift.
      </Text>
      <Text>
        <strong>Next steps:</strong>
      </Text>
      <Text>
        1. Use the secure button below to sign in to your applicant portal (no password needed).
        <br />
        2. Complete your full application — you can save and come back any time.
        <br />
        3. Your coordinator will reach out to schedule a short video call.
      </Text>
      <Button href={portalUrl} style={button}>
        Continue My Application
      </Button>
      <Text style={{ fontSize: 13, color: "#6B7470" }}>
        This sign-in link expires soon and can only be used once. If it has expired, request a new
        one at {SITE.domain}/portal.
      </Text>
    </EmailLayout>
  );
}
