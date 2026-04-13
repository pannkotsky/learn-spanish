import { createFileRoute, Link } from '@tanstack/react-router'

import { contactEmail } from '#/lib/contact-email'

const LAST_UPDATED = 'April 13, 2026'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6 pb-12">
      <div>
        <p className="mb-2 text-sm text-base-content/60">
          <Link to="/" className="link link-hover">
            Home
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-base-content">Terms of use</h1>
        <p className="mt-2 text-sm text-base-content/60">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="flex flex-col gap-6 text-base leading-relaxed text-base-content/80">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Agreement</h2>
          <p className="m-0">
            By accessing or using Learn Spanish (the “Service”), you agree to these terms. If you do
            not agree, please do not use the Service.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">What the Service is</h2>
          <p className="m-0">
            The Service offers educational tools (such as verb reference and quizzes) for learning
            Spanish. Content is provided for general learning purposes and may contain errors or
            omissions.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Accounts</h2>
          <p className="m-0">
            Creating an account is optional where offered. You agree to provide accurate information
            and to keep your login credentials confidential. You are responsible for activity under
            your account.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Acceptable use</h2>
          <p className="m-0">
            You will not misuse the Service: no unlawful activity, harassment, attempts to break
            security or overload systems, or use that interferes with others’ access. We may suspend
            access that violates these rules.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Intellectual property</h2>
          <p className="m-0">
            The Service, its design, and its materials are owned by us or our licensors. You may use
            the Service for personal, non-commercial learning unless we give written permission
            otherwise.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Disclaimer</h2>
          <p className="m-0">
            The Service is provided “as is” and “as available” without warranties of any kind, to
            the fullest extent permitted by law. We do not guarantee uninterrupted access or that
            content is complete or error-free.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Limitation of liability</h2>
          <p className="m-0">
            To the maximum extent permitted by applicable law, we are not liable for indirect,
            incidental, special, consequential, or punitive damages, or for any loss of data or
            profits, arising from your use of the Service.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Changes</h2>
          <p className="m-0">
            We may change these terms or the Service. We will update the “Last updated” date when
            the terms change materially. Continued use after changes constitutes acceptance of the
            new terms.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-base-content">Contact</h2>
          <p className="m-0">
            Questions about these terms:{' '}
            <a
              className="link link-hover font-medium text-base-content"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
