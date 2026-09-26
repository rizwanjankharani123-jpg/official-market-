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
  Phone,
  Home,
  CheckCircle2,
  Zap,
  Lock
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

  // Core Marketplace Cards for Mobile
  const coreMarketplaceCards = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      tag: 'Main',
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'software',
      label: 'Software & APKs',
      icon: Package,
      tag: 'Verified',
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30'
    },
    {
      id: 'free-apps',
      label: 'Free Apps',
      icon: Gift,
      tag: '100% Free',
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'bundles',
      label: 'Bundles',
      icon: Layers,
      tag: 'Save Big',
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30'
    },
    {
      id: 'deals',
      label: 'Deals & Offers',
      icon: Flame,
      tag: 'Hot',
      color: 'from-amber-500/20 to-rose-500/10 text-amber-400 border-amber-500/30'
    },
    {
      id: 'source-code',
      label: 'Source Code',
      icon: Code2,
      tag: 'Licenses',
      color: 'from-sky-500/20 to-cyan-500/10 text-sky-400 border-sky-500/30'
    }
  ];

  // Retention & Services Items for Mobile
  const customerHubItems = [
    {
      id: 'library',
      label: 'My Digital Vault',
      desc: 'Purchased files & licenses',
      icon: FolderArchive,
      badge: 'Library'
    },
    {
      id: 'rewards',
      label: 'Customer Rewards',
      desc: 'Points, tier status & perks',
      icon: Award,
      badge: 'Rewards'
    },
    {
      id: 'track-order',
      label: 'Track Order & Invoices',
      desc: 'Instant delivery tracking',
      icon: Search,
      badge: 'Orders'
    }
  ];

  // Community & Portfolio Links for Mobile
  const communityLinks = [
    { id: 'campaigns', label: 'Events & Campaigns', icon: Calendar, tag: 'Live' },
    { id: 'giveaways', label: 'Giveaways & Archive', icon: Gift, tag: 'Claim' },
    { id: 'announcements', label: 'News & Bulletins', icon: Bell, tag: unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} New` : null },
    { id: 'request-software', label: 'Request App / Feature', icon: Sparkles, tag: 'Request' },
    { id: 'portfolio', label: 'Developer Portfolio', icon: Terminal, tag: 'Work' },
    { id: 'about', label: 'About Aftab', icon: User, tag: 'Profile' },
    { id: 'contact', label: 'Official Contact', icon: Phone, tag: 'Direct' },
    { id: 'terms', label: 'Terms & Licensing', icon: ShieldCheck, tag: 'Legal' },
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
              className={`lg:hidden p-2 rounded-xl border transition-all cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-300 border-white/10 hover:text-white'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Enhanced Stylish Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/10 bg-[#060810]/98 backdrop-blur-2xl px-3 sm:px-5 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Section 1: Core Marketplace Navigation Grid */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  MARKETPLACE SECTIONS
                </span>
                <span className="text-[10px] font-mono text-slate-500">Quick Access</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {coreMarketplaceCards.map((card) => {
                  const Icon = card.icon;
                  const isActive = activeView === card.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleNavClick(card.id)}
                      className={`relative p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                        isActive
                          ? 'bg-gradient-to-br from-cyan-500/25 to-blue-600/20 border-cyan-400 text-white shadow-md shadow-cyan-500/15 font-bold'
                          : `bg-slate-900/80 hover:bg-slate-800/90 border-white/10 text-slate-200`
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`p-1.5 rounded-lg bg-white/5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                          isActive
                            ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40'
                            : 'bg-white/5 text-slate-400 border-white/5'
                        }`}>
                          {card.tag}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold mt-2 truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {card.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: User Digital Vault & Rewards Hub */}
            <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1.5 flex items-center gap-1.5">
                <FolderArchive className="w-3 h-3 text-indigo-400" />
                CUSTOMER PORTAL & VAULT
              </span>

              <div className="grid grid-cols-1 gap-1">
                {customerHubItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                          : 'bg-slate-950/40 hover:bg-slate-800 text-slate-300 border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1 rounded-lg bg-white/5 text-cyan-400 shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-white truncate">{item.label}</p>
                          <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 shrink-0 ml-2">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: More Services & Developer Community */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1 mb-1.5 block">
                MORE SERVICES & COMMUNITY
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {communityLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeView === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-[11px] font-medium transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold'
                          : 'bg-slate-900/40 hover:bg-slate-800 text-slate-300 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </div>
                      {link.tag && (
                        <span className={`text-[8px] font-mono px-1 rounded ml-1 shrink-0 ${
                          link.tag.includes('New')
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-white/5 text-slate-400'
                        }`}>
                          {link.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Quick Action CTA Buttons */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('custom-project')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 text-black shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Start Custom Project</span>
                <ChevronRight className="w-3.5 h-3.5 text-black" />
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Aftab, I am reaching out from AFFY OFFICIAL.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Support</span>
                </a>

                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-[11px] font-mono transition-all cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Admin</span>
                </button>
              </div>
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

