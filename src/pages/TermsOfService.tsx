import React, { useEffect } from "react";
import { FileText, User, Shield, AlertTriangle, BookOpen, Lock, Gavel, Mail, RefreshCcw } from "lucide-react";

const Section = ({ icon: Icon, title, children, bg }) => (
  <section className={`rounded-2xl p-8 mb-10 shadow-sm ${bg || "bg-white"}`}>
    <div className="flex items-center mb-4">
      {Icon && <Icon className="w-8 h-8 text-primary mr-3" />}
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="text-gray-700 text-lg leading-relaxed">{children}</div>
  </section>
);

// Define the component as a function
const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="container mx-auto max-w-3xl text-center">
          <FileText className="mx-auto mb-4 w-14 h-14 text-primary" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-700 mb-6">Last updated: February 2026</p>
        </div>
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        <Section icon={User} title="1. Acceptance of Terms" bg="bg-white">
          By accessing or using SlimFile (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
        </Section>
        <Section icon={BookOpen} title="2. Description of Service" bg="bg-gray-100">
          SlimFile provides online file compression and related services, including an API for programmatic access. The Service is provided on an "as is" and "as available" basis.
        </Section>
        <Section icon={User} title="3. User Responsibilities" bg="bg-white">
          <ul className="list-disc ml-6">
            <li>You must be at least 13 years old to use the Service.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree not to use the Service for any unlawful, harmful, or abusive purpose.</li>
            <li>You must not upload or process files that infringe on the intellectual property rights of others.</li>
            <li>You are responsible for compliance with all applicable laws and regulations.</li>
          </ul>
        </Section>
        <Section icon={Shield} title="4. Acceptable Use" bg="bg-gray-100">
          <ul className="list-disc ml-6">
            <li>No use of the Service to distribute malware, spam, or illegal content.</li>
            <li>No reverse engineering, decompiling, or attempting to extract the source code of the Service.</li>
            <li>No excessive or abusive use that may disrupt the Service for others.</li>
          </ul>
        </Section>
        <Section icon={Lock} title="5. Intellectual Property" bg="bg-white">
          All content, trademarks, and intellectual property on SlimFile are owned by SlimFile or its licensors. You may not use, copy, or distribute any content from the Service without permission.
        </Section>
        <Section icon={AlertTriangle} title="6. Termination" bg="bg-gray-100">
          We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms or is otherwise harmful to the Service or other users.
        </Section>
        <Section icon={Shield} title="7. Disclaimers" bg="bg-white">
          The Service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the Service will be error-free, secure, or uninterrupted.
        </Section>
        <Section icon={AlertTriangle} title="8. Limitation of Liability" bg="bg-gray-100">
          To the fullest extent permitted by law, SlimFile and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the Service; (b) any unauthorized access to or use of our servers and/or any personal information stored therein; (c) any interruption or cessation of transmission to or from the Service.
        </Section>
        <Section icon={RefreshCcw} title="9. Changes to Terms" bg="bg-white">
          We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.
        </Section>
        <Section icon={Gavel} title="10. Governing Law" bg="bg-gray-100">
          These Terms are governed by the laws of your jurisdiction, without regard to its conflict of law principles.
        </Section>
        <Section icon={Mail} title="11. Contact" bg="bg-white">
          If you have any questions about these Terms, please contact us at <a href="mailto:info@slim-file.com" className="text-primary underline">info@slim-file.com</a>.
        </Section>
      </div>
    </div>
  );
};

export default TermsOfService;
