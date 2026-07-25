import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — JobTrack",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen py-16 px-6">
      <article className="max-w-3xl mx-auto prose-sm" style={{ color: "rgb(var(--color-on-surface))" }}>
        <Link href="/" className="text-sm font-medium mb-8 inline-block" style={{ color: "rgb(var(--color-primary))" }}>
          ← Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm mb-8" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
          Last updated: July 25, 2026
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              By creating an account or using JobTrack, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              JobTrack is a web-based tool that allows users to track job applications. The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              <li>You must provide a valid email address and create a secure password.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You must be at least 16 years old to create an account.</li>
              <li>One person may not maintain more than one account.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Acceptable Use</h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              <li>Use the service for any unlawful purpose.</li>
              <li>Attempt to gain unauthorized access to other users&apos; data.</li>
              <li>Interfere with or disrupt the service&apos;s infrastructure.</li>
              <li>Use automated tools (bots, scrapers) to access the service.</li>
              <li>Upload malicious content or attempt to exploit vulnerabilities.</li>
              <li>Impersonate another person or misrepresent your identity.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Data Ownership</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              You retain ownership of all data you enter into JobTrack. We do not claim any intellectual property rights over your content. You grant us a limited license to store and display your data solely to provide the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Service Availability</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              We strive to maintain high availability but do not guarantee uninterrupted service. We reserve the right to modify, suspend, or discontinue the service (or any part of it) at any time with reasonable notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Account Termination</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              We may terminate or suspend your account if you violate these terms. You may delete your account at any time. Upon termination, your data will be deleted in accordance with our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              To the maximum extent permitted by law, JobTrack and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including but not limited to loss of data, loss of profits, or missed job opportunities.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. Indemnification</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              You agree to indemnify and hold harmless JobTrack, its operators, and affiliates from any claims, damages, or expenses arising from your use of the service or violation of these terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">10. Changes to Terms</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              We reserve the right to modify these terms at any time. Significant changes will be communicated via email to registered users. Continued use after changes constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation first, and if unresolved, through binding arbitration.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">12. Contact</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              For questions about these terms, contact us at:<br />
              <strong>Email:</strong> legal@jobtrack.app
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
