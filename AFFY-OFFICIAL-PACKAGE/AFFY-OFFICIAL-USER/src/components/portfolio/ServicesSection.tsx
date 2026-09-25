import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code,
  Smartphone,
  Server,
  Layers,
  Sparkles,
  ShieldAlert,
  Terminal,
  Database,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { setActiveView } = useApp();

  const services = [
    {
      icon: <Smartphone className="w-6 h-6 text-cyan-400" />,
      title: 'Custom Android & Mobile App Engineering',
      description: 'Native Kotlin & cross-platform Flutter/React Native solutions built for performance, background services, Bluetooth printing, push notifications, and offline caching.',
      features: ['Native Kotlin / Jetpack Compose', 'ESC/POS Thermal Bluetooth Integration', 'Offline-First SQLite Architecture', 'Google Play Release Preparation']
    },
    {
      icon: <Code className="w-6 h-6 text-emerald-400" />,
      title: 'Full-Stack Web & SaaS Ecosystems',
      description: 'End-to-end web applications with modern responsive frontends (React 19, Next.js, Tailwind) powered by resilient backend microservices and secure authentication.',
      features: ['High-Performance React/Next.js Frontends', 'Role-Based Access Control (RBAC)', 'Real-Time WebSocket Dashboards', 'Stripe & Regional Payment Gateways']
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      title: 'Enterprise POS & Inventory Architecture',
      description: 'Specialized point-of-sale systems, retail barcode scanners, multi-warehouse stock management, cashier shift auditing, and automated financial reporting.',
      features: ['Multi-Branch Live Synchronization', 'Barcode & QR Scanning Engines', 'Z-Report Financial Summaries', 'Client Credit & Khata Ledgers']
    },
    {
      icon: <Server className="w-6 h-6 text-purple-400" />,
      title: 'API Engineering, Security & Cloud DevOps',
      description: 'REST & GraphQL API design, database performance tuning, Linux VPS configuration, Docker containerization, and military-grade End-to-End Encryption.',
      features: ['PostgreSQL & Firebase Cloud Setup', 'Docker Container Orchestration', 'Military-Grade E2EE Encryption', 'Automated Database Backups']
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="space-y-3 mb-16 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>SERVICES & EXPERTISE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Software Development & Engineering Services
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          From individual APK modules to scalable enterprise SaaS platforms, I deliver end-to-end technical engineering with strict quality guarantees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl bg-[#090d16] border border-white/10 hover:border-cyan-500/40 transition-all text-left flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 w-fit border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                {srv.icon}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {srv.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {srv.description}
              </p>

              {/* Service Features */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                {srv.features.map((feat, fidx) => (
                  <div key={fidx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveView('custom-project');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="pt-4 flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group/btn"
            >
              <span>Request Quote for this Service</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
