import React from "react";
import { useSEO } from '@/hooks/useSEO';
import { Lock, User, FileText, Cloud, Shield, RefreshCcw, Mail, AlertTriangle } from "lucide-react";

const Section = ({ icon: Icon, title, children, bg }) => (
  <section className={`rounded-2xl p-8 mb-10 shadow-sm ${bg || "bg-white"}`}>
    <div className="flex items-center mb-4">
      {Icon && <Icon className="w-8 h-8 text-primary mr-3" />}
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="text-gray-700 text-lg leading-relaxed">{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  useSEO({
    title: 'Privacy Policy | SlimFile',
    description: 'Read SlimFile\'s Privacy Policy. We are committed to protecting your data — files are never stored or shared.',
  });
  return (
    <div className="min-h-screen pt-28 bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="container mx-auto max-w-3xl text-center">
          <Lock className="mx-auto mb-4 w-14 h-14 text-primary" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-700 mb-6">Last updated: August 1, 2026</p>
        </div>
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        <Section icon={FileText} title="1. Introduction" bg="bg-white">
          This Privacy Policy explains how SlimFile ("we", "us", or "our") collects, uses, and protects your information when you use our website, services, and API.
        </Section>
        <Section icon={User} title="2. Information We Collect" bg="bg-gray-100">
          <ul className="list-disc ml-6">
            <li><strong>Account Information:</strong> When you sign in, we may collect your name, email address, and profile picture via Google authentication.</li>
            <li><strong>Uploaded Files:</strong> Files you upload for compression are processed temporarily and deleted after processing.</li>
            <li><strong>Usage Data:</strong> We may collect information about how you use the Service, such as access times, device information, and IP address.</li>
            <li><strong>Cookies:</strong> We may use cookies and similar technologies to enhance your experience.</li>
          </ul>
        </Section>
        <Section icon={Cloud} title="3. How We Use Your Information" bg="bg-white">
          <ul className="list-disc ml-6">
            <li>To provide and improve the Service.</li>
            <li>To authenticate users and secure access to the API.</li>
            <li>To communicate with you about your account or support requests.</li>
            <li>To monitor and analyze usage for security and performance.</li>
            <li><strong>Public Leaderboard:</strong> Your name and compression statistics (average compression percentage, total files compressed, and space saved) may be displayed publicly on our Leaderboard feature to recognize top performers. Your profile picture may also be displayed if you've provided one through Google authentication. Guest users appear anonymously with a partial identifier.</li>
          </ul>
        </Section>
        <Section icon={Shield} title="4. Advertising" bg="bg-gray-100">
          <ul className="list-disc ml-6">
            <li><strong>Third-Party Advertising:</strong> We use third-party advertising services, including Google AdSense, to display ads on our website.</li>
            <li><strong>Cookies and Tracking:</strong> These advertising partners may use cookies, web beacons, and similar technologies to collect information about your visits to this and other websites in order to provide relevant advertisements about goods and services that may be of interest to you.</li>
            <li><strong>Personalized Advertising:</strong> Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google's Ads Settings</a>.</li>
            <li><strong>Privacy Policies:</strong> For more information about how Google uses data, please review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google's Privacy Policy</a>.</li>
          </ul>
        </Section>
        <Section icon={Shield} title="5. Data Sharing and Third Parties" bg="bg-white">
          <ul className="list-disc ml-6">
            <li>We do not sell your personal information.</li>
            <li>We may share data with trusted third-party service providers (e.g., cloud hosting, analytics) as necessary to operate the Service.</li>
            <li>We may disclose information if required by law or to protect our rights and users.</li>
          </ul>
        </Section>
        <Section icon={Lock} title="6. Data Security" bg="bg-gray-100">
          We implement reasonable security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure.
        </Section>
        <Section icon={AlertTriangle} title="7. Data Retention" bg="bg-white">
          Uploaded files are deleted after processing. Account and usage data are retained as long as necessary to provide the Service and comply with legal obligations.
        </Section>
        <Section icon={User} title="8. Your Rights" bg="bg-gray-100">
          <ul className="list-disc ml-6">
            <li>You may request access to, correction of, or deletion of your personal information by contacting us.</li>
            <li>You may opt out of non-essential communications at any time.</li>
          </ul>
        </Section>
        <Section icon={Shield} title="9. Children's Privacy" bg="bg-white">
          The Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
        </Section>
        <Section icon={RefreshCcw} title="10. Changes to This Policy" bg="bg-gray-100">
          We may update this Privacy Policy from time to time. Continued use of the Service after changes constitutes acceptance of the new policy.
        </Section>
        <Section icon={Mail} title="11. Contact" bg="bg-white">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@slim-file.com" className="text-primary underline">info@slim-file.com</a>.
        </Section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
