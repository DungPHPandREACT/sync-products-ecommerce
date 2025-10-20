import React from 'react';
import PublicLayout from '../../components/layouts/public-layout';

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the Sync Products Ecommerce platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Our Service provides a multi-platform synchronization solution for e-commerce products and orders across TikTok Shop, Shopee, Lazada, and WordPress platforms. The Service includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Real-time product synchronization</li>
              <li>Order management and status updates</li>
              <li>Inventory management</li>
              <li>Webhook integration for instant updates</li>
              <li>Conflict resolution tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className="mb-4">Users are responsible for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintaining accurate platform API credentials</li>
              <li>Ensuring compliance with platform policies</li>
              <li>Regular data backup and security measures</li>
              <li>Proper use of the Service in accordance with applicable laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your data. However, users are responsible for securing their platform credentials and ensuring compliance with data protection regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Service Availability</h2>
            <p className="mb-4">
              While we strive for high availability, we do not guarantee uninterrupted service. Scheduled maintenance and updates may temporarily affect service availability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              The Service is provided "as is" without warranties. We shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="mb-4">
              Either party may terminate this agreement at any time. Upon termination, access to the Service will be discontinued, and users should export their data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or through the Service interface.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="mb-4">
              For questions regarding these Terms of Service, please contact us through our support channels.
            </p>
          </section>

          <div className="text-sm text-gray-600 mt-8">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
