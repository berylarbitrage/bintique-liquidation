import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

export default function ContactEmail({
  name = "",
  email = "",
  topic = "",
  message = "",
}: {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}) {
  return (
    <EmailLayout preview={`Contact form: ${topic}`}>
      <Heading as="h1" style={{ fontSize: 22 }}>
        New contact form message
      </Heading>
      <Text>
        <strong>From:</strong> {name} ({email})
        <br />
        <strong>Topic:</strong> {topic}
      </Text>
      <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
    </EmailLayout>
  );
}
