import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import { DISCLAIMER, SITE } from "@/config/site";

export function EmailLayout({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#FBF8F4", fontFamily: "Inter, Arial, sans-serif", color: "#1E2422" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
          <Text style={{ fontSize: 20, fontWeight: 700, color: "#1F5F5B", fontFamily: "Georgia, serif" }}>
            {SITE.brand}
          </Text>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24 }}>{children}</Section>
          <Hr style={{ borderColor: "#E5DED4", margin: "24px 0" }} />
          <Text style={{ fontSize: 12, color: "#6B7470" }}>
            {SITE.brand} · {SITE.contactEmail} · {SITE.contactPhone}
            <br />
            {DISCLAIMER}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const button = {
  backgroundColor: "#E8846B",
  color: "#2A1410",
  borderRadius: 999,
  padding: "12px 24px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
} as const;
