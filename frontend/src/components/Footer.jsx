import React from 'react';
export const Footer = () =>{
    return (
        <footer className="py-5 px-4 border-t border-white/5 bg-black/40">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">APEX<span className="text-emerald-500">PROP</span></span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm">
                ApexProp is a leading proprietary trading firm providing capital to skilled traders worldwide. 
                Our mission is to democratize access to institutional-grade funding.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="/rules" className="hover:text-emerald-500 transition-colors">Trading Rules</a></li>
                <li><a href="/" className="hover:text-emerald-500 transition-colors">Funding Plans</a></li>
                <li><a href="/trading" className="hover:text-emerald-500 transition-colors">Trading Terminal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</a></li>
                <li><a href="/terms" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                <li><a href="/about" className="hover:text-emerald-500 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-4 pt-2 border-t border-white/5 text-center text-gray-500 text-xs leading-tight">
            © 2026 Vector-Funding Trading. All rights reserved. Trading involves significant risk.
          </div>
        </footer>
    )
}