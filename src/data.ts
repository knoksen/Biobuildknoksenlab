import { BioMaterial, Researcher } from './types';

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
    ownerId: 'res-4',
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
    ownerId: 'res-2',
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
      durabilityYears: 80
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
      durabilityYears: 45
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
      durabilityYears: 75
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
      durabilityYears: 50
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
      durabilityYears: 60
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
  }
];

