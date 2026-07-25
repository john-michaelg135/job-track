import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — JobTrack",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-16 px-6">
      <article className="max-w-3xl mx-auto prose-sm" style={{ color: "rgb(var(--color-on-surface))" }}>
        <Link href="/" className="text-sm font-medium mb-8 inline-block" style={{ color: "rgb(var(--color-primary))" }}>
          ← Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm mb-8" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
          Last updated: July 25, 2026
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              JobTrack (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, store, and protect your information when you use our job application tracking service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              <li><strong>Account Information:</strong> Email address and password (encrypted) for authentication purposes.</li>
              <li><strong>Application Data:</strong> Company names, job roles, URLs, application statuses, dates, and notes you voluntarily enter.</li>
              <li><strong>Usage Data:</strong> Basic analytics such as page views, session duration, and feature usage (anonymized).</li>
              <li><strong>Technical Data:</strong> Browser type, device type, and IP address for security and service optimization.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              <li>To provide and maintain the JobTrack service.</li>
              <li>To authenticate your identity and secure your account.</li>
              <li>To send transactional emails (account confirmation, password reset).</li>
              <li>To improve our service based on anonymized usage patterns.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Legal Basis for Processing (GDPR)</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              <li><strong>Consent:</strong> When you create an account, you consent to processing your data for the service.</li>
              <li><strong>Contract:</strong> Processing is necessary to deliver the service you signed up for.</li>
              <li><strong>Legitimate Interest:</strong> Improving security and service performance.</li>
              <li><strong>Legal Obligation:</strong> Complying with applicable laws.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Data Storage & Security</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              Your data is stored securely using Supabase (hosted on AWS) with the following protections:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              <li>Passwords are hashed using bcrypt (never stored in plaintext).</li>
              <li>All data is encrypted in transit (TLS/HTTPS) and at rest (AES-256).</li>
              <li>Row-Level Security (RLS) ensures users can only access their own data.</li>
              <li>Database access requires authentication with JWT tokens.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              We retain your data for as long as your account is active. Upon account deletion request, all your personal data and application entries are permanently deleted within 30 days, except where retention is required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              Under GDPR, CCPA, and similar regulations, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Rectification:</strong> Correct inaccurate data.</li>
              <li><strong>Erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;).</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format.</li>
              <li><strong>Restriction:</strong> Limit how we process your data.</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interest.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time without affecting prior processing.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              To exercise these rights, contact us at the email below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Cookies</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              We use essential cookies only for authentication and session management. We do not use advertising or third-party tracking cookies. Your theme and accent preferences are stored in localStorage (not cookies) and never leave your device.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              <li><strong>Supabase:</strong> Authentication and database hosting. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "rgb(var(--color-primary))" }}>Their privacy policy</a>.</li>
              <li><strong>Vercel:</strong> Application hosting. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "rgb(var(--color-primary))" }}>Their privacy policy</a>.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">10. Children&apos;s Privacy</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              JobTrack is not intended for children under 16 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">11. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              We may update this privacy policy from time to time. We will notify registered users of significant changes via email. Continued use of the service after changes constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">12. Contact</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
              For privacy-related inquiries, data requests, or complaints, contact us at:<br />
              <strong>Email:</strong> privacy@jobtrack.app
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
