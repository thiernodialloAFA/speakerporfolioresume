import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mic, Briefcase, Award, ChevronRight, BarChart3 } from 'lucide-react';
import { useStore } from '../../store';

export default function Dashboard() {
  const { profile, speakerExperiences, professionalExperiences, certifications } = useStore();

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
  ];

  const colorMap: Record<string, string> = {
    teal: 'bg-teal-500/20 text-teal-400 border-teal-500/20',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
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
      </div>
    </div>
  );
}
