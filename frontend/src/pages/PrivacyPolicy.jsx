import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1C1C] py-12 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 font-medium transition-colors text-sm group"
          >
            <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            Back to Home
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl outline outline-1 outline-[#E0C0B1]/20 shadow-xl shadow-orange-500/5 p-8 sm:p-12 overflow-hidden relative">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100/50 blur-3xl rounded-full -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/20 blur-3xl rounded-full -z-10" />

          {/* Header */}
          <header className="border-b border-zinc-100 pb-8 mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-[#9D4300] to-[#F97316] bg-clip-text text-transparent mb-3">
              Privacy Policy
            </h1>
            <p className="text-zinc-400 text-sm font-medium">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </header>

          {/* Policy content */}
          <div className="space-y-8 text-zinc-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">shield</span>
                1. Introduction
              </h2>
              <p>
                Welcome to SwaadQR. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website or use our services (collectively, the &quot;Service&quot;) and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">database</span>
                2. Information We Collect
              </h2>
              <p className="mb-3">
                We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> Includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, and browser plug-in types and versions.</li>
                <li><strong>Profile Data:</strong> Includes your username and password, restaurant details, menu items, prices, and preferences.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">visibility</span>
                3. How We Use Your Data
              </h2>
              <p className="mb-3">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To register you as a new customer and manage your account.</li>
                <li>To build, serve, and display your digital menus via QR codes.</li>
                <li>To improve our Website, products/services, marketing, and client relationships.</li>
                <li>To comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">lock</span>
                4. Data Security
              </h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">cookie</span>
                5. Cookies
              </h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">contact_support</span>
                6. Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at <span className="font-semibold text-orange-500">vaibhav00070@gmail.com</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
