import React, { useState } from 'react';
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
  MessageSquare,
  Bell,
  Heart,
  FolderArchive,
  Award
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../utils/notifications';
import { NotificationCenterModal } from './NotificationCenterModal';

interface NavbarProps {
  onOpenZipModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
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

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'software', label: 'Software / APKs' },
    { id: 'bundles', label: 'Bundles 📦' },
    { id: 'deals', label: 'Deals 🎯' },
    { id: 'campaigns', label: 'Events 🗓️' },
    { id: 'giveaways', label: 'Giveaways 🏆' },
    { id: 'free-apps', label: 'Free Apps 🆓' },
    { id: 'source-code', label: 'Source Code' },
    { id: 'announcements', label: 'News 📢' },
    { id: 'request-software', label: 'Request App 💡' },
    { id: 'library', label: 'My Vault 📚' },
    { id: 'rewards', label: 'Rewards 💎' },
    { id: 'track-order', label: 'Track Order' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About Aftab' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07090e]/90 backdrop-blur-xl transition-all duration-200">
        {/* Top micro-bar for verification & direct communication */}
        <div className="w-full bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border-b border-white/5 py-1 px-4 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Official Platform: {settings.developerName}</span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline text-cyan-400/90 font-mono">CodeWithAffy Production</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Aftab, I am reaching out from AFFY OFFICIAL.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition-colors px-2 py-0.5 rounded bg-white/5 hover:bg-emerald-500/10 border border-white/10"
              >
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                <span className="font-mono text-[10px] tracking-wide">WHATSAPP SUPPORT</span>
              </a>

              {isAdminAuthenticated && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold cursor-pointer"
                >
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>ADMIN PANEL ACTIVE</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center group-hover:bg-[#0c1220] transition-colors">
                <Code2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-[2px]">
                <ShieldCheck className="w-2.5 h-2.5 text-black" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-mono group-hover:text-cyan-300 transition-colors">
                  AFFY OFFICIAL
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider">
                {settings.developerName} <span className="text-slate-600">•</span> {settings.developerTitle.split('&')[0]}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
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

            {/* My Library Button */}
            <button
              onClick={() => handleNavClick('library')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
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
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Start Project</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="2xl:hidden border-b border-white/10 bg-[#07090e]/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top duration-150 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-1.5 pb-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
                    activeView === link.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('custom-project')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Start Your Custom Project
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
