import { Mic, Code2, Link2, Globe, Mail } from 'lucide-react';
import { useStore } from '../store';

export default function Footer() {
  const { profile } = useStore();

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <Mic size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white">{profile.name}</div>
              <div className="text-sm text-slate-400">{profile.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all">
                <Code2 size={20} />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all">
                <Link2 size={20} />
              </a>
            )}
            {profile.twitter && (
              <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all">
                <Globe size={20} />
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`}
                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all">
                <Mail size={20} />
              </a>
            )}
          </div>

          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
