import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  Package,
  Layers,
  Search,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Terminal,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Bell,
  Heart,
  FolderArchive,
  Award,
  Flame,
  Gift,
  Tag,
  Calendar,
  HelpCircle,
  FileText,
  User,
  Phone
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../utils/notifications';
import { NotificationCenterModal } from './NotificationCenterModal';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    settings,
    isAdminAuthenticated,
    wishlist,
    unreadAnnouncementsCount
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation links visible on desktop
  const primaryNavLinks = [
    { id: 'home', label: 'Home' },
    { id: 'software', label: 'Software & APKs' },
    { id: 'free-apps', label: 'Free Apps 🆓' },
    { id: 'bundles', label: 'Bundles 📦' },
    { id: 'deals', label: 'Deals 🎯' },
    { id: 'source-code', label: 'Source Code' },
  ];

  // Secondary navigation links in More dropdown
  const secondaryNavLinks = [
    { id: 'campaigns', label: 'Events & Campaigns 🗓️' },
    { id: 'giveaways', label: 'Giveaways & Archive 🏆' },
    { id: 'announcements', label: 'News & Bulletins 📢' },
    { id: 'request-software', label: 'Request App / Feature 💡' },
    { id: 'track-order', label: 'Track Order & Invoices 🔍' },
    { id: 'portfolio', label: 'Developer Portfolio 💼' },
    { id: 'about', label: 'About Aftab 👨‍💻' },
    { id: 'contact', label: 'Official Contact 📞' },
    { id: 'terms', label: 'Terms & Licensing 📜' },
  ];

  // Complete list for mobile drawer
  const allNavLinks = [
    ...primaryNavLinks,
    ...secondaryNavLinks,
    { id: 'library', label: 'My Digital Vault 📚' },
    { id: 'rewards', label: 'Customer Rewards 💎' },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMoreActive = secondaryNavLinks.some((l) => l.id === activeView);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07090e]/95 backdrop-blur-xl transition-all duration-200">
        {/* Top micro-bar for verification & direct communication */}
        <div className="w-full bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border-b border-white/5 py-1 px-3 sm:px-4 text-[11px] text-slate-400">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-slate-300 font-medium truncate">Official: {settings.developerName}</span>
              <span className="hidden md:inline text-slate-600">|</span>
              <span className="hidden md:inline text-cyan-400/90 font-mono">CodeWithAffy Verified</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Aftab, I am reaching out from AFFY OFFICIAL.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition-colors px-2 py-0.5 rounded bg-white/5 hover:bg-emerald-500/10 border border-white/10 text-[10px] font-mono"
              >
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                <span className="hidden xs:inline">WHATSAPP</span>
              </a>

              {isAdminAuthenticated && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold cursor-pointer"
                >
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">ADMIN PANEL ACTIVE</span>
                  <span className="sm:hidden">ADMIN</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none cursor-pointer shrink-0 min-w-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center group-hover:bg-[#0c1220] transition-colors">
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-[2px]">
                <ShieldCheck className="w-2.5 h-2.5 text-black" />
              </div>
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white font-mono group-hover:text-cyan-300 transition-colors">
                  AFFY OFFICIAL
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  PRO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 tracking-wider truncate">
                {settings.developerName} <span className="text-slate-600">•</span> Software Dev
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (Visible on lg / laptop & desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  isMoreActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090d16] border border-cyan-500/30 p-2 shadow-2xl shadow-cyan-950/60 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {secondaryNavLinks.map((link) => {
                    const isActive = activeView === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                activeView === 'wishlist'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:text-rose-400 hover:border-rose-500/30'
              }`}
              title="Saved Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-extrabold text-[9px] font-mono shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="relative p-2 rounded-xl bg-slate-900/80 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:text-white transition-all cursor-pointer"
              title="Marketplace Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-black font-extrabold text-[9px] font-mono shadow-md animate-pulse">
                  {unreadAnnouncementsCount}
                </span>
              )}
            </button>

            {/* My Vault / Library Button */}
            <button
              onClick={() => handleNavClick('library')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                activeView === 'library'
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>My Vault</span>
            </button>

            {/* Start Project CTA */}
            <button
              onClick={() => handleNavClick('custom-project')}
              className="hidden sm:flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span className="whitespace-nowrap">Start Project</span>
            </button>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/10 bg-[#07090e]/98 backdrop-blur-2xl px-3 sm:px-4 py-4 space-y-3 animate-in slide-in-from-top duration-150 max-h-[82vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {allNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                    activeView === link.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0 ml-1" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('custom-project')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Start Your Custom Project</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
    </>
  );
};
