import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, SpeakerExperience, ProfessionalExperience, Certification } from '../types';
import portfolioData from '../data/portfolio.json';
import authData from '../data/auth.json';
import { sha256Hex, timingSafeEqualHex } from '../lib/hash';

// Default content is loaded from `src/data/portfolio.json`. That file is
// committed to the repository, so the portfolio content is version-controlled
// and "pushable on git": the admin edits content via the /admin UI, exports
// the resulting JSON from the dashboard, replaces `src/data/portfolio.json`
// with it, and commits & pushes.
//
// Admin credentials use the same git-based persistence pattern:
//   - The admin email and the SHA-256 hash of the admin password live in
//     `src/data/auth.json` (committed to the repo). Those are the values
//     used by every fresh visitor / fresh deployment.
//   - The admin can change the password from the /admin/password page; the
//     new hash is kept in localStorage so it survives reloads on that
//     device, and can be exported as `auth.json` to be committed and
//     deployed for everyone else.
//   - Build-time env vars still take precedence and override the bundled
//     defaults (useful for one-off deployments or CI overrides):
//       VITE_ADMIN_EMAIL          (overrides the bundled email)
//       VITE_ADMIN_PASSWORD       (overrides the bundled hash with the
//                                  SHA-256 hash of this plain-text value)
//       VITE_ADMIN_PASSWORD_HASH  (overrides the bundled hash directly)

const defaultProfile: Profile = portfolioData.profile as Profile;
const defaultSpeakerExperiences: SpeakerExperience[] =
  portfolioData.speakerExperiences as SpeakerExperience[];
const defaultProfessionalExperiences: ProfessionalExperience[] =
  portfolioData.professionalExperiences as ProfessionalExperience[];
const defaultCertifications: Certification[] =
  portfolioData.certifications as Certification[];

const ENV_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
const ENV_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
const ENV_ADMIN_PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH as string | undefined;

const BUNDLED_ADMIN_EMAIL: string =
  ENV_ADMIN_EMAIL || (authData.email as string) || 'admin@portfolio.com';

/**
 * SHA-256 of the legacy default `Admin@2024`, kept as the ultimate fallback
 * so the app still works in environments where `auth.json` is missing or
 * empty.
 */
const FALLBACK_ADMIN_HASH =
  'd3fc50c8f714cebd16d6c827826df01205bf519529f9d34775293cf9b70a420e';

/**
 * Resolved (in priority order) from:
 *   1. `VITE_ADMIN_PASSWORD_HASH` (raw hex)
 *   2. `VITE_ADMIN_PASSWORD` (hashed lazily on first use)
 *   3. `src/data/auth.json` `passwordHash` field
 *   4. Hardcoded fallback hash (Admin@2024)
 *
 * Lazily resolved (memoised) so that the async hashing of an env-provided
 * plain-text password cannot race with login attempts.
 */
let bundledAdminHashPromise: Promise<string> | null = null;
function getBundledAdminHash(): Promise<string> {
  if (bundledAdminHashPromise) return bundledAdminHashPromise;
  if (ENV_ADMIN_PASSWORD_HASH) {
    bundledAdminHashPromise = Promise.resolve(ENV_ADMIN_PASSWORD_HASH.toLowerCase());
  } else if (ENV_ADMIN_PASSWORD) {
    bundledAdminHashPromise = sha256Hex(ENV_ADMIN_PASSWORD);
  } else {
    const fromFile = (authData.passwordHash as string | undefined) || FALLBACK_ADMIN_HASH;
    bundledAdminHashPromise = Promise.resolve(fromFile.toLowerCase());
  }
  return bundledAdminHashPromise;
}

export interface PortfolioData {
  profile: Profile;
  speakerExperiences: SpeakerExperience[];
  professionalExperiences: ProfessionalExperience[];
  certifications: Certification[];
}

export interface AuthData {
  email: string;
  passwordHash: string;
}

interface AppState extends PortfolioData {
  isAuthenticated: boolean;
  /** SHA-256 hex digest of the current admin password. Persisted locally
   *  so password changes survive reloads on the same device. When empty /
   *  null, the bundled `auth.json` hash is used. */
  passwordHash: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  /** Update the admin password. Requires the current password to match. */
  setPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  /** Reset the admin password back to the value bundled in `auth.json`. */
  resetPasswordToBundled: () => void;
  /** Returns the current `auth.json` payload (email + password hash) ready
   *  to be saved as `src/data/auth.json` and committed to git. */
  exportAuth: () => Promise<string>;
  /** Replace the in-memory auth credentials with the provided data. */
  importAuth: (data: AuthData) => void;
  /** The admin email that the login form expects. */
  getAdminEmail: () => string;

  updateProfile: (profile: Profile) => void;
  addSpeakerExperience: (exp: SpeakerExperience) => void;
  updateSpeakerExperience: (exp: SpeakerExperience) => void;
  deleteSpeakerExperience: (id: string) => void;
  addProfessionalExperience: (exp: ProfessionalExperience) => void;
  updateProfessionalExperience: (exp: ProfessionalExperience) => void;
  deleteProfessionalExperience: (id: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (cert: Certification) => void;
  deleteCertification: (id: string) => void;

  /** Returns the current portfolio content as a JSON string ready to be
   *  saved as `src/data/portfolio.json` and committed to git. */
  exportData: () => string;
  /** Replaces the in-memory portfolio content with the provided data. */
  importData: (data: PortfolioData) => void;
  /** Reset the portfolio content to the defaults bundled with the app. */
  resetToDefaults: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      passwordHash: null,
      profile: defaultProfile,
      speakerExperiences: defaultSpeakerExperiences,
      professionalExperiences: defaultProfessionalExperiences,
      certifications: defaultCertifications,

      login: async (email: string, password: string) => {
        if (email !== BUNDLED_ADMIN_EMAIL) return false;
        const inputHash = await sha256Hex(password);
        const expected = get().passwordHash || (await getBundledAdminHash());
        if (timingSafeEqualHex(inputHash, expected)) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      setPassword: async (currentPassword: string, newPassword: string) => {
        const currentHash = await sha256Hex(currentPassword);
        const expected = get().passwordHash || (await getBundledAdminHash());
        if (!timingSafeEqualHex(currentHash, expected)) return false;
        const newHash = await sha256Hex(newPassword);
        set({ passwordHash: newHash });
        return true;
      },

      resetPasswordToBundled: () => set({ passwordHash: null }),

      exportAuth: async () => {
        const data: AuthData = {
          email: BUNDLED_ADMIN_EMAIL,
          passwordHash: get().passwordHash || (await getBundledAdminHash()),
        };
        return JSON.stringify(data, null, 2);
      },

      importAuth: (data: AuthData) =>
        set({ passwordHash: data.passwordHash.toLowerCase() }),

      getAdminEmail: () => BUNDLED_ADMIN_EMAIL,

      updateProfile: (profile: Profile) => set({ profile }),

      addSpeakerExperience: (exp: SpeakerExperience) =>
        set((state) => ({
          speakerExperiences: [exp, ...state.speakerExperiences],
        })),

      updateSpeakerExperience: (exp: SpeakerExperience) =>
        set((state) => ({
          speakerExperiences: state.speakerExperiences.map((e) => (e.id === exp.id ? exp : e)),
        })),

      deleteSpeakerExperience: (id: string) =>
        set((state) => ({
          speakerExperiences: state.speakerExperiences.filter((e) => e.id !== id),
        })),

      addProfessionalExperience: (exp: ProfessionalExperience) =>
        set((state) => ({
          professionalExperiences: [exp, ...state.professionalExperiences],
        })),

      updateProfessionalExperience: (exp: ProfessionalExperience) =>
        set((state) => ({
          professionalExperiences: state.professionalExperiences.map((e) =>
            e.id === exp.id ? exp : e
          ),
        })),

      deleteProfessionalExperience: (id: string) =>
        set((state) => ({
          professionalExperiences: state.professionalExperiences.filter((e) => e.id !== id),
        })),

      addCertification: (cert: Certification) =>
        set((state) => ({
          certifications: [cert, ...state.certifications],
        })),

      updateCertification: (cert: Certification) =>
        set((state) => ({
          certifications: state.certifications.map((c) => (c.id === cert.id ? cert : c)),
        })),

      deleteCertification: (id: string) =>
        set((state) => ({
          certifications: state.certifications.filter((c) => c.id !== id),
        })),

      exportData: () => {
        const state = get();
        const data: PortfolioData = {
          profile: state.profile,
          speakerExperiences: state.speakerExperiences,
          professionalExperiences: state.professionalExperiences,
          certifications: state.certifications,
        };
        return JSON.stringify(data, null, 2);
      },

      importData: (data: PortfolioData) =>
        set({
          profile: data.profile,
          speakerExperiences: data.speakerExperiences ?? [],
          professionalExperiences: data.professionalExperiences ?? [],
          certifications: data.certifications ?? [],
        }),

      resetToDefaults: () =>
        set({
          profile: defaultProfile,
          speakerExperiences: defaultSpeakerExperiences,
          professionalExperiences: defaultProfessionalExperiences,
          certifications: defaultCertifications,
        }),
    }),
    {
      name: 'speaker-portfolio-storage',
      // Persist the auth flag and the per-device password hash override.
      // Portfolio content stays sourced from the committed `portfolio.json`
      // so updates pushed to git are picked up by every visitor on reload.
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        passwordHash: state.passwordHash,
      }),
    }
  )
);
