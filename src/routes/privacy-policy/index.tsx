import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/privacy-policy/')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy | Tisini' },
      {
        name: 'description',
        content:
          'How Tisini handles personal data for sports data services — what we collect, why we use it, and the rights and controls available to you.',
      },
    ],
  }),
  component: PrivacyPolicyPage,
})

const dataCategories = [
  {
    title: 'Contact details',
    detail:
      'Includes name, phone number, and e-mail address. For some of our services, we might require additional information like your home address.',
  },
  {
    title: 'Profile information',
    detail:
      'Includes profile picture, team details, language, and communication preferences. For some services, we might require more, like your player license details.',
  },
  {
    title: 'Geolocation',
    detail:
      'Information about where data collection occurs, the time, and progress of data collection activities.',
  },
  {
    title: 'Payment information',
    detail: 'Includes the amount charged and the payment method used.',
  },
  {
    title: 'Communication and correspondence records',
    detail:
      'When you engage with our customer service agents or in-app chat.',
  },
  {
    title: 'Device identification data',
    detail:
      'Limited data like the IP address on which the Tisini app has been installed.',
  },
  {
    title: 'Service usage data',
    detail:
      'Includes data about service status, times, and your conduct as assessed by other users.',
  },
] as const

const processingPurposes = [
  {
    title: 'Connecting with data collectors',
    detail:
      'We collect and process personal data to connect teams and players with data collectors.',
  },
  {
    title: 'Data collection management',
    detail:
      'We use geolocation data to manage and improve data collection processes.',
  },
  {
    title: 'Service optimization',
    detail:
      'We use contact details to notify users of updates and gather limited data from devices to keep accounts secure.',
  },
  {
    title: 'Payment processing',
    detail:
      'We obtain payment details to process user payments on behalf of data collectors and for our own services.',
  },
  {
    title: 'Maintaining standards',
    detail:
      'We collect data about service usage, including user ratings and feedback, to ensure quality and safety.',
  },
  {
    title: 'Communication',
    detail:
      'We use your contact information to communicate about completed services, provide receipts, and send important service updates.',
  },
] as const

const legalBases = [
  {
    title: 'Contractual obligations',
    detail:
      'Processing personal data to fulfill our contract with you and provide the services promised.',
  },
  {
    title: 'Legitimate interests',
    detail:
      'Processing based on our commercial interests in providing innovative, personalized, safe, and profitable services, unless these interests are overridden by your interests.',
  },
  {
    title: 'Legal obligations',
    detail: 'Processing personal data to comply with legal obligations.',
  },
  {
    title: 'Vital interests',
    detail:
      'Processing personal data to protect your vital interests or those of others.',
  },
  {
    title: 'Consent',
    detail:
      'Processing personal data when you have given clear consent for a specific purpose.',
  },
] as const

const recipients = [
  {
    title: 'Service users',
    detail:
      'Your personal data is disclosed to data collectors when engaging with them through the Tisini app.',
  },
  {
    title: 'Tisini group companies and partners',
    detail:
      'Personal data may be disclosed to local subsidiaries, representatives, affiliates, and agents under the same strict conditions as established in this privacy notice.',
  },
  {
    title: 'Legal obligations',
    detail:
      'We may share information with external recipients under legal obligations, such as court orders or law enforcement requests.',
  },
] as const

const rights = [
  {
    title: 'Right of access',
    detail: 'You can ask us for copies of your personal information.',
  },
  {
    title: 'Right to rectification',
    detail: 'You can ask us to rectify inaccurate or incomplete information.',
  },
  {
    title: 'Right to erasure',
    detail:
      'You can ask us to erase your personal information in certain circumstances.',
  },
  {
    title: 'Right to restriction of processing',
    detail: 'You can ask us to restrict processing in certain circumstances.',
  },
  {
    title: 'Right to object to processing',
    detail: 'You can object to processing based on legitimate interests.',
  },
  {
    title: 'Right to data portability',
    detail:
      'You can ask us to transfer your information to another organization or to you in certain circumstances.',
  },
] as const

const retention = [
  {
    title: 'Active accounts',
    detail: 'Personal data is stored as long as you have an active user account.',
  },
  {
    title: 'Financial data',
    detail: 'Stored for three years after the last service.',
  },
  {
    title: 'Accounting data',
    detail: 'Stored for seven years after the last service.',
  },
  {
    title: 'Disputes and investigations',
    detail:
      'Data is stored as long as necessary for legal and regulatory requirements.',
  },
] as const

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
      {children}
    </h2>
  )
}

function DefinitionList({
  items,
}: {
  items: readonly { title: string; detail: string }[]
}) {
  return (
    <dl className="mt-6">
      {items.map((item) => (
        <div
          key={item.title}
          className="grid gap-2 border-t border-border py-5 sm:grid-cols-4 sm:gap-8"
        >
          <dt className="font-heading text-sm font-semibold tracking-wide text-accent-foreground uppercase sm:col-span-1">
            {item.title}
          </dt>
          <dd className="text-base leading-relaxed text-muted-foreground sm:col-span-3">
            {item.detail}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function PrivacyPolicyPage() {
  return (
    <div className="page-shell-narrow text-foreground">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
        <Link
          to="/"
          className="transition-colors hover:text-accent-foreground"
        >
          Home
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-accent-foreground">Privacy</span>
      </nav>

        <p className="font-mono text-xs tracking-[0.2em] text-emerald-400/80 uppercase">
          Legal
        </p>
        <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Global Privacy Notice for Users
        </h1>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            This privacy notice informs you how we handle your personal data. It
            explains what information we use to provide you with our sports data
            collection services, how we use your information to give you
            insights, and the choices and controls available to you. This notice
            also informs you about your privacy rights and how data protection
            rules work to protect everyone.
          </p>
          <p>
            Tisini Operations is the Controller of your personal data unless
            otherwise stated below. Our address is: Nairobi, Kenya. We have
            nominated a Data Protection Officer, and you can contact them at{' '}
            <a
              href="mailto:privacy@tisini.co.ke"
              className="text-accent-foreground underline-offset-2 hover:underline"
            >
              privacy@tisini.co.ke
            </a>{' '}
            or via any one of our postal addresses found in the city pages.
            Please mark the envelope “Data Protection Officer”.
          </p>
          <p className="text-foreground/90">
            The term “us” or “we” refers to Tisini Operations, a private limited
            company incorporated and registered under the laws of the Republic
            of Kenya. The term “you” or “your” refers to the team or player who
            requests, hires, and/or receives a data service through their Tisini
            account.
          </p>
        </div>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>1. Personal data we process</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We only process information that we need, so that we can provide you
            with the best service in our data collection and analysis
            marketplace. The data categories are as follows:
          </p>
          <DefinitionList items={dataCategories} />
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We may also collect and receive your data from other sources, such
            as referral campaigns — we may receive referred persons&apos;
            information from participants in our referral campaigns.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            A lack of (or inaccurate) personal data may prevent us from
            fulfilling our contract with you or from doing something expected of
            us in law. It may also mean that we cannot operate your account
            effectively. For example, refusing to share geolocation data means
            we cannot direct a data collector to your location or show you
            nearby data collection opportunities.
          </p>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>2. Purpose of the processing</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We process your personal data so we can provide you with one or more
            of our data collection services:
          </p>
          <DefinitionList items={processingPurposes} />
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We may also process your personal data for the establishment,
            exercise, or defense of legal claims in case we need to defend
            against or provide proof of claims for damages or other claims
            submitted to us for investigation.
          </p>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>3. Legal basis</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We use personal information in the ways described above if we have a
            proper reason to do so. The legal bases for processing personal data
            include:
          </p>
          <DefinitionList items={legalBases} />
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>4. Recipients</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We only share your personal data with trusted partners and
            authorities when there is a proper reason to do so. We limit sharing
            to only what is required and do not sell your personal information.
          </p>
          <DefinitionList items={recipients} />
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>5. Security and access</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Personal data collected in the course of providing our services is
            transferred to and stored in data centers located in the territories
            of Member States of the European Union. Only authorized employees of
            Tisini group companies and partners have access to personal data for
            resolving issues associated with the use of services. For research
            and scientific purposes, all data is anonymized to ensure you cannot
            be identified from it.
          </p>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>6. Your rights and controls</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            You have rights and controls over your personal data. Tisini
            provides controls through the app where you can view your personal
            information, including profile data and service history. You can
            also manage marketing opt-ins and cookie consent on our website.
          </p>
          <DefinitionList items={rights} />
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>7. Retention</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tisini retains user data only as long as necessary for the purposes
            described above. Different categories of data are retained for
            different periods depending on the type of data, the service it
            relates to, and the purposes for which it was collected.
          </p>
          <DefinitionList items={retention} />
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>8. Direct marketing</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We may send direct marketing messages to your e-mail address and/or
            phone number with your permission or under a soft opt-in basis. You
            can personalize marketing messages using information on how you use
            our services. To opt-out, click the “Unsubscribe” link in the footer
            of our emails or update your preferences in the Tisini app.
          </p>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>9. Automated decision-making</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We use automated decision-making for issuing warnings and service
            suspensions, fraud checks, user verification, and complaint
            resolution. Automated decision-making is efficient and safer than
            manual processing. You have the right to request human intervention
            and object to automated decisions in certain circumstances.
          </p>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>10. Dispute resolution</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Disputes relating to the processing of personal data are resolved
            through customer support (
            <a
              href="mailto:info@tisini.co.ke"
              className="text-accent-foreground underline-offset-2 hover:underline"
            >
              info@tisini.co.ke
            </a>
            ) in the first instance. You have the right to contact Tisini&apos;s
            Data Protection Officer (
            <a
              href="mailto:privacy@tisini.co.ke"
              className="text-accent-foreground underline-offset-2 hover:underline"
            >
              privacy@tisini.co.ke
            </a>
            ). You can also lodge a complaint with the Kenyan Data Protection
            Inspectorate if you believe we have processed your personal data
            unlawfully or failed to comply with our legal obligations.
          </p>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading>11. Making this notice clear</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We strive to make this privacy notice easy to understand and keep it
            up-to-date to protect your privacy and provide transparency. Data
            protection laws are important, and we take our responsibilities with
            your data seriously.
          </p>
        </section>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-10">
          <Link
            to="/about"
            className="inline-flex items-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-5 py-2.5 font-mono text-sm tracking-wide text-accent-foreground uppercase transition-colors hover:bg-emerald-400/20"
          >
            About Tisini
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 font-mono text-sm tracking-wide text-muted-foreground uppercase transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            Back home
          </Link>
        </div>
    </div>
  )
}
