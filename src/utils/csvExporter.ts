import { BioMaterial, Researcher, UserSpace } from '../types';

export interface CsvExportOptions {
  delimiter?: ';' | ',' | '\t';
  decimalSeparator?: ',' | '.';
  includeBom?: boolean;
  useEnglishHeaders?: boolean;
}

/**
 * Formats a value safely for CSV export according to RFC 4180 / Excel rules.
 */
function formatCsvValue(
  val: string | number | boolean | null | undefined,
  delimiter: string,
  decimalSeparator: string
): string {
  if (val === null || val === undefined) {
    return '';
  }

  if (typeof val === 'number') {
    if (isNaN(val)) return '';
    if (decimalSeparator === ',') {
      return `"${val.toString().replace('.', ',')}"`;
    }
    return val.toString();
  }

  if (typeof val === 'boolean') {
    return val ? 'JA' : 'NEI';
  }

  const str = String(val);
  // Check if string contains quotes, delimiters or newlines
  const needsQuotes = str.includes('"') || str.includes(delimiter) || str.includes('\n') || str.includes('\r');
  
  if (needsQuotes) {
    // Escape internal quotes with double quotes
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Generates CSV content from a list of bio-materials with full research and EPD metadata.
 */
export function generateMaterialsCsv(
  materials: BioMaterial[],
  researchers: Researcher[] = [],
  userSpaces: UserSpace[] = [],
  options: CsvExportOptions = {}
): string {
  const delimiter = options.delimiter ?? ';';
  const decimalSeparator = options.decimalSeparator ?? (delimiter === ';' ? ',' : '.');
  const includeBom = options.includeBom ?? true;
  const useEnglishHeaders = options.useEnglishHeaders ?? false;

  // Lookup maps
  const researcherMap = new Map<string, Researcher>();
  researchers.forEach(r => researcherMap.set(r.id, r));

  const spaceMap = new Map<string, UserSpace>();
  userSpaces.forEach(s => spaceMap.set(s.id, s));

  // Define headers
  const headers = useEnglishHeaders
    ? [
        'ID',
        'Material Name',
        'Category',
        'TRL Level (1-9)',
        'GWP Carbon Footprint (kg CO2 eq/kg)',
        'Recycled Content (%)',
        'Expected Lifetime (Years)',
        'Circularity Note',
        'Compressive Strength (MPa)',
        'Fire Rating',
        'Durability (Years)',
        'Proven Testing Certification Level',
        'Certified Standards',
        'Fire Test Notes',
        'Moisture Resistance Notes',
        'Strength Test Notes',
        'Durability Test Notes',
        'Chemical Composition',
        'Biological Composition',
        'Scientific Description',
        'Application Areas',
        'Suppliers',
        'Health & Safety Notes',
        'Lead Researcher',
        'Lead Researcher Department',
        'Research Spaces & Labs',
        'Number of Research Articles',
        'Number of Open Questions',
        'Number of Experiments',
        'Sensor Measurements Count',
      ]
    : [
        'Material-ID',
        'Materialnavn',
        'Kategori',
        'TRL-Nivå (1-9)',
        'Karbonavtrykk GWP (kg CO2 eq/kg)',
        'Resirkulert innhold (%)',
        'Forventet levetid (år)',
        'Sirkularitets-profil',
        'Trykkfasthet (MPa)',
        'Brannklasse / Rating',
        'Bestandighet (år)',
        'Proven Testing Sertifisering',
        'Akkrediterte Standarder',
        'Branntest-resultat',
        'Fuktmotstand-resultat',
        'Styrketest-resultat',
        'Bestandighet-resultat',
        'Kjemisk sammensetning',
        'Biologisk organisme / oppbygning',
        'Vitenskapelig beskrivelse',
        'Bruksområder i bygg',
        'Produsenter og leverandører',
        'Helse- og miljørisiko',
        'Ansvarlig forsker',
        'Forskerens avdeling',
        'Tilknyttede Spaces & Laber',
        'Antall forskningsartikler',
        'Antall åpne forskningsspørsmål',
        'Antall registrerte eksperimenter',
        'Antall sensor-målepunkter',
      ];

  const rows: string[] = [];

  // Header row
  rows.push(headers.map(h => formatCsvValue(h, delimiter, decimalSeparator)).join(delimiter));

  // Data rows
  materials.forEach(mat => {
    const owner = mat.ownerId ? researcherMap.get(mat.ownerId) : undefined;
    const associatedSpaces = (mat.spaceIds || [])
      .map(id => spaceMap.get(id)?.name || id)
      .join(', ');

    const rowData: (string | number | boolean | null | undefined)[] = [
      mat.id,
      mat.name,
      mat.category,
      mat.trl,
      mat.epd?.gwp,
      mat.epd?.recycledContent,
      mat.epd?.lifetime,
      mat.epd?.circularity || '',
      mat.testResults?.strengthMpa,
      mat.testResults?.fireRating || '',
      mat.testResults?.durabilityYears,
      mat.provenTesting?.badgeLevel || 'Ikke sertifisert',
      (mat.provenTesting?.passedStandards || []).join(', '),
      mat.testResults?.fire || '',
      mat.testResults?.moisture || '',
      mat.testResults?.strength || '',
      mat.testResults?.durability || '',
      mat.chemicalComposition || '',
      mat.biologicalComposition || '',
      mat.description || '',
      (mat.applicationAreas || []).join(', '),
      (mat.suppliers || []).join(', '),
      mat.healthRisk || '',
      owner ? `${owner.name} (${owner.title})` : 'Ikke allokert',
      owner?.department || '',
      associatedSpaces || 'Fellesdatabase',
      mat.articles?.length || 0,
      mat.openQuestions?.length || 0,
      mat.experiments?.length || 0,
      mat.measurements?.length || 0,
    ];

    rows.push(rowData.map(v => formatCsvValue(v, delimiter, decimalSeparator)).join(delimiter));
  });

  const csvBody = rows.join('\r\n');
  return includeBom ? `\uFEFF${csvBody}` : csvBody;
}

/**
 * Downloads a generated CSV file directly in the user's browser.
 */
export function downloadMaterialsCsv(
  materials: BioMaterial[],
  researchers: Researcher[] = [],
  userSpaces: UserSpace[] = [],
  filename?: string,
  options: CsvExportOptions = {}
): void {
  const csvContent = generateMaterialsCsv(materials, researchers, userSpaces, options);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const dateStr = new Date().toISOString().split('T')[0];
  const defaultFilename = `BioBuild_Materialtabell_${materials.length}_materialer_${dateStr}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || defaultFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a comparison CSV for side-by-side technical evaluation of two materials.
 */
export function generateComparisonCsv(
  materialA: BioMaterial,
  materialB: BioMaterial,
  researchers: Researcher[] = [],
  options: CsvExportOptions = {}
): string {
  const delimiter = options.delimiter ?? ';';
  const decimalSeparator = options.decimalSeparator ?? (delimiter === ';' ? ',' : '.');
  const includeBom = options.includeBom ?? true;

  const researcherMap = new Map<string, Researcher>();
  researchers.forEach(r => researcherMap.set(r.id, r));

  const ownerA = materialA.ownerId ? researcherMap.get(materialA.ownerId)?.name : 'Ikke allokert';
  const ownerB = materialB.ownerId ? researcherMap.get(materialB.ownerId)?.name : 'Ikke allokert';

  const rows: [string, string | number | undefined, string | number | undefined][] = [
    ['Parameter / Egenskap', materialA.name, materialB.name],
    ['Material ID', materialA.id, materialB.id],
    ['Kategori', materialA.category, materialB.category],
    ['TRL Teknologisk modenhetsnivå (1-9)', materialA.trl, materialB.trl],
    ['Karbonavtrykk GWP (kg CO2 eq/kg)', materialA.epd?.gwp, materialB.epd?.gwp],
    ['Resirkulert innhold (%)', materialA.epd?.recycledContent, materialB.epd?.recycledContent],
    ['Forventet levetid (år)', materialA.epd?.lifetime, materialB.epd?.lifetime],
    ['Sirkularitet', materialA.epd?.circularity, materialB.epd?.circularity],
    ['Trykk-/Strekkfasthet (MPa)', materialA.testResults?.strengthMpa, materialB.testResults?.strengthMpa],
    ['Brannklassifisering', materialA.testResults?.fireRating, materialB.testResults?.fireRating],
    ['Bestandighet (år)', materialA.testResults?.durabilityYears, materialB.testResults?.durabilityYears],
    ['Proven Testing Sertifisering', materialA.provenTesting?.badgeLevel || 'Nei', materialB.provenTesting?.badgeLevel || 'Nei'],
    ['Akkrediterte Standarder', (materialA.provenTesting?.passedStandards || []).join(', '), (materialB.provenTesting?.passedStandards || []).join(', ')],
    ['Branntest-oppsummering', materialA.testResults?.fire, materialB.testResults?.fire],
    ['Fuktmotstand-oppsummering', materialA.testResults?.moisture, materialB.testResults?.moisture],
    ['Styrketest-oppsummering', materialA.testResults?.strength, materialB.testResults?.strength],
    ['Bestandighet-oppsummering', materialA.testResults?.durability, materialB.testResults?.durability],
    ['Kjemisk sammensetning', materialA.chemicalComposition, materialB.chemicalComposition],
    ['Biologisk sammensetning', materialA.biologicalComposition, materialB.biologicalComposition],
    ['Bruksområder', (materialA.applicationAreas || []).join(', '), (materialB.applicationAreas || []).join(', ')],
    ['Leverandører', (materialA.suppliers || []).join(', '), (materialB.suppliers || []).join(', ')],
    ['Helserisiko', materialA.healthRisk, materialB.healthRisk],
    ['Ansvarlig forsker', ownerA, ownerB],
    ['Antall artikler', materialA.articles?.length || 0, materialB.articles?.length || 0],
    ['Antall eksperimenter', materialA.experiments?.length || 0, materialB.experiments?.length || 0],
  ];

  const formattedRows = rows.map(cols =>
    cols.map(c => formatCsvValue(c, delimiter, decimalSeparator)).join(delimiter)
  );

  const csvBody = formattedRows.join('\r\n');
  return includeBom ? `\uFEFF${csvBody}` : csvBody;
}

/**
 * Downloads a comparison CSV file directly.
 */
export function downloadComparisonCsv(
  materialA: BioMaterial,
  materialB: BioMaterial,
  researchers: Researcher[] = [],
  filename?: string,
  options: CsvExportOptions = {}
): void {
  const csvContent = generateComparisonCsv(materialA, materialB, researchers, options);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const defaultFilename = `BioBuild_Sammenligning_${materialA.name.replace(/\s+/g, '_')}_vs_${materialB.name.replace(/\s+/g, '_')}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename || defaultFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
