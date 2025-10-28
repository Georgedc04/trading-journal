"use client";

import React from "react";
import { SiOpenai } from "react-icons/si";
import { MdEmail, MdLocationOn, MdGavel, MdSecurity } from "react-icons/md";
import { FaHistory, FaFileContract } from "react-icons/fa";
import { motion } from "framer-motion";

/**
 * PrivacyPolicy.tsx
 *
 * Full privacy policy for DC Trades.
 * - Replace the placeholder values marked with REPLACE_ME.
 * - Designed for dark-mode / existing app styles.
 */

const LAST_UPDATED = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-16 px-6 sm:px-12 lg:px-24 bg-[#07090b] text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SiOpenai className="w-9 h-9 text-cyan-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]" />
            <div>
              <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
              <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            This Privacy Policy explains how{" "}
            <span className="font-semibold text-cyan-300">DC Trades</span> ("we",
            "us", "our") collects, uses, discloses and safeguards your personal
            information when you use the DC Trades website, apps and Services.
            By using our Services you agree to the terms of this policy.
          </p>
        </header>

        {/* Quick contact block */}
        <section className="mb-8 p-5 rounded-2xl bg-[#08111a]/60 border border-cyan-400/6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <MdEmail className="w-6 h-6 text-cyan-300" />
              <div className="text-sm">
                <div>Support: <a className="text-cyan-300" href="mailto:support@dctrades.vercel.app">support@dctrades.vercel.app</a></div>
                <div>Privacy: <a className="text-cyan-300" href="mailto:privacy@dctrades.vercel.app">privacy@dctrades.vercel.app</a></div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-300">
              <MdLocationOn className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">Business:</div>
                <div className="text-xs">
                  {/* REPLACE the next line with your full legal address */}
                  DC Trades Technologies — <span className="italic">REPLACE_WITH_YOUR_BUSINESS_ADDRESS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table of contents */}
        <nav className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Contents</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            <li><a href="#who-we-are" className="text-cyan-300 hover:underline">1. Who we are</a></li>
            <li><a href="#what-we-collect" className="text-cyan-300 hover:underline">2. What we collect</a></li>
            <li><a href="#how-we-use" className="text-cyan-300 hover:underline">3. How we use</a></li>
            <li><a href="#sharing" className="text-cyan-300 hover:underline">4. Sharing & disclosure</a></li>
            <li><a href="#cookies" className="text-cyan-300 hover:underline">5. Cookies & tracking</a></li>
            <li><a href="#transfers" className="text-cyan-300 hover:underline">6. International transfers</a></li>
            <li><a href="#retention" className="text-cyan-300 hover:underline">7. Data retention</a></li>
            <li><a href="#rights" className="text-cyan-300 hover:underline">8. Your rights</a></li>
            <li><a href="#security" className="text-cyan-300 hover:underline">9. Data security</a></li>
            <li><a href="#children" className="text-cyan-300 hover:underline">10. Children's privacy</a></li>
            <li><a href="#links" className="text-cyan-300 hover:underline">11. Links</a></li>
            <li><a href="#changes" className="text-cyan-300 hover:underline">12. Changes</a></li>
            <li><a href="#governing-law" className="text-cyan-300 hover:underline">13. Governing Law</a></li>
            <li><a href="#contact" className="text-cyan-300 hover:underline">14. Contact</a></li>
          </ul>
        </nav>

        {/* Content */}
        <article className="prose prose-invert max-w-none space-y-8">
          <section id="who-we-are" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><FaFileContract className="text-cyan-300" /> 1. Who We Are</h3>
            <p className="text-sm text-gray-300">
              DC Trades is a digital trading journal and analytics platform for traders (Forex, Crypto, Indices and other markets). We provide trade recording, analytics, risk monitoring and automation tools.
            </p>
            <p className="text-sm text-gray-300">
              Legal entity: <strong>DC Trades Technologies</strong> (replace with your registered entity if different).
            </p>
          </section>

          <section id="what-we-collect" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MdSecurity className="text-cyan-300" /> 2. What Information We Collect</h3>

            <div className="space-y-2">
              <h4 className="font-semibold">2.1 Information You Provide</h4>
              <ul className="list-disc ml-5 text-sm text-gray-300">
                <li>Contact & profile: name, email, phone number, address (if provided).</li>
                <li>Account credentials and profile details.</li>
                <li>Payment & billing data (for subscriptions).</li>
                <li>Trade-entry data: trade date/time, instrument, direction, result, notes, screenshots, strategy tags.</li>
                <li>Any communications you send to us (support requests, feedback).</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">2.2 Automatically Collected Info</h4>
              <ul className="list-disc ml-5 text-sm text-gray-300">
                <li>Log data: IP address, device type, browser, OS, timestamps, pages visited.</li>
                <li>Usage analytics: feature usage, diagnostic and crash reports.</li>
                <li>Cookies and similar technologies (see section 5).</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">2.3 Third-Party & Derived Data</h4>
              <p className="text-sm text-gray-300">We may receive data from payment processors, analytics providers, or public sources. We also derive aggregated insights (e.g., win rate, expectancy) from raw trade data.</p>
            </div>

            <div>
              <h4 className="font-semibold">2.4 Sensitive Data</h4>
              <p className="text-sm text-gray-300">We do not intentionally collect special categories of sensitive personal data (e.g., race, religion, health) unless you explicitly provide them. If you are under the minimum age required by your jurisdiction to use our Services (usually 13 or 16), do not create an account without parental consent.</p>
            </div>
          </section>

          <section id="how-we-use" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><FaHistory className="text-cyan-300" /> 3. How We Use Your Information</h3>

            <p className="text-sm text-gray-300">We use personal data for the following legitimate purposes:</p>
            <ul className="list-disc ml-5 text-sm text-gray-300">
              <li>Provide and maintain the Services (accounts, dashboards, trade journaling).</li>
              <li>Manage billing, subscriptions and refunds.</li>
              <li>Improve our products via analytics and testing.</li>
              <li>Communicate product updates, security notices and marketing (where you opt-in).</li>
              <li>Detect and prevent fraud, enforce terms and secure our platform.</li>
              <li>Personalize your experience (preferences, saved layouts, analytics views).</li>
            </ul>

            <p className="text-sm text-gray-300">If you are a resident of the EU/EEA/UK, our legal bases for processing may include performance of a contract, compliance with legal obligations, your consent (where given), and our legitimate interests (product improvement, security).</p>
          </section>

          <section id="sharing" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MdGavel className="text-cyan-300" /> 4. How We Share & Disclose Information</h3>

            <p className="text-sm text-gray-300">We may share personal information with:</p>
            <ul className="list-disc ml-5 text-sm text-gray-300">
              <li>Service providers (hosting, storage, analytics, email providers) under contract to assist with Services.</li>
              <li>Payment processors (to process subscriptions and refunds).</li>
              <li>Regulatory or law enforcement authorities when required by law.</li>
              <li>Potential acquirers or investors in the context of corporate transactions — you will be notified where required by law.</li>
            </ul>

            <p className="text-sm text-gray-300"><strong>We do not sell your personal information for commercial purposes.</strong></p>
          </section>

          <section id="cookies" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><FaFileContract className="text-cyan-300" /> 5. Cookies & Tracking Technologies</h3>

            <p className="text-sm text-gray-300">We use cookies, local storage and SDKs to:</p>
            <ul className="list-disc ml-5 text-sm text-gray-300">
              <li>Authenticate and keep you signed in.</li>
              <li>Remember preferences and settings.</li>
              <li>Measure analytics and product performance.</li>
              <li>Deliver optional marketing content (where permitted).</li>
            </ul>

            <p className="text-sm text-gray-300">You can manage cookies via your browser or device settings; disabling some cookies may affect functionality.</p>
          </section>

          <section id="transfers" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MdSecurity className="text-cyan-300" /> 6. International Transfers</h3>
            <p className="text-sm text-gray-300">Your information may be stored and processed in countries where our service providers operate. By using the Services, you consent to such transfers. Where required, we implement appropriate safeguards (e.g., standard contractual clauses).</p>
          </section>

          <section id="retention" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><FaHistory className="text-cyan-300" /> 7. Data Retention</h3>
            <p className="text-sm text-gray-300">We keep personal information for as long as needed to provide the Services, comply with legal obligations, enforce agreements, and for legitimate business purposes. When no longer required, we securely delete or anonymize data.</p>
          </section>

          <section id="rights" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MdGavel className="text-cyan-300" /> 8. Your Rights & Choices</h3>

            <p className="text-sm text-gray-300">Depending on your location, you may have rights including:</p>
            <ul className="list-disc ml-5 text-sm text-gray-300">
              <li>Access your personal data.</li>
              <li>Correct inaccuracies.</li>
              <li>Request deletion (where applicable).</li>
              <li>Restrict or object to processing (in certain circumstances).</li>
              <li>Data portability requests (receive your data in a structured format).</li>
            </ul>

            <p className="text-sm text-gray-300">To exercise rights, email us at <a className="text-cyan-300" href="mailto:privacy@dctrades.vercel.app">privacy@dctrades.vercel.app</a>. We will respond within a reasonable timeframe as required by applicable law.</p>
          </section>

          <section id="security" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MdSecurity className="text-cyan-300" /> 9. Data Security</h3>
            <p className="text-sm text-gray-300">We implement industry-standard technical and organizational measures—encryption, access controls, monitoring—to protect data. No system is perfectly secure; we cannot guarantee absolute security, but we continuously improve safeguards and promptly notify affected users of material breaches when required by law.</p>
          </section>

          <section id="children" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><FaFileContract className="text-cyan-300" /> 10. Children's Privacy</h3>
            <p className="text-sm text-gray-300">We do not knowingly collect personal information from children under the applicable minimum age (commonly 13 or 16). If we learn we have collected such data without parental consent, we will take steps to delete it.</p>
          </section>

          <section id="links" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MdSecurity className="text-cyan-300" /> 11. Links to Other Services</h3>
            <p className="text-sm text-gray-300">Our Services may link to third-party sites that maintain separate privacy practices. We are not responsible for third-party practices; review their privacy policies before providing personal data.</p>
          </section>

          <section id="changes" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><FaHistory className="text-cyan-300" /> 12. Changes to This Privacy Policy</h3>
            <p className="text-sm text-gray-300">We may update this Policy periodically. If material changes occur, we will notify users by email or in-app and update the "Last updated" date on this page. Review this page occasionally for updates.</p>
          </section>

          <section id="governing-law" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MdGavel className="text-cyan-300" /> 13. Governing Law & Jurisdiction</h3>

            <p className="text-sm text-gray-300">
              This Policy and any disputes arising from it will be governed by the laws of
              <strong> REPLACE_WITH_YOUR_JURISDICTION</strong> (e.g., "India" or "State of California"). Replace this with your official governing jurisdiction.
            </p>

            <p className="text-sm text-gray-300">
              When using DC Trades from another jurisdiction you may have additional rights under local law.
            </p>
          </section>

          <section id="contact" className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MdEmail className="text-cyan-300" /> 14. Contact Us</h3>

            <p className="text-sm text-gray-300">
              For privacy requests, questions, or concerns:
            </p>

            <ul className="list-disc ml-5 text-sm text-gray-300">
              <li>Email (privacy): <a className="text-cyan-300" href="mailto:privacy@dctrades.vercel.app">privacy@dctrades.vercel.app</a></li>
              <li>Email (support): <a className="text-cyan-300" href="mailto:support@dctrades.vercel.app">support@dctrades.vercel.app</a></li>
              <li>Address: <span className="italic">REPLACE_WITH_YOUR_BUSINESS_ADDRESS</span></li>
              <li>Phone: <span className="italic">REPLACE_WITH_PHONE_IF_APPLICABLE</span></li>
            </ul>

            <p className="text-xs text-gray-500 mt-2">
              If you are in the EU/UK/EEA and believe we have processed your data incorrectly, you may lodge a complaint with a supervisory authority.
            </p>
          </section>
        </article>

        {/* Footer CTA */}
        <footer className="mt-12 pt-8 border-t border-cyan-400/6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} <span className="text-cyan-300 font-semibold">DC Trades</span>. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This Policy provides general information and does not create any contractual or legal rights beyond those set out in your agreements with DC Trades.
          </p>
        </footer>
      </motion.div>
    </main>
  );
}
