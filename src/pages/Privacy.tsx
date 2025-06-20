
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import SEO from '@/components/seo/SEO';

const Privacy: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - MyPetID.ai"
        description="Privacy Policy for MyPetID.ai - learn how we collect, use, and protect your personal information and your pet's digital identity data."
        keywords="privacy policy, data protection, pet identity privacy, digital pet data, GDPR compliance"
        canonicalUrl="https://mypetid.ai/privacy"
      />

      <div className="min-h-screen bg-white">
        <Header />

        <main className="container-max py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Privacy Policy</h1>
          <Separator className="mb-8" />

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Introduction and Our Commitment to Your Privacy</h2>
              <p className="mb-4">
                At MyPetID.ai, we are deeply committed to protecting your privacy and the sensitive information relating to your beloved pets. This comprehensive Privacy Policy describes in detail how we collect, use, process, store, and share information about you and your pets when you utilize our innovative digital pet identity platform and management services. Our platform includes our comprehensive Pet SSN system, advanced mobile applications, intuitive web interface, document management services, health record tracking, vaccination management, and all other associated online services (collectively referred to as the "Services").
              </p>
              <p className="mb-4">
                We understand that your pet's information is deeply personal and valuable to you. As responsible stewards of this data, we have implemented robust security measures and privacy protections to ensure your information remains secure, confidential, and is used only in ways that benefit you and your pet's care and well-being.
              </p>
              <p>
                Please read this Privacy Policy carefully and thoroughly. By accessing, using, or continuing to use our Services in any capacity, you acknowledge that you have read, understood, and agree to the collection, use, processing, and sharing of your information as described comprehensively in this Privacy Policy. If you do not agree with our policies, practices, or any terms outlined herein, please discontinue use of our Services immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Comprehensive Information Collection Practices</h2>
              <p className="mb-4">We collect several categories of information from and about users of our Services to provide you with the most comprehensive and personalized pet management experience possible. Our data collection practices are designed to enhance your experience while maintaining the highest standards of privacy and security.</p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">2.1 Information You Directly Provide to Us</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Account Registration Information:</strong> When you create an account with MyPetID.ai, we collect essential information including your full name, email address, secure password, phone number (optional), and any other contact details you choose to provide.</li>
                <li><strong>Comprehensive Pet Profile Information:</strong> You provide detailed information about your pets to create their comprehensive digital identity profiles, including but not limited to high-resolution photos, detailed breed information, birth dates and age calculations, unique Pet SSN assignments, weight and size measurements, temperament descriptions, behavioral notes, dietary preferences and restrictions, and any special care instructions.</li>
                <li><strong>Health and Medical Records:</strong> Our platform allows you to securely store and manage comprehensive health records including vaccination certificates and schedules, medical history and treatment records, prescription medications and dosages, veterinary visit notes and recommendations, emergency medical information, allergy and sensitivity information, and any other health-related documentation.</li>
                <li><strong>Digital Identity Documents:</strong> Various files, documents, images, and records you upload to create, maintain, and enhance your pet's comprehensive digital identity and secure Pet SSN profile.</li>
                <li><strong>Communication Records:</strong> When you contact our support team, customer service representatives, or engage with our platform in any way, we maintain detailed records of these communications along with any additional information you provide during these interactions.</li>
                <li><strong>Marketing Preferences:</strong> During registration and throughout your use of our Services, you may choose to opt-in to receive marketing communications, promotional materials, pet care tips, and other relevant content from us or our carefully selected partners.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">2.2 Information We Automatically Collect</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Detailed Usage Information:</strong> We automatically collect comprehensive information about your interaction with our Services, including specific features utilized, time spent on various sections of the platform, frequency of access, navigation patterns, and overall engagement metrics.</li>
                <li><strong>Device and Technical Information:</strong> We collect detailed information about the devices you use to access our Services, including device type and model, operating system version, browser type and version, IP address and approximate location, screen resolution and device capabilities, and unique device identifiers.</li>
                <li><strong>Advanced Cookies and Tracking Technologies:</strong> We utilize various cookies, web beacons, pixel tags, and similar advanced technologies to collect information about your browsing behavior, preferences, and to enhance your overall user experience on our platform.</li>
                <li><strong>Location Information:</strong> With your explicit consent, we may collect precise or approximate location information to provide location-based services such as finding nearby veterinarians, pet-friendly establishments, or emergency services.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. How We Use Your Information Comprehensively</h2>
              <p className="mb-4">We use the information we collect for a wide variety of purposes designed to enhance your experience and provide you with the most comprehensive pet management platform available. Our use of your information includes but is not limited to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Core Service Provision:</strong> Providing, maintaining, securing, and continuously improving our comprehensive digital pet identity Services and platform functionality</li>
                <li><strong>Account and Profile Management:</strong> Creating, maintaining, and securing your user account and your pets' detailed digital identity profiles</li>
                <li><strong>Pet SSN System:</strong> Generating, managing, and maintaining unique Pet SSN identifications for comprehensive pet tracking and identification</li>
                <li><strong>Health and Care Management:</strong> Processing, storing, and organizing health records, vaccination schedules, and medical information to provide comprehensive pet care management</li>
                <li><strong>Smart Notifications and Reminders:</strong> Providing intelligent health reminders, vaccination alerts, appointment notifications, and personalized care recommendations</li>
                <li><strong>Customer Support and Communication:</strong> Responding promptly and thoroughly to your comments, questions, support requests, and providing comprehensive customer service</li>
                <li><strong>Platform Enhancement and Development:</strong> Developing new features, products, and services for comprehensive pet digital identity management and care coordination</li>
                <li><strong>Personalization and Customization:</strong> Personalizing your experience by delivering content, recommendations, and features specifically relevant to your pets' unique needs and your preferences</li>
                <li><strong>Analytics and Optimization:</strong> Monitoring, analyzing, and understanding usage trends, user behavior, and platform performance to continuously optimize and improve our Services</li>
                <li><strong>Security and Fraud Prevention:</strong> Detecting, investigating, and preventing fraudulent transactions, unauthorized access, and other illegal activities to protect you and other users</li>
                <li><strong>Legal Compliance and Protection:</strong> Complying with applicable legal obligations, regulations, and industry standards while protecting our rights and the rights of our users</li>
                <li><strong>Marketing Communications (With Your Consent):</strong> When you have explicitly opted-in, we may use your information to send you promotional materials, pet care tips, platform updates, and other relevant marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Information Sharing and Disclosure Practices</h2>
              <p className="mb-4">We are committed to protecting your privacy and maintaining the confidentiality of your pet's digital identity information. We may share your information only in the specific circumstances outlined below, and we never sell your personal information for monetary gain.</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>With Your Explicit Consent:</strong> We share information with your explicit consent or at your specific direction, such as when sharing your pet's digital identity information with veterinarians, pet sitters, or other authorized care providers</li>
                <li><strong>Trusted Service Providers:</strong> We work with carefully vetted service providers and contractors who perform essential services on our behalf, including cloud hosting, data analytics, customer support, and technical maintenance, all under strict confidentiality agreements</li>
                <li><strong>Legal and Regulatory Compliance:</strong> We may disclose information when required by law, court order, or governmental regulation, or when we believe disclosure is necessary to protect rights, property, safety, or to comply with legal processes</li>
                <li><strong>Safety and Security Protection:</strong> We may share information to protect the rights, property, and safety of MyPetID.ai, our users, your pets, and the general public, including in emergency situations</li>
                <li><strong>Business Transactions:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, acquisition, or transfer of all or a portion of our business to another company, subject to confidentiality obligations</li>
                <li><strong>Marketing Partners (With Opt-In Consent Only):</strong> If you have explicitly opted-in to receive marketing communications during registration or through your account settings, we may share certain information with carefully selected partners to provide you with relevant pet care products, services, and information that may benefit you and your pets</li>
              </ul>
              <p className="mt-4 font-semibold">
                Important Note: We maintain strict control over how your information is used for marketing purposes. You can opt-out of marketing communications at any time through your account settings or by following unsubscribe instructions in any marketing email you receive.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Your Privacy Rights and Control Options</h2>
              <p className="mb-4">We believe you should have comprehensive control over your personal information and your pet's digital identity data. Depending on your location and applicable laws, you may have various rights regarding your personal information:</p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">5.1 Account Information Management</h3>
              <p className="mb-4">
                You can update, modify, or correct your account information and your pets' digital identity profiles at any time by accessing your account settings through our platform. You maintain complete control over the information you share and can modify privacy settings, sharing preferences, and communication preferences as needed.
              </p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">5.2 Pet Digital Identity Sharing Controls</h3>
              <p className="mb-4">
                You have complete and granular control over when, how, and with whom your pet's digital identity information is shared. You can grant or revoke access permissions at any time through your comprehensive account dashboard, and you can set specific sharing preferences for different types of information and different recipients.
              </p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">5.3 Marketing Communication Preferences</h3>
              <p className="mb-4">
                You can easily opt-out of receiving promotional emails, marketing communications, and other non-essential communications from us by following the unsubscribe instructions included in emails or by updating your communication preferences in your account settings. Even if you opt out of marketing communications, we may still send you important non-promotional emails related to your account, security updates, or essential service information.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">5.4 Data Protection Rights</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>The right to access and review personal information we hold about you and your pets</li>
                <li>The right to request correction or updating of inaccurate personal information</li>
                <li>The right to request deletion of your personal information and Pet SSN data, subject to certain legal limitations</li>
                <li>The right to restrict or object to certain processing of your personal information</li>
                <li>The right to data portability for your pet's digital identity information</li>
                <li>The right to withdraw consent for data processing where consent is the basis for processing</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@mypetid.ai with a detailed description of your request. We will respond to your request within the timeframe required by applicable law and may need to verify your identity before processing certain requests.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Comprehensive Data Security Measures</h2>
              <p className="mb-4">
                We take the security of your personal information and your pet's digital identity data extremely seriously. We have implemented comprehensive, industry-leading security measures designed to protect information about you and your pets from unauthorized access, disclosure, alteration, theft, loss, and destruction.
              </p>
              <p className="mb-4">
                Our security measures include but are not limited to: advanced encryption protocols for data transmission and storage, secure server infrastructure with regular security updates and monitoring, strict access controls and authentication procedures for all personnel, regular security audits and vulnerability assessments, comprehensive backup and disaster recovery procedures, and ongoing security training for all team members who handle user data.
              </p>
              <p>
                However, it is important to understand that no internet-based service, electronic storage system, or method of data transmission can be guaranteed to be completely secure. While we strive to use commercially acceptable and industry-standard security measures to protect your personal information, we cannot guarantee the absolute security of your information transmitted through our Services or stored in our systems.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Children's Privacy Protection</h2>
              <p className="mb-4">
                Our Services are designed for and intended to be used by individuals who are at least 16 years of age. We do not knowingly collect, process, or maintain personal information from children under 16 years of age without appropriate parental consent. If we become aware that we have inadvertently collected personal information from a child under 16 without proper parental consent, we will take immediate steps to delete that information from our systems.
              </p>
              <p>
                If you are a parent or guardian and believe that your child under 16 has provided personal information to us without your consent, please contact us immediately at privacy@mypetid.ai so that we can take appropriate action to remove such information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. International Data Transfers and Global Operations</h2>
              <p className="mb-4">
                MyPetID.ai operates primarily from the United States, and the information we collect is governed by U.S. law and regulations. If you are accessing our Services from outside the United States, please be aware that information collected through the Services may be transferred to, processed, stored, and used in the United States and other jurisdictions where our service providers operate.
              </p>
              <p className="mb-4">
                These jurisdictions may have data protection laws that differ from those in your country of residence. By using our Services, you acknowledge and consent to the transfer of your information to these jurisdictions. We take appropriate measures to ensure that your personal information receives adequate protection in accordance with applicable privacy laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. Comprehensive Data Retention Practices</h2>
              <p className="mb-4">
                We retain your personal information and your pet's digital identity data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by applicable law. The specific retention period depends on various factors including the nature of the information, the purposes for which it was collected, and our legal obligations.
              </p>
              <p className="mb-4">
                When determining retention periods, we consider factors such as: the ongoing relationship with you and your use of our Services, legal obligations and regulatory requirements, the need to resolve disputes or enforce agreements, and legitimate business purposes such as improving our Services and ensuring security.
              </p>
              <p>
                When we no longer need to retain your personal information, we will securely delete or anonymize it in accordance with our data retention and destruction policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">10. Changes and Updates to This Privacy Policy</h2>
              <p className="mb-4">
                We may update, modify, or revise this Privacy Policy from time to time to reflect changes in our practices, Services, legal requirements, or for other operational, legal, or regulatory reasons. When we make material changes to this Privacy Policy, we will provide notice through the Services, by email, or through other appropriate communication channels.
              </p>
              <p className="mb-4">
                We encourage you to review this Privacy Policy periodically to stay informed about our privacy practices and your rights. Your continued use of the Services after any changes to this Privacy Policy become effective constitutes your acceptance of such changes and the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">11. Contact Information and Privacy Inquiries</h2>
              <p className="mb-4">
                If you have any questions, concerns, comments, or requests regarding this Privacy Policy, our privacy practices, or your pet's digital identity data, please don't hesitate to contact us. We are committed to addressing your privacy concerns promptly and thoroughly.
              </p>
              <p className="ml-4">
                MyPetID.ai, Inc.<br />
                Privacy Department<br />
                Email: privacy@mypetid.ai<br />
                Subject Line: Privacy Policy Inquiry
              </p>
              <p className="mt-4">
                When contacting us about privacy matters, please provide as much detail as possible about your inquiry so that we can assist you effectively and efficiently.
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Privacy;