import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Video, Calendar, Tag, Search, Mic } from 'lucide-react';
import { useStore } from '../store';
import { format, parseISO } from 'date-fns';

export default function Speaking() {
  const { speakerExperiences } = useStore();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const sorted = [...speakerExperiences].sort((a, b) => b.date.localeCompare(a.date));

  const allTags = Array.from(new Set(sorted.flatMap((e) => e.tags)));

  const filtered = sorted.filter((exp) => {
    const matchSearch =
      !search ||
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.eventName.toLowerCase().includes(search.toLowerCase()) ||
      exp.description.toLowerCase().includes(search.toLowerCase());
    const matchTag = !selectedTag || exp.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr + '-01'), 'MMMM yyyy');
    } catch (_e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Mic size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Speaking Portfolio</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Conferences, meetups, and workshops where I've had the privilege to share knowledge.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search talks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  !selectedTag ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTag === tag ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-800/80 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-teal-500/30 transition-all group"
              >
                {exp.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exp.imageUrl}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <Calendar size={12} className="text-teal-400" />
                      <span className="text-xs text-slate-200">{formatDate(exp.date)}</span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-teal-400 transition-colors line-clamp-2">
                    {exp.title}
                  </h3>
                  <p className="text-teal-400 text-sm font-medium mb-3">{exp.eventName}</p>

                  {!exp.imageUrl && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
                      <Calendar size={14} />
                      <span>{formatDate(exp.date)}</span>
                    </div>
                  )}

                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {exp.description}
                  </p>

                  {exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-md">
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {exp.eventLink && (
                      <a
                        href={exp.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        <ExternalLink size={14} />
                        Event
                      </a>
                    )}
                    {exp.videoLink && (
                      <a
                        href={exp.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Video size={14} />
                        Watch Talk
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-slate-400"
          >
            <Mic size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No talks found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
