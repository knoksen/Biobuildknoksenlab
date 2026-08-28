export interface ResearchArticle {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  summary: string;
  url: string;
}

export interface OpenQuestion {
  id: string;
  question: string;
  importance: 'Høy' | 'Medium' | 'Lav';
  status: 'Åpen' | 'Under utforsking' | 'Løst';
}

export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  independentVariable: string;
  dependentVariable: string;
  status: 'Utkast' | 'Aktiv' | 'Fullført';
  startDate: string;
  endDate?: string;
  logs: string[];
  results?: string;
}

export interface ProvenTestingMark {
  isVerified: boolean;
  tier: 'SINTEF Verified' | 'RISE Accredited' | 'BioBuild Certified' | 'ISO/EN Standard' | 'Nordic Field Proven';
  accreditationNumber: string;
  verifiedDate: string;
  laboratory: string;
  leadInspector: string;
  reproducibilityScore: number; // 0-100%
  confidenceInterval: string;
  passedStandards: string[];
  auditReportUrl?: string;
  badgeLevel: 'Gold' | 'Platinum' | 'Silver' | 'Emerald';
}

export interface BioMaterial {
  id: string;
  name: string;
  category: 'Mykologiske' | 'Plantebaserte' | 'Alger & Bakterier' | 'Tre & Kork' | 'Annet';
  description: string;
  chemicalComposition: string;
  biologicalComposition: string;
  trl: number; // 1 to 9
  applicationAreas: string[];
  suppliers: string[];
  provenTesting?: ProvenTestingMark;
  epd: {
    gwp: number; // kg CO2 eq/kg
    recycledContent: number; // %
    lifetime: number; // år
    circularity: string; // f.eks. "100% komposterbar"
  };
  testResults: {
    fire: string; // Branntest beskrivelse
    moisture: string; // Fukttest beskrivelse
    strength: string; // Styrke beskrivelse
    durability: string; // Bestandighet beskrivelse
    fireRating?: string; // f.eks. "B-s1, d0"
    strengthMpa?: number; // Strekk/trykk-styrke i MPa
    durabilityYears?: number; // Forventet levetid i tøffe miljøer
    provenFireMark?: boolean;
    provenMoistureMark?: boolean;
    provenStrengthMark?: boolean;
    provenDurabilityMark?: boolean;
  };
  healthRisk: string;
  articles: ResearchArticle[];
  openQuestions: OpenQuestion[];
  experiments: Experiment[];
  measurements?: MeasurementPoint[];
  ownerId?: string;
}

export interface MeasurementPoint {
  id: string;
  parameter: 'strength' | 'moisture' | 'gwp';
  label: string;
  value: number;
  experimentTitle?: string;
  timestamp: string;
}

export interface Researcher {
  id: string;
  name: string;
  title: string;
  department: string;
  expertise: string[];
  avatar: string;
  activeHours: number;
  successRate: number;
  bio: string;
}

export interface ImageTag {
  id: string;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  label: string;
  category: 'Sprekk' | 'Fukt' | 'Delaminering' | 'Misfarging' | 'Generelt';
}

