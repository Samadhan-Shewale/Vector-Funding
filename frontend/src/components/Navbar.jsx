import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Trading', path: '/trading'},
    { name: 'Rules', path: '/rules' },
    { name: 'Withdrawals', path: '/withdrawals' },
    { name: 'About', path: '/about' },
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
  <div className="max-w-7xl mx-auto flex items-center w-full py-4 px-6">

    {/* Logo (Left) */}
    <div className="flex-1">
      <Link to="/">
        <span className="text-xl font-bold">APEX PROP</span>
      </Link>
    </div>

    {/* Nav Links (Center) */}
    <div className="flex-1 flex justify-center gap-6">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="ml-2 text-sm font-medium hover:text-blue-500"
        >
          {link.name}
        </Link>
      ))}
    </div>

    {/* Profile (Right) */}
    <div className="flex-1 flex justify-end">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Profile
      </button>
    </div>

  </div>
</nav>
  );
};