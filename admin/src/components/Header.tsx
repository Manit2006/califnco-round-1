'use client';

import React, { useState } from 'react';
import { Menu, Bell, Moon, Sun, Search, ShieldCheck } from 'lucide-react';
import { dataStore } from '../lib/dataStore';

interface HeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = dataStore.getNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  Notifications
                </span>
                <span className="text-xs text-slate-500">{notifications.length} total</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            CA
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                Admin Panel
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <span className="text-[10px] text-slate-400">Super Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};
