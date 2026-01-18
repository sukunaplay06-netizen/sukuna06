import React from "react";
import Footer from "../components/Footer";

function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center">
          Privacy Policy
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 leading-relaxed space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              1. Introduction
            </h2>
            <p>
              At <strong>Leadsgurukul</strong>, we respect your privacy. This
              Privacy Policy explains how we collect, use, and safeguard your
              personal information when you visit our website or interact with our
              affiliate programs.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Personal details (name, email address, phone number) when you sign
                up or contact us.
              </li>
              <li>
                Affiliate account data (referral IDs, commission history, and
                payouts).
              </li>
              <li>
                Technical information (IP address, browser type, device details)
                via cookies and analytics tools.
              </li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To operate and improve our affiliate marketing services.</li>
              <li>To track referrals, commissions, and payments accurately.</li>
              <li>To communicate important updates, promotions, or support.</li>
              <li>To comply with legal and regulatory requirements.</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              4. Cookies & Tracking
            </h2>
            <p>
              We use cookies, pixels, and similar technologies to track referrals,
              improve site performance, and deliver relevant advertising. You may
              adjust your browser settings to block cookies, but this could affect
              site functionality.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              5. Data Sharing & Third Parties
            </h2>
            <p>
              We do not sell your personal data. However, we may share information
              with trusted third-party service providers (such as payment
              processors, analytics platforms, and hosting providers) to operate
              our services. We also share anonymized affiliate data with partners
              to calculate commissions and verify referrals.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              6. Security of Your Data
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              personal information. However, no online system can be guaranteed
              100% secure.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              7. Your Rights & Choices
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to or correction of your personal data.</li>
              <li>Opt out of marketing communications at any time.</li>
              <li>Request deletion of your account or affiliate data.</li>
            </ul>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices. Updates will be posted on this page with
              the “last updated” date.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-600">
              9. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:{" "}
              <a
                href="mailto:support@yourwebsite.com"
                className="text-purple-600 underline"
              >
                support@leadsgurukul.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
       <Footer />
    </div>
  );
}

export default PrivacyPolicy;
