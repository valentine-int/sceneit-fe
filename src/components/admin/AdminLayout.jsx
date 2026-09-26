import React from 'react';
import { NavLink } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const navItems = [
  { to: '/admin/reports', icon: 'ri-flag-line', label: 'Report Moderation' },
  { to: '/admin/users', icon: 'ri-user-settings-line', label: 'User Management' },
  { to: '/admin/featured', icon: 'ri-star-line', label: 'Featured Content' },
];

function AdminLayout({ title, children }) {
  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-28">
        {/* SIDEBAR */}
        <aside className="hidden w-56 flex-shrink-0 sm:block">
          <p className="mb-4 px-3 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Admin Panel
          </p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1A1C24] text-[#F4F4F5]'
                      : 'text-[#93939A] hover:bg-[#12141C] hover:text-[#F4F4F5]'
                  }`
                }
              >
                <i className={item.icon}></i>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* MOBILE TABS */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[#27272A] bg-[#090A0F] sm:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
                  isActive ? 'text-[#F4F4F5]' : 'text-[#93939A]'
                }`
              }
            >
              <i className={`${item.icon} text-lg`}></i>
            </NavLink>
          ))}
        </nav>

        {/* CONTENT */}
        <section className="min-w-0 flex-1 pb-16 sm:pb-0">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{title}</h1>
          {children}
        </section>
      </div>
    </main>
  );
}

export default AdminLayout;