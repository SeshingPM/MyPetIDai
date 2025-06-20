
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import SEO from '@/components/seo/SEO';

const Terms: React.FC = () => {
  return (
    <>
      <SEO
        title="Terms of Service - MyPetID.ai"
        description="Terms of Service for MyPetID.ai - the comprehensive platform for managing your pet's digital identity, documents, and health records."
        keywords="terms of service, legal, pet document terms, pet health records terms, digital pet identity"
        canonicalUrl="https://mypetid.ai/terms"
      />

      <div className="min-h-screen bg-white">
        <Header />

        <main className="container-max py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Terms of Service</h1>
          <Separator className="mb-8" />

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Introduction and Agreement to Terms</h2>
              <p className="mb-4">
                Welcome to MyPetID.ai, the comprehensive digital pet identity platform designed to revolutionize how pet owners manage, organize, and access their pets' important information. These Terms of Service ("Terms") constitute a legally binding agreement that governs your access to and use of our website, mobile applications, digital pet identity services, Pet SSN system, health record management tools, document storage capabilities, and all related services and features (collectively referred to as the "Services").
              </p>
              <p className="mb-4">
                By accessing, browsing, registering for, or using our Services in any capacity, you acknowledge that you have read, understood, and agree to be legally bound by these Terms in their entirety, as well as our Privacy Policy, which is incorporated herein by reference. These Terms apply to all visitors, users, and others who access or use the Services, regardless of the extent or nature of their usage.
              </p>
              <p>
                If you do not agree with any provision of these Terms or our Privacy Policy, you must immediately discontinue access to and use of our Services. Your continued use of the Services following any modifications to these Terms constitutes your acceptance of such changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Comprehensive Account Registration and Management</h2>
              <p className="mb-4">
                To access and utilize the full range of features and capabilities within our Services, you are required to register for and maintain a user account. During the registration process, you agree to provide accurate, current, complete, and truthful information about yourself and your pets. You further agree to promptly update such information whenever changes occur to ensure that your account information remains accurate, current, and complete at all times.
              </p>
              <p className="mb-4">
                You are solely and entirely responsible for maintaining the confidentiality and security of your account credentials, including your username, password, and any other authentication methods. You acknowledge and agree that you are fully responsible for all activities, actions, and transactions that occur under your account, whether authorized by you or not. You agree to immediately notify us of any unauthorized use of your account, any suspected security breaches, or any other security concerns related to your account.
              </p>
              <p className="mb-4">
                We reserve the right to refuse registration, suspend, or terminate accounts at our sole discretion for any reason, including but not limited to violation of these Terms, suspicious activity, or other conduct that we deem inappropriate or harmful to our Services or other users.
              </p>
              <p>
                By registering for an account, you may choose to opt-in to receive marketing communications, promotional materials, pet care tips, and other relevant content from us or our carefully selected partners. You can modify these preferences at any time through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Service Availability and Free Access</h2>
              <p className="mb-4">
                MyPetID.ai is committed to providing our comprehensive digital pet identity platform and services completely free of charge to all users. There are no subscription fees, premium tiers, or hidden costs associated with accessing or using our Services. We believe that every pet owner should have access to high-quality tools for managing their pet's digital identity and health information.
              </p>
              <p className="mb-4">
                While our Services are provided free of charge, we reserve the right to introduce optional premium features or services in the future. Any such premium offerings will be clearly identified and will require your explicit consent before any charges are incurred. You will never be automatically enrolled in any paid services without your express authorization.
              </p>
              <p className="mb-4">
                We strive to maintain continuous availability of our Services, but we cannot guarantee uninterrupted access due to factors such as system maintenance, technical difficulties, or circumstances beyond our control. We will make reasonable efforts to provide advance notice of planned maintenance or service interruptions whenever possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Acceptable Use and Prohibited Activities</h2>
              <p className="mb-4">
                You agree to use the Services only for lawful purposes and in strict accordance with these Terms and all applicable laws, regulations, and industry standards. Your use of our Services must be responsible, ethical, and respectful of other users and the broader community.
              </p>
              <p className="mb-4">You expressly agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-8 mb-4 space-y-2">
                <li>Using the Services in any way that violates applicable local, state, national, or international laws, regulations, or ordinances</li>
                <li>Infringing upon or violating the intellectual property rights, privacy rights, or other legal rights of MyPetID.ai, other users, or third parties</li>
                <li>Uploading, transmitting, or distributing viruses, malware, ransomware, spyware, or other malicious code or harmful software</li>
                <li>Attempting to gain unauthorized access to any part of the Services, other user accounts, or computer systems or networks connected to the Services</li>
                <li>Using the Services to store, transmit, or distribute harmful, offensive, threatening, abusive, harassing, defamatory, or otherwise objectionable content</li>
                <li>Impersonating any person or entity, or falsely stating or misrepresenting your affiliation with any person or entity</li>
                <li>Interfering with or disrupting the Services, servers, or networks connected to the Services</li>
                <li>Collecting or harvesting any personally identifiable information from other users without their explicit consent</li>
                <li>Using automated systems, robots, or data mining techniques to access or collect information from the Services</li>
                <li>Reproducing, duplicating, copying, selling, reselling, or exploiting any portion of the Services without our express written permission</li>
                <li>Creating multiple accounts to circumvent any limitations or restrictions we may impose</li>
                <li>Sharing false, misleading, or inaccurate information about your pets that could endanger their health or safety</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. User Content and Digital Pet Identity Information</h2>
              <p className="mb-4">
                Our Services allow and encourage you to upload, store, manage, and share various types of content related to your pets, including but not limited to photographs, health records, vaccination certificates, medical documents, identification information, and other pet-related data ("User Content"). You retain all ownership rights to your User Content and your pets' digital identity information.
              </p>
              <p className="mb-4">
                By uploading or submitting User Content to our Services, you grant us a non-exclusive, worldwide, royalty-free, transferable license to use, copy, modify, distribute, publicly display, and perform your User Content solely for the purpose of providing, maintaining, improving, and securing the Services for your benefit and the benefit of other authorized users you designate.
              </p>
              <p className="mb-4">
                You are solely responsible for all User Content you upload, store, or share through our Services. You represent and warrant that you have all necessary rights, permissions, and authority to share such content through our Services and that your User Content does not violate any laws, regulations, or the rights of third parties.
              </p>
              <p className="mb-4">
                You understand and acknowledge that while we implement security measures to protect your User Content, you should maintain your own backup copies of important information and documents. We strongly recommend keeping physical or digital copies of critical pet documents in addition to storing them on our platform.
              </p>
              <p>
                If you opt-in to receive marketing communications, you consent to us using certain anonymized and aggregated information derived from User Content to improve our Services and provide you with relevant pet care information, products, and services that may benefit you and your pets.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Privacy, Data Protection, and Marketing Consent</h2>
              <p className="mb-4">
                Your privacy and the protection of your pet's digital identity information are of paramount importance to us. Our comprehensive Privacy Policy, which is incorporated into these Terms by reference, explains in detail how we collect, use, process, store, and protect information about you and your pets in connection with your use of the Services.
              </p>
              <p className="mb-4">
                During account registration and throughout your use of our Services, you have the opportunity to opt-in to receive marketing communications from us and our carefully selected partners. These communications may include promotional materials, pet care tips, product recommendations, service announcements, and other content that may be relevant and beneficial to you and your pets.
              </p>
              <p className="mb-4">
                If you choose to opt-in to marketing communications, you consent to us sharing certain information with trusted partners for the purpose of providing you with relevant offers and information. You maintain complete control over your marketing preferences and can opt-out at any time through your account settings or by following the unsubscribe instructions in any marketing communication you receive.
              </p>
              <p>
                We are committed to using your information responsibly and only in ways that benefit you and your pets. We will never sell your personal information for monetary gain, and we maintain strict standards for any partners we work with regarding data protection and privacy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Intellectual Property Rights and Ownership</h2>
              <p className="mb-4">
                The Services, including all content, features, functionality, software, source code, algorithms, user interfaces, visual designs, graphics, logos, trademarks, and other materials contained therein, are owned by MyPetID.ai, our licensors, or other providers of such material. All such content is protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws and treaties.
              </p>
              <p className="mb-4">
                These Terms grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services solely for your personal, non-commercial use in accordance with these Terms. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as specifically permitted herein or with our prior written consent.
              </p>
              <p>
                Any unauthorized use of our intellectual property may result in immediate termination of your access to the Services and may subject you to civil and criminal penalties under applicable intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. Service Modifications and Discontinuation</h2>
              <p className="mb-4">
                We reserve the right to modify, update, enhance, or discontinue any aspect of the Services at any time, with or without notice, for any reason including but not limited to improving functionality, addressing security concerns, complying with legal requirements, or adapting to changing technological landscape and user needs.
              </p>
              <p className="mb-4">
                While we strive to provide advance notice of significant changes that may affect your use of the Services, we cannot guarantee such notice in all circumstances. We encourage you to regularly review these Terms and check for service announcements to stay informed about any changes to the Services.
              </p>
              <p>
                In the event of service discontinuation, we will make reasonable efforts to provide users with advance notice and, where technically feasible, options for data export or migration to alternative platforms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. Account Termination and Data Retention</h2>
              <p className="mb-4">
                We reserve the right to suspend, disable, or terminate your access to the Services and your account at any time, with or without cause, and with or without notice, if we believe you have violated these Terms, engaged in prohibited activities, or for any other reason we deem appropriate in our sole discretion.
              </p>
              <p className="mb-4">
                You may terminate your account and discontinue use of the Services at any time by following the account deletion instructions available in your account settings or by contacting our support team. Upon termination of your account, your right to access and use the Services will immediately cease.
              </p>
              <p className="mb-4">
                Following account termination, we may retain certain information as required by law, for legitimate business purposes, or to protect the rights and safety of MyPetID.ai and other users. We will handle data retention and deletion in accordance with our Privacy Policy and applicable legal requirements.
              </p>
              <p>
                Before terminating your account, we strongly recommend downloading or backing up any important User Content or pet information you wish to preserve, as access to this information may not be available after account termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">10. Disclaimers and Limitations of Warranties</h2>
              <p className="mb-4">
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, TITLE, QUIET ENJOYMENT, AND WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.
              </p>
              <p className="mb-4">
                WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT THAT DEFECTS WILL BE CORRECTED OR THAT THE SERVICES WILL MEET YOUR SPECIFIC REQUIREMENTS OR EXPECTATIONS.
              </p>
              <p className="mb-4">
                WHILE WE STRIVE TO PROVIDE ACCURATE AND RELIABLE SERVICES, WE MAKE NO REPRESENTATIONS OR WARRANTIES ABOUT THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT, INFORMATION, OR MATERIALS PROVIDED THROUGH THE SERVICES. YOU ACKNOWLEDGE THAT YOUR USE OF THE SERVICES IS AT YOUR OWN RISK.
              </p>
              <p>
                THE SERVICES ARE NOT INTENDED TO REPLACE PROFESSIONAL VETERINARY CARE OR MEDICAL ADVICE. ANY HEALTH-RELATED INFORMATION OR RECOMMENDATIONS PROVIDED THROUGH THE SERVICES SHOULD NOT BE CONSIDERED A SUBSTITUTE FOR PROFESSIONAL VETERINARY CONSULTATION AND CARE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">11. Limitation of Liability and Indemnification</h2>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MYPETID.AI, ITS AFFILIATES, SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, PARTNERS, LICENSORS, OR CONTRACTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, THAT RESULT FROM OR ARISE OUT OF YOUR USE OF, OR INABILITY TO USE, THE SERVICES.
              </p>
              <p className="mb-4">
                OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICES SHALL NOT EXCEED ONE HUNDRED DOLLARS ($100) OR THE AMOUNT YOU HAVE PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, WHICHEVER IS GREATER.
              </p>
              <p className="mb-4">
                YOU AGREE TO DEFEND, INDEMNIFY, AND HOLD HARMLESS MYPETID.AI AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS FROM AND AGAINST ANY CLAIMS, LIABILITIES, DAMAGES, LOSSES, COSTS, AND EXPENSES (INCLUDING REASONABLE ATTORNEY'S FEES) ARISING FROM OR RELATING TO YOUR USE OF THE SERVICES, YOUR VIOLATION OF THESE TERMS, OR YOUR VIOLATION OF ANY RIGHTS OF THIRD PARTIES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">12. Governing Law and Dispute Resolution</h2>
              <p className="mb-4">
                These Terms and any disputes arising from or relating to the Services shall be governed by and construed in accordance with the laws of the United States and the state in which MyPetID.ai is incorporated, without regard to conflict of law principles.
              </p>
              <p className="mb-4">
                Any legal action or proceeding arising from or relating to these Terms or the Services shall be brought exclusively in the federal or state courts located in the jurisdiction where MyPetID.ai maintains its principal place of business, and you hereby consent to the personal jurisdiction and venue of such courts.
              </p>
              <p>
                Before initiating any formal legal proceedings, we encourage you to contact us directly to discuss and attempt to resolve any disputes through informal negotiation and communication.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">13. Changes to These Terms of Service</h2>
              <p className="mb-4">
                We may update, modify, or revise these Terms from time to time to reflect changes in our Services, business practices, legal requirements, or for other operational reasons. When we make material changes to these Terms, we will provide notice through the Services, by email to the address associated with your account, or through other appropriate communication methods.
              </p>
              <p className="mb-4">
                Your continued use of the Services after any changes to these Terms become effective constitutes your acceptance of the revised Terms. If you do not agree to the updated Terms, you must discontinue use of the Services.
              </p>
              <p>
                We encourage you to review these Terms periodically to stay informed about your rights and obligations when using our Services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">14. Miscellaneous Provisions</h2>
              <p className="mb-4">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect to the maximum extent permitted by law.
              </p>
              <p className="mb-4">
                These Terms constitute the entire agreement between you and MyPetID.ai regarding the Services and supersede all prior and contemporaneous agreements, communications, and understandings, whether written or oral, relating to the subject matter herein.
              </p>
              <p className="mb-4">
                Our failure to enforce any provision of these Terms shall not constitute a waiver of such provision or our right to enforce it in the future.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">15. Contact Information and Support</h2>
              <p>
                If you have any questions, concerns, or comments about these Terms of Service or our Services, please contact us:
              </p>
              <p className="ml-4 mt-4">
                MyPetID.ai, Inc.<br />
                Legal Department<br />
                Email: support@mypetid.ai<br />
                Subject Line: Terms of Service Inquiry
              </p>
              <p className="mt-4">
                We are committed to addressing your questions and concerns promptly and professionally.
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Terms;