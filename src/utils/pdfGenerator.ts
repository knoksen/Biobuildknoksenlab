import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BioMaterial, Researcher } from '../types';

export function generateMaterialPDFReport(material: BioMaterial, owner?: Researcher) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [90, 90, 64]; // #5A5A40
  const darkBg: [number, number, number] = [44, 44, 36]; // #2c2c24
  const accentColor: [number, number, number] = [180, 130, 40];

  let currentY = 15;

  // Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('BIOBUILD NORGE - RAPPORT', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 180);
  doc.text('Teknisk materialrapport & forskningsdokumentasjon', 14, 23);

  doc.setFontSize(8);
  doc.setTextColor(160, 160, 140);
  doc.text(`Generert: ${new Date().toLocaleDateString('no-NO')} | Alive Houses Platform`, 14, 29);

  currentY = 42;

  // Material Title & Basic Info
  doc.setTextColor(40, 40, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(material.name, 14, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 90);
  doc.text(`Kategori: ${material.category}  |  TRL Nivå: ${material.trl}/9  |  Forsknings-eier: ${owner ? owner.name : 'Ufordelt'}`, 14, currentY);
  currentY += 8;

  // Description
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 50);
  const descLines = doc.splitTextToSize(material.description || 'Ingen beskrivelse oppgitt.', 182);
  doc.text(descLines, 14, currentY);
  currentY += descLines.length * 4.5 + 4;

  // Key Specifications / EPD Table
  autoTable(doc, {
    startY: currentY,
    head: [['Nøkkelparameter', 'Verdi / Beskrivelse']],
    body: [
      ['Miljødeklarasjon (GWP)', `${material.epd?.gwp ?? 'N/A'} kg CO2 eq/kg`],
      ['Resirkulert andel', `${material.epd?.recycledContent ?? 0}%`],
      ['Forventet levetid', `${material.epd?.lifetime ?? 'N/A'} år`],
      ['Sirkularitets-status', material.epd?.circularity || 'N/A'],
      ['Bruksområder', material.applicationAreas?.join(', ') || 'N/A'],
      ['Leverandører/Partnere', material.suppliers?.join(', ') || 'N/A'],
      ['Helse & Sikkerhetsrisiko', material.healthRisk || 'Ingen spesielle risikofaktorer angitt']
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [40, 40, 30] },
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // Chemical & Biological Composition
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.text('1. Kjemisk og Biologisk Sammensetning', 14, currentY);
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Type', 'Komposisjonsanalyse']],
    body: [
      ['Kjemisk struktur', material.chemicalComposition || 'N/A'],
      ['Biologisk matriks', material.biologicalComposition || 'N/A']
    ],
    theme: 'striped',
    headStyles: { fillColor: [80, 80, 70], textColor: 255, fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // Test Results
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.text('2. Testresultater & Laboratoriemålinger', 14, currentY);
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Testområde', 'Resultat / Vurdering', 'Klassifisering / Verdi']],
    body: [
      ['Brannmotstand', material.testResults?.fire || 'Ikke testet', material.testResults?.fireRating ? `Klasse: ${material.testResults.fireRating}` : '-'],
      ['Fuktmotstand', material.testResults?.moisture || 'Ikke testet', '-'],
      ['Mekanisk Styrke', material.testResults?.strength || 'Ikke testet', material.testResults?.strengthMpa ? `${material.testResults.strengthMpa} MPa` : '-'],
      ['Bestandighet / Degradering', material.testResults?.durability || 'Ikke testet', material.testResults?.durabilityYears ? `${material.testResults.durabilityYears} år` : '-']
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' }, 2: { cellWidth: 40 } },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // Quantitative Measurement Points if available
  if (material.measurements && material.measurements.length > 0) {
    if (currentY > 240) {
      doc.addPage();
      currentY = 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Målepunkter & Tidsserie-logger', 14, currentY);
    currentY += 4;

    const measRows = material.measurements.map(m => [
      m.timestamp,
      m.label,
      `${m.value} ${m.parameter === 'strength' ? 'MPa' : m.parameter === 'moisture' ? '%' : 'kg CO2'}`,
      m.experimentTitle || '-'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Tidspunkt', 'Parameter', 'Måleverdi', 'Eksperiment']],
      body: measRows,
      theme: 'plain',
      headStyles: { fillColor: [220, 220, 210], textColor: 0, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // Check if we need a new page for Experiments and Articles
  if (currentY > 210) {
    doc.addPage();
    currentY = 15;
  }

  // Experiments & Log Entries
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.text('3. Laboratorieeksperimenter & Loggføringer', 14, currentY);
  currentY += 5;

  if (material.experiments && material.experiments.length > 0) {
    const expBody = material.experiments.map(e => [
      e.title,
      e.status,
      e.hypothesis || '-',
      (e.logs && e.logs.length > 0) ? e.logs.join('\n• ') : 'Ingen loggførte oppføringer'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Eksperiment Tittel', 'Status', 'Hypotese', 'Loggføringer & Observasjoner']],
      body: expBody,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      columnStyles: { 
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 20 },
        2: { cellWidth: 45 },
        3: { cellWidth: 72 }
      },
      margin: { left: 14, right: 14 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 110);
    doc.text('Ingen registrerte eksperimenter for dette materialet ennå.', 14, currentY);
    currentY += 8;
  }

  if (currentY > 220) {
    doc.addPage();
    currentY = 15;
  }

  // Research Articles & Publications
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkBg);
  doc.text('4. Forskningsartikler & Publikasjoner', 14, currentY);
  currentY += 5;

  if (material.articles && material.articles.length > 0) {
    const articleRows = material.articles.map(a => [
      a.title,
      `${a.authors} (${a.year})`,
      a.journal,
      a.summary
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Publikasjon', 'Forfattere & År', 'Tidsskrift', 'Sammendrag']],
      body: articleRows,
      theme: 'striped',
      headStyles: { fillColor: [80, 80, 70], textColor: 255, fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 }
      },
      margin: { left: 14, right: 14 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 110);
    doc.text('Ingen tilknyttede artikler registrert.', 14, currentY);
    currentY += 8;
  }

  // Open Questions
  if (material.openQuestions && material.openQuestions.length > 0) {
    if (currentY > 220) {
      doc.addPage();
      currentY = 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkBg);
    doc.text('5. Åpne Forskningsspørsmål', 14, currentY);
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
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      columnStyles: { 0: { fontStyle: 'bold' } },
      margin: { left: 14, right: 14 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 130);
    doc.text(`BioBuild Norge | Materialrapport: ${material.name}`, 14, 288);
    doc.text(`Side ${i} av ${totalPages}`, 190, 288, { align: 'right' });
  }

  // Save PDF
  const filename = `${material.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_rapport.pdf`;
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

