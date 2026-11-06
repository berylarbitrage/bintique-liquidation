import type { Metadata } from "next";
import { DonorLanding } from "@/components/marketing/donor-landing";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Become a Sperm Donor",
  description: `Become a sperm donor and earn ${SITE.spermComp}. Free health and genetic screening. Apply online in about 3 minutes.`,
  alternates: { canonical: "/sperm-donor" },
};

export default function SpermDonorPage() {
  return (
    <DonorLanding
      c={{
        type: "sperm",
        hero: {
          eyebrow: "Sperm donation",
          title: "Become a sperm donor. Help families grow.",
          subtitle: `Earn ${SITE.spermComp} with a flexible weekly schedule, plus free health and genetic screening.`,
          image: "/images/hero-sperm.svg",
        },
        partnerNote: (
          <>
            <strong>How we work:</strong> {SITE.brand} handles recruitment and initial screening.
            Formal medical testing and sperm processing are performed by our partner FDA-registered
            sperm banks and clinics.
          </>
        ),
        comp: {
          amount: SITE.spermComp,
          covered: [
            "Comprehensive health screening",
            "Free genetic carrier testing",
            "Infectious disease testing",
            "Ongoing health monitoring while you donate",
          ],
          note: "Paid for your time and commitment. The amount depends on donation frequency and the program.",
        },
        steps: [
          { title: "Pre-screen", body: "Answer a few basic questions online (about 3 minutes)." },
          { title: "Full application", body: "Complete your profile and family health history in your secure portal." },
          { title: "Coordinator call", body: "A short video call to answer your questions and confirm your schedule." },
          { title: "Initial sample & analysis", body: "Provide a sample at a partner sperm bank for semen analysis." },
          { title: "Medical & genetic screening", body: "Physical exam, infectious disease and genetic carrier testing by the partner bank." },
          { title: "Donor agreement", body: "Review and sign the donor agreement with the bank." },
          { title: "Weekly donations (6+ months)", body: "Visit the bank one to two times per week, about 15–30 minutes per visit." },
          { title: "Get compensated", body: "Compensation is paid on a regular schedule set by the program." },
        ],
        concerns: [
          {
            title: "Is it safe?",
            body: "Sperm donation is non-invasive. Screening involves routine blood tests and a physical exam performed by licensed medical staff.",
          },
          {
            title: "What is the time commitment?",
            body: "Plan for one to two short visits each week for at least six months, plus a few screening appointments at the start.",
          },
          {
            title: "Will I be anonymous?",
            body: "It depends on the program. Many banks offer open-ID options where adult offspring may request contact. You'll know the arrangement before signing.",
          },
          {
            title: "Legal responsibility",
            body: "Donations through licensed banks are made under legal agreements that generally protect donors from parental rights and obligations. State laws vary — the bank will explain the details.",
          },
        ],
      }}
    />
  );
}
