import React from 'react';

export const Terms = () => {
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Terms & Conditions</h1>
      
      <div className="space-y-8 text-gray-400 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using ApexProp, you agree to be bound by these Terms and Conditions. 
            If you do not agree with any part of these terms, you must not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Eligibility</h2>
          <p>
            You must be at least 18 years of age to use our services. 
            Our services are not intended for use by residents of jurisdictions where such activities are prohibited by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Trading Risks</h2>
          <p>
            Trading in financial markets involves significant risk. 
            Past performance is not indicative of future results. 
            ApexProp provides demo accounts for evaluation purposes and does not provide financial advice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Account Rules</h2>
          <p>
            Traders must adhere to the specific rules of their chosen challenge. 
            Violating drawdown limits, profit targets, or consistency rules will result in immediate account termination without refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Payouts</h2>
          <p>
            Payouts are processed based on the profit split defined in your plan. 
            We reserve the right to audit trading activity before approving any withdrawal request.
          </p>
        </section>

        <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="italic">
            Last updated: March 15, 2026. ApexProp reserves the right to modify these terms at any time.
          </p>
        </section>
      </div>
    </div>
  );
};
