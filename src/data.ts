import { BioMaterial } from './types';

export const initialBioMaterials: BioMaterial[] = [
  {
    id: 'mat-1',
    name: 'Mycelium Isolajonsblokker (Ganoderma)',
    category: 'Mykologiske',
    description: 'Bærekraftige isolasjonsmoduler dyrket naturlig ved å la soppmycel (Ganoderma lucidum) vokse gjennom et substrat av landbruksavfall og hampfiber. Fungerer som et sunnere alternativ til EPS/XPS.',
    chemicalComposition: 'Kitin (fungal cellevegg), cellulose, hemicellulose, lignin, og minimale mengder vann.',
    biologicalComposition: 'Ganoderma lucidum (skinnende lakksopp) mycel-nettverk integrert i finhakket Cannabis sativa (hamp) treverk.',
    trl: 6,
    applicationAreas: ['Innvendig isolasjon', 'Akustisk demping', 'Emballasje', 'Ikke-bærende fyllvegger'],
    suppliers: ['Ecovative Design', 'NTNU Biopolymer Lab', 'BioBuild Norge AS'],
    epd: {
      gwp: -1.2, // Karbonnegativt!
      recycledContent: 92,
      lifetime: 50,
      circularity: '100% biologisk nedbrytbar (komposteres på 45 dager i hagekompost).'
    },
    testResults: {
      fire: 'Selvslukkende egenskaper på grunn av naturlig kitin-sammensetning. Forkullingslag beskytter kjernen mot antennelse.',
      moisture: 'Høy fuktabsorpsjonsevne (opptil 12% av egenvekt) uten strukturell svekkelse. Dampåpen og pustende.',
      strength: 'Trykkfasthet på 0.2 MPa, strekkfasthet på 0.15 MPa. Fleksibel og elastisk, motstandsdyktig mot rystelser.',
      durability: 'God holdbarhet i tørre konstruksjoner. Muggresistent ved normal luftfuktighet, men brytes ned ved permanent vannmetning over 90 dager.',
      fireRating: 'B-s1, d0',
      strengthMpa: 0.2,
      durabilityYears: 40
    },
    healthRisk: 'Null VOC-utslipp. Svært allergivennlig. Levende sporer er 100% inaktivert via varmebehandling på 85°C før installasjon.',
    articles: [
      {
        id: 'art-1-1',
        title: 'Mechanical and Thermal Properties of Fungal Mycelium-based Bio-composites',
        authors: 'Haneef, M., Bertrand, L., Ceseracciu, L. et al.',
        year: 2017,
        journal: 'Scientific Reports',
        summary: 'En omfattende studie av de termiske og mekaniske egenskapene til sopp-biokompositter dyrket på cellulose, som viser at mycel gir utmerket akustisk og termisk isolasjon.',
        url: 'https://www.nature.com/articles/s41598-017-04306-8'
      },
      {
        id: 'art-1-2',
        title: 'Mycelium materials as a sustainable alternative in circular construction',
        authors: 'Sandberg, T. & Hansen, J. O.',
        year: 2022,
        journal: 'Nordic Journal of Bio-Architecture',
        summary: 'Studie av mycelkompositter brukt i det nordiske klimaet, med spesiell vekt på fuktsikkerhet og brannbeskyttelse i norske trehus.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-1-1',
        question: 'Hvordan kan vi forbedre vannavstøtningen uten å ødelegge den biologiske nedbrytbarheten?',
        importance: 'Høy',
        status: 'Under utforsking'
      },
      {
        id: 'q-1-2',
        question: 'Hva er den optimale varmebehandlingstiden for å garantere 100% spore-inaktivering uten å svekke strukturen?',
        importance: 'Medium',
        status: 'Åpen'
      }
    ],
    experiments: [
      {
        id: 'exp-1-1',
        title: 'Testing av naturlig voksbelegg på mycelblokker',
        hypothesis: 'Bruk av tynt lag med bivoks eller linolje på overflaten vil redusere vannabsorpsjon med 80% uten å tette dampåpenheten.',
        independentVariable: 'Type overflatebehandling (Ubehandlet, Bivoks, Linolje)',
        dependentVariable: 'Vannabsorpsjon (vektøkning under 24t dusjtest) og dampdiffusjonsmotstand',
        status: 'Aktiv',
        startDate: '2026-06-01',
        logs: [
          '01.06.2026: Klargjorde 15 mycelblokker av type Ganoderma.',
          '10.06.2026: Påførte bivoks (smeltet, 60C) på 5 blokker, linolje på 5 blokker. Siste 5 er kontrollgruppe.',
          '25.06.2026: Startet fuktkammer-eksponering.'
        ]
      }
    ]
  },
  {
    id: 'mat-2',
    name: 'Hampbetong (Hempcrete / Hampkalk)',
    category: 'Plantebaserte',
    description: 'Et bio-komposittmateriale laget av hampeskive ( cannabis sativa stilk-interiør) blandet med lesket kalk og vann. Fungerer som en kombinert isolasjon, termisk masse og fuktregulator for Alive Houses.',
    chemicalComposition: 'Kalsiumhydroksid (kalkhydrat), kalsiumkarbonat, cellulose, pektin, og silikater fra hamp.',
    biologicalComposition: '70% hampeskive (treaktig kjerne), 30% mineralbasert kalkbindemiddel.',
    trl: 8,
    applicationAreas: ['Yttervegger (støpt eller sprøytet)', 'Isolerende gulvunderlag', 'Takisolering', 'Pussing og rehabilitering'],
    suppliers: ['Hampbygg AS', 'Tradical France', 'SINTEF Community'],
    epd: {
      gwp: -1.6, // Binder mer CO2 enn det slipper ut i livsløpet!
      recycledContent: 85,
      lifetime: 100,
      circularity: 'Kan knuses og gjenbrukes som jordforbedring eller resirkuleres direkte inn i ny hampbetong.'
    },
    testResults: {
      fire: 'Eksepsjonell brannmotstand på grunn av kalkinnkapslingen. Hampfibrene kan ikke brenne uten oksygen, og kalken forkalker overflaten.',
      moisture: 'Svært høy hygroskopisk buffer. Absorberer fukt ved høy luftfuktighet, og slipper den ut igjen når luften blir tørrere.',
      strength: 'Ikke-strukturell bæreevne. Trykkfasthet 0.5 - 1.2 MPa. Må brukes sammen med en bærende struktur (f.eks. trekonstruksjon).',
      durability: 'Uforgjengelig over tid. Kalken fortsetter å karbonisere (absorbere CO2) over tiår, noe som gjør veggen hardere og sterkere med alderen.',
      fireRating: 'Class B-s1, d0 / EI 120 brannmur',
      strengthMpa: 0.8,
      durabilityYears: 100
    },
    healthRisk: 'Ingen farlige utslipp eller kjemikalier. Kalken hindrer naturlig vekst av mugg og sopp. Svært godt inneklima.',
    articles: [
      {
        id: 'art-2-1',
        title: 'Hygrothermal performance of hemp-lime wall in Nordic climate',
        authors: 'Arntsen, B. G. & Vågen, S.',
        year: 2021,
        journal: 'Building and Environment',
        summary: 'En undersøkelse av hvordan hampkalk-vegger presterer under kalde og fuktige forhold i Norge, med fokus på oppvarmingsbesparelser og fuktforebygging.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-2-1',
        question: 'Hvordan påvirkes tørketiden til tykke hampkalkvegger av den høye luftfuktigheten om høsten i Norge?',
        importance: 'Høy',
        status: 'Åpen'
      }
    ],
    experiments: [
      {
        id: 'exp-2-1',
        title: 'Hurtigtørking ved hjelp av kalk-akseleratorer',
        hypothesis: 'Tilsats av 5% naturlig puzzolan (vulkansk aske) i kalkblandingen vil halvere herdetiden og øke tidlig trykkfasthet med 40%.',
        independentVariable: 'Mengde puzzolansk akselerator (0%, 2.5%, 5%, 7.5%)',
        dependentVariable: 'Trykkfasthet etter 7 dager og relativ fuktighet i kjernen',
        status: 'Fullført',
        startDate: '2026-03-10',
        endDate: '2026-04-10',
        logs: [
          '10.03.2026: Støpte 12 testsylindre (150x300mm).',
          '17.03.2026: Målte trykkfasthet etter 7 dager.',
          '10.04.2026: Avsluttet 28-dagers herdetest.'
        ],
        results: 'Resultatene bekreftet hypotesen! 5% puzzolan reduserte tørketiden til 14 dager (ned fra 28) og økte trykkfastheten etter 7 dager fra 0.12 MPa til 0.22 MPa. Optimalt for norsk høstbygging.'
      }
    ]
  },
  {
    id: 'mat-3',
    name: 'Selvhelende Bio-betong (Bacillus)',
    category: 'Alger & Bakterier',
    description: 'Modifisert strukturell betong tilsatt inaktive sporer av slekten Bacillus og næringsstoffer (kalsiumlaktat). Når det oppstår sprekker og vann trenger inn, våkner bakteriene og feller ut kalkstein for å tette sprekken.',
    chemicalComposition: 'Portlandsement, kalsiumlaktat (bakterienæring), kalsiumkarbonat (utfelt), vann.',
    biologicalComposition: 'Bacillus pseudofirmus (alkalifile bakteriesporer) innkapslet i porøs leire eller hydrogel-perler.',
    trl: 7,
    applicationAreas: ['Underjordiske murer', 'Tunneler og kjellere', 'Vindmøllefundamenter', 'Utsatte fasader i kyststrøk'],
    suppliers: ['TU Delft Concrete Lab', 'BioMason Inc', 'Heidelberg Materials Norge'],
    epd: {
      gwp: 320, // Høyere oppstart enn tre, men reduserer vedlikehold drastisk.
      recycledContent: 30,
      lifetime: 150,
      circularity: 'Kan knuses og gjenbrukes som tilslag i ny betong.'
    },
    testResults: {
      fire: 'A1 ikke-brennbar (standard sementklasse). Bakteriene tåler temperaturer opp til 250°C i dvaletilstand uten å dø.',
      moisture: 'Vanninntrengning reduseres med 90% etter selvheling. Fuktmotstand øker progressivt når sprekker tetter seg selv.',
      strength: 'Full strukturell trykkfasthet på 35-45 MPa. Ingen signifikant tap av styrke ved tilsetning av bakterieperler.',
      durability: 'Enestående levetid. Bakteriesporene kan overleve i dvaletilstand i opptil 200 år inni betongmatrisen, klare til å tette fremtidige sprekker.',
      fireRating: 'Klasse A1',
      strengthMpa: 42,
      durabilityYears: 150
    },
    healthRisk: 'Bakteriene er helt ufarlige for mennesker (Patogenitetsklasse 1). Ingen giftige utslipp under hele livsløpet.',
    articles: [
      {
        id: 'art-3-1',
        title: 'Bacteria-based self-healing concrete: A review of recent developments',
        authors: 'Jonkers, H. M., Thijssen, A., Muyzer, G. et al.',
        year: 2010,
        journal: 'Ecological Engineering',
        summary: 'Den banebrytende artikkelen som beskriver bruken av Bacillus-bakterier til å felle ut kalsiumkarbonat i betongsprekker.',
        url: 'https://doi.org/10.1016/j.ecoleng.2008.12.025'
      }
    ],
    openQuestions: [
      {
        id: 'q-3-1',
        question: 'Hvordan presterer bakteriene i arktiske temperaturer under 0°C? Blir selvhelingen for treg?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-3-1',
        title: 'Helingshastighet i frysetemperaturer',
        hypothesis: 'Ved temperaturer under 4°C vil helingsprosessen gå 70% tregere, men vil aktiveres raskt så snart temperaturen stiger til over 10°C.',
        independentVariable: 'Omgivelsestemperatur under fuktsyklus (-2C, 4C, 12C, 20C)',
        dependentVariable: 'Prosentvis tetting av en kunstig 0.3mm sprekk over 28 dager',
        status: 'Utkast',
        startDate: '2026-08-01',
        logs: [
          'Planlagt oppstart august 2026.',
          'Vil benytte klimakammeret på SINTEF i Trondheim.'
        ]
      }
    ]
  }
];
