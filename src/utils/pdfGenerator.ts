import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BioMaterial, Researcher } from '../types';

interface MaterialRenderSubInfo {
  isBulk: boolean;
  index: number;
  total: number;
}

function renderSingleMaterialContent(
  doc: jsPDF,
  material: BioMaterial,
  owner?: Researcher,
  subInfo?: MaterialRenderSubInfo
) {
  const primaryColor: [number, number, number] = [70, 70, 50]; // Deep olive slate #464632
  const darkBg: [number, number, number] = [38, 38, 30]; // #26261e
  const emeraldColor: [number, number, number] = [30, 95, 45];
  const blueColor: [number, number, number] = [40, 75, 115];

  let currentY = 15;

  // Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 36, 'F');

  // Accent indicator bar
  doc.setFillColor(180, 150, 60);
  doc.rect(0, 35, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  const mainTitle = subInfo?.isBulk
    ? `BIOBUILD NORGE — DEL ${subInfo.index} AV ${subInfo.total}: ${material.name.toUpperCase()}`
    : 'BIOBUILD NORGE — MATERIALPROFIL & TESTRAPPORT';
  doc.text(mainTitle, 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(215, 215, 195);
  doc.text('Komplett teknisk materialdossier, akkrediterte testresultater og laboratoriedata', 14, 22);

  doc.setFontSize(8);
  doc.setTextColor(165, 165, 150);
  const genDate = new Date().toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const genTime = new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
  doc.text(`Dokument generert: ${genDate} kl. ${genTime} | Alive Houses Research Platform | Status: Autorisert rapport`, 14, 29);

  currentY = 44;

  // Material Title & Basic Metadata
  doc.setTextColor(30, 30, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(material.name, 14, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(95, 95, 85);
  const ownerLabel = owner ? `${owner.name} (${owner.department || owner.title})` : 'Ikke allokert forskningsleder';
  doc.text(`Kategori: ${material.category}  |  TRL: Nivå ${material.trl}/9  |  Fagansvarlig forsker: ${ownerLabel}  |  ID: ${material.id}`, 14, currentY);
  currentY += 8;

  // Description
  doc.setFontSize(9);
  doc.setTextColor(55, 55, 50);
  const descLines = doc.splitTextToSize(material.description || 'Ingen generell beskrivelse oppgitt.', 182);
  doc.text(descLines, 14, currentY);
  currentY += descLines.length * 4.5 + 4;

  // KEY PERFORMANCE INDICATORS / EXECUTIVE METRIC GRID TABLE
  const kpiRows = [
    [
      'Maksimal Trykkfasthet',
      material.testResults?.strengthMpa ? `${material.testResults.strengthMpa} MPa (Sluttfasthet)` : 'Ikke fastsatt',
      'Globalt Oppvarmingspotensial (GWP)',
      material.epd?.gwp !== undefined ? `${material.epd.gwp} kg CO2 eq/kg ${material.epd.gwp < 0 ? '(Karbonlagrende)' : ''}` : 'N/A'
    ],
    [
      'Brannmotstand / Euroclass',
      material.testResults?.fireRating ? `Klasse ${material.testResults.fireRating}` : 'Ikke klassifisert',
      'Fuktatferd & Bufferstatus',
      material.testResults?.provenMoistureMark ? 'Akkreditert dampåpen fuktbuffer' : 'Testet hygroskopisk'
    ],
    [
      'Resirkulert / Bio-andel',
      `${material.epd?.recycledContent ?? 0}% gjenvunnet innhold`,
      'Teknisk Designlevetid',
      `${material.epd?.lifetime ?? 'N/A'} år i konstruksjon`
    ]
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Nøkkelparameter (Styrke & Brann)', 'Verdi', 'Miljø & Bestandighet (EPD)', 'Verdi']],
    body: kpiRows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [40, 40, 35] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 46 },
      1: { cellWidth: 45 },
      2: { fontStyle: 'bold', cellWidth: 46 },
      3: { cellWidth: 45 }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // Proven Testing Accreditation Box if present
  if (material.provenTesting && material.provenTesting.isVerified) {
    const pt = material.provenTesting;
    doc.setFillColor(242, 248, 242);
    doc.setDrawColor(40, 120, 60);
    doc.roundedRect(14, currentY, 182, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 90, 40);
    doc.text(`AKKREDITERT PROVEN TESTING-DOSSIER: [${pt.tier}] — Nivå: ${pt.badgeLevel}`, 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 75, 55);
    doc.text(`Akkrediterings-ID: ${pt.accreditationNumber}  |  Laboratorium: ${pt.laboratory || 'Nasjonalt Prøvelaboratorium'}  |  Verifisert: ${pt.verifiedDate}`, 18, currentY + 12);
    doc.text(`Ledende inspektør: ${pt.leadInspector || 'Sertifisert kontrollør'}  |  Reproduserbarhetsscore: ${pt.reproducibilityScore}%  |  Konfidens: ${pt.confidenceInterval || '95% CI'}`, 18, currentY + 17);

    if (pt.passedStandards && pt.passedStandards.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Beståtte standarder: ${pt.passedStandards.join(', ')}`, 18, currentY + 22);
    }

    currentY += 30;
  }

  // SECTION 1: DETALJERTE FYSISKE & TEKNISKE TESTRESULTATER
  if (currentY > 230) {
    doc.addPage();
    currentY = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.text('1. Fysiske & Mekaniske Testresultater (Laboratorie-evaluering)', 14, currentY);
  currentY += 5;

  const testBody = [
    [
      'Brannmotstand\n(NS-EN 13501-1 / ISO 1182)',
      material.testResults?.fireRating ? `Klasse ${material.testResults.fireRating}` : 'Ikke klassifisert',
      material.testResults?.provenFireMark ? 'AKKREDITERT' : 'Standard labtest',
      material.testResults?.fire || 'Ingen spesifikk branntestbeskrivelse registrert.'
    ],
    [
      'Fuktmotstand & Hygrotermisk Atferd\n(EN ISO 12571 / ISO 8301)',
      'Dampåpen / Fuktbuffer',
      material.testResults?.provenMoistureMark ? 'AKKREDITERT' : 'Standard labtest',
      material.testResults?.moisture || 'Ingen spesifikk fukttestbeskrivelse registrert.'
    ],
    [
      'Mekanisk Fasthet & Trykkstyrke\n(NS-EN 12390)',
      material.testResults?.strengthMpa ? `${material.testResults.strengthMpa} MPa` : 'Ikke målt',
      material.testResults?.provenStrengthMark ? 'AKKREDITERT' : 'Standard labtest',
      material.testResults?.strength || 'Ingen spesifikk styrketestbeskrivelse registrert.'
    ],
    [
      'Biologisk Bestandighet & Nedbrytning\n(NS-EN 350 / ISO 846)',
      material.testResults?.durabilityYears ? `${material.testResults.durabilityYears} år` : `${material.epd?.lifetime || 'N/A'} år`,
      material.testResults?.provenDurabilityMark ? 'AKKREDITERT' : 'Standard labtest',
      material.testResults?.durability || 'Ingen spesifikk bestandighetstestbeskrivelse registrert.'
    ]
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Prøvingsområde & Norm', 'Målt Verdi / Klasse', 'Prøvingsstatus', 'Kvalitativ Laboratorie-evaluering & Observasjon']],
    body: testBody,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [35, 35, 30] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42 },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 24, fontStyle: 'bold', textColor: [30, 95, 45] },
      3: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // SECTION 2: KVANTITATIVE MÅLEPUNKTER & TIDSSERIER
  if (material.measurements && material.measurements.length > 0) {
    if (currentY > 225) {
      doc.addPage();
      currentY = 18;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkBg);
    doc.text('2. Kvantitative Målepunkter & Tidsserie-logger', 14, currentY);
    currentY += 5;

    const measRows = material.measurements.map((m, idx) => [
      `#${idx + 1}`,
      m.timestamp,
      m.parameter === 'strength' ? 'Trykkfasthet (Mekanisk)' :
      m.parameter === 'moisture' ? 'Fuktighetsabsorpsjon' : 'EPD Karbonavtrykk (GWP)',
      m.label,
      `${m.value} ${m.parameter === 'strength' ? 'MPa' : m.parameter === 'moisture' ? '%' : 'kg CO2 eq'}`,
      m.experimentTitle || 'Generell labmåling'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Nr', 'Tidspunkt', 'Parameter', 'Testetikett / Fase', 'Måleverdi', 'Tilknyttet Eksperiment']],
      body: measRows,
      theme: 'striped',
      headStyles: { fillColor: [85, 95, 105], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5 },
      columnStyles: {
        0: { cellWidth: 10, fontStyle: 'bold' },
        1: { cellWidth: 30 },
        2: { cellWidth: 38 },
        3: { cellWidth: 32 },
        4: { cellWidth: 26, fontStyle: 'bold', textColor: [40, 75, 115] },
        5: { cellWidth: 'auto' }
      },
      margin: { left: 14, right: 14 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // SECTION 3: LABORATORIEEKSPERIMENTER, HYPOTESER OG TESTRESULTATER
  if (currentY > 215) {
    doc.addPage();
    currentY = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.text('3. Registrerte Eksperimenter, Hypoteser og Testkonklusjoner', 14, currentY);
  currentY += 5;

  if (material.experiments && material.experiments.length > 0) {
    material.experiments.forEach((exp, idx) => {
      if (currentY > 225) {
        doc.addPage();
        currentY = 18;
      }

      // Experiment title header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(35, 45, 60);
      doc.text(`Eksperiment #${idx + 1}: ${exp.title}`, 14, currentY);

      // Status badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      if (exp.status === 'Fullført') {
        doc.setTextColor(30, 110, 40);
      } else if (exp.status === 'Aktiv') {
        doc.setTextColor(170, 95, 20);
      } else {
        doc.setTextColor(100, 100, 100);
      }
      doc.text(`Status: ${exp.status.toUpperCase()}  |  Startet: ${exp.startDate || 'N/A'}${exp.endDate ? `  |  Avsluttet: ${exp.endDate}` : ''}`, 130, currentY);
      currentY += 5;

      // Metadata table
      const expMetaRows = [
        ['Hypotese', exp.hypothesis || 'Ingen eksplisitt hypotese formulert'],
        ['Uavhengig variabel', exp.independentVariable || 'N/A'],
        ['Avhengig variabel', exp.dependentVariable || 'N/A'],
        ['Empirisk Testresultat / Konklusjon', exp.results ? exp.results : (exp.status === 'Fullført' ? 'Test fullført, se observasjoner under.' : 'Pågående testing — endelig resultat foreligger ikke ennå.')]
      ];

      autoTable(doc, {
        startY: currentY,
        body: expMetaRows,
        theme: 'plain',
        bodyStyles: { fontSize: 7.5, textColor: [40, 40, 35] },
        columnStyles: {
          0: { cellWidth: 42, fontStyle: 'bold', textColor: [60, 60, 50] },
          1: { cellWidth: 140 }
        },
        margin: { left: 14, right: 14 }
      });

      // @ts-ignore
      currentY = doc.lastAutoTable.finalY + 3;

      // Experiment logs
      if (exp.logs && exp.logs.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(70, 70, 65);
        doc.text('Loggførte observasjonsnotater:', 14, currentY);
        currentY += 4;

        exp.logs.forEach(log => {
          if (currentY > 275) {
            doc.addPage();
            currentY = 18;
          }
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(60, 60, 55);
          const splitLog = doc.splitTextToSize(`• ${log}`, 178);
          doc.text(splitLog, 16, currentY);
          currentY += splitLog.length * 3.8;
        });
        currentY += 2;
      }

      // Experiment research notes (detailed observation entries with timestamp)
      if (exp.notes && exp.notes.length > 0) {
        if (currentY > 230) {
          doc.addPage();
          currentY = 18;
        }

        const noteRows = exp.notes.map(n => [
          n.timestamp,
          n.category || 'Observasjon',
          n.author || 'Labforsker',
          n.content
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Tidspunkt', 'Kategori', 'Forsker', 'Utfyllende Laboratorieobservasjon']],
          body: noteRows,
          theme: 'grid',
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold' },
          bodyStyles: { fontSize: 7.5 },
          columnStyles: {
            0: { cellWidth: 28 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 'auto' }
          },
          margin: { left: 14, right: 14 }
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 6;
      } else {
        currentY += 4;
      }
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 110);
    doc.text('Ingen registrerte eksperimenter for dette materialet ennå.', 14, currentY);
    currentY += 8;
  }

  // SECTION 4: KJEMISK OG BIOLOGISK SAMMENSETNING
  if (currentY > 220) {
    doc.addPage();
    currentY = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.text('4. Kjemisk og Biologisk Sammensetning', 14, currentY);
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Komponenttype', 'Komposisjonsanalyse & Biologisk Matriks']],
    body: [
      ['Kjemisk struktur', material.chemicalComposition || 'Ingen kjemisk analyse spesifisert'],
      ['Biologisk matriks / organisme', material.biologicalComposition || 'Ingen biologisk organisme spesifisert'],
      ['Anvendelsesområder', material.applicationAreas?.join(', ') || 'N/A'],
      ['Partnere & Leverandører', material.suppliers?.join(', ') || 'N/A']
    ],
    theme: 'striped',
    headStyles: { fillColor: [80, 80, 70], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 46, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // SECTION 5: EPD MILJØDEKLARASJON, SIRKULARITET & HELSE
  if (currentY > 220) {
    doc.addPage();
    currentY = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.text('5. Miljødeklarasjon (EPD), Sirkularitet & Helsepåvirkning', 14, currentY);
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Miljøfaktor / EPD-indikator', 'Deklarert Verdi / Ytelse']],
    body: [
      ['Globalt Oppvarmingspotensial (GWP)', `${material.epd?.gwp ?? 'N/A'} kg CO2 eq/kg ${material.epd?.gwp !== undefined && material.epd.gwp < 0 ? '(Karbonnegativt / Nettobinder CO2)' : ''}`],
      ['Resirkulert & Fornybar Andel', `${material.epd?.recycledContent ?? 0}% høstet/ombrukt råstoff`],
      ['Beregnet Teknisk Levetid', `${material.epd?.lifetime ?? 'N/A'} år i konstruksjon`],
      ['Endt Livsløp & Nedbrytbarhet (Circularity)', material.epd?.circularity || 'N/A'],
      ['Miljø- & Helserisiko / VOC-utslipp', material.healthRisk || 'Ingen spesielle risikofaktorer eller helsefarer angitt.']
    ],
    theme: 'grid',
    headStyles: { fillColor: emeraldColor, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 55, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // SECTION 6: FORSKNINGSARTIKLER & PUBLIKASJONER
  if (material.articles && material.articles.length > 0) {
    if (currentY > 220) {
      doc.addPage();
      currentY = 18;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkBg);
    doc.text('6. Vitenskapelige Publikasjoner & Referanser', 14, currentY);
    currentY += 5;

    const articleRows = material.articles.map(a => [
      a.title,
      `${a.authors} (${a.year})`,
      a.journal,
      a.summary
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Publikasjon', 'Forfattere & År', 'Tidsskrift', 'Sammendrag / Funn']],
      body: articleRows,
      theme: 'striped',
      headStyles: { fillColor: [75, 85, 95], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 7.5 },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 'auto' }
      },
      margin: { left: 14, right: 14 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // SECTION 7: ÅPNE FORSKNINGSSPØRSMÅL
  if (material.openQuestions && material.openQuestions.length > 0) {
    if (currentY > 220) {
      doc.addPage();
      currentY = 18;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkBg);
    doc.text('7. Åpne Forskningsspørsmål & Videre Undersøkelser', 14, currentY);
    currentY += 5;

    const qRows = material.openQuestions.map(q => [
      q.question,
      q.importance,
      q.status
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Spørsmål / Problemstilling', 'Viktighet', 'Status']],
      body: qRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 7.5 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 110 } },
      margin: { left: 14, right: 14 }
    });
  }
}

export function generateMaterialPDFReport(material: BioMaterial, owner?: Researcher) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  renderSingleMaterialContent(doc, material, owner);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 130);
    doc.text(`BioBuild Norge | Materialprofil & Testresultater: ${material.name}`, 14, 288);
    doc.text(`Dokument-ID: BB-${material.id.toUpperCase()} | Side ${i} av ${totalPages}`, 196, 288, { align: 'right' });
  }

  // Save PDF
  const filename = `${material.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_materialprofil_og_testresultater.pdf`;
  doc.save(filename);
}

export function generateBulkMaterialsPDFReport(materials: BioMaterial[], researchers: Researcher[]) {
  if (!materials || materials.length === 0) return;

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [70, 70, 50]; // #464632
  const darkBg: [number, number, number] = [38, 38, 30]; // #26261e
  const emeraldColor: [number, number, number] = [30, 95, 45];

  // PAGE 1: COVER & MASTER COMPARISON OVERVIEW
  let currentY = 15;

  // Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 38, 'F');

  // Accent line
  doc.setFillColor(180, 150, 60);
  doc.rect(0, 37, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('BIOBUILD NORGE — SAMLET MATERIALDOSSIER', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(215, 215, 195);
  doc.text(`Konsolidert teknisk rapport & testresultater for ${materials.length} utvalgte bio-materialer`, 14, 23);

  doc.setFontSize(8);
  doc.setTextColor(165, 165, 150);
  const genDate = new Date().toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const genTime = new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
  doc.text(`Generert: ${genDate} kl. ${genTime} | Alive Houses Research Platform | Offisiell samlerapport`, 14, 30);

  currentY = 46;

  // Executive summary intro
  doc.setTextColor(30, 30, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Eksekutiv Sammenstilling & Utvalgsoversikt', 14, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 55);
  const introLines = doc.splitTextToSize(
    `Denne samlerapporten inneholder fullstendige tekniske datablader, akkrediterte testresultater, laboratorieeksperimenter og livssyklusanalyser (EPD) for ${materials.length} utvalgte materialprofiler. Nedenfor følger en komparativ sammenstilling etterfulgt av individuelle materialdossierer.`,
    182
  );
  doc.text(introLines, 14, currentY);
  currentY += introLines.length * 4 + 4;

  // AGGREGATE STATS CARDS
  const totalExperiments = materials.reduce((acc, m) => acc + (m.experiments?.length || 0), 0);
  const totalArticles = materials.reduce((acc, m) => acc + (m.articles?.length || 0), 0);
  const totalMeasurements = materials.reduce((acc, m) => acc + (m.measurements?.length || 0), 0);
  const gwps = materials.map(m => m.epd?.gwp).filter((g): g is number => typeof g === 'number');
  const avgGwp = gwps.length > 0 ? (gwps.reduce((a, b) => a + b, 0) / gwps.length).toFixed(2) : 'N/A';
  const trls = materials.map(m => m.trl);
  const minTrl = Math.min(...trls);
  const maxTrl = Math.max(...trls);

  doc.setFillColor(247, 246, 240);
  doc.setDrawColor(215, 212, 195);
  doc.roundedRect(14, currentY, 182, 19, 2, 2, 'FD');

  const statCols = [
    { label: 'VALGTE MATERIALER', val: `${materials.length} stk` },
    { label: 'TRL-SPENN', val: `Nivå ${minTrl} - ${maxTrl}` },
    { label: 'SNITT GWP (CO2 eq)', val: `${avgGwp} kg/kg` },
    { label: 'FORSØK & MÅLINGER', val: `${totalExperiments} exp / ${totalMeasurements} målinger` },
    { label: 'PUBLIKASJONER', val: `${totalArticles} artikler` }
  ];

  statCols.forEach((col, idx) => {
    const colX = 17 + idx * 36;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(110, 110, 100);
    doc.text(col.label, colX, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 45, 35);
    doc.text(col.val, colX, currentY + 13);
  });

  currentY += 24;

  // MASTER COMPARATIVE TABLE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkBg);
  doc.text('Komparativ Matrise for Utvalgte Materialer', 14, currentY);
  currentY += 4;

  const comparisonRows = materials.map((m, idx) => {
    const owner = researchers.find(r => r.id === m.ownerId);
    return [
      `#${idx + 1}`,
      m.name,
      m.category,
      `TRL ${m.trl}`,
      m.testResults?.strengthMpa ? `${m.testResults.strengthMpa} MPa` : '-',
      m.testResults?.fireRating ? `Kl. ${m.testResults.fireRating}` : '-',
      m.epd?.gwp !== undefined ? `${m.epd.gwp}` : '-',
      m.provenTesting?.isVerified ? `JA (${m.provenTesting.badgeLevel || 'Akkreditert'})` : 'Standard lab',
      owner ? owner.name.split(' ')[0] + ' ' + (owner.name.split(' ')[1]?.[0] || '') + '.' : 'Ufordelt'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Nr', 'Materialnavn', 'Kategori', 'TRL', 'Trykk (MPa)', 'Brannklasse', 'GWP (kg)', 'Akkreditering', 'Eier']],
    body: comparisonRows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [35, 35, 30] },
    columnStyles: {
      0: { cellWidth: 10, fontStyle: 'bold' },
      1: { cellWidth: 38, fontStyle: 'bold' },
      2: { cellWidth: 26 },
      3: { cellWidth: 16 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 18, textColor: [30, 95, 45], fontStyle: 'bold' },
      7: { cellWidth: 22 },
      8: { cellWidth: 12 }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // Innholdsfortegnelse / Material Index
  if (currentY < 240) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 50);
    doc.text('Innhold i denne samlerapporten:', 14, currentY);
    currentY += 5;

    materials.forEach((m, idx) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 75);
      doc.text(`• Del ${idx + 1}: ${m.name} (${m.category}, TRL ${m.trl}) — Komplett profil, prøvinger og analyser`, 18, currentY);
      currentY += 4.2;
    });
  }

  // NOW RENDER EACH MATERIAL AS A SEPARATE DOSSIER SECTION
  materials.forEach((material, index) => {
    doc.addPage();
    const owner = researchers.find(r => r.id === material.ownerId);
    renderSingleMaterialContent(doc, material, owner, {
      isBulk: true,
      index: index + 1,
      total: materials.length
    });
  });

  // GLOBAL RUNNING FOOTER ON ALL PAGES
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 130);
    doc.text(`BioBuild Norge | Samlet Materialdossier (${materials.length} materialer)`, 14, 288);
    doc.text(`Side ${i} av ${totalPages}`, 196, 288, { align: 'right' });
  }

  // Save PDF
  const filename = `biobuild_samlerapport_${materials.length}_materialer.pdf`;
  doc.save(filename);
}


export function generateExperimentAndTestDataPDFReport(material: BioMaterial, owner?: Researcher) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [44, 82, 130]; // #2c5282 Deep Lab Blue
  const darkBg: [number, number, number] = [26, 32, 44]; // #1a202c
  const accentColor: [number, number, number] = [180, 130, 40];

  let currentY = 15;

  // Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('BIOBUILD NORGE — EKSPERIMENT- & TESTDATA RAPPORT', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 215, 230);
  doc.text('Fullstendig laboratorielogg, testmålinger og hypoteser for deling', 14, 23);

  doc.setFontSize(8);
  doc.setTextColor(160, 175, 190);
  doc.text(`Eksportert: ${new Date().toLocaleDateString('no-NO')} | Alive Houses Research Platform`, 14, 30);

  currentY = 43;

  // Material Title & Metadata
  doc.setTextColor(30, 40, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(material.name, 14, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(90, 100, 115);
  doc.text(`Kategori: ${material.category}  |  TRL Nivå: ${material.trl}/9  |  Ansvarlig forsker: ${owner ? owner.name : 'Ikke tildelt'}`, 14, currentY);
  currentY += 9;

  // Overview summary text
  doc.setFontSize(9);
  doc.setTextColor(50, 60, 75);
  const summaryText = `Denne rapporten inneholder en samlet oversikt over alle registrerte laboratorieforsøk, testresultater, tidsserie-målinger og observasjonslogger for materialet ${material.name}.`;
  const summaryLines = doc.splitTextToSize(summaryText, 182);
  doc.text(summaryLines, 14, currentY);
  currentY += summaryLines.length * 4.5 + 6;

  // SECTION 1: Technical & Laboratory Test Results
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('1. Laboratorietester & Tekniske Ytelsesmetrikker', 14, currentY);
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Testkategori', 'Resultat & Kvalitativ Beskrivelse', 'Målt Verdi / Klassifisering']],
    body: [
      ['Brannmotstand', material.testResults?.fire || 'Ikke testet', material.testResults?.fireRating ? `Klasse: ${material.testResults.fireRating}` : '-'],
      ['Fuktmotstand', material.testResults?.moisture || 'Ikke testet', '-'],
      ['Mekanisk Styrke', material.testResults?.strength || 'Ikke testet', material.testResults?.strengthMpa ? `${material.testResults.strengthMpa} MPa` : '-'],
      ['Bestandighet', material.testResults?.durability || 'Ikke testet', material.testResults?.durabilityYears ? `${material.testResults.durabilityYears} år` : '-'],
      ['Global Warming Potential (GWP)', 'Miljøpåvirkning per kg virke', material.epd?.gwp !== undefined ? `${material.epd.gwp} kg CO2 eq/kg` : '-'],
      ['Resirkulert / Sirkulær Andel', 'Andel ombrukte eller biologiske ressurser', material.epd?.recycledContent !== undefined ? `${material.epd.recycledContent}%` : '-']
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 42, fontStyle: 'bold' }, 2: { cellWidth: 45 } },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 10;

  // SECTION 2: Laboratory Experiments & Observation Logs
  if (currentY > 230) {
    doc.addPage();
    currentY = 15;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('2. Registrerte Eksperimenter & Detaljerte Observasjonslogger', 14, currentY);
  currentY += 6;

  if (material.experiments && material.experiments.length > 0) {
    material.experiments.forEach((exp, idx) => {
      if (currentY > 230) {
        doc.addPage();
        currentY = 15;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 40, 55);
      doc.text(`Eksperiment #${idx + 1}: ${exp.title}`, 14, currentY);
      
      // Status badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(exp.status === 'Fullført' ? 20 : exp.status === 'Aktiv' ? 180 : 100, exp.status === 'Fullført' ? 120 : exp.status === 'Aktiv' ? 100 : 100, 40);
      doc.text(`Status: ${exp.status}`, 150, currentY);
      currentY += 5;

      const expMetaRows = [
        ['Hypotese', exp.hypothesis || 'Ingen hypotese oppgitt'],
        ['Uavhengig variabel', exp.independentVariable || 'N/A'],
        ['Avhengig variabel', exp.dependentVariable || 'N/A'],
        ['Periode', `${exp.startDate || 'Ikke startet'} ${exp.endDate ? `til ${exp.endDate}` : '(pågående)'}`]
      ];

      if (exp.results) {
        expMetaRows.push(['Konklusjon / Resultat', exp.results]);
      }

      autoTable(doc, {
        startY: currentY,
        body: expMetaRows,
        theme: 'plain',
        bodyStyles: { fontSize: 8, textColor: [40, 40, 30] },
        columnStyles: { 0: { cellWidth: 38, fontStyle: 'bold', textColor: [70, 80, 95] } },
        margin: { left: 14, right: 14 }
      });

      // @ts-ignore
      currentY = doc.lastAutoTable.finalY + 3;

      // Log entries table for this experiment
      if (exp.logs && exp.logs.length > 0) {
        const logRows = exp.logs.map(log => [log]);
        autoTable(doc, {
          startY: currentY,
          head: [['Loggførte Observasjoner & Målinger']],
          body: logRows,
          theme: 'striped',
          headStyles: { fillColor: [225, 230, 240], textColor: [40, 50, 70], fontSize: 8, fontStyle: 'bold' },
          bodyStyles: { fontSize: 8 },
          margin: { left: 14, right: 14 }
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 8;
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 110);
        doc.text('Ingen observasjonslogger registrert for dette eksperimentet ennå.', 14, currentY);
        currentY += 8;
      }

      // Laboratorieobservasjoner & Forskningsnotater
      if (exp.notes && exp.notes.length > 0) {
        if (currentY > 230) {
          doc.addPage();
          currentY = 15;
        }

        const noteRows = exp.notes.map(n => [
          n.timestamp,
          n.category || 'Observasjon',
          n.author || 'Lab',
          n.content
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Tidspunkt', 'Kategori', 'Forsker', 'Utfyllende Laboratorieobservasjon']],
          body: noteRows,
          theme: 'grid',
          headStyles: { fillColor: [90, 90, 64], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold' },
          bodyStyles: { fontSize: 7.5 },
          columnStyles: {
            0: { cellWidth: 28 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 'auto' }
          },
          margin: { left: 14, right: 14 }
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 8;
      }
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 110);
    doc.text('Ingen eksperimenter registrert for dette materialet ennå.', 14, currentY);
    currentY += 10;
  }

  // SECTION 3: Quantitative Measurement Time Series
  if (currentY > 220) {
    doc.addPage();
    currentY = 15;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('3. Tidsserie-målinger & Eksperimentelle Målepunkter', 14, currentY);
  currentY += 5;

  if (material.measurements && material.measurements.length > 0) {
    const measRows = material.measurements.map(m => [
      m.timestamp,
      m.label,
      `${m.value} ${m.parameter === 'strength' ? 'MPa' : m.parameter === 'moisture' ? '%' : 'kg CO2'}`,
      m.experimentTitle || '-'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Dato / Tidspunkt', 'Måleparameter', 'Registrert Verdi', 'Tilknyttet Eksperiment']],
      body: measRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      columnStyles: { 0: { cellWidth: 32 }, 2: { fontStyle: 'bold' } },
      margin: { left: 14, right: 14 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 110);
    doc.text('Ingen kvantitative målepunkter logget ennå.', 14, currentY);
    currentY += 10;
  }

  // SECTION 4: Open Questions
  if (material.openQuestions && material.openQuestions.length > 0) {
    if (currentY > 220) {
      doc.addPage();
      currentY = 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('4. Åpne Forskningsspørsmål & Videre Undersøkelser', 14, currentY);
    currentY += 5;

    const qRows = material.openQuestions.map(q => [
      q.question,
      q.importance,
      q.status
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Spørsmål / Hypoteseproblemstilling', 'Viktighet', 'Status']],
      body: qRows,
      theme: 'grid',
      headStyles: { fillColor: [80, 95, 115], textColor: 255, fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      columnStyles: { 0: { fontStyle: 'bold' } },
      margin: { left: 14, right: 14 }
    });
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 130);
    doc.text(`BioBuild Norge | Eksperiment- & Testrapport: ${material.name}`, 14, 288);
    doc.text(`Side ${i} av ${totalPages}`, 190, 288, { align: 'right' });
  }

  // Save PDF
  const filename = `${material.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_eksperiment_testrapport.pdf`;
  doc.save(filename);
}

