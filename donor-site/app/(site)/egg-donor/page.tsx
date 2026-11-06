import type { Metadata } from "next";
import { DonorLanding } from "@/components/marketing/donor-landing";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Become an Egg Donor",
  description: `Become an egg donor and earn ${SITE.eggComp}. All medical, travel, legal and insurance costs covered. Apply online in about 3 minutes.`,
  alternates: { canonical: "/egg-donor" },
};

export default function EggDonorPage() {
  return (
    <DonorLanding
      c={{
        type: "egg",
        hero: {
          eyebrow: "Egg donation",
          title: "Become an egg donor. Give the gift of family.",
          subtitle: `Earn ${SITE.eggComp} while helping someone build their family — with a dedicated coordinator by your side.`,
          image: "/images/hero-egg.svg",
        },
        comp: {
          amount: SITE.eggComp,
          covered: [
            "All medical screening, medication and procedures",
            "Travel and accommodation, if needed",
            "Independent legal consultation",
            "Complication insurance for your cycle",
          ],
        },
        steps: [
          { title: "Pre-screen", body: "Answer a few basic questions online (about 3 minutes)." },
          { title: "Full application", body: "Complete your profile, health history and photos in your secure portal." },
          { title: "Video interview", body: "Meet your coordinator on a short video call to talk through the process." },
          { title: "Matching", body: "Your anonymous profile is shared with intended parents who are looking for a donor." },
          { title: "Medical & psychological evaluation", body: "Blood work, ultrasound, genetic testing and a session with a mental-health professional at a partner clinic." },
          { title: "Legal contract", body: "You sign an agreement reviewed by your own independent attorney, at no cost to you." },
          { title: "Ovarian stimulation (about 10–14 days)", body: "Daily hormone injections with regular monitoring appointments." },
          { title: "Egg retrieval", body: "A short outpatient procedure under light sedation (about 20–30 minutes)." },
          { title: "Payment", body: "Your compensation is paid after the retrieval is complete." },
        ],
        concerns: [
          {
            title: "Is it safe?",
            body: "Egg donation is a well-established procedure performed by experienced physicians. As with any medical treatment, there are risks — such as ovarian hyperstimulation syndrome (OHSS) or reactions to medication — which the clinic monitors closely. The clinic will review all risks with you before you agree.",
          },
          {
            title: "Does it hurt?",
            body: "Injections use small needles and most donors adjust quickly. Retrieval is done under sedation. Afterward, cramping and bloating for a few days is common.",
          },
          {
            title: "Will it affect my future fertility?",
            body: "Current research has not found that egg donation reduces fertility in healthy donors, but long-term data is still limited. Please discuss your personal situation with a physician.",
          },
          {
            title: "Will I be anonymous?",
            body: "Most donations are anonymous. Some families request a known or open-ID arrangement; you'll always know which before you agree, and it will be in your contract.",
          },
        ],
      }}
    />
  );
}
