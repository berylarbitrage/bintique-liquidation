import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, button } from "./layout";

export default function LoginEmail({ url = "https://example.com/auth/confirm" }: { url?: string }) {
  return (
    <EmailLayout preview="Your secure sign-in link">
      <Heading as="h1" style={{ fontSize: 22 }}>Sign in to your account</Heading>
      <Text>Click the button below to sign in. This link can only be used once and expires soon.</Text>
      <Button href={url} style={button}>Sign In</Button>
      <Text style={{ fontSize: 13, color: "#6B7470" }}>
        If you didn&apos;t request this, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}
