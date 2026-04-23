import { createFileRoute, Link } from '@tanstack/react-router'

import { contactEmail } from '#/lib/contact-email'

const LAST_UPDATED = 'April 23, 2026'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6 pb-12">
      <div>
        <p className="mb-2 text-sm text-base-content/60">
          <Link to="/" className="link link-hover">
            Home
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-base-content">Privacy policy</h1>
        <p className="mt-2 text-sm text-base-content/60">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="flex flex-col gap-6 text-base leading-relaxed text-base-content/80">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Overview</h2>
          <p className="m-0">
            This policy describes how Learn Spanish (“we”, “us”) handles information when you use
            this website and related services (the “Service”). It is meant to be short and readable;
            contact us if something is unclear.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Information we collect</h2>
          <ul className="m-0 list-inside list-disc space-y-2">
            <li>
              <strong className="font-medium text-base-content">Account data.</strong> If you sign
              up or log in, we store the details needed to run authentication (for example, email
              and a password hash). We do not sell your personal information.
            </li>
            <li>
              <strong className="font-medium text-base-content">Technical data.</strong> Like most
              sites, our servers and hosting partners may log basic technical information (such as
              IP address, browser type, and timestamps) for security, debugging, and reliability.
            </li>
            <li>
              <strong className="font-medium text-base-content">Cookies and local storage.</strong>{' '}
              We currently use limited first-party browser storage to run core features: an
              authentication/session cookie (when you log in) and a theme preference cookie
              (`light`/`dark`, up to 12 months). We do not use this storage for advertising.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">How we use information</h2>
          <p className="m-0">
            We use the above to provide and secure the Service, operate accounts where you use them,
            fix problems, and comply with the law. We do not use your data for third-party
            advertising in this minimal setup.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Cookie choices</h2>
          <p className="m-0">
            The cookies we currently set are used only for strictly necessary functionality (account
            authentication and your chosen theme). Where applicable law requires consent for
            non-essential cookies or similar technologies, we will request consent before enabling
            them and provide a way to withdraw that consent.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Sharing</h2>
          <p className="m-0">
            We may share data with infrastructure providers that host the Service, strictly as
            needed to run the site. Links to third parties (for example GitHub) are governed by
            their own policies when you leave this site.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Retention and security</h2>
          <p className="m-0">
            We keep information only as long as needed for these purposes or as required by law. No
            method of transmission over the internet is perfectly secure; we use reasonable
            safeguards appropriate to a small project.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Your choices and rights</h2>
          <p className="m-0">
            Depending on where you live, you may have rights to access, correct, or delete personal
            data we hold about you. Email us at{' '}
            <a
              className="link link-hover font-medium text-base-content"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>{' '}
            for requests or questions.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Children</h2>
          <p className="m-0">
            The Service is not directed at children under 13 (or the minimum age required in your
            country). If you believe we have collected a child’s data in error, contact us and we
            will take appropriate steps.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Changes</h2>
          <p className="m-0">
            We may update this policy from time to time. The “Last updated” date at the top will
            change when we do; continued use of the Service after changes means you accept the
            revised policy.
          </p>
        </section>
      </div>
    </main>
  )
}
