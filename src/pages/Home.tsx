import { motion } from 'framer-motion';
import { MapPin, Mail, Code2, Link2, Globe, Mic, ArrowRight, Award, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Home() {
  const { profile, speakerExperiences, certifications } = useStore();

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={profile.bannerUrl}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 md:-mt-32 mb-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-2xl ring-2 ring-teal-500/30">
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                <Mic size={14} className="text-white" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 pt-16 md:pt-20"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{profile.name}</h1>
              <p className="text-teal-400 text-lg font-medium mb-3">{profile.title}</p>
              {profile.location && (
                <div className="flex items-center gap-1 text-slate-400 text-sm mb-4">
                  <MapPin size={14} />
                  <span>{profile.location}</span>
                </div>
              )}

              {/* Social links */}
              <div className="flex flex-wrap items-center gap-3">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-all">
                    <Code2 size={15} /> GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-all">
                    <Link2 size={15} /> LinkedIn
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-all">
                    <Globe size={15} /> Twitter
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-all">
                    <Mail size={15} /> Email
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Bio */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl"
          >
            <p className="text-slate-300 text-lg leading-relaxed">{profile.bio}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Speaking Events', value: speakerExperiences.length, icon: Mic, color: 'teal' },
              { label: 'Years Experience', value: '10+', icon: Briefcase, color: 'indigo' },
              { label: 'Certifications', value: certifications.length, icon: Award, color: 'purple' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="p-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-center hover:border-teal-500/30 transition-all"
              >
                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                  color === 'teal' ? 'bg-teal-500/20 text-teal-400' :
                  color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-sm text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Recent talks preview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Talks</h2>
              <Link
                to="/speaking"
                className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
              >
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {speakerExperiences.slice(0, 2).map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="p-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl hover:border-teal-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {exp.imageUrl && (
                      <img src={exp.imageUrl} alt={exp.title} className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-teal-400 transition-colors">{exp.title}</h3>
                      <p className="text-teal-400 text-xs mt-1">{exp.eventName}</p>
                      <p className="text-slate-500 text-xs mt-1">{exp.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/speaking"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/25"
            >
              <Mic size={18} />
              View Speaking Portfolio
            </Link>
            <Link
              to="/resume"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all border border-slate-600 hover:border-slate-500"
            >
              View Resume
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
