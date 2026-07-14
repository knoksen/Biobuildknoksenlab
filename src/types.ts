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
  };
  healthRisk: string;
  articles: ResearchArticle[];
  openQuestions: OpenQuestion[];
  experiments: Experiment[];
}
