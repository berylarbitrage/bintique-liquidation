import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, button } from "./layout";
import { SITE } from "@/config/site";

export default function IneligibleEmail({
  firstName = "there",
  referUrl = "https://example.com/refer",
}: {
  firstName?: string;
  referUrl?: string;
}) {
  return (
    <EmailLayout preview="Thank you for your interest">
      <Heading as="h1" style={{ fontSize: 24 }}>
        Thank you, {firstName}
      </Heading>
      <Text>
        We truly appreciate your interest in becoming a donor. Based on the current requirements of
        our partner programs, we&apos;re not able to move forward with your application at this
        time. Requirements are set by medical providers and are not a reflection of you as a person.
      </Text>
      <Text>
        You can still help! Refer a friend who might be a great fit, and earn {SITE.referralBonus}
        when they complete a donation.
      </Text>
      <Button href={referUrl} style={button}>
        Get My Referral Link
      </Button>
    </EmailLayout>
  );
}
