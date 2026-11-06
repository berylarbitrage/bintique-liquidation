import { ELIGIBILITY } from "@/config/eligibility";
import { SITE, serviceStatesText } from "@/config/site";

export interface FaqItem {
  q: string;
  a: string;
}

export type FaqGroup = "general" | "egg" | "sperm";

const egg = ELIGIBILITY.egg;
const sperm = ELIGIBILITY.sperm;

export const FAQ: Record<FaqGroup, { title: string; items: FaqItem[] }> = {
  general: {
    title: "General Questions",
    items: [
      {
        q: "Who are you, and what do you do?",
        a: `${SITE.brand} recruits and pre-screens egg and sperm donors. Medical screening, procedures, and lab work are performed by licensed partner clinics and FDA-registered sperm banks.`,
      },
      {
        q: "How long does the online pre-screen take?",
        a: "About 3 minutes. We only ask basic questions at this stage — no Social Security number, medical records, or photos.",
      },
      {
        q: "What happens after I submit the pre-screen?",
        a: "You'll see your initial result right away. If you pre-qualify, we'll email you a secure link to complete the full application, and a coordinator will reach out.",
      },
      {
        q: "Where do you operate?",
        a: `We currently work with donors in ${serviceStatesText}. Some programs may require travel, which is arranged and paid for.`,
      },
      {
        q: "Is my information kept private?",
        a: "Yes. Your information is stored securely, is only accessed by our screening team and partner clinics, and is never sold. See our Privacy Policy for details.",
      },
      {
        q: "Is compensation based on my looks, ethnicity, or test scores?",
        a: "No. Compensation is for your time, effort, and commitment to the process. It is never based on personal traits such as appearance, ethnicity, or intelligence.",
      },
      {
        q: "Can I refer a friend?",
        a: `Yes! You earn ${SITE.referralBonus} when someone you refer completes a donation. Visit our Refer a Friend page to get your personal link.`,
      },
      {
        q: "Can I withdraw at any time?",
        a: "Yes. Donation is voluntary, and you can withdraw from the process at any point before a procedure.",
      },
      {
        q: "How do I request deletion of my data?",
        a: `Email ${SITE.contactEmail} with your request. We'll confirm your identity and delete your data, subject to any legal record-keeping requirements.`,
      },
      {
        q: "Do you provide medical advice?",
        a: "No. We can explain the process, but please talk to a licensed physician about any medical questions. Final eligibility is determined by our partner medical providers.",
      },
    ],
  },
  egg: {
    title: "Egg Donation",
    items: [
      {
        q: "What are the basic requirements to be an egg donor?",
        a: `You should be ${egg.minAge}–${egg.maxAge} years old, have a BMI under ${egg.maxBmi}, be a non-smoker, have regular menstrual cycles, and have at least a high school diploma.`,
      },
      {
        q: "How much are egg donors compensated?",
        a: `Compensation is typically ${SITE.eggComp}, paid for your time and commitment. All medical, travel, legal, and insurance costs are covered separately.`,
      },
      {
        q: "How long does the whole process take?",
        a: "From application to retrieval usually takes about 2–4 months. The active medication phase is about 10–14 days, and the full commitment including screening is about 3–6 weeks of appointments.",
      },
      {
        q: "Does egg retrieval hurt?",
        a: "Retrieval is done under light sedation, so most donors feel no pain during the procedure. Mild cramping or bloating afterward is common and usually resolves within a few days. Ask the clinic's physician about what to expect for you.",
      },
      {
        q: "Will donating affect my future fertility?",
        a: "Current medical research has not shown that egg donation reduces future fertility in healthy donors, but every person is different. The clinic's physician will discuss risks with you, and we encourage you to ask questions.",
      },
      {
        q: "Are there medical risks?",
        a: "Like any medical procedure, there are some risks, including ovarian hyperstimulation syndrome (OHSS), reactions to medication, and rare procedural complications. Partner clinics monitor you closely to minimize risk.",
      },
      {
        q: "Can I donate if I'm on birth control?",
        a: "Often yes. Many types of birth control are compatible, though some (like certain implants or shots) may need to be paused. Tell us what you use in the pre-screen.",
      },
      {
        q: "Is egg donation anonymous?",
        a: "Most donations are anonymous, though some intended parents request a known or open-ID arrangement. You'll always know the type of arrangement before agreeing, and it will be spelled out in your legal contract.",
      },
      {
        q: "Do I need to take time off work or school?",
        a: "Most monitoring appointments are early in the morning. You'll need to take the retrieval day off, and possibly the day after.",
      },
      {
        q: "Can I donate more than once?",
        a: "Many donors are eligible to donate again, following clinic guidelines and industry recommendations on the total number of cycles.",
      },
      {
        q: "Who pays for medical costs?",
        a: "All screening, medication, procedures, and related insurance are paid for. You will never pay out of pocket for medical costs related to donation.",
      },
    ],
  },
  sperm: {
    title: "Sperm Donation",
    items: [
      {
        q: "What are the basic requirements to be a sperm donor?",
        a: `You should be ${sperm.minAge}–${sperm.maxAge}, at least ${Math.floor(sperm.minHeightInches / 12)}'${sperm.minHeightInches % 12}" tall, a non-smoker, currently in college or a graduate, and live within 60 minutes of a partner sperm bank.`,
      },
      {
        q: "How much are sperm donors compensated?",
        a: `Compensation is ${SITE.spermComp}, depending on how often you donate and the program. It is paid for your time and commitment.`,
      },
      {
        q: "Who performs testing and processing?",
        a: `${SITE.brand} handles recruitment and initial screening. Formal medical testing, genetic testing, and sperm processing are done by our partner FDA-registered sperm banks and clinics.`,
      },
      {
        q: "How often do I need to donate?",
        a: "Most programs ask for one to two visits per week for at least 6 months.",
      },
      {
        q: "Why is there a height requirement?",
        a: "Height requirements are set by our partner sperm banks based on recipient preferences. They do not affect compensation.",
      },
      {
        q: "What does screening include?",
        a: "Screening typically includes a semen analysis, physical exam, infectious disease testing, genetic carrier screening, and a detailed family medical history.",
      },
      {
        q: "How long does a donation visit take?",
        a: "Usually 15–30 minutes at a private room in the partner sperm bank.",
      },
      {
        q: "Do I need to abstain before donating?",
        a: "Yes. Banks usually ask donors to abstain for 2–5 days before each donation for the best sample quality.",
      },
      {
        q: "Is sperm donation anonymous?",
        a: "Programs vary. Many banks offer open-ID programs where adult children may request contact information. The arrangement will be clearly explained before you sign anything.",
      },
      {
        q: "Will I have any legal or financial responsibility for children?",
        a: "Donations through licensed banks are made under legal agreements that generally protect donors from parental rights and obligations. Laws vary by state, so the bank will provide details.",
      },
      {
        q: "Do I get free health screening?",
        a: "Yes. Donors receive free genetic testing and health screening as part of the process.",
      },
    ],
  },
};

/** The 5 questions shown on the home page. */
export const HOME_FAQ: FaqItem[] = [
  FAQ.general.items[1]!,
  FAQ.egg.items[1]!,
  FAQ.sperm.items[1]!,
  FAQ.egg.items[4]!,
  FAQ.general.items[4]!,
];
