import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, balance }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar balance={balance} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
