import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AftabAvatar } from '../common/AftabAvatar';
import { Layers, ExternalLink, Github, Sparkles, FolderGit2, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { projects, setActiveView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>PORTFOLIO SHOWCASE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Featured Projects & Client Solutions
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Selected client builds, enterprise deployments, and open architecture systems designed and built by Aftab.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-14 text-center rounded-2xl bg-[#090d16] border border-white/5 space-y-3">
          <FolderGit2 className="w-10 h-10 text-cyan-400/50 mx-auto" />
          <h3 className="text-base font-bold text-white font-mono">Custom Engineering Solutions</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Aftab specializes in full-stack web architectures, Android APK systems, and high-performance backend APIs. Submit your specifications to start.
          </p>
          <button
            onClick={() => {
              setActiveView('custom-project');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono hover:bg-cyan-500/30 transition-colors cursor-pointer"
          >
            Commission Custom Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-[#090d16] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col overflow-hidden text-left"
            >
              {/* Image Preview */}
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300">
                  {project.category}
                </div>
              </div>

              {/* Content Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  {project.client && (
                    <p className="text-[11px] font-mono text-slate-400">Client: {project.client}</p>
                  )}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* External Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>Live Preview</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Production Private</span>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
                        title="View Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Developer Profile Banner & CTA Box */}
      <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-[#090e1a] to-slate-950 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-cyan-500/40 shrink-0 shadow-lg shadow-cyan-950/50">
            <AftabAvatar
              className="w-full h-full"
              imgClassName="w-full h-full object-cover object-top"
              alt="Aftab — Web Developer & Software Developer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">Aftab</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Lead Architect
              </span>
            </div>
            <p className="text-xs text-cyan-400/90 font-mono">Web Developer & Software Developer • CodeWithAffy</p>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              Every system and source package is personally engineered, tested, and maintained. Need custom architecture?
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveView('custom-project');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs whitespace-nowrap transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Start Your Project</span>
        </button>
      </div>
    </section>
  );
};
