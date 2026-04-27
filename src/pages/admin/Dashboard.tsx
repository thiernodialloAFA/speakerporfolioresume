import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mic,
  Briefcase,
  Award,
  ChevronRight,
  BarChart3,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useStore, PortfolioData } from '../../store';

export default function Dashboard() {
  const {
    profile,
    speakerExperiences,
    professionalExperiences,
    certifications,
    exportData,
    importData,
    resetToDefaults,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback(null), 5000);
  };

  const handleExport = () => {
    try {
      const json = exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'portfolio.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showFeedback(
        'success',
        'portfolio.json downloaded. Replace src/data/portfolio.json with it, then commit & push to git.'
      );
    } catch {
      showFeedback('error', 'Failed to export portfolio content.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<PortfolioData>;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        !parsed.profile ||
        !Array.isArray(parsed.speakerExperiences) ||
        !Array.isArray(parsed.professionalExperiences) ||
        !Array.isArray(parsed.certifications)
      ) {
        showFeedback('error', 'Invalid portfolio.json: missing required fields.');
        return;
      }
      importData(parsed as PortfolioData);
      showFeedback('success', 'Portfolio content imported successfully.');
    } catch {
      showFeedback('error', 'Failed to import file: not valid JSON.');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Reset all portfolio content to the defaults bundled with the app (from src/data/portfolio.json)? Unsaved local edits will be lost.'
      )
    ) {
      resetToDefaults();
      showFeedback('success', 'Portfolio content reset to defaults from portfolio.json.');
    }
  };

  const sections = [
    {
      title: 'Edit Profile',
      description: 'Update your name, bio, photo, and social links',
      to: '/admin/profile',
      icon: User,
      color: 'teal',
      count: null as number | null,
    },
    {
      title: 'Speaking Experiences',
      description: 'Manage your speaking events and talks',
      to: '/admin/speaking',
      icon: Mic,
      color: 'indigo',
      count: speakerExperiences.length,
    },
    {
      title: 'Professional Experiences',
      description: 'Update your work history and achievements',
      to: '/admin/professional',
      icon: Briefcase,
      color: 'purple',
      count: professionalExperiences.length,
    },
    {
      title: 'Certifications',
      description: 'Add or remove certifications and learning',
      to: '/admin/certifications',
      icon: Award,
      color: 'amber',
      count: certifications.length,
    },
    {
      title: 'Change Password',
      description: 'Set, update, or reset the admin login password',
      to: '/admin/password',
      icon: KeyRound,
      color: 'rose',
      count: null as number | null,
    },
  ];

  const colorMap: Record<string, string> = {
    teal: 'bg-teal-500/20 text-teal-400 border-teal-500/20',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400">Welcome back, <span className="text-teal-400">{profile.name}</span></p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sections.map(({ title, description, to, icon: Icon, color, count }, idx) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={to}
                className="flex items-center gap-5 p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:border-teal-500/30 hover:bg-slate-700/60 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorMap[color]}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors">{title}</h3>
                    {count !== null && (
                      <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full font-medium">
                        {count}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{description}</p>
                </div>
                <ChevronRight size={20} className="text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Persistence / git workflow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-slate-800 border border-slate-700 rounded-2xl"
        >
          <h2 className="font-semibold text-white mb-2">Persist content to git</h2>
          <p className="text-slate-400 text-sm mb-4">
            Edits you make here are kept locally in memory only. To make them part of the deployed
            site, export the JSON, replace
            <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-900 text-teal-300">src/data/portfolio.json</code>
            with the downloaded file, then commit and push to git.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/25"
            >
              <Download size={16} />
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <Upload size={16} />
              Import JSON
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-xl transition-all"
            >
              <RotateCcw size={16} />
              Reset to portfolio.json
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          {feedback && (
            <div
              className={`mt-4 flex items-start gap-2 p-3 rounded-xl text-sm border ${
                feedback.type === 'success'
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
