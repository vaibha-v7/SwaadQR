import { Link } from "react-router-dom";

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-zinc-400 text-sm font-medium">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </header>

          {/* Terms content */}
          <div className="space-y-8 text-zinc-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">gavel</span>
                1. Agreement to Terms
              </h2>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service. SwaadQR provides contactless menu solutions for restaurants and food businesses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">person_pin</span>
                2. User Accounts
              </h2>
              <p>
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding your password and for any activities or actions under your password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">restaurant</span>
                3. Restaurant and Menu Content
              </h2>
              <p>
                You retain all rights to any menus, text, pricing, details, and photos that you upload or display using our Service (&quot;Content&quot;). By posting Content on our Service, you grant us the right and license to use, display, and format such Content to render the digital menus for your patrons. You represent and warrant that the Content is yours or you have the right to use it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">block</span>
                4. Prohibited Uses
              </h2>
              <p className="mb-3">
                You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>To upload or transmit inappropriate, offensive, or illegal food/menu listings or pictures.</li>
                <li>To engage in any conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service, or which may harm SwaadQR or users of the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">dangerous</span>
                5. Limitation of Liability
              </h2>
              <p>
                In no event shall SwaadQR, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1C1C] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-lg">refresh</span>
                6. Changes to Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
