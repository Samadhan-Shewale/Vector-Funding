import React from 'react';

export const About = () => {
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">About ApexProp</h1>
      
      <div className="space-y-8 text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p>
            ApexProp was founded with a single goal: to empower talented traders by providing them with the capital they need to succeed. 
            We believe that financial barriers should not stand in the way of skilled market participants. 
            Our platform offers a fair, transparent, and high-performance environment for traders to showcase their abilities.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold text-xl mb-3">Who We Are</h3>
            <p className="text-sm">
              We are a team of veteran traders, developers, and financial experts dedicated to building the most reliable proprietary trading firm in the industry.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold text-xl mb-3">What We Offer</h3>
            <p className="text-sm">
              From $10,000 to $100,000 funding, we provide the resources, technology, and support needed to scale your trading career.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>80% Profit Split for funded traders.</li>
            <li>No hidden fees or recurring subscriptions.</li>
            <li>Fast and reliable payout processing.</li>
            <li>Advanced trading terminal with live market data.</li>
            <li>Supportive community and professional environment.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
