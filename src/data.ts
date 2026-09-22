import { BioMaterial, Researcher, UserSpace } from './types';

export const initialBioMaterials: BioMaterial[] = [
  {
    id: 'mat-1',
    name: 'Mycelium Isolajonsblokker (Ganoderma)',
    category: 'Mykologiske',
    ownerId: 'res-1',
    description: 'Bærekraftige isolasjonsmoduler dyrket naturlig ved å la soppmycel (Ganoderma lucidum) vokse gjennom et substrat av landbruksavfall og hampfiber. Fungerer som et sunnere alternativ til EPS/XPS.',
    chemicalComposition: 'Kitin (fungal cellevegg), cellulose, hemicellulose, lignin, og minimale mengder vann.',
    biologicalComposition: 'Ganoderma lucidum (skinnende lakksopp) mycel-nettverk integrert i finhakket Cannabis sativa (hamp) treverk.',
    trl: 6,
    applicationAreas: ['Innvendig isolasjon', 'Akustisk demping', 'Emballasje', 'Ikke-bærende fyllvegger'],
    suppliers: ['Ecovative Design', 'NTNU Biopolymer Lab', 'BioBuild Norge AS'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-MYC01',
      verifiedDate: '2026-06-15',
      laboratory: 'SINTEF Byggforsk & NTNU Biopolymer Lab',
      leadInspector: 'Dr. Marianne Jensen (Sertifisert Kontrollør)',
      reproducibilityScore: 98.4,
      confidenceInterval: '95% KI (± 0.04)',
      passedStandards: [
        'NS-EN 13501-1 (Brannklasse B-s1, d0)',
        'ISO 12571 (Hygroskopisk fuktbuffer)',
        'ISO 8301 (Termisk konduktivitet lambda 0.038 W/mK)',
        'ISO 14044 (Miljødeklarasjon EPD)'
      ],
      badgeLevel: 'Gold'
    },
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
      durabilityYears: 40,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: false,
      provenDurabilityMark: true
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
        ],
        notes: [
          {
            id: 'note-1-1',
            timestamp: '11.06.2026 kl. 09:30',
            author: 'Dr. L. Vinterberg (Lab)',
            category: 'Observasjon',
            content: 'Optisk mikroskopering (50x) viser jevn overflateforsegling på blokkene behandlet med bivoks. Ingen sprekker i overgangen mellom hyfenettverket og vokslaget.',
            tags: ['mikroskopi', 'overflate', 'hyfestruktur']
          },
          {
            id: 'note-1-2',
            timestamp: '26.06.2026 kl. 14:15',
            author: 'K. Solheim (Labingeniør)',
            category: 'Miljø & Klima',
            content: 'Klimakammeret holder stabil 95% RF ved 21.4°C. Kontrollgruppen viser tidlige tegn til overflatesvelling etter 24 timer i kammeret.',
            tags: ['klimakammer', 'fuktighet', 'kontrollgruppe']
          },
          {
            id: 'note-1-3',
            timestamp: '28.06.2026 kl. 11:00',
            author: 'Dr. L. Vinterberg (Lab)',
            category: 'Måling & Prøving',
            content: 'Vannoppsugingstesten etter 48 timer viser kun 4.2% vektøkning for bivoks-prøvene, mot 31.8% for ubehandlet kontroll. Resultatene er signifikant over hypotesens forventninger.',
            tags: ['kapillærsug', 'vektmåling', 'bivoks']
          }
        ]
      }
    ],
    measurements: [
      { id: 'm-1-1', timestamp: '2026-06-02', parameter: 'strength', value: 0.012, label: 'Dag 1', experimentTitle: 'Naturlig voksbelegg på mycelblokker' },
      { id: 'm-1-2', timestamp: '2026-06-04', parameter: 'strength', value: 0.043, label: 'Dag 3', experimentTitle: 'Naturlig voksbelegg på mycelblokker' },
      { id: 'm-1-3', timestamp: '2026-06-08', parameter: 'strength', value: 0.106, label: 'Dag 7', experimentTitle: 'Naturlig voksbelegg på mycelblokker' },
      { id: 'm-1-4', timestamp: '2026-06-15', parameter: 'strength', value: 0.162, label: 'Dag 14', experimentTitle: 'Naturlig voksbelegg på mycelblokker' },
      { id: 'm-1-5', timestamp: '2026-06-22', parameter: 'strength', value: 0.194, label: 'Dag 21', experimentTitle: 'Naturlig voksbelegg på mycelblokker' },
      { id: 'm-1-6', timestamp: '2026-06-29', parameter: 'strength', value: 0.208, label: 'Dag 28', experimentTitle: 'Naturlig voksbelegg på mycelblokker' }
    ]
  },
  {
    id: 'mat-2',
    name: 'Hampbetong (Hempcrete / Hampkalk)',
    category: 'Plantebaserte',
    ownerId: 'res-4',
    description: 'Et bio-komposittmateriale laget av hampeskive ( cannabis sativa stilk-interiør) blandet med lesket kalk og vann. Fungerer som en kombinert isolasjon, termisk masse og fuktregulator for Alive Houses.',
    chemicalComposition: 'Kalsiumhydroksid (kalkhydrat), kalsiumkarbonat, cellulose, pektin, og silikater fra hamp.',
    biologicalComposition: '70% hampeskive (treaktig kjerne), 30% mineralbasert kalkbindemiddel.',
    trl: 8,
    applicationAreas: ['Yttervegger (støpt eller sprøytet)', 'Isolerende gulvunderlag', 'Takisolering', 'Pussing og rehabilitering'],
    suppliers: ['Hampbygg AS', 'Tradical France', 'SINTEF Community'],
    provenTesting: {
      isVerified: true,
      tier: 'RISE Accredited',
      accreditationNumber: 'NO-RISE-2026-HMP18',
      verifiedDate: '2026-04-12',
      laboratory: 'RISE Fire & Safety Lab Trondheim',
      leadInspector: 'Dr. Sindre Vanebo & Dr. Johan Dahl',
      reproducibilityScore: 99.1,
      confidenceInterval: '99% KI (± 0.01)',
      passedStandards: [
        'NS-EN 1365-1 (Brannmotstandsprøving for Bærende Vegger - EI 120)',
        'NS-EN ISO 12572 (Bygningsmaterialers Fuktoverføringsegenskaper)',
        'ISO 9869 (Varmegjennomgangskoeffisient in-situ U-verdi)'
      ],
      badgeLevel: 'Platinum'
    },
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
      durabilityYears: 100,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: false,
      provenDurabilityMark: true
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
    ],
    measurements: [
      { id: 'm-2-1', timestamp: '2026-03-11', parameter: 'strength', value: 0.054, label: 'Dag 1', experimentTitle: 'Akselerert herding av hampkalk' },
      { id: 'm-2-2', timestamp: '2026-03-13', parameter: 'strength', value: 0.192, label: 'Dag 3', experimentTitle: 'Akselerert herding av hampkalk' },
      { id: 'm-2-3', timestamp: '2026-03-17', parameter: 'strength', value: 0.425, label: 'Dag 7', experimentTitle: 'Akselerert herding av hampkalk' },
      { id: 'm-2-4', timestamp: '2026-03-24', parameter: 'strength', value: 0.680, label: 'Dag 14', experimentTitle: 'Akselerert herding av hampkalk' },
      { id: 'm-2-5', timestamp: '2026-03-31', parameter: 'strength', value: 0.760, label: 'Dag 21', experimentTitle: 'Akselerert herding av hampkalk' },
      { id: 'm-2-6', timestamp: '2026-04-07', parameter: 'strength', value: 0.825, label: 'Dag 28', experimentTitle: 'Akselerert herding av hampkalk' }
    ]
  },
  {
    id: 'mat-3',
    name: 'Selvhelende Bio-betong (Bacillus)',
    category: 'Alger & Bakterier',
    ownerId: 'res-2',
    description: 'Modifisert strukturell betong tilsatt inaktive sporer av slekten Bacillus og næringsstoffer (kalsiumlaktat). Når det oppstår sprekker og vann trenger inn, våkner bakteriene og feller ut kalkstein for å tette sprekken.',
    chemicalComposition: 'Portlandsement, kalsiumlaktat (bakterienæring), kalsiumkarbonat (utfelt), vann.',
    biologicalComposition: 'Bacillus pseudofirmus (alkalifile bakteriesporer) innkapslet i porøs leire eller hydrogel-perler.',
    trl: 7,
    applicationAreas: ['Underjordiske murer', 'Tunneler og kjellere', 'Vindmøllefundamenter', 'Utsatte fasader i kyststrøk'],
    suppliers: ['TU Delft Concrete Lab', 'BioMason Inc', 'Heidelberg Materials Norge'],
    provenTesting: {
      isVerified: true,
      tier: 'ISO/EN Standard',
      accreditationNumber: 'NO-ISO-2026-BAC42',
      verifiedDate: '2026-05-20',
      laboratory: 'SINTEF Structural Materials Lab & TU Delft Lab',
      leadInspector: 'Prof. Lars Solberg & Dr. Jonkers',
      reproducibilityScore: 97.9,
      confidenceInterval: '95% KI (± 0.03)',
      passedStandards: [
        'NS-EN 12390-3 (Trykkfasthet for Prøvelegemer av Betong)',
        'RILEM TC 221-SHC (Metoder for Måling av Selvheling i Betong)',
        'NS-EN 13501-1 (Brannklasse A1 Ubrennbar)'
      ],
      badgeLevel: 'Gold'
    },
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
      durabilityYears: 150,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
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
    ],
    measurements: [
      { id: 'm-3-1', timestamp: '2026-05-02', parameter: 'strength', value: 13.1, label: 'Dag 1', experimentTitle: 'NS-EN 12390-3 Trykkprøving' },
      { id: 'm-3-2', timestamp: '2026-05-04', parameter: 'strength', value: 25.4, label: 'Dag 3', experimentTitle: 'NS-EN 12390-3 Trykkprøving' },
      { id: 'm-3-3', timestamp: '2026-05-08', parameter: 'strength', value: 33.8, label: 'Dag 7', experimentTitle: 'NS-EN 12390-3 Trykkprøving' },
      { id: 'm-3-4', timestamp: '2026-05-15', parameter: 'strength', value: 39.2, label: 'Dag 14', experimentTitle: 'NS-EN 12390-3 Trykkprøving' },
      { id: 'm-3-5', timestamp: '2026-05-22', parameter: 'strength', value: 41.5, label: 'Dag 21', experimentTitle: 'NS-EN 12390-3 Trykkprøving' },
      { id: 'm-3-6', timestamp: '2026-05-29', parameter: 'strength', value: 43.6, label: 'Dag 28', experimentTitle: 'NS-EN 12390-3 Trykkprøving' }
    ]
  },
  {
    id: 'mat-4',
    name: 'Termisk Modifisert Massivtre & Kork (Kork-CLT Hybrider)',
    category: 'Tre & Kork',
    ownerId: 'res-4',
    description: 'Bærekraftige massivtre-elementer (CLT) med integrerte indre sjikt av ekspandert kork. Termisk modifisert uten kjemikalier (varmebehandlet ved 190°C) for maksimal råte- og dimensjonsstabilitet i nordisk klima.',
    chemicalComposition: 'Lignin, varmeherdet cellulose, suberin (fra korkcellevegger), harpikssyrer.',
    biologicalComposition: '100% fornybar biomasse: 75% termisk modifisert Picea abies (norsk gran) og 25% ekspandert Quercus suber (korkbark).',
    trl: 9,
    applicationAreas: ['Bærende yttervegger', 'Etasjeskillere', 'Passivhus-fasader', 'Eksponerte takkonstruksjoner'],
    suppliers: ['Moelven Wood AS', 'Splitkon AS', 'Amorim Cork Composites'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-CLT04',
      verifiedDate: '2026-05-18',
      laboratory: 'SINTEF Byggforsk & Moelven Teknologisenter',
      leadInspector: 'Dr. Johan Dahl (Teknisk Kontroll)',
      reproducibilityScore: 99.5,
      confidenceInterval: '99% KI (± 0.005)',
      passedStandards: [
        'NS-EN 16351 (Trekonstruksjoner - Massivtre / CLT)',
        'NS-EN 350 (Holdbarhet mot Råtesopp - Klasse 1-2)',
        'NS-EN 13501-1 (Brannmotstand REI 90)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -1.85,
      recycledContent: 40,
      lifetime: 80,
      circularity: '100% ombrukbart som elementer eller resirkulerbart til spon, trefiberisolasjon og biokull.'
    },
    testResults: {
      fire: 'Langsom og forutsigbar innbrenningshastighet (0.65 mm/min). Danner et beskyttende kullsjikt som opprettholder bæreevnen.',
      moisture: 'Svelging og krymping redusert med 60% sammenlignet med ubehandlet treverk. Fuktbalanse under 8%.',
      strength: 'Høy elastisitetsmodul (11 000 MPa) og trykkfasthet på 24 MPa i fiberretningen.',
      durability: 'Holdbarhetsklasse 1-2 i henhold til NS-EN 350 (råteresistent i over 60 år uten overflatebehandling).',
      fireRating: 'REI 90 / B-s1, d0',
      strengthMpa: 24.0,
      durabilityYears: 80,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Null formaldehyd eller syntetisk lim. Treet avgir kun naturlige tre-aromaer (terpener). Inneklima i klasse A+.',
    articles: [
      {
        id: 'art-4-1',
        title: 'Thermal modification of Nordic softwood for structural mass timber applications',
        authors: 'Dahl, J. & Sandland, K.',
        year: 2023,
        journal: 'European Journal of Wood and Wood Products',
        summary: 'Klassifisering av thermotre i kombinasjon med naturlig kork for redusert kuldebro og forbedret lydisolering i massivtrebygg.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-4-1',
        question: 'Hvordan påvirker den termiske modifiseringen limheftet ved bruk av bio-basert ligninlim i steden for PUR-lim?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-4-1',
        title: 'Lignin-basert bio-lim for kork-CLT skjøter',
        hypothesis: 'Kraftselskap-enzymatisk lignin kan erstatte polyuretanlim med 100% opprettholdt strekk-skjærfasthet etter fuktsykluser.',
        independentVariable: 'Lignin-blanding med organisk krosslinker (0%, 15%, 30%, 45%)',
        dependentVariable: 'Skjærfasthet i limfuge etter 24t vannsenking',
        status: 'Aktiv',
        startDate: '2026-05-15',
        logs: [
          '15.05.2026: Fremstilte 20 test-brikker med 30% lignin-lim.',
          '02.06.2026: Utførte delamineringstest i fuktkammer ved 40°C.'
        ]
      }
    ]
  },
  {
    id: 'mat-5',
    name: 'Mikroalge-SkumIsolasjon (Chlorella Biopolymer)',
    category: 'Alger & Bakterier',
    ownerId: 'res-2',
    description: 'Et ultra-lettvekts bio-skum fremstilt ved bio-oppsamling av mikroalger (Chlorella vulgaris) og kryssoverlenkede alginat-polymere høstet fra norsk kysttang. Erstatter polyuretan- og Isopor-skum.',
    chemicalComposition: 'Natriumalginat, kalsiumklorid kryssoverlenker, fykobiliproteiner, mikroalge-proteiner, glycerol.',
    biologicalComposition: 'Chlorella vulgaris mikroalge-biomasse (60%) integrert i en kalsiumalginat-hydrogelmatrise (40%).',
    trl: 5,
    applicationAreas: ['Blåst hulromsisolasjon', 'Sprøyteisolering for tak', 'Termiske skillevegger', 'Lyddempende himling'],
    suppliers: ['SINTEF Ocean', 'Algea Norway AS', 'NTNU Bioprocess Lab'],
    provenTesting: {
      isVerified: true,
      tier: 'BioBuild Certified',
      accreditationNumber: 'NO-BIOBUILD-2026-ALG05',
      verifiedDate: '2026-06-08',
      laboratory: 'SINTEF Ocean & NTNU Bioprocess Lab',
      leadInspector: 'Prof. Lars Solberg',
      reproducibilityScore: 97.2,
      confidenceInterval: '95% KI (± 0.04)',
      passedStandards: [
        'ISO 8301 (Termisk konduktivitet lambda 0.034 W/mK)',
        'NS-EN 13501-1 (Brannklasse B-s2, d0)',
        'ISO 16000-9 (VOC Utslippsfri)'
      ],
      badgeLevel: 'Emerald'
    },
    epd: {
      gwp: -2.1,
      recycledContent: 95,
      lifetime: 45,
      circularity: '100% biologisk oppløselig ved enzymatisk kompostering.'
    },
    testResults: {
      fire: 'Danner naturlig et brannhemmende forkullet mineral-askelag. Liten gassutvikling.',
      moisture: 'Moderat hygroskopisk. Krever damp-åpen hydrofob membran ved utvendig bruk.',
      strength: 'Trykkfasthet 0.18 MPa ved 10% deformasjon. Elastisk minneskum-effekt.',
      durability: 'Stabil under innvendige tørre forhold. Unngå direkte UV-eksponering uten belegg.',
      fireRating: 'B-s2, d0',
      strengthMpa: 0.18,
      durabilityYears: 45,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: false,
      provenDurabilityMark: true
    },
    healthRisk: 'Helt uten isocyanater, KFK-gasser eller toksiske flammehemmere. Svært rent innemiljø.',
    articles: [
      {
        id: 'art-5-1',
        title: 'Algae-derived biopolymers for sustainable thermal insulation in buildings',
        authors: 'Solberg, L. & Rostova, E.',
        year: 2024,
        journal: 'Journal of Cleaner Production',
        summary: 'Eksperimentell evaluering av isolasjonsverdi (lambda-verdi 0.034 W/mK) for mikroalgeskum dyrket i industrielle fotobioreaktorer.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-5-1',
        question: 'Kan faste mikroalgeskum storskala-fremstilles med kontinuerlig ekstrudering uten at cellestrukturen kollapser?',
        importance: 'Høy',
        status: 'Åpen'
      }
    ],
    experiments: [
      {
        id: 'exp-5-1',
        title: 'Skumstabilisering med naturlig saponin',
        hypothesis: 'Tilsetning av 2% naturlig plante-saponin vil gi 30% lavere densitet (høyere isolasjonseffekt) uten tap av struktur.',
        independentVariable: 'Konsentrasjon av saponin-skummiddel',
        dependentVariable: 'Densitet (kg/m3) og varmeledningsevne (W/mK)',
        status: 'Utkast',
        startDate: '2026-09-01',
        logs: [
          'Skummetingsutstyr klargjort i biologilaboratoriet.'
        ]
      }
    ]
  },
  {
    id: 'mat-6',
    name: 'Presset Halm & Takrør-Plate (Phragmites-BioBoard)',
    category: 'Plantebaserte',
    ownerId: 'res-3',
    description: 'Tykke isolasjons- og byggeplater fremstilt ved høy-temperatur komprimering av naturlig halm og takrør (Phragmites australis) uten tilsatt lim. Naturlig harpiks og lignin i stråene binder platen under trykk.',
    chemicalComposition: 'Cellulose (45%), hemicellulose (28%), lignin (18%), kiselolje/silika (5%).',
    biologicalComposition: '100% tørkede strå av Phragmites australis og Triticum aestivum (hvetehalm).',
    trl: 8,
    applicationAreas: ['Innvendige skillevegger', 'Undertak', 'Lydisolering i etasjeskillere', 'Systemvegger i kontorbygg'],
    suppliers: ['Ekopanely', 'Nordic StrawTech AS', 'BioBuild Norge AS'],
    provenTesting: {
      isVerified: true,
      tier: 'Nordic Field Proven',
      accreditationNumber: 'NO-NORDIC-2026-STR06',
      verifiedDate: '2026-03-14',
      laboratory: 'NIBIO & SINTEF Byggforsk',
      leadInspector: 'Dr. Elena Rostova',
      reproducibilityScore: 98.6,
      confidenceInterval: '95% KI (± 0.02)',
      passedStandards: [
        'NS-EN 1364-1 (Brannmotstandsprøving av Ikke-bærende Vegger - EI 60)',
        'NS-EN ISO 10140 (Laboratoriemåling av Lydisolasjon i Bygninger)',
        'NS-EN 310 (Bøyefasthet for Trebaserte Plater)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -1.4,
      recycledContent: 100,
      lifetime: 75,
      circularity: 'Fullstendig biologisk nedbrytbar eller direkte gjenbrukbar som platekomponent.'
    },
    testResults: {
      fire: 'Ekstremt høy tetthet hindrer surstoff-tilførsel i kjernen. Tåler direkte flamme i 60 minutter.',
      moisture: 'Høy silikainnhold i takrør gir naturlig motstand mot fukt og soppvekst.',
      strength: 'Bøyefasthet på 3.8 MPa. Meget robust og spikerfast plate.',
      durability: 'Tørre konstruksjoner har dokumentert levetid på over 75 år uten deformasjon.',
      fireRating: 'EI 60 / B-s1, d0',
      strengthMpa: 3.8,
      durabilityYears: 75,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: '100% naturlig landbruksråvare. Ingen stoffer på OBS-listen. Regulerer relativ luftfuktighet optimalt.',
    articles: [
      {
        id: 'art-6-1',
        title: 'Acoustic and thermal properties of unbonded compressed straw panels',
        authors: 'Rostova, E. & Jensen, M.',
        year: 2022,
        journal: 'Materials & Design',
        summary: 'Dokumentasjon av lydreduksjonstall (Rw = 54 dB) for dobbelte halm-skillevegger i kontorbygg.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-6-1',
        question: 'Hvordan kan vi optimalisere kutte- og sagemetoder for å unngå støvflukt på byggeplass?',
        importance: 'Lav',
        status: 'Løst'
      }
    ],
    experiments: []
  },
  {
    id: 'mat-7',
    name: 'Bio-Chitosan Marint Kompositt (Pandalus Shell-Matrix)',
    category: 'Mykologiske',
    ownerId: 'res-1',
    description: 'Et banebrytende hybridmateriale som kombinerer rekeskall-avfall (kitosan fra Pandalus borealis) med fungal mycel-armering. Gir en hard, flise-lignende, vannbestandig overflate for våtrom og kjøkken.',
    chemicalComposition: 'Deacetylert kitosan, kalsiumkarbonat, kitin, beta-glukaner.',
    biologicalComposition: 'Marint kitosan-matrise (50%) armert med Pleurotus ostreatus mycelnettverk (50%).',
    trl: 6,
    applicationAreas: ['Våtromsbekledning', 'Kjøkkenplater', 'Baderomsinnredning', 'Dekorative slitesterke paneler'],
    suppliers: ['ChitoTech Tromsø', 'NTNU Marin Bioprospektering', 'BioBuild Norge AS'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-CHT07',
      verifiedDate: '2026-06-22',
      laboratory: 'NTNU Marin Bioprospektering & SINTEF Byggforsk',
      leadInspector: 'Dr. Marianne Jensen',
      reproducibilityScore: 98.1,
      confidenceInterval: '95% KI (± 0.03)',
      passedStandards: [
        'NS-EN 13501-1 (Brannmotstand B-s1, d0)',
        'ISO 27448 (Test for overflate-hydrofobi og kontaktvinkel)',
        'NS-EN 438-2 (Dekorative Høytrykkslaminater - Slitasjemotstand)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -0.9,
      recycledContent: 98,
      lifetime: 50,
      circularity: 'Kan brytes ned av kitinase-enzymer eller gjenbrukes i sirkulære marin-kompositter.'
    },
    testResults: {
      fire: 'Nitrogenrik kitinstruktur virker naturlig flammehemmende.',
      moisture: 'Vannavvisende (kontaktvinkel > 95°). Svært velegnet for miljøer med skvettvann.',
      strength: 'Høy bøyefasthet på 18 MPa og trykkfasthet på 12 MPa.',
      durability: 'Høy ripefasthet og god kjemisk motstand mot milde rengjøringsmidler.',
      fireRating: 'B-s1, d0',
      strengthMpa: 12.0,
      durabilityYears: 50,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: '100% biokompatibelt. Allergitestet (proteinrester fra reker er fullstendig fjernet i deacetyleringsprosessen).',
    articles: [
      {
        id: 'art-7-1',
        title: 'Chitosan-mycelium composite materials for water-resistant bio-based interior panels',
        authors: 'Jensen, M. & Solberg, L.',
        year: 2025,
        journal: 'ACS Sustainable Chemistry & Engineering',
        summary: 'Syntese av kitosan fra nordiske rekeskall integrert med mycelium for skapelse av hydrofobe innvendige paneler.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-7-1',
        question: 'Hva er den mest energieffektive milde deacetyleringsprosessen for utvinning av kitosan fra rekeavfall?',
        importance: 'Medium',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-7-1',
        title: 'Overflate-hydrofobi med nativ chitinase-inhibering',
        hypothesis: 'Behandling med milde bio-baserte kitinase-hemmere forlenger hydrofob levetid i våtrom med over 300%.',
        independentVariable: 'Inhibitorkonsentrasjon (0.1%, 0.5%, 1.0%)',
        dependentVariable: 'Kontaktvinkel og slitasjemotstand etter 1000 våtvask-sykluser',
        status: 'Aktiv',
        startDate: '2026-06-10',
        logs: [
          '10.06.2026: Utførte overflatebehandling på 10 testfliser.',
          '20.06.2026: Målte innledende kontaktvinkel til 102°.'
        ]
      }
    ],
    measurements: [
      { id: 'm-7-1', timestamp: '2026-06-12', parameter: 'strength', value: 18.2, label: 'Bøyefasthet Flis', experimentTitle: 'Chitosan hydrofobi' },
      { id: 'm-7-2', timestamp: '2026-06-21', parameter: 'moisture', value: 2.1, label: 'Vannabsorpsjon (24t)', experimentTitle: 'Chitosan hydrofobi' }
    ]
  },
  {
    id: 'mat-8',
    name: 'Nanocellulose Aerogel & Linfiber Isolering',
    category: 'Plantebaserte',
    ownerId: 'res-6',
    description: 'Ultra-lett isolasjonsmateriale med krisp og transparent microporøs aerogel-struktur fremstilt av nanofibrillert cellulose (NFC) fra norsk grantopp, armert med mekanisk kjemmet lin. Gir ekstremt lav varmeledningsevne (λ = 0,018 W/mK).',
    chemicalComposition: 'Nanofibrillert cellulose (NFC), kryssoverlenket glukose, naturlig lin-lignin, boraks-fribaserte flammehemmere.',
    biologicalComposition: '80% Picea abies cellulose-nanofibre og 20% Linum usitatissimum (linfiber-nettverk).',
    trl: 6,
    applicationAreas: ['Superisolerende vinduskassassetter', 'Slanke fasadepaneler', 'Passive solfangere', 'Kryogene rørisolasjoner'],
    suppliers: ['RISE PFI Trondheim', 'Borregaard Exilva', 'BioBuild Norge AS'],
    provenTesting: {
      isVerified: true,
      tier: 'RISE Accredited',
      accreditationNumber: 'NO-RISE-2026-NFC08',
      verifiedDate: '2026-06-03',
      laboratory: 'RISE PFI & NTNU Nanofabrikasjon Lab',
      leadInspector: 'Dr. Anders Lindqvist',
      reproducibilityScore: 99.3,
      confidenceInterval: '99% KI (± 0.008)',
      passedStandards: [
        'ISO 8302 (Termisk isolasjon - Varmestrømsmåler)',
        'NS-EN 13501-1 (Brannklasse B-s1, d0)',
        'ISO 15901-2 (Porestørrelse og porøsitet via gassadsorpsjon)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -1.95,
      recycledContent: 90,
      lifetime: 60,
      circularity: '100% resirkulerbart til ny papirmasse eller biologisk nedbrytbart i skogsjord.'
    },
    testResults: {
      fire: 'Varmebehandlet med mineralborat; slukker umiddelbart ved fjerning av direkte flamme uten å smelte.',
      moisture: 'Dampåpen nanostruktur med beskyttende silan-overflatebelegg for forhindring av kondensansamling.',
      strength: 'Liten egenvekt (densitet 18 kg/m³), trykkfasthet på 0.12 MPa ved 10% deformasjon.',
      durability: 'Stabil aerogel-matrise som beholder sine vakuumporer over 60 år i tørre skilleveggmoduler.',
      fireRating: 'B-s1, d0',
      strengthMpa: 0.12,
      durabilityYears: 60,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: false,
      provenDurabilityMark: true
    },
    healthRisk: 'Fullstendig giftfri bio-nanoteknologi. Ingen støvemisjon av skadelige mikrofibre etter silan-innkapsling.',
    articles: [
      {
        id: 'art-8-1',
        title: 'Nanocellulose aerogels with reinforced flax fibers for ultra-insulating building envelopes',
        authors: 'Lindqvist, A., Rostova, E. & Solberg, L.',
        year: 2025,
        journal: 'ACS Applied Bio Materials',
        summary: 'Dokumentasjon på fremstilling av frysetørkede aerogeler fra norsk granmasse med λ-verdier lavere enn stillestående luft.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-8-1',
        question: 'Hvordan kan frysetørkingsprosessen oppskaleres industrielt med 50% lavere energiforbruk?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-8-1',
        title: 'Superkritisk CO2-tørking vs frysetørking for NFC-aerogel',
        hypothesis: 'Superkritisk tørking bevarer 98% av nanoporene, noe som gir λ-verdi på 0,016 W/mK.',
        independentVariable: 'Tørkemetodikk (Frysetørking vs Superkritisk CO2)',
        dependentVariable: 'Porestørrelsesfordeling og termisk konduktivitet',
        status: 'Aktiv',
        startDate: '2026-05-01',
        logs: [
          '01.05.2026: Produserte 20 aerogel-prøver i autoklaven.',
          '15.05.2026: Målte porestørrelse med SEM (Scanning Electron Microscopy).'
        ]
      }
    ],
    measurements: [
      { id: 'm-8-1', timestamp: '2026-05-16', parameter: 'gwp', value: 0.018, label: 'Varmeledningsevne (W/mK)', experimentTitle: 'Superkritisk CO2-tørking' },
      { id: 'm-8-2', timestamp: '2026-06-02', parameter: 'strength', value: 0.12, label: 'Trykkfasthet Aerogel', experimentTitle: 'Superkritisk CO2-tørking' }
    ]
  },
  {
    id: 'mat-9',
    name: 'Bio-Kull Binders-Kompositt (Biochar Asphalt & Concrete)',
    category: 'Plantebaserte',
    ownerId: 'res-7',
    description: 'Bærekraftig infrastruktur- og fundamentkompositt som benytter stabilisert bio-kull (pyrolysert skogsavfall) som erstatning for fossilt bitumen og sement-tilslag. Fungerer som en permanent karbonfelle i veier og kjellergulv.',
    chemicalComposition: 'Stabilisert aromatisk karbon-nettverk (>85% rent C), kalsiumsilikathydrater, naturlige bio-oljer.',
    biologicalComposition: '70% karbonisert Picea abies / Pinus sylvestris skogsbiomasse (bio-kull) bundet med plantebasert harpiks.',
    trl: 7,
    applicationAreas: ['Karbonnegative permeable dekker', 'Fundamentunderlag', 'Parkeringsarealer', 'Sykkelveier i trehusområder'],
    suppliers: ['VOW Green Metals', 'Veidekke Bio-Infrastruktur', 'NTNU Pyrolyse-Lab'],
    epd: {
      gwp: -3.4, // Ekstremt sterk karbonfelle!
      recycledContent: 95,
      lifetime: 100,
      circularity: 'Kan knuses og gjenbrukes uendelig som veitilslag eller jordforbedring i bioporter.'
    },
    testResults: {
      fire: 'Inert karbongitter; brenner ikke uten ekstern oksygenblåsing ved ekstreme temperaturer (>900°C).',
      moisture: 'Svært god dreneringsevne ved permeabel kornstørrelsesfordeling.',
      strength: 'Marshall-stabilitet på 12.5 kN, trykkfasthet opptil 18 MPa.',
      durability: 'Bio-kull er kjemisk ugjennomtrengelig for tinesalt og syre; råtner eller brytes aldri ned.',
      fireRating: 'Klasse A2-s1, d0',
      strengthMpa: 18.0,
      durabilityYears: 100
    },
    healthRisk: 'Binding av tunge partikler. Null utslipp av PAH eller flyktige aromatiske hydrokarboner etter pyrolyse ved 600°C.',
    articles: [
      {
        id: 'art-9-1',
        title: 'Carbon-negative infrastructure: Biochar as a functional filler in asphalt and concrete',
        authors: 'Amundsen, H., Dahl, J. & Rostova, E.',
        year: 2024,
        journal: 'Cleaner Materials',
        summary: 'Kvantifisering av sekvestrert CO2 per m3 bio-kulldekke i norske utbyggingsprosjekter.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-9-1',
        question: 'Hvilken korngradering på bio-kull gir den beste balansen mellom dreneringsevne og slitasjestyrke mot piggdekk?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-9-1',
        title: 'Slitasjemåling i spor-tester for bio-asfalt',
        hypothesis: 'Blanding med 20% bio-kull gir samme spordybdemotstand som standard ÅDT-1000 bitumen.',
        independentVariable: 'Bio-kull andel (10%, 20%, 30%)',
        dependentVariable: 'Spordybde etter 10 000 overfarter',
        status: 'Aktiv',
        startDate: '2026-04-12',
        logs: [
          '12.04.2026: Støpte 6 testplater.',
          '20.05.2026: Kjører 5 000 sykluser i Prall-maskin.'
        ]
      }
    ],
    measurements: [
      { id: 'm-9-1', timestamp: '2026-05-22', parameter: 'strength', value: 18.0, label: 'Marshall Stabilitet (kN)', experimentTitle: 'Slitasjemåling bio-asfalt' }
    ]
  },
  {
    id: 'mat-10',
    name: 'Sjøgress & Ålegress Isolasjonsmatter (Zostera Marina)',
    category: 'Plantebaserte',
    ownerId: 'res-3',
    description: 'Klassisk kystnært isolasjonsmateriale gjenopplivet for moderne miljøbygg. Høstet fra ilandskylt ålegress (Zostera marina) langs Skagerrak. Naturlig impregnert med havsalt som gir motstand mot brann, mugg og skadedyr.',
    chemicalComposition: 'Cellulose, hemicellulose, naturlige havsalt (NaCl, MgCl2), silikater, alginat-spor.',
    biologicalComposition: '100% tørket og renset Zostera marina-bladverk formet til tette isolasjonsmatter.',
    trl: 9,
    applicationAreas: ['Etasjeskillere', 'Kaldloft-isolering', 'Lydisolerende skillevegger', 'Rehabilitering av verneverdige trehus'],
    suppliers: ['SjøgressTech Mandal', 'Læsø Tangisolering', 'BioBuild Norge AS'],
    epd: {
      gwp: -1.7,
      recycledContent: 100,
      lifetime: 150,
      circularity: 'Fullstendig biologisk nedbrytbart uten kjemisk avfall.'
    },
    testResults: {
      fire: 'Havsaltinnholdet gjør at materialet bare ulmer langsomt uten å gi åpne flammer.',
      moisture: 'Hygroskopisk balanse. Tåler periodisk høy luftfuktighet uten å mugne pga. saltinnholdet.',
      strength: 'Elastisk matte med god gjenreisningsevne etter kompresjon.',
      durability: 'Dokumenterte eksempler i kystbygg fra 1800-tallet som fremdeles er Intakte etter 150 år.',
      fireRating: 'B-s1, d0',
      strengthMpa: 0.15,
      durabilityYears: 150
    },
    healthRisk: 'Ingen støv av farlige kjemikalier. Frisk, mild havduft som avtar over tid.',
    articles: [
      {
        id: 'art-10-1',
        title: 'Eelgrass (Zostera marina) as a circular and fire-resilient insulation material in Nordic architecture',
        authors: 'Rostova, E. & Lindqvist, A.',
        year: 2023,
        journal: 'Journal of Architectural Heritage',
        summary: 'Historisk og teknisk gjennomgang av ålegressets termiske isolasjonsevne (λ = 0,038 W/mK) og brannmotstand.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-10-1',
        question: 'Hvordan kan skånsom høsting av ilandskylt ålegress sertifiseres uten å forstyrre kystøkosystemene?',
        importance: 'Medium',
        status: 'Løst'
      }
    ],
    experiments: [],
    measurements: [
      { id: 'm-10-1', timestamp: '2026-04-10', parameter: 'moisture', value: 8.5, label: 'Relativ Fuktighetsbuffer (%)', experimentTitle: 'Sjøgress fukttest' }
    ]
  },
  {
    id: 'mat-11',
    name: 'Bakterielt Selvhelende Bio-Mørtel (Sporosarcina Pasteurii)',
    category: 'Alger & Bakterier',
    ownerId: 'res-2',
    description: 'Injisert repereasjonsmørtel for mur- og betongkonstruksjoner som bruker endosporer av Sporosarcina pasteurii til mikrobiologisk indusert kalsittutfelling (MICP). Tetter sprekker og gjenoppretter vanntetthet på 7 dager.',
    chemicalComposition: 'Kalsiumklorid, urea, kalsiumkarbonat, biosilikater, organisk hydrogel.',
    biologicalComposition: 'Innkapslede Sporosarcina pasteurii endosporer i leirepartikler med næringsmiddel.',
    trl: 8,
    applicationAreas: ['Sprekk-reparasjon i kystmurer', 'Kjellerfuktsikring', 'Historiske steinkonstruksjoner', 'Vannreservoarer'],
    suppliers: ['TU Delft Bio-Con', 'SINTEF Byggforsk', 'Heidelberg BioTech'],
    epd: {
      gwp: 45, // Lav karbonbelastning sammenlignet med epoksy eller mikrosement
      recycledContent: 60,
      lifetime: 120,
      circularity: 'Integreres sømløst i mineralsk matrise uten plastavfall.'
    },
    testResults: {
      fire: '100% ubrannbart mineralsk kalsiumkarbonat.',
      moisture: 'Reduserer vannpermeabilitet i sprekker med 99.4% etter 7 dagers bio-kalsifisering.',
      strength: 'Strekk- og trykkfasthet i fuge opptil 28 MPa.',
      durability: 'Kalsitt-krystallene vokser sammen med den opprinnelige steinen og er kjemisk stabile over 100+ år.',
      fireRating: 'Klasse A1',
      strengthMpa: 28.0,
      durabilityYears: 120
    },
    healthRisk: '100% trygt for drikkevannskilder. Ingen gifter, kjemiske epoksyer eller skadelige gasser.',
    articles: [
      {
        id: 'art-11-1',
        title: 'MICP-based bio-mortars for sustainable restoration of historic masonry and concrete',
        authors: 'Solberg, L. & Amundsen, H.',
        year: 2025,
        journal: 'Construction and Building Materials',
        summary: 'Måling av fugeheft og vanntetthet ved bruk av urea-kalsifiserende bakterier i kystnære norske murbygg.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-11-1',
        question: 'Kan vi erstatte ren urea med landbruksavfall for å gjøre urealysen 100% sirkulær?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-11-1',
        title: 'Urea-erstatning med organisk urin-derivat',
        hypothesis: 'Bruk av renset organisk restråstoff gir lik kalsittkrystallisasjonsrate som kjemisk urea.',
        independentVariable: 'Kilde til nitrogen/urea (Syntetisk urea vs Organisk derivat)',
        dependentVariable: 'Masse utfelt CaCO3 per gram bakteriebiomasse',
        status: 'Fullført',
        startDate: '2026-02-01',
        endDate: '2026-03-15',
        logs: [
          '01.02.2026: Klargjorde batcher med Sporosarcina pasteurii.',
          '15.03.2026: Kvantifiserte utfelt kalsitt via røntgen-diffraksjon (XRD).'
        ],
        results: 'Vellykket! Det organiske derivatet oppnådde 96% av krystallisasjonsraten til syntetisk urea, med 70% lavere karbonavtrykk.'
      }
    ],
    measurements: [
      { id: 'm-11-1', timestamp: '2026-03-16', parameter: 'strength', value: 28.1, label: 'Fuge-trykkfasthet (MPa)', experimentTitle: 'Urea-erstatning test' }
    ]
  },
  {
    id: 'mat-12',
    name: 'Sukkertare & Alginat Akustikkpaneler (Saccharina Latissima)',
    category: 'Alger & Bakterier',
    ownerId: 'res-9',
    description: 'Miljøvennlige, lydabsorberende dekorpaneler fremstilt av tørket sukkertare (Saccharina latissima) og bio-kryssoverlenket alginathydrogel. Gir spennende organisk tekstur og dokumentert støydemping i moderne kontor- og undervisningsbygg.',
    chemicalComposition: 'Natriumalginat, kalsiumklorid kryssoverlenker, fykokolloider, mannitol, naturlig jod og mineraler.',
    biologicalComposition: '75% tørket og varmebehandlet sukkertare fra trøndelagskysten og 25% bio-nedbrytbart alginatbindemiddel.',
    trl: 7,
    applicationAreas: ['Akustisk veggkledning', 'Lyddempende himlinger', 'Designmoduler i auditorium', 'Møteromspaneler'],
    suppliers: ['Seaweed Solutions AS', 'SINTEF Ocean', 'BioBuild Norge AS'],
    epd: {
      gwp: -1.3,
      recycledContent: 96,
      lifetime: 40,
      circularity: '100% komposterbar i organisk hagekompost.'
    },
    testResults: {
      fire: 'Inneholder naturlig høyt salt- og jodinnhold som gir selvslukkende egenskaper og forhindrer flammepredning.',
      moisture: 'Opprettholder sin akustiske dempingseffekt opp til 85% relativ fuktighet.',
      strength: 'Lydabsorpsjonskoeffisient αw = 0.85 (Klasse B akustikk). Bøyefasthet 4.2 MPa.',
      durability: 'Uforandret akustisk ytelse etter 10 års test i normalt inneklima.',
      fireRating: 'B-s1, d0',
      strengthMpa: 4.2,
      durabilityYears: 40
    },
    healthRisk: 'Null flyktige organiske forbindelser (VOC). Luktnøytralisert og overflatebehandlet med linolje.',
    articles: [
      {
        id: 'art-12-1',
        title: 'Macroalgae-based acoustic panels for sustainable indoor noise attenuation',
        authors: 'Vanebo, S. & Rostova, E.',
        year: 2025,
        journal: 'Applied Acoustics',
        summary: 'Eksperimentell måling av lydreduksjonsindeks for sukkertarepaneler i klangrom.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-12-1',
        question: 'Hvordan påvirker variasjoner i tarehøstings-sesongen panelets farge- og lydabsorpsjonsegenskaper?',
        importance: 'Medium',
        status: 'Åpen'
      }
    ],
    experiments: [
      {
        id: 'exp-12-1',
        title: 'Klangromstest av sukkertarepaneler med ulik overflatestruktur',
        hypothesis: 'Bølget overflate-tekstur vil øke lydabsorpsjonen i lavfrekvensområdet (125-250 Hz) med 25%.',
        independentVariable: 'Overflate-geometri (Glatt, Riflet, Bølget)',
        dependentVariable: 'Lydabsorpsjonskoeffisient (αw) i impedansrør',
        status: 'Aktiv',
        startDate: '2026-06-01',
        logs: [
          '01.06.2026: Støpte 12 akustikkplater med ulike overflatestrukturer.',
          '15.06.2026: Gjennomførte akustisk måling i impedansrøret på NTNU.'
        ]
      }
    ],
    measurements: [
      { id: 'm-12-1', timestamp: '2026-06-16', parameter: 'strength', value: 0.85, label: 'Lydabsorpsjonskoeffisient (αw)', experimentTitle: 'Klangromstest' }
    ]
  },
  {
    id: 'mat-13',
    name: 'Biolignin Sponplate uten Formaldehyd (LignoBond Wood)',
    category: 'Tre & Kork',
    ownerId: 'res-8',
    description: 'Miljøvennlig spon- og fiberplate der tradisjonelt kreftfremkallende formaldehydlim (UF/PF) er erstattet med 100% enzymatisk kryssoverlenket tre-lignin høstet fra norsk celluloseindustri (Borregaard LignoTech).',
    chemicalComposition: 'Enzymatisk aktivert kraft-lignin, glyoksal som bio-kryssbinder, cellulose, hemicellulose, naturlig furu-voks.',
    biologicalComposition: '88% gran- og furuspon fra norske sagbruk og 12% bio-basert lignin-lim.',
    trl: 8,
    applicationAreas: ['Møbelproduksjon', 'Innvendig veggbekledning', 'Bærende undertaksplater', 'Parkettunderlag'],
    suppliers: ['Borregaard AS', 'Norske Skog', 'BioBuild Norge AS'],
    epd: {
      gwp: -1.65,
      recycledContent: 92,
      lifetime: 60,
      circularity: 'Kan gjenbrukes direkte til ny sponplate eller brennes rent uten giftige gasser.'
    },
    testResults: {
      fire: 'Karboniserer langsomt; oppfyller standard klasse D-s2, d0 uten tilsetning av halogenerte brannhemmere.',
      moisture: 'Tykkelsessvelging etter 24t i vann er under 8% (i tråd med EN 317 for fuktbestandige plater).',
      strength: 'Tverrstrekkfasthet (internal bond) på 0.65 MPa, bøyefasthet på 16.5 MPa.',
      durability: 'Utmerket dimensjonsstabilitet over 60 års innvendig brukstid.',
      fireRating: 'Klasse D-s2, d0 / P5 fuktbestandig',
      strengthMpa: 16.5,
      durabilityYears: 60
    },
    healthRisk: 'E1 og CARB Phase 2 sertifisert med absolutt NULL utslipp av formaldehyd eller helseskadelige gasser.',
    articles: [
      {
        id: 'art-13-1',
        title: 'Formaldehyde-free particleboards bonded with enzymatically activated Kraft lignin',
        authors: 'Hauge, I., Dahl, J. & Jensen, M.',
        year: 2024,
        journal: 'ACS Industrial & Engineering Chemistry Research',
        summary: 'Optimering av pressetemperatur og enzymatisk oksidasjon for kraft-lignin som bindemiddel i sponplater.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-13-1',
        question: 'Kan pressetiden i varmpressen reduseres til under 10 sekunder per millimeter platetykkelse?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-13-1',
        title: 'Katalytisk akselerasjon av lignin-herding',
        hypothesis: 'Tilsetning av 1.5% bio-basert sitronsyre vil senke påkrevd herdetemperatur fra 190°C til 165°C.',
        independentVariable: 'Sitronsyre andel (0%, 0.5%, 1.5%, 2.5%)',
        dependentVariable: 'Tverrstrekkfasthet (Internal Bond) og herdetid',
        status: 'Fullført',
        startDate: '2026-03-01',
        endDate: '2026-04-10',
        logs: [
          '01.03.2026: Fremstilte 24 testplater med varierende syreinnhold.',
          '10.04.2026: Målte tverrstrekk på Zwick/Roell universalprüfmaschine.'
        ],
        results: '1.5% sitronsyre tillot senking av pressetemperatur til 170°C uten tap av indre binding (0.68 MPa oppnådd).'
      }
    ],
    measurements: [
      { id: 'm-13-1', timestamp: '2026-04-11', parameter: 'strength', value: 16.5, label: 'Bøyefasthet (MPa)', experimentTitle: 'Katalytisk akselerasjon' }
    ]
  },
  {
    id: 'mat-14',
    name: 'Bioluminesent Mycena Skilt- & Belysningspanel',
    category: 'Mykologiske',
    ownerId: 'res-1',
    description: 'Nyskapende selvlysende biologisk overflate-panel som benytter levende bioluminesente sopparter (Mycena chlorophos / Panellus stipticus) dyrket i transparent hydrogel. Gir mild grønn nødlysbelysning i rømningstraseer uten strømforbruk.',
    chemicalComposition: 'Luciferin, enzymet luciferase, kalsiumalginat, glyserol, kiselgel, mineralnæring.',
    biologicalComposition: 'Mycena chlorophos mycel-kultur integrert i en transparent, pustende silikon-alginat matrise.',
    trl: 5,
    applicationAreas: ['Nødlys-markering i trappeoppganger', 'Rømningsveier i kontorbygg', 'Arktiske utendørs stilykt-markører', 'Dekorative lyspaneler'],
    suppliers: ['NTNU BioLight Lab', 'BioBuild Norge AS', 'GlowBio Inc'],
    epd: {
      gwp: -0.8,
      recycledContent: 90,
      lifetime: 15,
      circularity: '100% biologisk nedbrytbar etter endt lys-syklus.'
    },
    testResults: {
      fire: 'Selvslukkende hydrogel-struktur.',
      moisture: 'Krever lukket, men pustende kapsling med 75-85% fuktighet for opprettholdelse av bioluminescens.',
      strength: 'Fleksibel, gummilignende overflateskinn.',
      durability: 'Kontinuerlig lysemisjon i opptil 180 dager per fôringssyklus.',
      fireRating: 'B-s1, d0',
      strengthMpa: 1.2,
      durabilityYears: 15
    },
    healthRisk: '100% ufarlige, ugifte soppkulturer uten helserisiko for bygningsbrukere.',
    articles: [
      {
        id: 'art-14-1',
        title: 'Bioluminescent fungal matrices for zero-energy ambient lighting in indoor spaces',
        authors: 'Jensen, M., Vanebo, S. & Solberg, L.',
        year: 2026,
        journal: 'Nature Biotechnology & Architecture',
        summary: 'Kvantifisering av lysintensitet (lux) og næringsstoff-levetid for Mycena-paneler i rømningsveier.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-14-1',
        question: 'Hvordan kan vi forlenge den kontinuerlige bioluminescens-syklusen til over 2 år ved faste næringsdepoter?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-14-1',
        title: 'Sakte-frigjørende næringskapsler for forlenger bioluminescens',
        hypothesis: 'Mikrokapsler med tre-sukker (trehalose) forlenger lysemisjonen fra 60 dager til 210 dager.',
        independentVariable: 'Kapselmateriale og trehalose-konsentrasjon',
        dependentVariable: 'Luminans (mcd/m2) målt med spektroradiometer over tid',
        status: 'Aktiv',
        startDate: '2026-05-10',
        logs: [
          '10.05.2026: Innkapslet Mycena chlorophos i 10 testmoduler.',
          '01.07.2026: Målte stabilt nødlys på 12 mcd/m2 etter 50 dagers kontinuerlig lysing.'
        ]
      }
    ],
    measurements: [
      { id: 'm-14-1', timestamp: '2026-07-02', parameter: 'strength', value: 12.0, label: 'Luminans Nødlys (mcd/m2)', experimentTitle: 'Sakte-frigjørende næringskapsler' }
    ]
  },
  {
    id: 'mat-15',
    name: 'Rekeskall-Chitosan Bio-Tettingsmembran (ChitoSeal Hydro)',
    category: 'Annet',
    ownerId: 'res-9',
    description: 'Slitesterk, fleksibel og vannfast vindsperre og tettingsmembran basert på bio-kryssoverlenket kitin og chitosan utvunnet fra norsk sjømatavfall (reke- og krabbeskall). Erstatter petrokjemiske polyuretan- og plastmembraner.',
    chemicalComposition: 'Deacetylert chitosan, sitronsyre kryssoverlenker, linolje-plastifiserer, naturlig silika-fyllstoff.',
    biologicalComposition: '82% kitin/chitosan fra rekeskall og 18% vegetabilske bio-mykknere.',
    trl: 7,
    applicationAreas: ['Vindsperre i trebygninger', 'Våtromsmembraner under flis', 'Tetting rundt vindusbeslag', 'Grønne tak-membraner'],
    suppliers: ['MareBio Norge AS', 'SINTEF Ocean', 'BioBuild Norge AS'],
    epd: {
      gwp: -1.9,
      recycledContent: 98,
      lifetime: 50,
      circularity: '100% biologisk nedbrytbar i kompostering etter endt levetid.'
    },
    testResults: {
      fire: 'Chitosan danner en naturlig brent karbonskorpe ved flammepåvirkning som hemmer brannspredning.',
      moisture: 'Vannadamptett (Sd-verdi > 50m) og tåler kontinuerlig vanntrykk opp til 3.5 bar.',
      strength: 'Strekkfasthet 24.5 MPa, bruddforlengelse 180%.',
      durability: 'Uforandret vannfasthet etter 1000 timers akselerert fukt- og UV- aldring.',
      fireRating: 'B-s1, d0',
      strengthMpa: 24.5,
      durabilityYears: 50
    },
    healthRisk: 'Null VOC-utslipp, ugiftig og naturnær overflate helt fri for ftalater og microplast.',
    articles: [
      {
        id: 'art-15-1',
        title: 'Chitosan-based bio-membranes for sustainable building envelope waterproofing',
        authors: 'Vanebo, S., Amundsen, H. & Jensen, M.',
        year: 2025,
        journal: 'Journal of Cleaner Production',
        summary: 'Kvantifisering av vannbarrierens effektivitet og elastisitet for kitin-baserte tettingsfolier.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-15-1',
        question: 'Hvordan reagerer membranen ved langvarig kontakt med ekstremt alkaliske betongoverflater?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-15-1',
        title: 'Alkalisk motstandstest av ChitoSeal på ung betong',
        hypothesis: 'Kryssoverlenking med sitronsyre hindrer hydrolyse ved pH 12.5 i minst 90 dager.',
        independentVariable: 'pH-verdi i eksponeringsbad (pH 9, pH 11, pH 12.5)',
        dependentVariable: 'Strekkfasthet (MPa) og masseendring over tid',
        status: 'Aktiv',
        startDate: '2026-06-05',
        logs: [
          '05.06.2026: Senket 18 teststrimler i alkalisk bad på kjemilaben.',
          '20.07.2026: Målte 95% opprettholdt strekkfasthet etter 45 dager.'
        ]
      }
    ],
    measurements: [
      { id: 'm-15-1', timestamp: '2026-07-21', parameter: 'strength', value: 24.5, label: 'Strekkfasthet Membran (MPa)', experimentTitle: 'Alkalisk motstandstest' }
    ]
  },
  {
    id: 'mat-16',
    name: 'Kullsopp Brannisolerende Mycel-Skumblokker (Daldinia ThermoFoam)',
    category: 'Mykologiske',
    ownerId: 'res-1',
    description: 'Nyskapende brannsikkert isolasjonsskum oppbygd av mycelnettverk fra kullsopp (Daldinia concentrica) grodd på pyrolysert trespon og bio-kull. Gir unik varmeisolering og oppnår klasse A2 brannmotstand.',
    chemicalComposition: 'Kitin, glucan, biokull-nanopartikler, kalsiumkarbonat, naturlige kiselmineraler.',
    biologicalComposition: '65% Daldinia-mycelium og 35% finsiktet bjørkebio-kull.',
    trl: 6,
    applicationAreas: ['Kjerneisolasjon i branndører', 'Passivhus fasadeisolasjon', 'Isolasjon rundt piper og kanaler', 'Lyddempende skillevegger'],
    suppliers: ['BioBuild Norge AS', 'SINTEF Byggforsk', 'Nordic MycoTech'],
    epd: {
      gwp: -2.4,
      recycledContent: 95,
      lifetime: 75,
      circularity: '100% sirkulær, kan knuses og brukes som jordforbedrende bio-kull etter bruk.'
    },
    testResults: {
      fire: 'Ekstremt brannresistent! Karboniserer uten røykutvikling ved 1000°C flammepåvirkning i 120 minutter.',
      moisture: 'Utrustet med fuktstoppende hydrofobe sporer som hindrer vannabsorpsjon.',
      strength: 'Trykkfasthet 3.8 MPa ved tetthet 110 kg/m3. Varmeledningsevne λ = 0.032 W/mK.',
      durability: 'Uforgjengelig mot råtesopp på grunn av det tette, pre-karboniserte mycelnettverket.',
      fireRating: 'A2-s1, d0 (Ubrennbar)',
      strengthMpa: 3.8,
      durabilityYears: 75
    },
    healthRisk: '100% inaktivt, varmebehandlet mycelium. Helt støvfritt og allergitestet.',
    articles: [
      {
        id: 'art-16-1',
        title: 'Fire-retardant mycelium-biochar composites for high-performance thermal insulation',
        authors: 'Jensen, M., Amundsen, H. & Rostova, E.',
        year: 2026,
        journal: 'Materials & Design',
        summary: 'Termisk konduktivitet og brannegenskaper for Daldinia-myceliumberiket biokullskum.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-16-1',
        question: 'Kan vi opskalere vertikal støping av 200mm tykke isolasjonsblokker i industriell skala?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-16-1',
        title: '120 minutters branntest etter ISO 834 standard kurve',
        hypothesis: '100mm skumblokk vil holde bakside-temperaturen under 60°C under 1000°C direkte gassflamme.',
        independentVariable: 'Blokk-tykkelse (50mm, 75mm, 100mm)',
        dependentVariable: 'Temperatur på skjermet bakside over 120 minutter',
        status: 'Fullført',
        startDate: '2026-04-01',
        endDate: '2026-05-15',
        logs: [
          '01.04.2026: Støpte og grodde 6 testblokker i klimakammer.',
          '15.05.2026: Gjennomførte branntest i brennkammeret på RISE Fire Research.'
        ],
        results: 'Vellykket! Baksidetemperaturen steg kun til 48.2°C etter 120 minutter ved 1000°C stigning.'
      }
    ],
    measurements: [
      { id: 'm-16-1', timestamp: '2026-05-16', parameter: 'strength', value: 3.8, label: 'Trykkfasthet Isolasjon (MPa)', experimentTitle: '120 min Branntest' }
    ]
  },
  {
    id: 'mat-17',
    name: 'Bakteriell Nanocellulose Bio-Glass (BC-Clear Window)',
    category: 'Alger & Bakterier',
    ownerId: 'res-6',
    description: 'Sømløst, ultra-transparent og ubruddbart nanostrukturert bio-glass fremstilt gjennom bakteriell fermentering av Komagataeibacter xylinus. Tilbyr 92% lysgjennomslipp med 5x høyere slagfasthet enn konvensjonelt glass.',
    chemicalComposition: 'Ren nanofibrillert cellulose (NFC), bio-epoksy kryssoverlenker fra linolje, kiselgel-reaktiv matrise.',
    biologicalComposition: '90% bakteriell cellulose produsert fra eplepressrester og 10% organiske tverrbindere.',
    trl: 7,
    applicationAreas: ['Drivhus-vinduer med høy isolasjon', 'Solfanger-dekkglass', 'Uknuselige dagslys-takvinduer', 'Innvendige glassvegger'],
    suppliers: ['BioBuild Norge AS', 'RISE Research Institutes', 'SkogBio Tech'],
    epd: {
      gwp: -2.1,
      recycledContent: 94,
      lifetime: 60,
      circularity: '100% resirkulerbar til nanocellulose-masser eller biologisk nedbrytbar.'
    },
    testResults: {
      fire: 'Selvslukkende nanostruktur med høy termisk stabilitet opp til 280°C.',
      moisture: 'Hydrofob nanocoating forhindrer kondensdannelse og dugg på glassoverflaten.',
      strength: 'Slagfasthet 85 kJ/m2 (uknuselig med standard hammerstøt). Bøyefasthet 140 MPa.',
      durability: 'Fullstendig UV-resistent uten gulning etter 5 års utendørs eksponeringstester.',
      fireRating: 'B-s1, d0 / U-verdi 0.6 W/m2K',
      strengthMpa: 140.0,
      durabilityYears: 60
    },
    healthRisk: '100% biokompatibelt og fritt for knusefare/skarpe skår.',
    articles: [
      {
        id: 'art-17-1',
        title: 'Optically transparent bacterial cellulose nanocomposites for energy-efficient glazing',
        authors: 'Lindqvist, A., Dahl, J. & Solberg, L.',
        year: 2025,
        journal: 'Advanced Functional Materials',
        summary: 'Fabrikasjon og optisk transmisjonsanalyse for tykke bakterielle cellulose-ruter.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-17-1',
        question: 'Hvordan kan vi optimalisere fermenteringstiden for å gro 10mm tykke plater på under 48 timer?',
        importance: 'Høy',
        status: 'Åpen'
      }
    ],
    experiments: [
      {
        id: 'exp-17-1',
        title: 'Slagfasthet- og hagl-simulering på BC-Clear glass',
        hypothesis: 'BC-Clear rute på 4mm tåler 40mm is-kuler skutt i 130 km/t uten sprekker.',
        independentVariable: 'Prosjektil-hastighet (80, 110, 130, 150 km/t)',
        dependentVariable: 'Deformasjonsdybde og overflatesprekk-oppkomst',
        status: 'Fullført',
        startDate: '2026-03-10',
        endDate: '2026-04-20',
        logs: [
          '10.03.2026: Fermenterte 12 BC-Clear testplater på nanolab.',
          '20.04.2026: Skjøt ispilarer mot platene med trykkluftkanon.'
        ],
        results: 'Ingen gjennomtrengning eller skår! Kun elastisk bulking opp til 150 km/t.'
      }
    ],
    measurements: [
      { id: 'm-17-1', timestamp: '2026-04-21', parameter: 'strength', value: 140.0, label: 'Bøyefasthet Bio-Glass (MPa)', experimentTitle: 'Hagl-simulering' }
    ]
  },
  {
    id: 'mat-18',
    name: 'Lav & Moss Bioreaktiv Fasadekledning (Cladonia BioFacade)',
    category: 'Plantebaserte',
    ownerId: 'res-4',
    description: 'Levende, bioklimatisk fasadepanel sammensatt av tørkeresistent reinlav (Cladonia stellaris) grodd på en resirkulert, porøs leca- og pumismatrise. Renser byluft for NOx, opptar CO2 og regulerer mikroklimaet rundt bygningen.',
    chemicalComposition: 'Usninsyre, kalsiumsilikat, porøs vulkansk leire, naturbaserte hydrogeler.',
    biologicalComposition: '70% levende Cladonia stellaris lav-kultur og 30% porøst bio-mineralsubstrat.',
    trl: 8,
    applicationAreas: ['Bærekraftige fasadepaneler', 'Støyskjermer langs motorveier', 'Grønne lunger i urbane strøk', 'Innvendige mosevegger'],
    suppliers: ['NaturMose AS', 'BioBuild Norge AS', 'NIBIO'],
    epd: {
      gwp: -3.2,
      recycledContent: 90,
      lifetime: 40,
      circularity: '100% sirkulær, regenererer seg selv ved naturlig regnvann.'
    },
    testResults: {
      fire: 'Inneholder naturlig høye fuktreserver og usninsyrer som virker brannhemmende.',
      moisture: 'Kan absorbere opptil 300% sin egen tørrvekt i regnvann uten drypping.',
      strength: 'Bøyefasthet 8.5 MPa i bæreplaten. Absorberer 12 dB luftbåren støy.',
      durability: 'Tåler arktiske vintre ned til -40°C og tilpasser seg tørkeperioder ved å gå i dvale.',
      fireRating: 'B-s2, d0',
      strengthMpa: 8.5,
      durabilityYears: 40
    },
    healthRisk: 'Aktiverer luftrensing; reduserer fint støv (PM2.5) og NOx i byrommet.',
    articles: [
      {
        id: 'art-18-1',
        title: 'Living lichen facade cladding for urban air purification and microclimate modulation',
        authors: 'Dahl, J., Lindqvist, A. & Amundsen, H.',
        year: 2026,
        journal: 'Building and Environment',
        summary: 'NOx-reduksjon og termisk isolasjonskapasitet for levende Cladonia-fasader i nordisk klima.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-18-1',
        question: 'Hvor raskt restituerer lavkulturene seg etter 60 dagers sammenhengende sommer-tørke?',
        importance: 'Medium',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-18-1',
        title: 'NOx-opptaksmåling i klimakammer med byforurensning',
        hypothesis: '1 m2 Cladonia BioFacade fjerner over 150 mg NO2 per døgn fra omgivelsesluften.',
        independentVariable: 'NO2-konsentrasjon (50 ppb, 100 ppb, 250 ppb)',
        dependentVariable: 'Reduksjonsrate (mg/m2/døgn) og klorofyll-fluorescens',
        status: 'Aktiv',
        startDate: '2026-05-01',
        logs: [
          '01.05.2026: Monterte 4 fasadepaneler i gasskammeret.',
          '15.06.2026: Målte gjennomsnittlig reduksjon på 182 mg NO2/m2/døgn.'
        ]
      }
    ],
    measurements: [
      { id: 'm-18-1', timestamp: '2026-06-16', parameter: 'strength', value: 8.5, label: 'Bøyefasthet Bæreplate (MPa)', experimentTitle: 'NOx-opptaksmåling' }
    ]
  },
  {
    id: 'mat-19',
    name: 'Flaksfiber-Bio-Kompositt (Linum Structural Beam)',
    category: 'Plantebaserte',
    ownerId: 'res-2',
    description: 'Strukturelle I-bjelker og profiler produsert av flettede nordiske lin-/flaksfibre impregnert med bio-epoksy basert på tallolje fra treforedling. Erstatter stål og aluminium i lette tak- og fasadebærende konstruksjoner med negativt karbonavtrykk.',
    chemicalComposition: 'Cellulosemikrofibriller (75%), hemicellulose (15%), furu-basert bio-epoksymatrise (10%).',
    biologicalComposition: 'Linum usitatissimum (dyrket lin/flaks) forsterket med talloljebindemiddel fra norsk skogsavfall.',
    trl: 7,
    applicationAreas: ['Bærende takbjelker', 'Fasadesøyler', 'Vindu- og dørkarmer', 'Modulære lettbærende rammer'],
    suppliers: ['Nordic Flax Tech AS', 'Bcomp Switzerland/Norway', 'NIBIO Ås'],
    provenTesting: {
      isVerified: true,
      tier: 'RISE Accredited',
      accreditationNumber: 'NO-RISE-2026-FLX902',
      verifiedDate: '2026-05-14',
      laboratory: 'RISE Fire & Structures Lab Trondheim',
      leadInspector: 'Prof. Lars Solberg (RISE-sertifisert)',
      reproducibilityScore: 98.7,
      confidenceInterval: '95% KI (± 0.03)',
      passedStandards: [
        'NS-EN 1995-1-1 (Eurokode 5 Tre & Komposittkonstruksjoner)',
        'NS-EN 13501-1 (Brannklasse B-s1, d0)',
        'ASTM D3039 (Strekkfasthet for Polymerkompositter)',
        'ISO 14044 (Livsløpsvurdering EPD)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -1.4,
      recycledContent: 90,
      lifetime: 80,
      circularity: 'Termisk gjenvinnbar eller 100% bio-komposterbar etter kjemisk hydrolyse.'
    },
    testResults: {
      fire: 'Behandlet med naturlig kalsiumborat forsinker. Oppnår B-s1, d0 uten giftige halogenholdige kjemikalier.',
      moisture: 'Hydrofobisk herdet overflate. Vannabsorpsjon < 1.8% etter 48t nedsenking.',
      strength: 'Meget høy strekk- og bøyefasthet. 18.5 MPa strekkfasthet i fiberretning, elastisitetsmodul 14 GPa.',
      durability: 'UV-stabilisert med naturlig kvae. Testet for 80 års levetid i tøft nordisk kystklima.',
      fireRating: 'B-s1, d0',
      strengthMpa: 18.5,
      durabilityYears: 80,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: '100% formaldehyd- og isocyanatfri. Ingen VOC-avdamping i inneklima.',
    articles: [
      {
        id: 'art-19-1',
        title: 'Structural flax composite I-beams in load-bearing architecture: Creep and fatigue under cyclic loading',
        authors: 'Solberg, L., Amundsen, H. & Lindqvist, A.',
        year: 2026,
        journal: 'Composites Part B: Engineering',
        summary: 'Dokumenterer at flettede flaksfiberbjelker har overlegen vibrasjonsdemping og 85% lavere vekt enn stålkonstruksjoner.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-19-1',
        question: 'Hvordan påvirkes langtids siging (kryp) ved permanent 95% relativ luftfuktighet over 10 år?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-19-1',
        title: '4-punkts bøyebelastningstest og knekking under 20 kN last',
        hypothesis: 'Bjelkeprofilen tåler over 20 kN punktlast i midtspenn uten delaminering mellom flens og steg.',
        independentVariable: 'Punktlast (kN) fra 5 til 25 kN med 0.5 kN/s hastighet',
        dependentVariable: 'Nedbøyning (mm) og akustisk emisjon for mikroskopisk fibersprekk',
        status: 'Fullført',
        startDate: '2026-04-10',
        endDate: '2026-05-12',
        results: 'Brudd oppstod først ved 24.8 kN. Bøyestivhet EI = 420 kNm² bekreftet.',
        logs: [
          '10.04.2026: Kalibrerte ZwickRoell 100 kN testrigg.',
          '28.04.2026: Gjennomførte 100 000 sykliske utmattelseslaster.',
          '12.05.2026: Endelig bruddtest gjennomført med video-opptak.'
        ]
      }
    ],
    measurements: [
      { id: 'm-19-1', timestamp: '2026-05-12', parameter: 'strength', value: 18.5, label: 'Maks Bøyefasthet (MPa)', experimentTitle: '4-punkts bøyebelastningstest' },
      { id: 'm-19-2', timestamp: '2026-05-14', parameter: 'gwp', value: -1.4, label: 'Netto EPD GWP (kg CO2 eq/kg)', experimentTitle: 'Livsløpsanalyse RISE' }
    ]
  },
  {
    id: 'mat-20',
    name: 'Mose- og Lavbasert Bio-Filterkledning (Cladonia Living Wall)',
    category: 'Plantebaserte',
    ownerId: 'res-1',
    description: 'Levende og stabiliserte akustikk- og rensepaneler bygget på reinlav (Cladonia stellaris) og torvmose. Regulerer luftfuktighet passivt og fjerner 88% av luftbårne VOC-gasser, formaldehyd og svevestøv i inneluften.',
    chemicalComposition: 'Usninsyre (naturlig antibakteriell), kitin-lignende lavvegger, polysakkarider og glyserin-mineralstabilisator.',
    biologicalComposition: '100% viltvoksende Cladonia stellaris (kvitkrull) fra Rendalen, bundet på perforert treplate.',
    trl: 8,
    applicationAreas: ['Innvendig støyreduksjon', 'Biofilisk luftrensing', 'Skillevegger i kontorlandskap', 'Soveromsfuktbuffere'],
    suppliers: ['Nordic Moss Design AS', 'BioFilter Norge', 'NIBIO Skog'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-MOSS41',
      verifiedDate: '2026-03-22',
      laboratory: 'SINTEF Byggforsk Akustikklab Oslo',
      leadInspector: 'Dr. Marianne Jensen (SINTEF-godkjent)',
      reproducibilityScore: 99.2,
      confidenceInterval: '99% KI (± 0.01)',
      passedStandards: [
        'ISO 354 (Måling av Lydabsorpsjon i Etterklangrom - Klasse A)',
        'NS-EN 13501-1 (Brannklasse B-s1, d0)',
        'ISO 16000-9 (Emisjonstesting av Flyktige Organiske Forbindelser)',
        'BREEAM-NOR v6.0 (Kriterier for Naturlig Inneklima)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -0.9,
      recycledContent: 95,
      lifetime: 30,
      circularity: 'Fullstendig komposterbar til næringsrik humus.'
    },
    testResults: {
      fire: 'Inneholder naturlige mineralsalter som forhindrer flammestiftelse (B-s1, d0).',
      moisture: 'Svært høy hygroskopisitet: Opptar og avgir opptil 35% fukt uten vekst av skadelig mugg pga. usninsyre.',
      strength: 'Lav mekanisk bæreevne (0.15 MPa). Kledningselement uten bærende funksjon.',
      durability: 'Krever ingen vanning eller sollys. Beholder farge og elastisitet i minimum 30 år innendørs.',
      fireRating: 'B-s1, d0',
      strengthMpa: 0.15,
      durabilityYears: 30,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: false,
      provenDurabilityMark: true
    },
    healthRisk: 'Hypoallergenisk, ingen pollen og forbedrer astma-indeks i inneluft.',
    articles: [
      {
        id: 'art-20-1',
        title: 'Passive biofiltration and acoustics of stabilized lichen walls in modern wooden schools',
        authors: 'Jensen, M. & Vanebo, S.',
        year: 2026,
        journal: 'Indoor and Built Environment',
        summary: 'Målinger fra 12 klasserom i Trondheim viste 40% reduksjon i etterklangstid og markant lavere CO2- og formaldehydopphopning.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-20-1',
        question: 'Hvor ofte bør saltstabilisatoren fornyes ved ekstremt tørt vinterklima (< 20% RF)?',
        importance: 'Lav',
        status: 'Løst'
      }
    ],
    experiments: [
      {
        id: 'exp-20-1',
        title: 'Akustisk absorpsjonstest i fullskala etterklangskammer',
        hypothesis: 'Panelene oppnår NRC > 0.90 og absorpsjonsklasse A over 500-4000 Hz frekvensbåndet.',
        independentVariable: 'Paneltetthet (4 kg/m², 6 kg/m², 8 kg/m²)',
        dependentVariable: 'Lydabsorpsjonskoeffisient alpha_s per tersbånd',
        status: 'Fullført',
        startDate: '2026-02-10',
        endDate: '2026-03-18',
        results: 'Vektet absorpsjonskoeffisient alpha_w = 0.95 (Klasse A) verifisert.',
        logs: [
          '10.02.2026: Monterte 12 m² testflate i etterklangsrommet.',
          '18.03.2026: SINTEF Akustikk utstedte offisielt kalibreringssertifikat.'
        ]
      }
    ],
    measurements: [
      { id: 'm-20-1', timestamp: '2026-03-18', parameter: 'moisture', value: 34.0, label: 'Maks Hygroskopisk Bufferkapasitet (%)', experimentTitle: 'Akustisk absorpsjonstest' }
    ]
  },
  {
    id: 'mat-21',
    name: 'FungiCrete Komprimert Mycelium-Treblokk (Pleurotus Ostreatus)',
    category: 'Mykologiske',
    ownerId: 'res-1',
    description: 'Høytrykkskomprimert mycelium-matrise dyrket med østerssopp (Pleurotus ostreatus) og bjørkeflis. Varmeherdet til halvbærende murblokker med enestående termisk og mekanisk stabilitet for Alive Houses.',
    chemicalComposition: 'Tettvevd beta-glukan kitinettverk, lignocellulose og polymeriserte proteiner.',
    biologicalComposition: 'Pleurotus ostreatus mycelium sammengrodd med 80% resirkulert norsk bjørk- og oreflis.',
    trl: 6,
    applicationAreas: ['Ikke-bærende innervegger', 'Akustiske skillemoduler', 'Termisk brannskille', 'Sirkulære innredningsblokker'],
    suppliers: ['MycoBuild Nordic', 'NTNU Biopolymer', 'Alive Houses R&D'],
    provenTesting: {
      isVerified: true,
      tier: 'BioBuild Certified',
      accreditationNumber: 'NO-BIOBUILD-2026-FNG88',
      verifiedDate: '2026-06-02',
      laboratory: 'BioBuild Advanced Testing Facility & NTNU Lab',
      leadInspector: 'Dr. Marianne Jensen & Dr. Johan Dahl',
      reproducibilityScore: 97.4,
      confidenceInterval: '95% KI (± 0.05)',
      passedStandards: [
        'NS-EN 772-1 (Prøvingsmetoder for Murverk - Trykkfasthet)',
        'ISO 8301 (Bestemmelse av Varmemotstand og Termisk Konduktivitet)',
        'ISO 1182 (Ikke-brennbarhetstest for Byggematerialer)',
        'NS-EN ISO 717-1 (Lydisolasjon i Bygninger)'
      ],
      badgeLevel: 'Emerald'
    },
    epd: {
      gwp: -1.8,
      recycledContent: 98,
      lifetime: 60,
      circularity: 'Kan gjenbrukes som bygningsfyll eller komposteres 100% etter levetid.'
    },
    testResults: {
      fire: 'Forkuller ved 450°C og danner en isolerende keramisk barriere. EI 60 brannmotstand.',
      moisture: 'Impregnert med bio-voks; tåler 85% RF uten dimensjonsendring.',
      strength: 'Trykkfasthet på 3.4 MPa, overgår standard porebetong (Leca/Ytong lettblokker).',
      durability: 'Stabil over 60 år i innendørs klimasone. Inaktivert med 90°C tørrvarme.',
      fireRating: 'Class B-s1, d0 / EI 60',
      strengthMpa: 3.4,
      durabilityYears: 60,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Null utslipp, 100% fri for giftige bindemidler eller formaldehyd.',
    articles: [
      {
        id: 'art-21-1',
        title: 'High-density compressed fungal blocks: Mechanical scaling and thermal conductivity optimization',
        authors: 'Jensen, M., Dahl, J. & Rostova, E.',
        year: 2026,
        journal: 'Materials & Design',
        summary: 'Optimalisering av presstrykk og varmebehandling resulterte i 3.4 MPa trykkfasthet med lambda-verdi 0.042 W/mK.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-21-1',
        question: 'Hva er den mest energieffektive tørkemetoden for storskala industriell produksjon?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-21-1',
        title: 'Langtids fuktighetsbelastning og trykkfasthet ved 90% RF',
        hypothesis: 'Trykkfastheten forblir over 3.0 MPa etter 90 dager i fuktkammer.',
        independentVariable: 'Eksponeringstid i fuktkammer (0, 30, 60, 90 dager)',
        dependentVariable: 'Trykkfasthet (MPa) og overflatesoppdannelse',
        status: 'Aktiv',
        startDate: '2026-05-01',
        logs: [
          '01.05.2026: Plasserte 20 testblokker i fuktkammer (20°C, 90% RF).',
          '01.06.2026: 30-dagers test: 3.35 MPa trykkfasthet, null muggvekst registrert.'
        ]
      }
    ],
    measurements: [
      { id: 'm-21-1', timestamp: '2026-06-01', parameter: 'strength', value: 3.4, label: 'Målt Trykkfasthet (MPa)', experimentTitle: 'Langtids fuktighetsbelastning' },
      { id: 'm-21-2', timestamp: '2026-06-02', parameter: 'gwp', value: -1.8, label: 'LCA Karbonlagring (kg CO2 eq/kg)', experimentTitle: 'BioBuild LCA Validering' }
    ]
  },
  {
    id: 'mat-22',
    name: 'Bakteriell Kalsitt-Sandstein (MICP BioStone)',
    category: 'Alger & Bakterier',
    ownerId: 'res-2',
    description: 'Kaldherdet bio-kalkstein skapt ved mikrobiologisk indusert kalsittutfelling (MICP) med Sporosarcina pasteurii. Omdanner lokalt sand og pukk til solide byggesteiner uten energikrevende sementbrenning.',
    chemicalComposition: '95% Kalsiumkarbonat (kalsittkrystaller CaCO3), 5% kvartssand (SiO2) og biologisk restmasse.',
    biologicalComposition: 'Sporosarcina pasteurii bakteriekulturer stimulert med naturlig urea og kalsiumklorid.',
    trl: 7,
    applicationAreas: ['Bærende fasadeblokker', 'Belegningsstein', 'Kystsikring', 'Støttemurer'],
    suppliers: ['BioStone Technologies AS', 'SINTEF Betonglab', 'NTNU Konstruksjonsteknikk'],
    provenTesting: {
      isVerified: true,
      tier: 'ISO/EN Standard',
      accreditationNumber: 'NO-ISO-2026-MICP505',
      verifiedDate: '2026-04-19',
      laboratory: 'SINTEF Structural Materials Lab & NTNU Sementlab',
      leadInspector: 'Prof. Lars Solberg (ISO 17025 Lead Auditor)',
      reproducibilityScore: 98.9,
      confidenceInterval: '95% KI (± 0.02)',
      passedStandards: [
        'NS-EN 12390-3 (Trykkfasthet for Herdet Betong og Stein)',
        'NS-EN 1338 (Belegningsstein av Betong - Krav og Prøvingsmetoder)',
        'NS-EN 13755 (Vannabsorpsjon ved Atmosfærisk Trykk)',
        'ISO 14040 (Livsløpsvurdering for Byggestein)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -0.6,
      recycledContent: 88,
      lifetime: 120,
      circularity: '100% resirkulerbar som tilslag i ny biobetong eller fyllmasse.'
    },
    testResults: {
      fire: 'Klasse A1 Ubrennbar naturstein. Tåler over 1000°C uten sprekking eller gassavgivelse.',
      moisture: 'Ekstremt lav vannabsorpsjon (< 3.2%). Svært god frostbestandighet (56 fryse/tine-sykluser bestått).',
      strength: 'Trykkfasthet på 24.5 MPa, tilsvarende standard C25 konstruksjonsbetong.',
      durability: 'Eksepsjonell levetid på 120+ år. Kalsittbindingene styrkes over tid i kontakt med fukt og CO2.',
      fireRating: 'A1 (Ubrennbar)',
      strengthMpa: 24.5,
      durabilityYears: 120,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Helt mineralsk, inaktiv etter fullført kalsifisering. Trygt for drikkevannskontakt.',
    articles: [
      {
        id: 'art-22-1',
        title: 'Microbial induced calcite precipitation (MICP) for zero-emission sandstone block manufacturing',
        authors: 'Solberg, L., Rostova, E. & Lindqvist, A.',
        year: 2026,
        journal: 'Cement and Concrete Research',
        summary: 'Gjennombrudd innen enzymatisk akselerert bakterievekst som halverer herdetiden fra 14 dager til 36 timer.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-22-1',
        question: 'Kan vi erstatte laboratoriedyrket urea med nitrogenrikt overskuddsvann fra landbruket?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-22-1',
        title: 'Trykkprøving og knekklast etter 56 fryse-/tinesykluser i saltvann',
        hypothesis: 'Trykkfastheten forblir over 22 MPa uten avskalling etter tøff kysteksponering.',
        independentVariable: 'Antall fryse/tine-sykluser (-20°C til +20°C i 3% NaCl)',
        dependentVariable: 'Masseavskalling (g/m²) og gjenværende trykkfasthet (MPa)',
        status: 'Fullført',
        startDate: '2026-03-01',
        endDate: '2026-04-15',
        results: 'Resultat: 24.5 MPa trykkfasthet, masseavskalling < 15 g/m² (Krav < 200 g/m²).',
        logs: [
          '01.03.2026: Klargjorde 12 bio-sandsteinsprismer i klimakammer.',
          '15.04.2026: SINTEF Betonglab bekreftet bestått test.'
        ]
      }
    ],
    measurements: [
      { id: 'm-22-1', timestamp: '2026-04-15', parameter: 'strength', value: 24.5, label: 'Målt Trykkfasthet (MPa)', experimentTitle: 'Trykkprøving og knekklast' },
      { id: 'm-22-2', timestamp: '2026-04-18', parameter: 'gwp', value: -0.6, label: 'Netto EPD Karbonregnskap (kg CO2 eq/kg)', experimentTitle: 'Livsløpsanalyse MICP' }
    ]
  },
  {
    id: 'mat-23',
    name: 'Grankvae- & Bivoksbasert Hydrofobisk Trebeskyttelse (Nordic Resin Shield)',
    category: 'Tre & Kork',
    ownerId: 'res-8',
    description: 'Løsemiddelfri, 100% naturlig dypimpregnering for trevirke laget av oppvarmet grankvae (Picea abies harpiks), rå linolje og ren bivoks. Beskytter fasader og terrassebord mot råtesopp i over 70 år uten giftig kobber eller kreosot.',
    chemicalComposition: 'Abietinsyre (resin/harpiks), linolensyre-triglyserider, palmitinsyre-estere (bivoks).',
    biologicalComposition: 'Ren harpiks tappet fra norsk gran, kaldpresset linolje fra Østfold og bivoks fra lokale birøktere.',
    trl: 8,
    applicationAreas: ['Utvendig trekledning', 'Terrassedekker', 'Vannkantkonstruksjoner', 'Vindussnekkeri'],
    suppliers: ['Nordic Resin Works', 'Norsk Treteknisk Institutt', 'Trebåt- & Byggvern AS'],
    provenTesting: {
      isVerified: true,
      tier: 'RISE Accredited',
      accreditationNumber: 'NO-RISE-2026-RES774',
      verifiedDate: '2026-02-15',
      laboratory: 'RISE Treteknisk Laboratorium Stockholm/Trondheim',
      leadInspector: 'Dr. Ingrid Hauge & Dr. Sindre Vanebo',
      reproducibilityScore: 99.4,
      confidenceInterval: '99% KI (± 0.01)',
      passedStandards: [
        'NS-EN 335 (Holdbarhet for Tre og Trebaserte Produkter - Bruksklasse 3 & 4)',
        'NS-EN 113 (Laboratorieprøving av Trebeskyttelsesmidler mot Råtesopp)',
        'EN 927-6 (Maling og Lakk for Utvendig Tre - Akselerert Væring QUV)',
        'NS-EN 13501-1 (Brannklasse B-s1, d0 på Tett Kledning)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -2.3,
      recycledContent: 100,
      lifetime: 70,
      circularity: 'Forblir 100% biologisk nedbrytbar og komposterbar.'
    },
    testResults: {
      fire: 'Inneholder naturlige mineraliserte harpikssalter som oppnår B-s1, d0 på tett kledning.',
      moisture: 'Kontaktvinkel mot vann: 118° (superhydrofobisk perleeffekt). Fuktopptak redusert med 92%.',
      strength: 'Øker overflatehardheten til furu og gran med 35% (Brinell-hardhet 2.8 HB).',
      durability: 'Bestått 2000 timers akselerert kystværtest (Nordic Climate Simulator) uten overflateoppsprekking.',
      fireRating: 'B-s1, d0',
      strengthMpa: 12.0,
      durabilityYears: 70,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Giftfri, matgodkjent og avgir en behagelig duft av naturlig norsk barskog.',
    articles: [
      {
        id: 'art-23-1',
        title: 'Deep penetration mechanisms of bio-hot-oil pine resin in Scots pine sapwood',
        authors: 'Hauge, I., Vanebo, S. & Amundsen, H.',
        year: 2026,
        journal: 'Holzforschung',
        summary: 'Mikro-CT skanning viser 100% cellelumina-fylling opp til 12 mm dybde i furu-yteved.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-23-1',
        question: 'Hva er den maksimale tørketiden før overflaten er fullstendig klebefri ved lave temperaturer (+5°C)?',
        importance: 'Medium',
        status: 'Løst'
      }
    ],
    experiments: [
      {
        id: 'exp-23-1',
        title: 'QUV akselerert aldringstest med UV-stråling og saltvannssprut',
        hypothesis: 'Trekledningen beholder vannavvisende kontaktvinkel > 100° etter 2000 timers QUV-syklus.',
        independentVariable: 'Harpikskonsentrasjon i linoljeblandingen (20%, 35%, 50%)',
        dependentVariable: 'Vannkontaktvinkel, fargeendring (Delta E) og soppkolonisering',
        status: 'Fullført',
        startDate: '2025-11-01',
        endDate: '2026-02-05',
        results: '35% harpiksblanding opprettholdt 118° kontaktvinkel og null soppangrep.',
        logs: [
          '01.11.2025: Startet 2000-timers syklus i QUV-kammer.',
          '05.02.2026: RISE utstedte offisiell godkjenning for Bruksklasse 4.'
        ]
      }
    ],
    measurements: [
      { id: 'm-23-1', timestamp: '2026-02-05', parameter: 'moisture', value: 92.0, label: 'Fuktavvisningsgrad (%)', experimentTitle: 'QUV akselerert aldringstest' },
      { id: 'm-23-2', timestamp: '2026-02-15', parameter: 'gwp', value: -2.3, label: 'LCA Karbonbinding (kg CO2 eq/kg)', experimentTitle: 'RISE EPD Verifisering' }
    ]
  },
  {
    id: 'mat-24',
    name: 'Gjenvunnet Dun- & Fjærkompositt for Akustikkdemping (BioFeather Aero)',
    category: 'Annet',
    ownerId: 'res-4',
    description: 'Superlette, akustikk- og varmeisolerende matter produsert av sterilisert og kjemisk kryssbundet overskuddsfjær og dun fra landbruket. Utnytter keratinets hule mikrostruktur for overlegen lyd- og varmeisolasjon i Alive Houses.',
    chemicalComposition: 'Alfa-keratin (91%), svovel-kryssbundne disulfidbroer, bio-polymermatrise (9%).',
    biologicalComposition: '100% resirkulerte fjær fra norsk fjørfeproduksjon, termisk bundet med polylaktid (PLA).',
    trl: 7,
    applicationAreas: ['Lydisolasjon i etasjeskillere', 'Innvendig støyabsorpsjon', 'Ytterveggsisolasjon', 'Akustiske himlingsplater'],
    suppliers: ['BioFeather Nordic AS', 'SINTEF Akustikk', 'Nortura Sirkulær'],
    provenTesting: {
      isVerified: true,
      tier: 'BioBuild Certified',
      accreditationNumber: 'NO-BIOBUILD-2026-FTH12',
      verifiedDate: '2026-07-10',
      laboratory: 'BioBuild Acoustic & Thermal Lab & SINTEF Byggforsk',
      leadInspector: 'Dr. Elena Rostova & Dr. Marianne Jensen',
      reproducibilityScore: 98.1,
      confidenceInterval: '95% KI (± 0.03)',
      passedStandards: [
        'ISO 11654 (Akustikk - Lydabsorbenter for Bygninger - Vurdering av Lydabsorpsjon)',
        'NS-EN 12667 (Termisk Ytelse for Byggematerialer - Lambda 0.031 W/mK)',
        'NS-EN 13501-1 (Brannklassifisering B-s1, d0)',
        'OEKO-TEX Standard 100 (Klasse 1 Trygg for Inneklima)'
      ],
      badgeLevel: 'Emerald'
    },
    epd: {
      gwp: -1.5,
      recycledContent: 96,
      lifetime: 50,
      circularity: 'Kan gjenvinnes til ny isolasjon eller omdannes til nitrogenrik gjødsel.'
    },
    testResults: {
      fire: 'Keratin forkuller naturlig ved antennelse og kveler flammer (selvslukkende, B-s1, d0).',
      moisture: 'Fuktavvisende nanostruktur på fjæroverflaten hindrer oppbløting. Dampåpen (mu = 1.2).',
      strength: 'Kompresjonselastisk med 95% gjenvinning etter 50 kPa belastning.',
      durability: 'Behandlet mot møll med naturlig lavendel- og neemoljeekstrakt. 50 års funksjonsgaranti.',
      fireRating: 'B-s1, d0',
      strengthMpa: 0.35,
      durabilityYears: 50,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: false,
      provenDurabilityMark: true
    },
    healthRisk: 'Grundig vasket og dampsterilisert på 130°C. 100% hypoallergenisk.',
    articles: [
      {
        id: 'art-24-1',
        title: 'Thermal insulation and acoustic attenuation of upcycled poultry feather keratin mats',
        authors: 'Rostova, E., Jensen, M. & Amundsen, H.',
        year: 2026,
        journal: 'Journal of Cleaner Production',
        summary: 'Viser 20% bedre varmeisolasjon (lambda = 0.031 W/mK) enn konvensjonell mineralull av samme tetthet.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-24-1',
        question: 'Hva er den mest kostnadseffektive metoden for storskala hydrofobisk nanobehandling av råfjær?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-24-1',
        title: 'Måling av trinnlydsreduksjon (Delta L_w) i trebjelkelag',
        hypothesis: 'BioFeather Aero matten gir minst 28 dB trinnlydsreduksjon i etasjeskille av massivtre.',
        independentVariable: 'Isolasjonstykkelse (25 mm, 50 mm, 75 mm)',
        dependentVariable: 'Vektet trinnlydsforbedringstall Delta L_w (dB)',
        status: 'Fullført',
        startDate: '2026-06-01',
        endDate: '2026-07-05',
        results: '50 mm matte oppnådde Delta L_w = 31 dB, overgikk alle TEK17-krav.',
        logs: [
          '01.06.2026: Monterte prøvefelt i akkreditert akustikklab.',
          '05.07.2026: Fullførte trinnlydsmålinger med standard bankeapparat.'
        ]
      }
    ],
    measurements: [
      { id: 'm-24-1', timestamp: '2026-07-05', parameter: 'strength', value: 0.35, label: 'Kompresjonsmotstand (MPa)', experimentTitle: 'Måling av trinnlydsreduksjon' },
      { id: 'm-24-2', timestamp: '2026-07-10', parameter: 'gwp', value: -1.5, label: 'Sirkulært GWP Utslippstall (kg CO2 eq/kg)', experimentTitle: 'BioBuild LCA Validering' }
    ]
  },
  {
    id: 'mat-25',
    name: 'Silica-anriket Diatomejord- og Alginatpuss (Diatomite BioPlaster)',
    category: 'Alger & Bakterier',
    ownerId: 'res-3',
    description: 'Pustende og luftrensende innvendig dekorpuss fremstilt av fossilt diatomé-skall (kiselalger) bundet med bruntarealginat og hvitkalk. Har mikroskopisk nano-porøsitet som absorberer lukt, fukt og formaldehyd i rommet.',
    chemicalComposition: 'Amorf biogen silika (SiO2 · nH2O), kalsiumhydroksid, natriumalginat og glimmer.',
    biologicalComposition: 'Fossile kiselalger (Bacillariophyceae) forsterket med Laminaria hyperborea alge-ekstrakt.',
    trl: 8,
    applicationAreas: ['Innvendig veggpuss', 'Baderomsvegger uten direkte sprut', 'Kjellerrehabilitering', 'Soverom og oppholdsrom'],
    suppliers: ['Nordic Diatomite Plaster', 'SINTEF Kjemilab', 'AlgeBygg Norge AS'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-DIA93',
      verifiedDate: '2026-05-30',
      laboratory: 'SINTEF Byggforsk Inneklimagruppe & Norsk Treteknisk Institutt',
      leadInspector: 'Dr. Elena Rostova & Dr. Sindre Vanebo',
      reproducibilityScore: 99.6,
      confidenceInterval: '99% KI (± 0.008)',
      passedStandards: [
        'JIS A 1470-1 (Fuktbufferkapasitet for Byggematerialer > 250 g/m²)',
        'NS-EN 15824 (Spesifikasjon for Utvendig og Innvendig Puss basert på Organiske Bindemidler)',
        'ISO 16000-3 (Måling av Formaldehyd og Andre Karbonylforbindelser)',
        'NS-EN 13501-1 (Brannklasse A1 - Ubrennbart)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -0.8,
      recycledContent: 85,
      lifetime: 60,
      circularity: 'Kan knuses og returneres til jorden som kisel-jordforbedring.'
    },
    testResults: {
      fire: 'A1 Ubrennbar mineral-algepuss. Utvikler null røyk eller giftige gasser.',
      moisture: 'Verdensledende fuktbuffer: Tar opp 3 ganger mer fuktighet enn leirpuss ved 90% RF.',
      strength: 'Høy vedheft (1.2 MPa på mur/tre) og bøyestrekkfasthet 2.8 MPa.',
      durability: 'Høyt alkalisk pH-nivå (pH > 11) forhindrer mugg- og soppvekst permanent.',
      fireRating: 'A1 (Ubrennbar)',
      strengthMpa: 2.8,
      durabilityYears: 60,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Null VOC, absorberer aktivt formaldehyd fra møbler og forbedrer inneklimaet markant.',
    articles: [
      {
        id: 'art-25-1',
        title: 'Hygroscopic buffering and indoor formaldehyde remediation of diatomite-alginate interior plasters',
        authors: 'Rostova, E., Vanebo, S. & Jensen, M.',
        year: 2026,
        journal: 'Building and Environment',
        summary: 'Dokumenterte 72% reduksjon av toppfuktighet i baderomsmiljø og 90% adsorpsjon av formaldehyd i løpet av 24 timer.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-25-1',
        question: 'Hvordan påvirkes pussens fargebestandighet ved direkte eksponering for intens sol over 15 år?',
        importance: 'Lav',
        status: 'Løst'
      }
    ],
    experiments: [
      {
        id: 'exp-25-1',
        title: 'Dynamisk fuktkammertesting etter Nordtest-protokollen',
        hypothesis: 'Fuktbufferverdien (MBV) er over 2.5 g/(m² · %RF), som kvalifiserer til klassen Excellent.',
        independentVariable: 'Pusstykkelse (4 mm, 8 mm, 12 mm)',
        dependentVariable: 'Moisture Buffer Value (MBV) ved 8t 75% RF / 16t 33% RF syklus',
        status: 'Fullført',
        startDate: '2026-04-10',
        endDate: '2026-05-25',
        results: 'MBV målt til 3.1 g/(m² · %RF) for 8 mm puss (Klasse: Excellent Moisture Buffer).',
        logs: [
          '10.04.2026: Klargjorde 8 prøveplater av Diatomite BioPlaster.',
          '25.05.2026: SINTEF Inneklima utstedte sertifikat med MBV = 3.1.'
        ]
      }
    ],
    measurements: [
      { id: 'm-25-1', timestamp: '2026-05-25', parameter: 'strength', value: 2.8, label: 'Bøyestrekkfasthet (MPa)', experimentTitle: 'Dynamisk fuktkammertesting' },
      { id: 'm-25-2', timestamp: '2026-05-30', parameter: 'gwp', value: -0.8, label: 'Livsløpsavtrykk EPD (kg CO2 eq/kg)', experimentTitle: 'SINTEF EPD Validering' }
    ]
  },
  {
    id: 'mat-26',
    name: 'Transparent Trevirke for Dagslysførende Fasader (Optisk Delignifisert Furu)',
    category: 'Tre & Kork',
    ownerId: 'res-10',
    spaceIds: ['space-main', 'space-sintef'],
    description: 'Optisk transparent heltre utviklet ved kontrollert kjemisk fjerning av lysabsorberende lignin fra nordisk furu, etterfulgt av vakuuminfiltrering med bio-basert metakrylat-matrise. Gir 85% lystransmisjon og overlegen termisk isolasjon sammenlignet med tradisjonelt 3-lags isolerglass.',
    chemicalComposition: 'Cellulose-nanofibriller (78%), bio-basert poly-metylmetakrylat (PMMA matrise 22%), fri for klorforbindelser og halogener.',
    biologicalComposition: 'Nordisk furu (Pinus sylvestris) delignifisert ved pereddiksyre-prosess, bevart naturlig cellulose-skjelett med langsgående ledningsbaner.',
    trl: 6,
    applicationAreas: ['Translusente ytterfasader', 'Diffust dagslysinnslipp i takkonstruksjoner', 'Bygningsintegrerte solceller (BIPV substrat)', 'Innvendige lysledende bærevegger'],
    suppliers: ['KTH Wood Biocomposites Lab', 'RISE Bygg & Treteknikk', 'BioBuild Nordic AS'],
    provenTesting: {
      isVerified: true,
      tier: 'RISE Accredited',
      accreditationNumber: 'NO-RISE-2026-TRW26',
      verifiedDate: '2026-06-18',
      laboratory: 'RISE Bygg & Treteknikk Lab',
      leadInspector: 'Dr. Solveig Skoglund',
      reproducibilityScore: 98.7,
      confidenceInterval: '95% KI (± 0.02)',
      passedStandards: [
        'ISO 13468-1 (Plast - Bestemmelse av total lystransmittans: 85.4%)',
        'NS-EN 13501-1 (Brannklasse B-s1, d0 med bio-silikatflammehemmer)',
        'NS-EN ISO 10077-2 (Termisk U-verdi målt til 0.82 W/m²K)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -0.45,
      recycledContent: 45,
      lifetime: 60,
      circularity: '88% resirkulerbar komposittmatrise'
    },
    testResults: {
      fire: 'Behandlet med bio-mineralisert silikatflammehemmer. Røykutvikling er minimal og brennbare drypp oppstår ikke.',
      moisture: 'Vakuum-infiltrert porenettverk hindrer vannopptak; metningsverdi under 1.2% ved 95% RF.',
      strength: 'Høy slagseighet og bøyestrekkfasthet på 92 MPa, tre ganger sterkere enn standard floatglass.',
      durability: 'UV-stabilisert i over 50 år uten misfarging eller optisk turbiditet.',
      fireRating: 'B-s1, d0',
      strengthMpa: 92.0,
      durabilityYears: 50,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Null formaldehyd, TVOC < 10 µg/m³. Ikke-splintrende bruddmekanikk gir høy personsikkerhet.',
    articles: [
      {
        id: 'art-26-1',
        title: 'Optically transparent wood composites with bio-based polymer infiltration for energy-efficient glazing',
        authors: 'Skoglund, S., Dahl, J. & Berglund, L.',
        year: 2026,
        journal: 'Nature Communications Materials',
        summary: 'Demonstrerte 85.4% lystransmisjon med haze på 70%, noe som gir diffust blendingsfritt interiørlys med U-verdi 0.82 W/m²K.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-26-1',
        question: 'Hvordan kan delignifiseringstiden kuttes fra 8 timer til under 90 minutter i industriell rulle-prosess?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-26-1',
        title: 'Accelerert termisk klimasykling (-25°C til +65°C)',
        hypothesis: 'Differensiell termisk ekspansjon mellom cellulose og bio-PMMA forårsaker ikke delaminering etter 1000 sykluser.',
        independentVariable: 'Temperaturspenn og relativ fuktighet (10% til 90% RF)',
        dependentVariable: 'Optisk uklarhet (Haze) og bøyefasthet (MPa)',
        status: 'Fullført',
        startDate: '2026-03-01',
        endDate: '2026-05-15',
        results: 'Bøyefastheten var stabil på 91.8 MPa (+/- 0.8 MPa) med null indre delaminering.',
        logs: [
          '01.03.2026: Plasserte 12 prøvestaver i klimakammer på RISE Trondheim.',
          '15.05.2026: Verifiserte feilfri mikrostruktur via SEM-skanning.'
        ]
      }
    ],
    measurements: [
      { id: 'm-26-1', timestamp: '2026-05-15', parameter: 'strength', value: 92.0, label: 'Bøyefasthet (MPa)', experimentTitle: 'Accelerert termisk klimasykling' },
      { id: 'm-26-2', timestamp: '2026-05-18', parameter: 'gwp', value: -0.45, label: 'Livsløpsavtrykk EPD (kg CO2 eq/kg)', experimentTitle: 'RISE LCA Analyse' }
    ]
  },
  {
    id: 'mat-27',
    name: 'Bioluminescerende Alge-Innkapslet Fasademaling (Noctiluca Bio-Glow)',
    category: 'Alger & Bakterier',
    ownerId: 'res-13',
    spaceIds: ['space-main', 'space-marine'],
    description: 'Levende fotosyntetisk fasadebelegg beriket med mikroinnkapslede bioluminescerende algekulturer (Pyrocystis fusiformis) og fosforescerende silikater. Lader opp energi gjennom naturlig dagslys og avgir et mykt, blendingsfritt grønn-blått nattlys (470 nm) som kutter utendørs belysningsbehov med opptil 60%.',
    chemicalComposition: 'Kalium-vannglass (silikatbindemiddel), mikrokapsler av kalsiumalginat, uorganiske fosforescerende strontiumaluminat-pigmenter.',
    biologicalComposition: 'Inaktiverte og levende celler av Pyrocystis fusiformis mikroalger innkapslet i næringsgel og hydrofile porer.',
    trl: 5,
    applicationAreas: ['Nattlysende fasadeelementer', 'Rømningsveier og trappeløp', 'Gang- og sykkelveier', 'Subtile arkitektoniske lysaksenter'],
    suppliers: ['Københavns Universitet Bio-Optics', 'SINTEF Ocean', 'BioBuild Nordic AS'],
    provenTesting: {
      isVerified: true,
      tier: 'BioBuild Certified',
      accreditationNumber: 'NO-BIOBUILD-2026-ALG27',
      verifiedDate: '2026-07-02',
      laboratory: 'SINTEF Ocean & NTNU Fotobiologi Lab',
      leadInspector: 'Dr. Mikkel Lindholm',
      reproducibilityScore: 97.4,
      confidenceInterval: '95% KI (± 0.03)',
      passedStandards: [
        'DIN 67510 (Fosforescerende pigmenter og produkter - Lyskraft)',
        'NS-EN 13501-1 (Brannklasse A2-s1, d0 ubrannbart mineralsk silikat)',
        'ISO 16000-9 (VOC-fri innendørs og utendørs emisjonstest)'
      ],
      badgeLevel: 'Emerald'
    },
    epd: {
      gwp: -1.1,
      recycledContent: 70,
      lifetime: 30,
      circularity: '100% mineral- og biologisk resirkulerbar'
    },
    testResults: {
      fire: 'Silikatbasert bindemiddel gjør overflaten fullstendig flammehemmende (Klasse A2).',
      moisture: 'Svært diffusjonsåpen (Sd < 0.05 m); tillater at underliggende murbruk puster fritt.',
      strength: 'Høy abrasjonsmotstand etter 10 000 våtskrubbesykluser etter DIN EN 13300.',
      durability: 'Bioluminescens og fosforescens bevarer over 85% av lysintensiteten etter 10 års UV-eksponering.',
      fireRating: 'A2-s1, d0',
      strengthMpa: 4.5,
      durabilityYears: 30,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Ufarlig og giftfri. Ingen tungmetaller eller radioaktive isotoper. Algekulturen er biologisk sikkerhetsnivå 1.',
    articles: [
      {
        id: 'art-27-1',
        title: 'Photosynthetic light-emitting architectural coatings using microencapsulated marine dinoflagellates',
        authors: 'Lindholm, M., Vanebo, S. & Amundsen, H.',
        year: 2026,
        journal: 'Solar Energy Materials and Solar Cells',
        summary: 'Målte en kontinuerlig luminescens på 120 mcd/m² i de første 4 timene etter mørkets frembrudd, med en stabil etterglød på 15 mcd/m² gjennom natten.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-27-1',
        question: 'Hvordan forbedre mikrokapslenes næringsbuffer slik at algekoloniene kan fornye seg over 15 vintre?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-27-1',
        title: 'Måling av fotonisk lysutbytte etter 8 timers nordisk vinterdagslys',
        hypothesis: 'Kombinasjonen av algeluciferin og strontiumaluminat gir > 50 mcd/m² luminans kl 22:00.',
        independentVariable: 'Konsentrasjon av mikrokapsler (5%, 10%, 15% vektandel)',
        dependentVariable: 'Luminans (mcd/m²) målt ved spektrofotometer over 12 timer',
        status: 'Fullført',
        startDate: '2026-02-10',
        endDate: '2026-04-12',
        results: '10% vektandel ga 68 mcd/m² kl 22:00, mer enn tilstrekkelig for sikker orientering i mørke.',
        logs: [
          '10.02.2026: Påførte 3 strøk på betongplater på NTNU Gløshaugen.',
          '12.04.2026: Testresultater evaluert og bekreftet av SINTEF Ocean.'
        ]
      }
    ],
    measurements: [
      { id: 'm-27-1', timestamp: '2026-04-12', parameter: 'moisture', value: 0.04, label: 'Diffusjonsmotstand Sd (m)', experimentTitle: 'Fotonisk lysutbytte og porøsitetstest' },
      { id: 'm-27-2', timestamp: '2026-04-15', parameter: 'gwp', value: -1.1, label: 'Netto GWP karbonkreditt (kg CO2 eq/m²)', experimentTitle: 'LCA Algebelegg' }
    ]
  },
  {
    id: 'mat-28',
    name: 'Mykologisk Brann- & Akustikkfilt (Fomes Fomentarius Knuskkjuke)',
    category: 'Mykologiske',
    ownerId: 'res-1',
    spaceIds: ['space-main', 'space-myco', 'space-sintef'],
    description: 'Tett, uvevd bio-filt produsert direkte fra tramalaget i knuskkjuke (Fomes fomentarius). Eksepsjonell naturlig brannmotstand (selvslukkende uten tilsatte kjemikalier) og fremragende lydabsorpsjonskoeffisient (NRC = 0.95). Utviklet for konsertsaler, skoler og åpne kontorlandskap.',
    chemicalComposition: 'Fibrillært kitin-glukan-kompleks (92%), melanin (4%), spor av aminosyrer og mineraler.',
    biologicalComposition: 'Fomes fomentarius (knuskkjuke) høstet fra bærekraftig forvaltet lauvskog og bearbeidet mekanisk uten syrebad.',
    trl: 7,
    applicationAreas: ['Akustisk himling og veggpaneler', 'Brannhemmende mellomlegg', 'Møbeltapetsering i offentlige bygg', 'Lyddempende skillevegger'],
    suppliers: ['NTNU Mykologilab', 'NIBIO Ås', 'BioBuild Norge AS'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-MYC28',
      verifiedDate: '2026-05-29',
      laboratory: 'SINTEF Akustikk & Byggforsk Oslo',
      leadInspector: 'Prof. Eirik Møller',
      reproducibilityScore: 99.2,
      confidenceInterval: '99% KI (± 0.01)',
      passedStandards: [
        'NS-EN ISO 354 (Måling av lydabsorpsjon i etterklangrom: NRC 0.95)',
        'NS-EN 13501-1 (Brannklasse B-s1, d0 helt uten kjemiske tilsetninger)',
        'ISO 16000-3 (Emisjon av formaldehyd: Ikke påvisbart, < 1 µg/m³)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -2.3,
      recycledContent: 98,
      lifetime: 70,
      circularity: '100% biologisk nedbrytbar i kompost'
    },
    testResults: {
      fire: 'Eksepsjonell naturlig flammehemming. Danner et tett kullsjikt momentant ved 400°C som kveler videre forbrenning.',
      moisture: 'Fungerer som dynamisk fuktbufferelement; absorberer opptil 35% av egenvekt i vanndamp uten å miste form.',
      strength: 'Myk, elastisk tekstur med strekkfasthet på 4.8 MPa og god slitestyrke mot mekanisk berøring.',
      durability: 'Uforanderlig akustisk demping over 70 år; motstår muggvekst på grunn av naturlige soppdrepende metabolitter.',
      fireRating: 'B-s1, d0',
      strengthMpa: 4.8,
      durabilityYears: 70,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: '100% allergivennlig. Renser inneluft for støvpartikler og luktstoffer. Ingen respirable glassfibre.',
    articles: [
      {
        id: 'art-28-1',
        title: 'Acoustic absorption and intrinsic fire retardancy of natural Fomes fomentarius fungal mycelium tramal sheets',
        authors: 'Møller, E., Jensen, M. & Berg, T.',
        year: 2026,
        journal: 'Applied Acoustics',
        summary: 'Dokumenterte at knuskkjukefilt med 25 mm tykkelse overgår mineralull i lydabsorpsjon mellom 500 Hz og 4000 Hz, med NRC på 0.95.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-28-1',
        question: 'Kan farging med naturlige planteoljer gjøres vaskeekte uten å forringe brannhemmende kitinstruktur?',
        importance: 'Medium',
        status: 'Løst'
      }
    ],
    experiments: [
      {
        id: 'exp-28-1',
        title: 'Fullskala etterklangromstesting av 40 m² veggareal',
        hypothesis: 'Etterklangstiden T60 reduseres med > 60% i frekvensområdet 250 - 2000 Hz.',
        independentVariable: 'Paneltykkelse (15 mm vs 25 mm) og spaltedybde mot bakvegg',
        dependentVariable: 'Etterklangstid (s) og absorpsjonsfaktor α_s',
        status: 'Fullført',
        startDate: '2026-03-20',
        endDate: '2026-05-20',
        results: '25 mm plate ga α_s = 0.98 ved 1000 Hz. SINTEF Akustikk utstedte offisiell A-klassifisering.',
        logs: [
          '20.03.2026: Monterte paneler i SINTEF etterklangrom i Trondheim.',
          '20.05.2026: Endelig rapport ferdigstilt og lagt i BioBuild arkivet.'
        ]
      }
    ],
    measurements: [
      { id: 'm-28-1', timestamp: '2026-05-20', parameter: 'strength', value: 4.8, label: 'Strekkfasthet (MPa)', experimentTitle: 'Mekanisk strekkprøving' },
      { id: 'm-28-2', timestamp: '2026-05-29', parameter: 'gwp', value: -2.3, label: 'Netto karbonfangst EPD (kg CO2 eq/kg)', experimentTitle: 'LCA Vugge-til-Grav' }
    ]
  },
  {
    id: 'mat-29',
    name: 'Skalldyrbasert Kitosan-Geopolymer Mørtel (Marint Kystsement)',
    category: 'Alger & Bakterier',
    ownerId: 'res-9',
    spaceIds: ['space-main', 'space-marine'],
    description: 'Alkali-aktivert marin geopolymer fremstilt fra kalsinert leire, knuste rekeskall og modifisert marint kitosan. Konstruert spesifikt for kaianlegg, moloer og vindmøllefundamenter utsatt for kloridinntrengning, saltvannskorrosjon og krevende fryse-tine-sykluser i arktisk kystklima.',
    chemicalComposition: 'Aluminosilikat-polymer (Si-O-Al-O), kalsiumkarbonat, deacetilert kitosan (C6H11NO4)n (3.5%), natriumsilikat aktivator.',
    biologicalComposition: 'Nordatlantisk dypvannsreke (Pandalus borealis) restråstoff fra fiskeindustrien i Troms og Finnmark.',
    trl: 7,
    applicationAreas: ['Kaianlegg og flytebrygger', 'Offshore vindfundamenter', 'Sjøvannsbestandige moloer', 'Slitesterk kystsprøytebetong'],
    suppliers: ['ChitoTech Tromsø', 'SINTEF Kystinfrastruktur', 'BioBuild Marine AS'],
    provenTesting: {
      isVerified: true,
      tier: 'Nordic Field Proven',
      accreditationNumber: 'NO-NORDIC-2026-MAR29',
      verifiedDate: '2026-06-11',
      laboratory: 'SINTEF Kystinfrastruktur Tromsø',
      leadInspector: 'Dr. Sindre Vanebo',
      reproducibilityScore: 98.9,
      confidenceInterval: '95% KI (± 0.02)',
      passedStandards: [
        'NS-EN 12390-3 (Trykkfasthet etter 28 døgn: 54.2 MPa)',
        'NT BUILD 492 (Akselerert kloridmigrasjonskoeffisient D_nssm < 1.5 · 10⁻¹² m²/s)',
        'NS-EN 13501-1 (Brannklasse A1 Ubrennbart materiale)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: 48.0, // 85% lavere enn tradisjonell Portland-sement (som ligger på 350-400 kg/tonn)
      recycledContent: 88,
      lifetime: 120,
      circularity: 'Kan knuses til 100% gjenvinnbar tilslag for ny marin betong'
    },
    testResults: {
      fire: 'Fullstendig ubrennbar geopolymer med klasse A1. Tåler temperaturer opp mot 1000°C uten spalling.',
      moisture: 'Ekstremt lav kapillær absorpsjon. Kitosanet chelerer kloridioner og forsegler mikroporer.',
      strength: '28-døgns trykkfasthet på 54.2 MPa; overgår tradisjonell anleggssement i saltvannsmiljø.',
      durability: 'Garantert levetid over 120 år i arktisk tidevannssone uten armeringskorrosjon.',
      fireRating: 'A1 Ubrennbar',
      strengthMpa: 54.2,
      durabilityYears: 120,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Kjemisk stabil etter herding. Ingen utlekking av tungmetaller eller frie aminer til det marine økosystemet.',
    articles: [
      {
        id: 'art-29-1',
        title: 'Chitosan-enhanced alkali-activated geopolymers for severe marine environment corrosion mitigation',
        authors: 'Vanebo, S., Solberg, L. & Sundsfjord, K.',
        year: 2026,
        journal: 'Cement and Concrete Research',
        summary: 'Kitosan-kompleksering i geopolymer-matrisen reduserte kloridinntrengning med 82% sammenlignet med referanse-betong i 24 måneders feltforsøk i Tromsøysundet.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-29-1',
        question: 'Hva er optimal herdetemperatur for prefabrikkerte kaielementer under arktiske vinterforhold?',
        importance: 'Medium',
        status: 'Løst'
      }
    ],
    experiments: [
      {
        id: 'exp-29-1',
        title: 'Langtidseksponering i tidevannssone ved Tromsø Havn',
        hypothesis: 'Kloridkonsentrasjon på 50 mm dybde forblir under 0.05% etter 18 måneders flo og fjøre.',
        independentVariable: 'Kitosanandel i bindemiddelet (1.5%, 3.5%, 5.0%)',
        dependentVariable: 'Kloridprofil og trykkfasthetstap (MPa)',
        status: 'Fullført',
        startDate: '2025-10-01',
        endDate: '2026-05-30',
        results: '3.5% kitosan viste null armeringskorrosjon og intakt trykkfasthet på 54.2 MPa.',
        logs: [
          '01.10.2025: Nedsenket 24 testblokker ved Tromsø Havn.',
          '30.05.2026: Blokker tatt opp og analysert med energidispersiv røntgenspektroskopi (EDX).'
        ]
      }
    ],
    measurements: [
      { id: 'm-29-1', timestamp: '2026-05-30', parameter: 'strength', value: 54.2, label: 'Trykkfasthet (MPa)', experimentTitle: 'Tidevannseksponering Tromsø' },
      { id: 'm-29-2', timestamp: '2026-06-05', parameter: 'gwp', value: 48.0, label: 'CO2-avtrykk (kg CO2 eq/m³ betong)', experimentTitle: 'SINTEF EPD Sertifisering' }
    ]
  },
  {
    id: 'mat-30',
    name: 'Linolje- og Kaseinbasert Pustende Ytterpuss (Nordisk Bio-Kalk)',
    category: 'Plantebaserte',
    ownerId: 'res-14',
    spaceIds: ['space-main', 'space-circular'],
    description: 'Kulturhistorisk forankret og vitenskapelig optimalisert bio-kalkpuss basert på naturlig hydraulisk lesket kalk (NHL 3.5), koldpresset jomfrulinolje og melkeprotein (kaseinat). Gir en diffusjonsåpen, elastisk fasade med naturlig sopp- og mosedempende overflate egnet for både vernede bygg og moderne passivhus.',
    chemicalComposition: 'Kalsiumhydroksid Ca(OH)2, kalsiumsilikathydrater, linolensyre-polymerer, kaseinat-kalsium chelater.',
    biologicalComposition: 'Kaldpresset nordisk linolje (Linum usitatissimum) og mikronisert melkekasein fra økologisk melkebruk i Trøndelag.',
    trl: 8,
    applicationAreas: ['Vernede kulturminnebygg og kirker', 'Pussede fasader på halm- og hampbygg', 'Sokkelpuss i fuktutsatte kyststrøk', 'Innvendig fuktregulerende murpuss'],
    suppliers: ['Mære Landbruksskole / NIKU', 'Nordisk Kalk AS', 'BioBuild Norge AS'],
    provenTesting: {
      isVerified: true,
      tier: 'Nordic Field Proven',
      accreditationNumber: 'NO-NORDIC-2026-KLK30',
      verifiedDate: '2026-04-22',
      laboratory: 'NIKU Bygghåndverkslab & SINTEF Byggforsk',
      leadInspector: 'Dr. Kari Sundsfjord',
      reproducibilityScore: 98.5,
      confidenceInterval: '95% KI (± 0.02)',
      passedStandards: [
        'NS-EN 998-1 (Spesifikasjon for mørtel for murverk - Del 1: Pussmørtel)',
        'NS-EN 1015-18 (Bestemmelse av kapillær vannabsorpsjonskoeffisient: Klasse W2)',
        'NS-EN 13501-1 (Brannklasse A1 Ubrennbar)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -0.85,
      recycledContent: 60,
      lifetime: 90,
      circularity: '100% mineralsk og organisk kretsløpskompatibel'
    },
    testResults: {
      fire: 'Uorganisk kalkmatrise gir 100% ubrennbarhet (Klasse A1). Ingen røykutvikling overhodet.',
      moisture: 'Vannavvisende overflate (hydrofob dråpeeffekt fra linoljen) kombinert med ekstremt høy dampdiffusjonsåpning.',
      strength: 'Trykkfasthet 5.2 MPa med overlegen elastisitet (E-modul tilpasset myke underlag som tre og halm).',
      durability: 'Kalken fortsetter å karbonisere og styrkes over århundrer i nordisk uteklima.',
      fireRating: 'A1 Ubrennbar',
      strengthMpa: 5.2,
      durabilityYears: 90,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Helt uten syntetiske biocider eller mikroplast. Alkaliske egenskaper forhindrer mugg naturlig.',
    articles: [
      {
        id: 'art-30-1',
        title: 'Casein-linseed oil modifications of natural hydraulic lime mortars for extreme cold-climate weather resistance',
        authors: 'Sundsfjord, K., Dahl, J. & Rostova, E.',
        year: 2026,
        journal: 'Journal of Cultural Heritage',
        summary: 'Studien dokumenterte 65% reduksjon i kapillært vannopptak uten tap av dampåpenhet, med null frostsprenging over 50 fryse-tinesykluser.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-30-1',
        question: 'Hva er det maksimale innholdet av linolje før karboniseringshastigheten reduseres med mer enn 10%?',
        importance: 'Lav',
        status: 'Løst'
      }
    ],
    experiments: [
      {
        id: 'exp-30-1',
        title: 'Akselerert fryse-tine testing i saltlake etter NS-EN 13687',
        hypothesis: 'Kasein-linolje modifisert NHL 3.5 tåler 56 fryse-tine sykluser uten overflateavskalling.',
        independentVariable: 'Kasein:Linolje masseforhold (1:1, 1:2, 2:1)',
        dependentVariable: 'Massetap (g/m²) og dynamisk elastisitetsmodul',
        status: 'Fullført',
        startDate: '2026-01-15',
        endDate: '2026-04-10',
        results: 'Forholdet 1:2 ga kun 12 g/m² massetap (grensekrav er < 500 g/m²). Eksepsjonell frostmotstand.',
        logs: [
          '15.01.2026: Støpte 18 standard prismeprøver på NIKU lab.',
          '10.04.2026: Målinger bekreftet og registrert i Nordisk Kalkdatabase.'
        ]
      }
    ],
    measurements: [
      { id: 'm-30-1', timestamp: '2026-04-10', parameter: 'strength', value: 5.2, label: 'Trykkfasthet (MPa)', experimentTitle: 'Akselerert fryse-tine testing' },
      { id: 'm-30-2', timestamp: '2026-04-15', parameter: 'moisture', value: 0.02, label: 'Vanndampmotstand Sd (m)', experimentTitle: 'Dampdiffusjonsmåling' }
    ]
  },
  {
    id: 'mat-31',
    name: 'Karbonfikserende Cyanobakterie Bio-Fliser (Photosynthetic Tiles)',
    category: 'Alger & Bakterier',
    ownerId: 'res-2',
    spaceIds: ['space-main', 'space-sintef', 'space-circular'],
    description: 'Selvdannende og karbonfikserende fasade- og belegningsfliser dyrket av fotosyntetiske cyanobakterier (Synechococcus) suspendert i et porøst hydrogel-nettverk av sand og biokjemisk utfelt kalsiumkarbonat. Absorberer og binder CO2 aktivt fra uteluften i hele sin operative levetid.',
    chemicalComposition: 'Biogen kalsiumkarbonat CaCO3 (kalsitt og vateritt), silikasand, gelatin-agarose hydrogelmatrise.',
    biologicalComposition: 'Synechococcus sp. levende og mineraliserte fotosyntetiske bakteriekulturer.',
    trl: 6,
    applicationAreas: ['Karbonnegative fasadekledninger', 'Pustende utendørs fortau og torg', 'Grønne vegger med mikroalge-samspill', 'Akustiske perforerte interiørfliser'],
    suppliers: ['TU Delft Materials Lab', 'NTNU Biokjemi', 'BioMason / BioBuild'],
    provenTesting: {
      isVerified: true,
      tier: 'ISO/EN Standard',
      accreditationNumber: 'NO-ISO-2026-CYA31',
      verifiedDate: '2026-06-25',
      laboratory: 'SINTEF Structural Lab & TU Delft',
      leadInspector: 'Prof. Lars Solberg',
      reproducibilityScore: 98.2,
      confidenceInterval: '95% KI (± 0.025)',
      passedStandards: [
        'NS-EN 14411 (Keramiske fliser - Definisjoner, klassifisering og egenskaper)',
        'NS-EN 13501-1 (Brannklasse A1 Ubrennbar mineralisering)',
        'ISO 14040/44 (Karbonfikseringsvalidering: 1.8 kg CO2 sekvestrert per m² flis)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -3.2,
      recycledContent: 85,
      lifetime: 80,
      circularity: '100% gjenvinnbar som kalkkilde eller jordforbedring'
    },
    testResults: {
      fire: 'Ubrennbar klasse A1. Ingen organisk røykutvikling da hydrogelen er fullstendig forkalket.',
      moisture: 'Porøsiteten gir overlegen drenering og motvirker dannelse av ishinne på utendørs flater.',
      strength: 'Bøyebruddstyrke på 18.5 MPa og trykkfasthet på 32.0 MPa, fullt på høyde med tradisjonell porselensflis.',
      durability: 'Høy bestandighet mot kjemisk forvitring; bakteriefikseringen styrker flisen når den utsettes for regn og CO2.',
      fireRating: 'A1 Ubrennbar',
      strengthMpa: 32.0,
      durabilityYears: 80,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: '100% biokompatibelt. Cyanobakteriestammen er fri for mikrocystiner og endotoksiner.',
    articles: [
      {
        id: 'art-31-1',
        title: 'Continuous carbon sequestration in photosynthetic living building blocks using Synechococcus biomineralization',
        authors: 'Solberg, L., Rostova, E. & Jensen, M.',
        year: 2026,
        journal: 'Matter (Cell Press)',
        summary: 'Dokumenterte at hver kvadratmeter fasadeflis binder 1.8 kg atmosfærisk CO2 årlig via fotosyntese og mineralisering.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-31-1',
        question: 'Hvordan påvirkes fotosyntesen i de mørkeste nordiske månedene fra november til januar?',
        importance: 'Medium',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-31-1',
        title: 'Måling av kontinuerlig CO2-opptak i lukket strømningskammer',
        hypothesis: 'Flisene absorberer minimum 50 mg CO2 per m² per time under 200 µmol fotoner/(m²·s).',
        independentVariable: 'Lysintensitet og CO2-konsentrasjon i innløpsluft (400 ppm vs 800 ppm)',
        dependentVariable: 'Netto karbonfangstrate (mg CO2/m²·t)',
        status: 'Fullført',
        startDate: '2026-03-05',
        endDate: '2026-05-18',
        results: 'Gjennomsnittlig opptak målt til 62 mg CO2/m²·t ved 400 ppm. Hypotese bekreftet.',
        logs: [
          '05.03.2026: Kalibrerte infrarød gassanalysator (IRGA) ved NTNU.',
          '18.05.2026: Forsøk fullført og data overført til SINTEF EPD-database.'
        ]
      }
    ],
    measurements: [
      { id: 'm-31-1', timestamp: '2026-05-18', parameter: 'strength', value: 32.0, label: 'Trykkfasthet (MPa)', experimentTitle: 'Mekanisk kompresjonstest' },
      { id: 'm-31-2', timestamp: '2026-05-20', parameter: 'gwp', value: -3.2, label: 'Netto livsløps GWP (kg CO2 eq/m²)', experimentTitle: 'CO2-opptaksanalyse' }
    ]
  },
  {
    id: 'mat-32',
    name: 'Bio-harpiksbundet Halm- & Hamp-Lettplate (AgroBuild EcoCore)',
    category: 'Plantebaserte',
    ownerId: 'res-4',
    spaceIds: ['space-main', 'space-circular'],
    description: 'Strukturelle lettplater produsert av presset kornhalm og hampestilk bundet sammen med et 100% formaldehydfritt soyaprotein- og trelignin-bindemiddel. Erstatter tradisjonelle gips- og OSB-plater i innvendige skillevegger med 60% lavere vekt, enestående skruehold og negativt karbonfotavtrykk.',
    chemicalComposition: 'Cellulose (52%), hemicellulose (24%), lignin (16%), soyaprotein-epoksy bioharpiks (8%).',
    biologicalComposition: 'Østnorsk hvetehalm (Triticum aestivum) og industrihamp (Cannabis sativa) fra sertifiserte landbruksarealer.',
    trl: 8,
    applicationAreas: ['Innvendige skillevegger og himlinger', 'Erstatning for OSB og gipsplater', 'Bærelag for parkett og tregulv', 'Prefabrikkerte modulvegger'],
    suppliers: ['AgroBuild Norge', 'Splitkon Wood', 'BioBuild Nordic AS'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-AGR32',
      verifiedDate: '2026-06-30',
      laboratory: 'SINTEF Byggforsk Oslo',
      leadInspector: 'Dr. Johan Dahl',
      reproducibilityScore: 99.0,
      confidenceInterval: '95% KI (± 0.015)',
      passedStandards: [
        'NS-EN 312 (Sponplater - Krav og spesifikasjoner: Type P5 fuktbestandig plate)',
        'NS-EN 13501-1 (Brannklasse B-s1, d0 med integrert bio-flammehemmer)',
        'NS-EN 320 (Skrueuttrekkingsmotstand: 1450 N)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -1.75,
      recycledContent: 95,
      lifetime: 60,
      circularity: '100% komposterbar eller resirkulerbar til nye plater'
    },
    testResults: {
      fire: 'Inneholder naturlig silisiumdioksid fra halmen og tilsatt bio-silikat som gir brannklasse B-s1, d0.',
      moisture: 'Hydrofob soyaproteinmatrise sikrer at tykkelsessvelling etter 24 timers vannbad er under 6.5%.',
      strength: 'Bøyefasthet på 19.5 MPa og E-modul på 2800 MPa; tåler direkte innfesting av tunge overskap uten spikerslag.',
      durability: 'Uforgjengelig i tørre og tempererte innemiljøer med dokumentert levetid på 60+ år.',
      fireRating: 'B-s1, d0',
      strengthMpa: 19.5,
      durabilityYears: 60,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Null VOC og 0.00 ppm formaldehyd. Testet og godkjent for BREEAM-NOR Excellent og Svanemerket bygging.',
    articles: [
      {
        id: 'art-32-1',
        title: 'Agricultural straw and hemp core biocomposites with soy-lignin adhesives for zero-emission interior partitioning',
        authors: 'Dahl, J., Hauge, I. & Rostova, E.',
        year: 2026,
        journal: 'Industrial Crops and Products',
        summary: 'Demonstrerte at soy-lignin-bindemiddelet gir samme mekaniske egenskaper som MDI- og fenolharpikser, med 92% lavere livsløpsutslipp og null formaldehydemisjon.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-32-1',
        question: 'Hvordan kan kontinuerlig varmpressing optimaliseres for å øke produksjonshastigheten til 30 meter per minutt?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-32-1',
        title: 'Fullskala skrueuttrekk- og skjærfasthetsprøving etter NS-EN 320',
        hypothesis: 'Skruehold i platekjerne overgår standard 13 mm gipsplate med minst 400%.',
        independentVariable: 'Soyaprotein-andel i bindemiddelet (6%, 8%, 10%)',
        dependentVariable: 'Maksimal uttrekkskraft (N) for 4.0 x 40 mm treskruer',
        status: 'Fullført',
        startDate: '2026-04-05',
        endDate: '2026-05-28',
        results: '8% bindemiddel ga 1450 N uttrekkskraft (over 5 ganger høyere enn gips). Hypotese bekreftet.',
        logs: [
          '05.04.2026: Presset 20 testplater i laboratorieskala.',
          '28.05.2026: Verifisert av SINTEF Byggforsk mekanisk prøvingslab.'
        ]
      }
    ],
    measurements: [
      { id: 'm-32-1', timestamp: '2026-05-28', parameter: 'strength', value: 19.5, label: 'Bøyefasthet (MPa)', experimentTitle: 'Fullskala mekanisk prøving' },
      { id: 'm-32-2', timestamp: '2026-06-02', parameter: 'gwp', value: -1.75, label: 'Netto livsløpsutslipp GWP (kg CO2 eq/m²)', experimentTitle: 'EPD AgroBuild Livsløpsanalyse' }
    ]
  },
  {
    id: 'mat-33',
    name: 'Hamp-Kalk Termisk Byggeblokk (HempCrete Nordic Block)',
    category: 'Plantebaserte',
    ownerId: 'res-3',
    spaceIds: ['space-main', 'space-circular', 'space-sintef', 'space-personal'],
    description: 'Karbonnegativ termisk byggeblokk sammensatt av industriell hampestrie (Cannabis sativa) og naturlig hydraulisk kalk (NHL 3.5). Blokkene regulerer inneklimaet passivt gjennom kontinuerlig fuktighetsbuffring og fungerer som en brannsikker, varmeisolerende veggkjerne med over 100 kg CO2 sekvestrert per kubikkmeter.',
    chemicalComposition: 'Cellulose (44%), hemicellulose (18%), kalsiumhydroksid Ca(OH)2 (22%), kalsiumkarbonat CaCO3 (12%), biogene silikater (4%).',
    biologicalComposition: 'Stengelved (hurds) fra sertifisert østnorsk industrihamp og bio-kalk fra nordiske brudd.',
    trl: 8,
    applicationAreas: ['Monolittiske yttervegger i trebygg', 'Etterisolering av historiske bindingsverksbygg', 'Akustiske og brannskillende innervegger', 'Passivhus og nullutslippsboliger'],
    suppliers: ['Norsk Hampindustri AS', 'Nordic Hempcrete Solutions', 'SINTEF Materialpartner'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-HMP33',
      verifiedDate: '2026-07-02',
      laboratory: 'SINTEF Byggforsk & NTNU Gløshaugen',
      leadInspector: 'Dr. Johan Dahl',
      reproducibilityScore: 99.2,
      confidenceInterval: '95% KI (± 0.012)',
      passedStandards: [
        'ISO 8301 (Termisk konduktivitet: λ = 0.068 W/(m·K))',
        'NS-EN 13501-1 (Brannklasse B-s1, d0 ikke brennbar kjerne)',
        'NS-EN 772-1 (Trykkfasthet for murblokker: 1.85 MPa)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -108.0,
      recycledContent: 100,
      lifetime: 100,
      circularity: 'Fullstendig knusbar til kalkberiket jordforbedring eller resirkulerbar i ny mørtel'
    },
    testResults: {
      fire: 'Uovertruffen motstand mot åpen flamme; kalkmineraliseringen danner et forkullet beskyttelseslag uten røyk eller giftige gasser (B-s1, d0).',
      moisture: 'Eksepsjonell dampdiffusjonsåpenhet (Sd = 0.03 m) og hygroskopisk bufferkapasitet på 2.1 g/(m²·%RF).',
      strength: 'Trykkfasthet på 1.85 MPa gir tilstrekkelig bæreevne som utfyllingsvegg i bærekonstruksjoner av massivtre.',
      durability: 'Kalken herder gradvis via karbonatisering med atmosfærisk CO2, noe som gjør blokken hardere over tid.',
      fireRating: 'B-s1, d0',
      strengthMpa: 1.85,
      durabilityYears: 100,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: '100% giftfri og hypoallergen. Nøytraliserer muggsporer og bakterier naturlig via høy pH (pH 11.5 under montering).',
    articles: [
      {
        id: 'art-33-1',
        title: 'Hygrothermal and carbon-sequestration performance of Nordic hemp-lime blocks in cold sub-arctic climates',
        authors: 'Dahl, J., Solberg, L. & Møller, E.',
        year: 2026,
        journal: 'Journal of Cleaner Production',
        summary: 'Dokumenterte at hamp-kalkblokker kutter oppvarmingsbehov med 28% på grunn av dynamisk latent varmelagring i fuktporer.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-33-1',
        question: 'Kan herdetiden reduseres fra 28 til 7 dager ved bruk av biogene karbonatiseringskatalysatorer?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-33-1',
        title: 'Dynamisk klimakammertesting av fuktbufferverdi (MBV) etter NORDTEST',
        hypothesis: 'Hamp-kalkblokk oppnår MBV over 2.0 g/(m²·%RF), definert som utmerket fuktbuffer.',
        independentVariable: 'Relativ fuktighetssyklus (33% til 75% RF ved 20°C)',
        dependentVariable: 'Vektendring per kvadratmeter per %RF',
        status: 'Fullført',
        startDate: '2026-05-10',
        endDate: '2026-06-20',
        results: 'Gjennomsnittlig MBV målt til 2.14 g/(m²·%RF). Hypotese bekreftet.',
        logs: [
          '10.05.2026: Prøvelegemer kondisjonert ved 23°C og 50% RF.',
          '20.06.2026: Avsluttet 16 fullstendige 24-timers sykluser i SINTEF klimakammer.'
        ]
      }
    ],
    measurements: [
      { id: 'm-33-1', timestamp: '2026-06-20', parameter: 'gwp', value: -108.0, label: 'Livsløps GWP (kg CO2 eq/m³)', experimentTitle: 'EPD Hamp-kalk livsløp' },
      { id: 'm-33-2', timestamp: '2026-06-22', parameter: 'strength', value: 1.85, label: 'Trykkfasthet (MPa)', experimentTitle: 'Akkreditert kompresjonstest' }
    ]
  },
  {
    id: 'mat-34',
    name: 'Selvhelende Bakterie-Biobetong (Bacillus pseudofirmus Bio-Crack Filler)',
    category: 'Alger & Bakterier',
    ownerId: 'res-5',
    spaceIds: ['space-main', 'space-sintef', 'space-marine', 'space-personal'],
    description: 'Strukturell betong tilsatt mikrokapsler med sporer fra alkalifile bakterier (Bacillus pseudofirmus) og kalsiumlaktat. Når sprekker oppstår og vann siver inn, vekkes bakteriene og feller ut kalsiumkarbonat (kalsitt) som tetter sprekken fullstendig innen 21 dager.',
    chemicalComposition: 'Biologisk utfelt kalsitt CaCO3 (>98%), kalsiumlaktat Ca(C3H5O3)2, silikater og bakterielle peptidoglykaner.',
    biologicalComposition: 'Bakteriesporer av Bacillus pseudofirmus innkapslet i porøse ekspanderte leirepartikler (Leca).',
    trl: 7,
    applicationAreas: ['Undersjøiske fundamenter og brokar', 'Tunneler og underjordiske parkeringskjellere', 'Avløpskummer og drikkevannsreservoarer', 'Marine kaianlegg utsatt for saltvann'],
    suppliers: ['Heidelberg Materials BioNord', 'BioBetong Norge', 'SINTEF Kystinfrastruktur'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-BAC34',
      verifiedDate: '2026-06-25',
      laboratory: 'SINTEF Bygg & Konstruksjon Trondheim',
      leadInspector: 'Dr. Espen Lind',
      reproducibilityScore: 98.6,
      confidenceInterval: '95% KI (± 0.018)',
      passedStandards: [
        'NS-EN 12390-3 (Trykkfasthet betong: 52.4 MPa ved 28 dager)',
        'NS-EN 12390-8 (Vanninntrengingsdybde under trykk: < 5 mm etter selvheling)',
        'RILEM TC 221-SHC (Validering av biologisk sprekkheling opp til 0.8 mm)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: 38.0,
      recycledContent: 45,
      lifetime: 120,
      circularity: 'Resirkulerbart som høyverdig tilslag til ny betong eller kystforbygninger'
    },
    testResults: {
      fire: 'Ubrennbar klasse A1 etter NS-EN 13501-1; de biologiske sporene forblir inaktive i betongmatrisen inntil vanninntrenging oppstår.',
      moisture: 'Selvtetter aktive lekkasjesprekker på opptil 0.8 mm bredde under hydrostatisk vanntrykk innen tre uker.',
      strength: 'Karakteristisk trykkfasthet B35/B45 (52.4 MPa), gjenvinner over 88% av opprinnelig strekkfasthet etter sprekkheling.',
      durability: 'Forhindrer klorid- og oksygenkorrosjon på armeringsjern, dobler levetiden til marine betongkonstruksjoner.',
      fireRating: 'A1 Ubrennbar',
      strengthMpa: 52.4,
      durabilityYears: 120,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Ufarlig og ikke-patogen bakteriestamme (risikogruppe 1). Forseglet i betongkrystallene.',
    articles: [
      {
        id: 'art-34-1',
        title: 'Long-term healing efficiency of spore-based bio-concrete in harsh Nordic saline splash zones',
        authors: 'Lind, E., Vanebo, S. & Jonkers, H.',
        year: 2026,
        journal: 'Cement and Concrete Research',
        summary: 'Påviste 100% tetting av mikrosprekker i prøvelegemer nedsenket i Trondheimsfjorden over 18 måneder.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-34-1',
        question: 'Hvor mange helingssykluser kan de innkapslede bakteriesporene gjennomgå over en 50-årsperiode?',
        importance: 'Medium',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-34-1',
        title: 'Akkreditert permeabilitetstest etter simulert rissdannelse',
        hypothesis: 'Vanngjennomstrømning gjennom 0.5 mm riss reduseres med over 90% etter 21 dager i vannbad.',
        independentVariable: 'Vannherdingstemperatur (8°C kystvann vs 20°C ferskvann)',
        dependentVariable: 'Vannstrømning (ml/min) under 2 bar trykk',
        status: 'Fullført',
        startDate: '2026-04-15',
        endDate: '2026-05-30',
        results: 'Vannstrømning redusert fra 450 ml/min til 12 ml/min (97.3% reduksjon). Hypotese bekreftet.',
        logs: [
          '15.04.2026: Generert kontrollerte 0.5 mm riss via trepunkts bøyeprøving.',
          '30.05.2026: Kalsittutfelling mikroskopert med SEM-EDX ved NTNU.'
        ]
      }
    ],
    measurements: [
      { id: 'm-34-1', timestamp: '2026-05-30', parameter: 'strength', value: 52.4, label: 'Trykkfasthet 28d (MPa)', experimentTitle: 'NS-EN 12390-3 prøving' },
      { id: 'm-34-2', timestamp: '2026-06-01', parameter: 'gwp', value: -42.0, label: 'Netto karbonbinding (kg CO2 eq/m³)', experimentTitle: 'Kalsinerings- og EPD-analyse' }
    ]
  },
  {
    id: 'mat-35',
    name: 'Suberin-Aerogel Termisk Superisolasjon (Bio-Cork Aerogel)',
    category: 'Tre & Kork',
    ownerId: 'res-10',
    spaceIds: ['space-main', 'space-sintef', 'space-personal'],
    description: 'Ultralett, nanoporøs superisolasjonsmatte fremstilt av oppsirkulert korkbark (Quercus suber) og bio-silika fra rishullaske. Med en termisk konduktivitet på kun 0.019 W/(m·K) muliggjør materialet slanke, høyeffektive passivhusvegger uten syntetisk polyuretan eller EPS.',
    chemicalComposition: 'Suberin (48%), lignin (24%), nanostrukturert bio-silika SiO2 (16%), ceroid-vokser (8%), tannin (4%).',
    biologicalComposition: 'Bærekraftig innhøstet korkbark kombinert med bio-baserte aerogeler via superkritisk CO2-tørking.',
    trl: 6,
    applicationAreas: ['Slanke ytterveggkonstruksjoner i passivhus', 'Innvendig etterisolering av fredede byfasader', 'Kjølerom og fryselager i næringsbygg', 'Kuldebrobrytere rundt vinduer og balkonginnfestinger'],
    suppliers: ['Nordic Aerogel AS', 'Amorim Cork Nordics', 'SINTEF Termisk Lab'],
    provenTesting: {
      isVerified: true,
      tier: 'RISE Accredited',
      accreditationNumber: 'SE-RISE-2026-CRK35',
      verifiedDate: '2026-07-10',
      laboratory: 'RISE Bygg & Treteknikk Borås',
      leadInspector: 'Dr. Solveig Skoglund',
      reproducibilityScore: 97.9,
      confidenceInterval: '95% KI (± 0.021)',
      passedStandards: [
        'ISO 8301 (Termisk konduktivitet superisolasjon: λ = 0.019 W/(m·K))',
        'NS-EN 1602 (Densitet isolasjonsmaterialer: 68 kg/m³)',
        'NS-EN 13501-1 (Brannklasse C-s1, d0 med naturlig suberin-flammehemming)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -54.0,
      recycledContent: 88,
      lifetime: 75,
      circularity: 'Gjenvinnbar som isolasjonsgranulat eller 100% biologisk nedbrytbar industrikompost'
    },
    testResults: {
      fire: 'Suberinet danner en naturlig glassaktig koksbarriere som kveler oksygentilførsel (C-s1, d0).',
      moisture: 'Hydrofob overflate med kontaktvinkel på 135°; absorberer under 0.8 volumprosent fuktighet ved 95% RF.',
      strength: 'Trykkspenning ved 10% deformasjon på 180 kPa; tåler mekanisk innspenning i stenderverk.',
      durability: 'Fullstendig upåvirket av fuktsvigninger, biologisk nedbrytning og maur/skadeinsekter over 75+ år.',
      fireRating: 'C-s1, d0',
      strengthMpa: 0.18,
      durabilityYears: 75,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Fri for støvfibre og petrokjemiske isocyanater. Dokumentert null avgassing i henhold til AgBB og M1-kravene.',
    articles: [
      {
        id: 'art-35-1',
        title: 'Nanoporous suberin-silica hybrid aerogels with ultra-low thermal conductivity for heritage building retrofitting',
        authors: 'Skoglund, S., Berg, T. & Jensen, M.',
        year: 2026,
        journal: 'Advanced Functional Materials',
        summary: 'Rapporterte superisolerende egenskaper med 60% tynnere veggoppbygning enn tradisjonell mineralull.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-35-1',
        question: 'Hvordan kan industriell superkritisk CO2-tørking skaleres opp for å halvere produksjonskostnaden?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-35-1',
        title: 'Hot-plate konduktivitetsmåling etter akselerert aldring ved 70°C og 90% RF',
        hypothesis: 'Lambda-verdien forblir under 0.021 W/(m·K) etter 500 timers fuktvarme-belastning.',
        independentVariable: 'Eksponeringstid i klimaskap (0 til 500 timer)',
        dependentVariable: 'Termisk konduktivitet λ (W/mK)',
        status: 'Fullført',
        startDate: '2026-05-02',
        endDate: '2026-06-15',
        results: 'Målt lambda etter 500 timer var 0.0194 W/(m·K). Hypotese bekreftet.',
        logs: [
          '02.05.2026: Monterte prøvestykker i calibrated guarded hot plate (GHP).',
          '15.06.2026: Ingen porekollaps observert ved CT-skanning.'
        ]
      }
    ],
    measurements: [
      { id: 'm-35-1', timestamp: '2026-06-15', parameter: 'gwp', value: -54.0, label: 'Livsløps GWP (kg CO2 eq/m³)', experimentTitle: 'LCA Suberin-aerogel' },
      { id: 'm-35-2', timestamp: '2026-06-18', parameter: 'strength', value: 0.18, label: 'Trykkfasthet 10% (MPa)', experimentTitle: 'Mekanisk kompresjon' }
    ]
  },
  {
    id: 'mat-36',
    name: 'Marint Kollagen & Skjell Bio-Glava (OceanWool Insulation)',
    category: 'Annet',
    ownerId: 'res-9',
    spaceIds: ['space-main', 'space-marine', 'space-circular'],
    description: 'Isolasjonsmatter spunnet av marint kollagenfiber fra hvitfiskrestråstoff bundet med finmalt kalsiumkarbonat fra kamskjellavfall. Erstatter tradisjonell steinull og glassull med overlegen akustisk demping og null hud- eller lungeirritasjon under montering.',
    chemicalComposition: 'Type-I marint kollagen (56%), kalsiumkarbonat CaCO3 fra muslingskjell (32%), natriumalginat kryssbinder (12%).',
    biologicalComposition: 'Kollagen ekstrahert fra restråstoff fra torsk og sei (Gadus morhua) og kamskjellskall fra kystnæringen i Trøndelag.',
    trl: 6,
    applicationAreas: ['Termisk isolasjon i tak og vegger', 'Akustisk lydfelle i ventilasjonskanaler og etasjeskiller', 'Flytende gulvisolasjon mot trinnlyd', 'Skipsinnredning og offshore boligkvarter'],
    suppliers: ['OceanWool Marine AS', 'Biomarine Resirkulering Tromsø', 'SINTEF Ocean'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-OCW36',
      verifiedDate: '2026-06-18',
      laboratory: 'SINTEF Ocean & NIVA Marine Lab',
      leadInspector: 'Dr. Sindre Vanebo',
      reproducibilityScore: 98.1,
      confidenceInterval: '95% KI (± 0.024)',
      passedStandards: [
        'ISO 354 (Akustisk absorpsjon: NRC 0.94 ved 100 mm tykkelse)',
        'NS-EN 12667 (Termisk konduktivitet: λ = 0.034 W/(m·K))',
        'NS-EN 13501-1 (Brannklasse B-s1, d0 med mineralsk skjellskjold)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -38.5,
      recycledContent: 100,
      lifetime: 60,
      circularity: '100% bio-sirkulært marin biprodukt, fullstendig komposterbar til nitrogengjødsel'
    },
    testResults: {
      fire: 'Kalsiumkarbonatpartiklene fra skjellene fungerer som en naturlig varmeabsorber og slukker glør umiddelbart (B-s1, d0).',
      moisture: 'Kollagenfibrene buffer fuktighet uten å miste spenst eller isolasjonsevne (tykkelsestap < 2% etter fuktsyklus).',
      strength: 'Strekkfasthet i fiberlengderetning på 0.42 MPa, utmerket elastisk gjenvinning etter komprimering.',
      durability: 'Alginatbinding forhindrer nedsmuldring; behandlet med bio-sitronsyre mot bakterievekst.',
      fireRating: 'B-s1, d0',
      strengthMpa: 0.42,
      durabilityYears: 60,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Fullstendig hudvennlig. Krever ingen vernebriller eller støvmaske under montasje.',
    articles: [
      {
        id: 'art-36-1',
        title: 'Circular upcycling of fish skin collagen and seashell biomineral fibers into acoustic insulation mats',
        authors: 'Vanebo, S., Møller, E. & Lindholm, M.',
        year: 2026,
        journal: 'Bioresource Technology',
        summary: 'Beviste at kollagenbasert isolasjon oppnår likeverdige termiske egenskaper som glassull, med 14 dB bedre trinnlydsreduksjon.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-36-1',
        question: 'Hvordan påvirkes isolasjonens langtidselastisitet ved eksponering for konstant 90% RF over 10 år?',
        importance: 'Medium',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-36-1',
        title: 'Måling av lydabsorpsjon i impedansrør etter ISO 10534-2',
        hypothesis: 'Lydabsorpsjonskoeffisient ved 500–2000 Hz overstiger 0.90 for 75 mm OceanWool-matte.',
        independentVariable: 'Kollagenfiberdiameter og andel finmalt kalsiumkarbonat (20% vs 35%)',
        dependentVariable: 'Normal incidens absorpsjonskoeffisient α',
        status: 'Fullført',
        startDate: '2026-04-20',
        endDate: '2026-05-25',
        results: 'Maksimal absorpsjon på 0.96 målt ved 1000 Hz med 32% skjellpartikler. Hypotese bekreftet.',
        logs: [
          '20.04.2026: Kalibrert 4-mikrofon impedansrør ved SINTEF Akustikk.',
          '25.05.2026: Sluttrapport overlevert NIVA akkrediteringsorgan.'
        ]
      }
    ],
    measurements: [
      { id: 'm-36-1', timestamp: '2026-05-25', parameter: 'gwp', value: -38.5, label: 'Livsløps GWP (kg CO2 eq/m³)', experimentTitle: 'OceanWool LCA EPD' },
      { id: 'm-36-2', timestamp: '2026-05-28', parameter: 'strength', value: 0.42, label: 'Strekkfasthet (MPa)', experimentTitle: 'Mekanisk fiberstrekk' }
    ]
  },
  {
    id: 'mat-37',
    name: 'Arakne-Spidroin Bio-Armering (SpiderSilk Reinforced Rebar)',
    category: 'Annet',
    ownerId: 'res-8',
    spaceIds: ['space-main', 'space-sintef', 'space-personal'],
    description: 'Høystyrke bio-armeringsstenger produsert av biosyntetiske edderkoppsilkeproteiner (rekombinant spidroin) støpt i en bio-basert linoljeharpiks. Har tre ganger høyere strekkfasthet enn konstruksjonsstål per vektenhet og ruster aldri, noe som revolusjonerer betongarmert kystbygging.',
    chemicalComposition: 'Rekombinant Spidroin MaSp1/MaSp2 (72%), epoksidert bio-linoljematrise (24%), silankobler (4%).',
    biologicalComposition: 'Mikrobielt fermentert silke-protein fra presisjonsgjæring i bioreaktorer, spunnet til mikrofibriller.',
    trl: 5,
    applicationAreas: ['Ikke-korroderende armering i kystbetong og brukonstruksjoner', 'Armering for tynne bio-kompositte fasadeelementer', 'Jordskjelvsikring med ekstrem energiabsorpsjon', 'Magnetresonansrom (MR) på sykehus uten metallinterferens'],
    suppliers: ['Nordic Spidroin Biotech', 'BioArmering Norge AS', 'NTNU Nanoteknologilab'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-SPD37',
      verifiedDate: '2026-07-15',
      laboratory: 'NTNU Nanomekanikk & SINTEF Konstruksjon',
      leadInspector: 'Dr. Kristin Nygård',
      reproducibilityScore: 97.4,
      confidenceInterval: '95% KI (± 0.028)',
      passedStandards: [
        'ISO 10406-1 (Mekanisk prøving av fiberarmert polymer for betong: Strekkfasthet 1420 MPa)',
        'ISO 527-4 (Bruddforlengelse 26.5% - overlegen duktilitet)',
        'NS-EN 13501-1 (Brannklasse B-s1 for innstøpt komposittstang)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -12.0,
      recycledContent: 60,
      lifetime: 150,
      circularity: 'Enzymatisk spaltbar for gjenvinning av proteinmonomerer eller resirkulerbar som bio-plastfiller'
    },
    testResults: {
      fire: 'Når innstøpt i betong er brannmotstanden lik konvensjonell armering; ved fri eksponering forkuller silkeproteinet uten drypp.',
      moisture: 'Total immunitet mot kloridangrep og saltvann; 0% korrosjonsfare uavhengig av betongens rissvidde.',
      strength: 'Eksepsjonell strekkfasthet på 1420 MPa og elastisitetsmodul på 78 GPa med uovertruffen seighet.',
      durability: 'Teoretisk levetid på over 150 år i marint saltvannsmiljø uten degradering.',
      fireRating: 'B-s1 innstøpt',
      strengthMpa: 1420.0,
      durabilityYears: 150,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: '100% biokompatibelt materiale godkjent for medisinske implantater, null kjemisk helserisiko for arbeidere.',
    articles: [
      {
        id: 'art-37-1',
        title: 'Recombinant spidroin microcomposite rebars for non-corrosive marine concrete infrastructure',
        authors: 'Nygård, K., Solberg, L. & Dahl, J.',
        year: 2026,
        journal: 'Nature Materials Biocomposites',
        summary: 'Viste at bio-spidroinarmering motstår 2000 timers akselerert kloridkorrosjon uten detekterbart styrketap.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-37-1',
        question: 'Hvordan kan fermenteringsutbyttet i gjæringstankene økes fra 15 g/l til 45 g/l for å nå prisparitet med rustfritt stål?',
        importance: 'Høy',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-37-1',
        title: 'Mekanisk strekkprøving og forankringslengdetest i høyfast betong',
        hypothesis: 'Spidroinstang oppnår full forankringskapasitet med 20% kortere forankringslengde enn kamstål B500NC.',
        independentVariable: 'Overflaterilling og ribbegeometri på bio-stangen',
        dependentVariable: 'Heftfasthet (bond strength) i MPa etter NS-EN 10080',
        status: 'Fullført',
        startDate: '2026-05-12',
        endDate: '2026-06-28',
        results: 'Heftfasthet målt til 18.2 MPa mot standard ståls 14.5 MPa. Hypotese bekreftet.',
        logs: [
          '12.05.2026: Støpte uttrekkssylindere med 16 mm spidroinstenger.',
          '28.06.2026: Verifisert brudd i stang uten glidning i betongen.'
        ]
      }
    ],
    measurements: [
      { id: 'm-37-1', timestamp: '2026-06-28', parameter: 'strength', value: 1420.0, label: 'Strekkfasthet (MPa)', experimentTitle: 'Mekanisk strekktest ISO 10406-1' },
      { id: 'm-37-2', timestamp: '2026-07-02', parameter: 'moisture', value: 1.8, label: 'Fuktopptak etter 90d i saltlake (%)', experimentTitle: 'Kloridkorrosjonsmodell' }
    ]
  },
  {
    id: 'mat-38',
    name: 'Nordisk Pil- og Hassel-Bioflettverk (Salix Architectural Weave)',
    category: 'Plantebaserte',
    ownerId: 'res-7',
    spaceIds: ['space-main', 'space-circular'],
    description: 'Ventilerte klimaskjermer og solavskjermingspaneler flettet av hurtigvoksende nordisk kurvpil (Salix viminalis) og hassel, impregnert med varmpresset furutjære og bivoks. Skaper en levende, biologisk solskjerming som endrer farge og duft med årstidene og absorberer vindkrefter elastisk.',
    chemicalComposition: 'Cellulose (49%), hemicellulose (23%), lignin (19%), furutjæresyrer (6%), bivoks (3%).',
    biologicalComposition: 'Høstet ett- og toårig kurvpil (Salix viminalis) fra norske flomsoner og furutjære fra Trøndelag.',
    trl: 8,
    applicationAreas: ['Ytre ventilerte fasadeskjermer', 'Integrerte solavskjermingslameller på næringsbygg', 'Støyskjermer langs veier med naturlig vegetasjon', 'Utearealer, pergolaer og takhager'],
    suppliers: ['Nordic Salix Bygg AS', 'Trøndelag Tjære & Tre', 'BioFasade Norge'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-SLX38',
      verifiedDate: '2026-05-30',
      laboratory: 'NIBIO Divisjon for Skog og Tre & SINTEF Byggforsk',
      leadInspector: 'Dr. Camilla Frost',
      reproducibilityScore: 98.9,
      confidenceInterval: '95% KI (± 0.015)',
      passedStandards: [
        'NS-EN 350-2 (Holdbarhet for treverk: Råteklasse 1 Meget holdbart etter tjærebehandling)',
        'ISO 4892-3 (UV-akselerert forvitringsprøving: 3500 timer uten fiberseparasjon)',
        'NS-EN 13501-1 (Brannklasse C-s2, d0 for utvendig ventilert kledning)'
      ],
      badgeLevel: 'Gold'
    },
    epd: {
      gwp: -86.5,
      recycledContent: 100,
      lifetime: 45,
      circularity: '100% biologisk nedbrytbar eller gjenbrukbar som flis til bio-kompositter og jordforbedring'
    },
    testResults: {
      fire: 'Furutjære og voks danner et herdet skjold som motvirker overflateflamme (Klasse C-s2, d0).',
      moisture: 'Flettverket har en naturlig åpen struktur som tørker på få minutter etter slagregn og hindrer soppvekst.',
      strength: 'Bøyestyrke på 65 MPa; tåler vindkast opptil 45 m/s (orkanstyrke) ved fleksibel bøyedeformasjon.',
      durability: 'Dokumentert levetid på 45+ år med enkel etteroljing hvert 10. år.',
      fireRating: 'C-s2, d0',
      strengthMpa: 65.0,
      durabilityYears: 45,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Naturlig aromatisk furuduft, avgir ingen syntetiske kjemikalier eller mikroplast.',
    articles: [
      {
        id: 'art-38-1',
        title: 'Bio-architectural shading screens from coppiced Salix viminalis with traditional pine tar weatherproofing',
        authors: 'Frost, C., Lindholm, M. & Sundsfjord, K.',
        year: 2026,
        journal: 'Building and Environment',
        summary: 'Dokumenterte 34% reduksjon i kjølebehov om sommeren og 100% resirkulerbarhet ved endt levetid.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-38-1',
        question: 'Kan flettemønsteret robotiseres med 6-akset kranarm for storskala prefabrikasjon?',
        importance: 'Medium',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-38-1',
        title: 'Fullskala vindlast- og aerodynamisk bøyeprøving i vindtunnel',
        hypothesis: 'Flettverkspanel tåler 40 m/s vindhastighet med reversibel elastisk utbøyning under 50 mm.',
        independentVariable: 'Vindhastighet (10 til 45 m/s) og flettetetthet (70% vs 85% dekning)',
        dependentVariable: 'Maksimal utbøyning og restdeformasjon etter vindkast',
        status: 'Fullført',
        startDate: '2026-04-02',
        endDate: '2026-05-15',
        results: 'Maksimal utbøyning ved 45 m/s var 38 mm; null restdeformasjon etter avlastning. Hypotese bekreftet.',
        logs: [
          '02.04.2026: Monterte 2.4 x 1.2 m flettverkspanel i SINTEF vindtunnel.',
          '15.05.2026: Testserie fullført uten knekkskader på pilestilker.'
        ]
      }
    ],
    measurements: [
      { id: 'm-38-1', timestamp: '2026-05-15', parameter: 'gwp', value: -86.5, label: 'Livsløps GWP (kg CO2 eq/m² fasade)', experimentTitle: 'Salix LCA' },
      { id: 'm-38-2', timestamp: '2026-05-18', parameter: 'strength', value: 65.0, label: 'Bøyestyrke (MPa)', experimentTitle: 'Vindlast- og bøyeprøving' }
    ]
  },
  {
    id: 'mat-39',
    name: 'Kiselalge Diatomitt-Gipsplate (Diatomite Active Board)',
    category: 'Alger & Bakterier',
    ownerId: 'res-14',
    spaceIds: ['space-main', 'space-circular'],
    description: 'Fuktregulerende og luktnøytraliserende innvendig bygningsplate laget av fossile kiselalgeskall (Diatomite) bundet med kasein og plantestivelse. Den mikroporøse strukturen har et overflateareal på over 60 m²/g som adsorberer flyktige organiske forbindelser (VOC) og regulerer relativ luftfuktighet passivt.',
    chemicalComposition: 'Amorf biogen silika SiO2 (74%), kalsiumkarbonat (12%), kaseinprotein (8%), modifisert hvetestivelse (6%).',
    biologicalComposition: 'Kiselalgeskall (Diatomeae) fra skandinaviske sedimentære kilder og melkekasein fra overskuddsmelk.',
    trl: 7,
    applicationAreas: ['Innvendige vegger i soverom og stuer for optimalt soveklima', 'Baderomsvegger utenfor våtsone for dugghindring', 'Skoler, barnehager og kontorer med høye krav til inneklima', 'Arkiver og museer med strenge krav til fuktstabilitet'],
    suppliers: ['Nordic Diatomite Board AS', 'BioGips Norden', 'Inneklima Norge'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-DTM39',
      verifiedDate: '2026-06-12',
      laboratory: 'SINTEF Byggforsk Oslo Inneklimagruppen',
      leadInspector: 'Dr. Kari Sundsfjord',
      reproducibilityScore: 99.3,
      confidenceInterval: '95% KI (± 0.011)',
      passedStandards: [
        'NORDTEST NT BUILD 482 (Fuktbufferverdi: 2.3 g/(m²·%RF) - Klasse Utmerket)',
        'ISO 16000-6 (Adsorpsjon av formaldehyd og VOC: 85% reduksjon innen 24 timer)',
        'NS-EN 13501-1 (Brannklasse A2-s1, d0 ubrennbar kjerne)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -22.0,
      recycledContent: 92,
      lifetime: 70,
      circularity: 'Kan knuses og gjenbrukes som jordforbedringsmiddel eller råstoff til ny plateproduksjon'
    },
    testResults: {
      fire: 'Høyt silikatinnhold gir tilnærmet ubrennbar plate i klasse A2-s1, d0 uten giftig røyk.',
      moisture: 'Absorberer opptil 350 ml vann per m² uten å miste formstabilitet, forhindrer kondens og dugg på speil og vinduer.',
      strength: 'Bøyestrekkfasthet på 6.8 MPa og skruehold på 620 N, overgår standard 12.5 mm gipsplate.',
      durability: 'Mineralstrukturen er uorganisk og uforgjengelig; muggsopp kan ikke vokse på den porøse diatomitten.',
      fireRating: 'A2-s1, d0',
      strengthMpa: 6.8,
      durabilityYears: 70,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: 'Eksepsjonelt gunstig for astmatikere og allergikere. Fjerner lukt og VOC fra inneluften kontinuerlig.',
    articles: [
      {
        id: 'art-39-1',
        title: 'Passive moisture buffering and indoor formaldehyde remediation by bio-casein diatomaceous earth boards',
        authors: 'Sundsfjord, K., Dahl, J. & Frost, C.',
        year: 2026,
        journal: 'Indoor Air',
        summary: 'Dokumenterte at rom kledd med diatomittplater holdt relativ fuktighet stabilt mellom 45% og 55% uavhengig av uteklima.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-39-1',
        question: 'Hvor raskt mettes diatomittens VOC-adsorpsjonskapasitet i sterkt forurensede bymiljøer før regenerering er nødvendig?',
        importance: 'Medium',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-39-1',
        title: 'Formaldehyd-nedbrytning i 1 m³ ventilert testkammer etter ISO 16000',
        hypothesis: 'Luftkonsentrasjon av formaldehyd reduseres med over 80% innen 24 timer ved romtemperatur.',
        independentVariable: 'Plateoverflateareal i kammeret (0.5 m² vs 1.2 m²)',
        dependentVariable: 'Gjenværende formaldehydkonsentrasjon (µg/m³)',
        status: 'Fullført',
        startDate: '2026-05-05',
        endDate: '2026-06-08',
        results: 'Konsentrasjon falt fra 120 µg/m³ til 14 µg/m³ (88.3% fjerning). Hypotese bekreftet.',
        logs: [
          '05.05.2026: Dosert formaldehydgass i forseglet kammer.',
          '08.06.2026: Kromatografisk analyse fullført ved SINTEF Oslo.'
        ]
      }
    ],
    measurements: [
      { id: 'm-39-1', timestamp: '2026-06-08', parameter: 'gwp', value: -22.0, label: 'Livsløps GWP (kg CO2 eq/m²)', experimentTitle: 'Diatomite LCA EPD' },
      { id: 'm-39-2', timestamp: '2026-06-10', parameter: 'strength', value: 6.8, label: 'Bøyestyrke (MPa)', experimentTitle: 'Mekanisk bøyeprøving' }
    ]
  },
  {
    id: 'mat-40',
    name: 'Torvmose-Kompositt Dreneringsmatte (Sphagnum BioDrain Sheet)',
    category: 'Plantebaserte',
    ownerId: 'res-12',
    spaceIds: ['space-main', 'space-sintef', 'space-marine'],
    description: 'Komprimert, perforert drenerings- og radonsikringsmatte laget av regenerert hvitmose (Sphagnum magellanicum) og kokos-/jutefibre. Monteres på utsiden av kjelleryttervegger og under såleblokker. Mosen absorberer 25 ganger sin egen vekt i vann, filtrerer sedimenter og har en naturlig sur pH som hindrer kjemisk forvitring.',
    chemicalComposition: 'Sphagnan-polysakkarider (58%), cellulose (22%), lignin (12%), pektin og fenoliske syrer (8%).',
    biologicalComposition: 'Bærekraftig høstet Sphagnum-torvmose fra kontrollerte restaureringsfelt kombinert med kokosvev.',
    trl: 8,
    applicationAreas: ['Utvendig drenering og fuktbeskyttelse for grunnmur', 'Overvannshåndtering og fordrøyningslag i grønne tak', 'Radon- og gassbrems under betonggulv på grunn', 'Jordstabilisering i erosjonsutsatte byggegroper'],
    suppliers: ['Sphagnum Bygg AS', 'Grønn Drenering Norge', 'NIBIO Torvforsk'],
    provenTesting: {
      isVerified: true,
      tier: 'SINTEF Verified',
      accreditationNumber: 'NO-SINTEF-2026-SPH40',
      verifiedDate: '2026-07-08',
      laboratory: 'SINTEF Infrastruktur & Geoteknikk',
      leadInspector: 'Dr. Tuva Berg',
      reproducibilityScore: 98.7,
      confidenceInterval: '95% KI (± 0.016)',
      passedStandards: [
        'NS-EN 13252 (Geotekstiler for drenering: Dreneringskapasitet 1.8 l/(s·m) ved 20 kPa trykk)',
        'NS-EN ISO 25619-2 (Kompresjonsegenskaper: Beholder 82% porøsitet under 50 kPa jordtrykk)',
        'NS-EN 13501-1 (Brannklasse E under terreng)'
      ],
      badgeLevel: 'Platinum'
    },
    epd: {
      gwp: -64.0,
      recycledContent: 100,
      lifetime: 80,
      circularity: '100% bionedbrytbar; omdannes gradvis til organisk humus uten forurensning av grunnvann'
    },
    testResults: {
      fire: 'Plasseres under terreng mot fuktig jord; tilfredsstiller brannkrav til nedgravd drenering (Klasse E).',
      moisture: 'Uovertruffen vannfordrøyning; leder bort 120 liter overvann per m² per time uten å tette seg med leirpartikler.',
      strength: 'Tåler jordtrykk på opptil 75 kPa (tilsvarer 3.5 meter tilbakefylling) uten kollaps av dreneringskanalene.',
      durability: 'Det naturlige innholdet av sphagnan-syre virker konserverende og hindrer biologisk forråtnelse under bakken.',
      fireRating: 'Klasse E (Under bakken)',
      strengthMpa: 0.075,
      durabilityYears: 80,
      provenFireMark: true,
      provenMoistureMark: true,
      provenStrengthMark: true,
      provenDurabilityMark: true
    },
    healthRisk: '100% naturlig mose. Null utlekking av mikroplast eller giftige ftalater til grunnvann og drikkevannskilder.',
    articles: [
      {
        id: 'art-40-1',
        title: 'Sphagnum biomass geocomposites for sustainable basement drainage and stormwater retention in urban clays',
        authors: 'Berg, T., Dahl, J. & Vanebo, S.',
        year: 2026,
        journal: 'Geotextiles and Geomembranes',
        summary: 'Påviste at sphagnum-dreneringsmatter opprettholder over 80% vanngjennomstrømning selv etter 1000 timers leireslam-belastning.',
        url: '#'
      }
    ],
    openQuestions: [
      {
        id: 'q-40-1',
        question: 'Kan tørket torvmose komprimeres til tynne ruller uten å miste den fibrillære sphagnan-strukturen?',
        importance: 'Medium',
        status: 'Under utforsking'
      }
    ],
    experiments: [
      {
        id: 'exp-40-1',
        title: 'Vanngjennomstrømningsprøving i radialpermeameter under konstant jordbelastning',
        hypothesis: 'Dreneringskapasitet forblir over 1.5 l/(s·m) ved 40 kPa kompresjon.',
        independentVariable: 'Mekanisk overtrykk (10, 25, 50 kPa)',
        dependentVariable: 'Vannføringskapasitet Q i planet (l/(s·m))',
        status: 'Fullført',
        startDate: '2026-05-18',
        endDate: '2026-06-30',
        results: 'Vannføring ved 50 kPa målt til 1.78 l/(s·m). Hypotese bekreftet.',
        logs: [
          '18.05.2026: Monterte prøve i geoteknisk permeameter hos SINTEF.',
          '30.06.2026: Avsluttet 6-ukers kontinuerlig strømningstest.'
        ]
      }
    ],
    measurements: [
      { id: 'm-40-1', timestamp: '2026-06-30', parameter: 'gwp', value: -64.0, label: 'Livsløps GWP (kg CO2 eq/m²)', experimentTitle: 'Sphagnum LCA' },
      { id: 'm-40-2', timestamp: '2026-07-02', parameter: 'strength', value: 0.075, label: 'Tillatt jordtrykk (MPa)', experimentTitle: 'Geoteknisk kompresjonsprøving' }
    ]
  }
];

export const initialResearchers: Researcher[] = [
  {
    id: 'res-1',
    name: 'Dr. Marianne Jensen',
    title: 'Senior Mykologiforsker',
    department: 'Biopolymer & Mykologilab',
    expertise: ['Soppmycel', 'Kitin-strukturering', 'Hygroskopisk regulering', 'Biologisk nedbrytbarhet'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    activeHours: 140,
    successRate: 94,
    bio: 'Pioner innen utvikling av soppbaserte byggemoduler i Norden. Har ledet flere SINTEF-støttede innovasjonsprosjekter for Alive Houses.'
  },
  {
    id: 'res-2',
    name: 'Prof. Lars Solberg',
    title: 'Sjefingeniør for Bio-materialer',
    department: 'Konstruksjonsteknikk & Bio-sement',
    expertise: ['Bio-sementering', 'Kalksteinsutfelling', 'Trykkfasthet', 'Strukturell mekanikk'],
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    activeHours: 110,
    successRate: 89,
    bio: 'Spesialist på mikrobiologisk indusert kalkutfelling (MICP) i betong og sementholdige materialer, med fokus på forlengelse av levetid.'
  },
  {
    id: 'res-3',
    name: 'Dr. Elena Rostova',
    title: 'Miljøanalytiker & LCA-Spesialist',
    department: 'Sirkulærøkonomi & Miljø',
    expertise: ['EPD-regnskap', 'Global Warming Potential (GWP)', 'Livsløpsvurderinger', 'Sirkularitet'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    activeHours: 85,
    successRate: 96,
    bio: 'Utvikler av de nasjonale EPD-standardene for bio-baserte byggevarer. Ekspert på karbonregnskap og regenerative materialanalyser.'
  },
  {
    id: 'res-4',
    name: 'Dr. Johan Dahl',
    title: 'Forsker på Plante-biomasse',
    department: 'Fytomaterialer & Treteknologi',
    expertise: ['Hampbetong', 'Plantefiber', 'Kalkbindemidler', 'Termisk isolasjon'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    activeHours: 120,
    successRate: 91,
    bio: 'Dyp erfaring med landbruksbiprodukter til byggeformål. Har optimalisert hamp-kalk-blandinger for kalde og fuktige kyststrøk.'
  },
  {
    id: 'res-5',
    name: 'Eva-01 (MetaHuman Partner)',
    title: 'Senior Virtuell Forskningskoordinator',
    department: 'Unreal Simulation & AI Synthesis',
    expertise: ['Generativ AI', 'Tverrfaglig Materialsyntese', '3D Rigg-analyse', 'Prediktiv Modellering'],
    avatar: 'metahuman_eva',
    activeHours: 200,
    successRate: 98,
    bio: 'Avansert AI-basert forskningspartner generert i Unreal Engine. Kobler simuleringsdata fra Unreal-miljøet med fysisk labforskning.'
  },
  {
    id: 'res-6',
    name: 'Dr. Astrid Lindqvist',
    title: 'Spesialist på Nanocellulose & Aerogeler',
    department: 'Nanoteknologi & Skogbaserte Polymere',
    expertise: ['Nanofibrillert Cellulose', 'Aerogel-synthesis', 'Frysetørking', 'Superisolasjon'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    activeHours: 135,
    successRate: 93,
    bio: 'Ekspert på omdanning av norske skogsbiprodukter til superisolerende nanostrukturer for lavenergi- og passivhus.'
  },
  {
    id: 'res-7',
    name: 'Prof. Henrik Amundsen',
    title: 'Leder for Pyrolyse & Bio-kull Teknologi',
    department: 'Karbonnegativ Infrastruktur',
    expertise: ['Bio-kull pyrolyse', 'Karbonfanging', 'Asfalt-kompositter', 'Geoteknisk Bæreevne'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    activeHours: 150,
    successRate: 95,
    bio: 'Spesialist på termisk pyrolyse for omdanning av organisk restråstoff til stabile karbonfeller i infrastruktur og veidekker.'
  },
  {
    id: 'res-8',
    name: 'Dr. Ingrid Hauge',
    title: 'Spesialist på Bio-Baserte Lim & Harpikser',
    department: 'Grønn Kjemi & Bio-Klebemidler',
    expertise: ['Enzymatisk Lignin-Lim', 'Soyaprotein-Harpiks', 'Formaldehydfrie Bindemidler', 'Bio-Terskel Tester'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    activeHours: 128,
    successRate: 92,
    bio: 'Leder kjemilaboratoriet for utvikling av 100% giftfrie bio-bindemidler utvunnet fra tre-lignin og landbruksavfall til treindustrien.'
  },
  {
    id: 'res-9',
    name: 'Dr. Sindre Vanebo',
    title: 'Seniorforsker på Marint Lignin & Talg',
    department: 'Akvatiske Biomassematerialer',
    expertise: ['Tare-Alginat', 'Skjellmelet-Mørtel', 'Akvatisk Korrosjonsvern', 'Bioluminescence Sensorer'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    activeHours: 115,
    successRate: 90,
    bio: 'Fokuserer på utnyttelse av ilandskyldt sukkertare og restråstoff fra skjellnæringen for utvikling av fukt- og saltherdede kystmaterialer.'
  },
  {
    id: 'res-10',
    name: 'Dr. Solveig Skoglund',
    title: 'Spesialist på Translucent Tre & Nanokompositter',
    department: 'RISE Bygg & Treteknikk / KTH',
    expertise: ['Optisk delignifisering', 'Bio-basert PMMA-infiltrering', 'Termisk U-verdi modellering', 'Dagslys-arkitektur'],
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    activeHours: 165,
    successRate: 97,
    bio: 'Ledende nordisk forsker på transparente trematerialer for fremtidens energieffektive glassfasader og lysstyring i passivbygg.'
  },
  {
    id: 'res-11',
    name: 'Prof. Eirik Møller',
    title: 'Forskningsleder for Akustisk Biofysikk',
    department: 'SINTEF Akustikk & Chalmers',
    expertise: ['Porøs absorpsjonsmekanikk', 'Knuskkjuke-veving', 'Etterklangrom-validering', 'Fibrillær kitin-elastisitet'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    activeHours: 180,
    successRate: 95,
    bio: 'Ekspert på naturlige og bio-baserte akustiske absorbenter. Utvikler sirkulære lydabsorbenter med NRC over 0.95 for skoler og kulturbygg.'
  },
  {
    id: 'res-12',
    name: 'Dr. Tuva Berg',
    title: 'Seniorforsker på Jordforsterkning & Biopolymerer',
    department: 'NIBIO Divisjon for Bioteknologi',
    expertise: ['Geotekniske biopolymerer', 'Xanthan-gum jordsikring', 'Røtter og mycorrhiza-forsterkning', 'Jorderosjonsvern'],
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80',
    activeHours: 130,
    successRate: 93,
    bio: 'Forsker på biologisk stabilisering av skråninger, byggegroper og erosjonsutsatt leirgrunn ved hjelp av mikrobielle polysakkarider.'
  },
  {
    id: 'res-13',
    name: 'Dr. Mikkel Lindholm',
    title: 'Leder for Fotosyntetisk Arkitektur & Fotobiologi',
    department: 'Københavns Universitet & SINTEF Ocean',
    expertise: ['Bioluminescens i bygg', 'Mikroalgedyrking i fasader', 'Fotoreaktive silikater', 'Nattlig luminansoptimalisering'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    activeHours: 145,
    successRate: 94,
    bio: 'Pioner innen integrering av levende mikroalgekulturer og fosforescens i urbane overflater for naturlig belysning uten strømforbruk.'
  },
  {
    id: 'res-14',
    name: 'Dr. Kari Sundsfjord',
    title: 'Kulturminneforsker & Bio-Mørtelspesialist',
    department: 'NIKU Bygghåndverkslaboratorium',
    expertise: ['Hydraulisk bio-kalk (NHL)', 'Kasein-kalsium chelater', 'Diffusjonsmekanikk', 'Historisk murverksvern'],
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    activeHours: 160,
    successRate: 96,
    bio: 'Kombinerer tradisjonelt nordisk murhåndverk med moderne materialkjemi for utvikling av diffusjonsåpne og saltbestandige bio-kalkpussinger.'
  },
  {
    id: 'res-15',
    name: 'Siv.ing. Jarle H.',
    title: 'Sjefarkitekt for Digitale Labs & Brukerspaces',
    department: 'Nordic BioBuild Hub & Systemarkitektur',
    expertise: ['Multi-lab koordinering', 'TRL-akselerasjon', 'Digital tvilling & Unreal integrasjon', 'Brukerspace-allokering'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    activeHours: 210,
    successRate: 99,
    bio: 'Prosjektleder og systemarkitekt for BioBuild-plattformen. Ansvarlig for tverrfaglige arbeidsområder, datastandardisering og forskerspaces.'
  }
];

export const initialUserSpaces: UserSpace[] = [
  {
    id: 'space-main',
    name: 'Nordic BioBuild Hovedlaboratorium',
    code: 'NBB-CORE',
    description: 'Sentral fellesforskningshub for registrering, akkreditering og testing av alle biologiske bygningsmaterialer i Norden.',
    leadResearcherId: 'res-15',
    department: 'Nordic BioBuild Hub & Konsortium',
    focusAreas: ['TRL Validering', 'Akkreditert Prøving', 'EPD-Standardisering', 'Klassifisering'],
    pinnedMaterialIds: ['mat-1', 'mat-2', 'mat-4', 'mat-26', 'mat-28', 'mat-31', 'mat-33', 'mat-34', 'mat-35', 'mat-39'],
    activeExperimentsCount: 14,
    memberCount: 15,
    badge: 'Sentral Hub',
    color: 'emerald',
    notes: 'Fokus på Q3 2026: Samle inn akkrediterte brann- og fuktmålinger for samtlige TRL 6-8 materialer i forkant av EU-harmonisering.',
    createdAt: '2026-01-10'
  },
  {
    id: 'space-sintef',
    name: 'SINTEF Prøvingslab & Brannsikkerhet',
    code: 'SIN-FIRE',
    description: 'Spesialisert testlaboratorium for ISO 1182 og NS-EN 13501-1 branntester, mekanisk bøyeprøving og termisk U-verdianalyse.',
    leadResearcherId: 'res-2',
    department: 'SINTEF Byggforsk & Konstruksjon',
    focusAreas: ['Brannklasse A1/B-s1', 'Termisk U-verdi', 'Mekanisk Trykkfasthet', 'ISO 8301'],
    pinnedMaterialIds: ['mat-2', 'mat-10', 'mat-26', 'mat-28', 'mat-32', 'mat-33', 'mat-34', 'mat-37', 'mat-40'],
    activeExperimentsCount: 8,
    memberCount: 6,
    badge: 'Akkreditert Testkammer',
    color: 'amber',
    notes: 'Branntesting i vertikal ovn kalibrert 15. august 2026. Prioriterer transparente trepaneler og halmbaserte EcoCore-plater.',
    createdAt: '2026-02-01'
  },
  {
    id: 'space-myco',
    name: 'NTNU Biopolymer & Mykologi Sandbox',
    code: 'NTNU-MYCO',
    description: 'Forskningsrom dedikert til dyrking av soppmycel, kitinbaserte kompositter, celleveggsmodifikasjoner og akustikk.',
    leadResearcherId: 'res-1',
    department: 'NTNU Biopolymerlab Gløshaugen',
    focusAreas: ['Ganoderma lucidum', 'Fomes fomentarius', 'Hygroskopisk Buffer', 'Akustisk Absorpsjon'],
    pinnedMaterialIds: ['mat-1', 'mat-8', 'mat-21', 'mat-28'],
    activeExperimentsCount: 9,
    memberCount: 5,
    badge: 'Bio-Dyrking & Akustikk',
    color: 'purple',
    notes: 'Optimalisering av vekstsyklus for knuskkjuke ved 24°C og 85% RF. NIBIO-samarbeid på skogsavfalls-substrater pågår.',
    createdAt: '2026-02-15'
  },
  {
    id: 'space-circular',
    name: 'Sirkulær Ressurs & Karbonregnskap (LCA Lab)',
    code: 'LCA-CIRC',
    description: 'Analytisk arbeidsrom for miljødeklarasjoner (EPD), vugge-til-grav analyser, karbonnegativitet og jordbruksrestråstoff.',
    leadResearcherId: 'res-3',
    department: 'Sirkulærøkonomi & Miljøanalyse',
    focusAreas: ['EPD-regnskap (GWP)', 'Vugge-til-grav LCA', 'Landbruksbiprodukter', 'Komposterbarhet'],
    pinnedMaterialIds: ['mat-4', 'mat-11', 'mat-22', 'mat-30', 'mat-32', 'mat-33', 'mat-36', 'mat-38', 'mat-39'],
    activeExperimentsCount: 7,
    memberCount: 4,
    badge: 'Karbonregnskap & LCA',
    color: 'blue',
    notes: 'Validerer negative GWP-tall for halmplater og kaseinkalkmørtel for publisering i EPD Norge-registeret.',
    createdAt: '2026-03-01'
  },
  {
    id: 'space-marine',
    name: 'Akvatiske Biomaterialer & Kystinfrastruktur',
    code: 'SEA-INFRA',
    description: 'Arbeidsområde for utnyttelse av kyst- og havråstoffer: tare-alginat, skalldyr-kitosan, biologisk korrosjonsvern og kystbetong.',
    leadResearcherId: 'res-9',
    department: 'SINTEF Ocean & Tromsø Kystlab',
    focusAreas: ['Kitosan Geopolymer', 'Sukkertare-bindemidler', 'Arktisk Saltvannsklima', 'Bioluminescens'],
    pinnedMaterialIds: ['mat-6', 'mat-24', 'mat-27', 'mat-29', 'mat-34', 'mat-36', 'mat-37', 'mat-40'],
    activeExperimentsCount: 6,
    memberCount: 5,
    badge: 'Kyst & Havressurser',
    color: 'teal',
    notes: 'Tidevannseksponering ved Tromsø havn viser eksepsjonell bestandighet mot kloridvandring for kitosanbetong.',
    createdAt: '2026-03-20'
  },
  {
    id: 'space-personal',
    name: 'Mitt Forskerspace (Jarle / Personlig Lab)',
    code: 'USR-JARLE',
    description: 'Ditt personlige eksperimentelle arbeidsområde. Pinned materialer, egne notater, rask hypotese-testing og tilpassede parametere.',
    leadResearcherId: 'res-15',
    department: 'Personlig Pilot & Utforskningsrom',
    focusAreas: ['Egendefinerte Tester', 'Hypotesegenerering', 'Hurtig Prototype', 'Favorittmaterialer'],
    pinnedMaterialIds: ['mat-1', 'mat-26', 'mat-27', 'mat-28', 'mat-29', 'mat-31', 'mat-32', 'mat-33', 'mat-34', 'mat-35', 'mat-37'],
    activeExperimentsCount: 5,
    memberCount: 2,
    badge: 'Personlig Arbeidsrom',
    color: 'rose',
    notes: 'Prioritert arbeidsplan: Kjøre Unreal Engine simulering på translucent tre og kombinere det med bioluminescerende algebelegg.',
    createdAt: '2026-04-01'
  }
];


