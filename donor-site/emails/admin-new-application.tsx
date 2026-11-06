import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, button } from "./layout";

/** Admin notification. Contains NO health information by design. */
export default function AdminNewApplicationEmail({
  name = "Jane Doe",
  donorType = "egg",
  eligible = true,
  adminUrl = "https://example.com/admin",
  kind = "pre-screen",
}: {
  name?: string;
  donorType?: "egg" | "sperm";
  eligible?: boolean;
  adminUrl?: string;
  kind?: "pre-screen" | "full application";
}) {
  return (
    <EmailLayout preview={`New ${kind}: ${name}`}>
      <Heading as="h1" style={{ fontSize: 22 }}>
        New {kind} submitted
      </Heading>
      <Text>
        <strong>Name:</strong> {name}
        <br />
        <strong>Type:</strong> {donorType}
        <br />
        <strong>Pre-qualified:</strong> {eligible ? "Yes" : "No"}
      </Text>
      <Button href={adminUrl} style={button}>
        Open in Admin
      </Button>
    </EmailLayout>
  );
}
