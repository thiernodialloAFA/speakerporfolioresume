export interface Profile {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  bannerUrl: string;
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  location: string;
}

export interface SpeakerExperience {
  id: string;
  title: string;
  eventName: string;
  date: string; // YYYY-MM format
  description: string;
  eventLink?: string;
  videoLink?: string;
  imageUrl?: string;
  tags: string[];
}

export interface ProfessionalExperience {
  id: string;
  company: string;
  role: string;
  startDate: string; // YYYY-MM
  endDate?: string; // YYYY-MM or empty for current
  location: string;
  description: string;
  achievements: string[];
  skills?: string[];
  companyLogo?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuingOrg?: string;
  date: string; // YYYY-MM
  issueDate?: string; // alias for date
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  logoUrl?: string;
  description?: string;
}
