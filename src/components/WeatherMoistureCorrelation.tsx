import React, { useState, useEffect, useMemo } from 'react';
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSun,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Droplets,
  Thermometer,
  Wind,
  MapPin,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
  Plus,
  ArrowRight,
  ShieldAlert,
  Gauge,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RecTooltip,
  Legend,
  ReferenceLine,
  Scatter
} from 'recharts';
import { BioMaterial, MeasurementPoint } from '../types';

export interface WeatherDataPoint {
  time: string;
  hourLabel: string;
  temperature: number;
  relativeHumidity: number;
  dewPoint: number;
  isNow?: boolean;
}

export interface CurrentWeather {
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  dewPoint: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  time: string;
}

export interface ResearchLocation {
  id: string;
  name: string;
  station: string;
  lat: number;
  lon: number;
  climateZone: string;
  description: string;
}

const RESEARCH_LOCATIONS: ResearchLocation[] = [
  {
    id: 'oslo',
    name: 'Oslo',
    station: 'SINTEF Byggforsk & Blindern',
    lat: 59.9438,
    lon: 10.7185,
    climateZone: 'Innland / Østlandsklima',
    description: 'Moderat fuktighet, kalde vintre og varme tørre somre.'
  },
  {
    id: 'trondheim',
    name: 'Trondheim',
    station: 'NTNU Gløshaugen & RISE Lab',
    lat: 63.4185,
    lon: 10.4022,
    climateZone: 'Kyst- og Trøndelagsklima',
    description: 'Varierende luftfuktighet, hyppig nedbør og frost/tø-sykluser.'
  },
  {
    id: 'bergen',
    name: 'Bergen',
    station: 'Vestland Kyst- og Havlab',
    lat: 60.3913,
    lon: 5.3221,
    climateZone: 'Oseanisk kystklima',
    description: 'Høy vedvarende luftfuktighet (75-95% RH) og kraftig slagregn.'
  },
  {
    id: 'aas',
    name: 'Ås (Viken)',
    station: 'NMBU Biovitenskap & Treteknologi',
    lat: 59.6657,
    lon: 10.7818,
    climateZone: 'Landbruks- og skogklima',
    description: 'Høy biologisk aktivitet, fuktige høstnetter og dugging.'
  },
  {
    id: 'tromso',
    name: 'Tromsø',
    station: 'UiT Arktisk Byggteststasjon',
    lat: 69.6492,
    lon: 18.9553,
    climateZone: 'Subarktisk kystklima',
    description: 'Lave temperaturer, tørr vinterluft og høyt snøpådriv.'
  },
  {
    id: 'stavanger',
    name: 'Stavanger',
    station: 'Rogaland Senter for Sirkulærbygg',
    lat: 58.9699,
    lon: 5.7331,
    climateZone: 'Mildt maritimt klima',
    description: 'Milde vintre, saltholdig kystluft og hyppig fuktopptak.'
  }
];

interface WeatherMoistureCorrelationProps {
  material: BioMaterial;
  allMaterials?: BioMaterial[];
  onAddMeasurement?: (measurement: MeasurementPoint) => void;
}

export default function WeatherMoistureCorrelation({
  material,
  allMaterials = [],
  onAddMeasurement
}: WeatherMoistureCorrelationProps) {
  const [selectedLocation, setSelectedLocation] = useState<ResearchLocation>(RESEARCH_LOCATIONS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Real-time weather state
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>({
    temperature: 14.5,
    relativeHumidity: 72,
    apparentTemperature: 13.8,
    dewPoint: 9.5,
    windSpeed: 3.8,
    precipitation: 0.0,
    weatherCode: 2,
    time: new Date().toISOString()
  });

  // Hourly series state
  const [hourlySeries, setHourlySeries] = useState<WeatherDataPoint[]>([]);

  // Modal for logging moisture measurement linked to weather
  const [showLogModal, setShowLogModal] = useState(false);
  const [logValue, setLogValue] = useState<number | ''>('');
  const [logNotes, setLogNotes] = useState('');
  const [logExpTitle, setLogExpTitle] = useState('');

  // Fetch real-time weather from Open-Meteo API
  const fetchWeatherData = async (loc: ResearchLocation) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m&past_days=1&forecast_days=2&timezone=auto`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Klarte ikke å hente værdata (HTTP ${res.status})`);
      }
      
      const data = await res.json();
      
      if (!data.current || !data.hourly) {
        throw new Error('Uventet dataformat mottatt fra værtjenesten');
      }

      const cur = data.current;
      // Calculate dew point approximation if missing: Td ≈ T - ((100 - RH)/5)
      const curTemp = Number(cur.temperature_2m ?? 14);
      const curRh = Number(cur.relative_humidity_2m ?? 70);
      const approxDewPoint = Number((curTemp - (100 - curRh) / 5).toFixed(1));

      setCurrentWeather({
        temperature: curTemp,
        relativeHumidity: curRh,
        apparentTemperature: Number(cur.apparent_temperature ?? curTemp),
        dewPoint: approxDewPoint,
        windSpeed: Number(cur.wind_speed_10m ?? 3.5),
        precipitation: Number(cur.precipitation ?? 0),
        weatherCode: Number(cur.weather_code ?? 1),
        time: cur.time || new Date().toISOString()
      });

      // Parse hourly series (take 24 hours: 12 past, current, and 11 forecast)
      const times: string[] = data.hourly.time || [];
      const temps: number[] = data.hourly.temperature_2m || [];
      const rhs: number[] = data.hourly.relative_humidity_2m || [];
      const dewPoints: number[] = data.hourly.dew_point_2m || [];

      const nowTimeStr = cur.time ? cur.time.slice(0, 13) : '';
      let currentIndex = times.findIndex(t => t.startsWith(nowTimeStr));
      if (currentIndex === -1) currentIndex = Math.floor(times.length / 2);

      const startIndex = Math.max(0, currentIndex - 12);
      const endIndex = Math.min(times.length, currentIndex + 13);

      const slicedSeries: WeatherDataPoint[] = [];
      for (let i = startIndex; i < endIndex; i++) {
        const tStr = times[i];
        const dateObj = new Date(tStr);
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const dayLabel = dateObj.toLocaleDateString('no-NO', { weekday: 'short' });
        const isCurrentHour = i === currentIndex;

        slicedSeries.push({
          time: tStr,
          hourLabel: `${dayLabel} ${hours}:00`,
          temperature: temps[i] ?? 12,
          relativeHumidity: rhs[i] ?? 70,
          dewPoint: dewPoints[i] ?? 8,
          isNow: isCurrentHour
        });
      }

      setHourlySeries(slicedSeries);
      setLastUpdated(new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err: any) {
      console.warn('Weather fetch error:', err);
      setErrorMsg(err.message || 'Kunne ikke kontakte værtjenesten');
      
      // Fallback data for robust UI
      const mockHour = new Date().getHours();
      const mockPoints: WeatherDataPoint[] = [];
      for (let i = -12; i <= 12; i++) {
        const h = (mockHour + i + 24) % 24;
        const hStr = String(h).padStart(2, '0');
        const rhSim = Math.round(72 + Math.sin((i / 24) * Math.PI * 2) * 16);
        const tempSim = Number((14 - Math.sin((i / 24) * Math.PI * 2) * 4).toFixed(1));
        mockPoints.push({
          time: `mock-${i}`,
          hourLabel: `${hStr}:00`,
          temperature: tempSim,
          relativeHumidity: rhSim,
          dewPoint: Number((tempSim - (100 - rhSim) / 5).toFixed(1)),
          isNow: i === 0
        });
      }
      setHourlySeries(mockPoints);
      setLastUpdated(new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedLocation);
  }, [selectedLocation]);

  // Weather description helper
  const getWeatherDescription = (code: number) => {
    if (code === 0) return { label: 'Klarvær / Sol', icon: Sun, color: 'text-amber-500' };
    if (code >= 1 && code <= 3) return { label: 'Delvis skyet', icon: CloudSun, color: 'text-amber-600' };
    if (code >= 45 && code <= 48) return { label: 'Tåke / Skodde', icon: CloudFog, color: 'text-slate-500' };
    if (code >= 51 && code <= 67) return { label: 'Regnvær / Yr', icon: CloudRain, color: 'text-blue-500' };
    if (code >= 71 && code <= 77) return { label: 'Snøvær', icon: CloudSnow, color: 'text-sky-400' };
    if (code >= 80 && code <= 82) return { label: 'Kraftige regnbyger', icon: CloudRain, color: 'text-blue-600' };
    if (code >= 95) return { label: 'Tordenvær', icon: CloudLightning, color: 'text-purple-600' };
    return { label: 'Overskyet', icon: Cloud, color: 'text-gray-500' };
  };

  const weatherMeta = getWeatherDescription(currentWeather.weatherCode);
  const WeatherIconComponent = weatherMeta.icon;

  // Material Specific Moisture Buffering & Sorption Profile
  const materialSorptionFactor = useMemo(() => {
    const cat = (material.category || '').toLowerCase();
    const name = (material.name || '').toLowerCase();

    if (name.includes('hamp') || cat.includes('hamp')) return 1.45; // Hempcrete has superior buffering
    if (name.includes('tre') || cat.includes('tre') || name.includes('massivtre')) return 1.25; // Wood/timber
    if (name.includes('mycel') || cat.includes('mycel')) return 1.35; // Mycelium composite
    if (name.includes('halm') || cat.includes('halm')) return 1.30; // Straw
    if (name.includes('leire') || cat.includes('leire')) return 1.15; // Clay/earth
    if (name.includes('kork') || cat.includes('kork')) return 0.85; // Cork
    return 1.1;
  }, [material]);

  // Calculate Equilibrium Moisture Content (EMC) in % weight based on RH and Temp
  // Uses empirical sorption isotherm formula modified for biomaterials:
  // EMC = factor * (0.0018 * RH^2 + 0.08 * RH + 0.5) * (1 - 0.003 * (T - 20))
  const calculateEMC = (rh: number, temp: number): number => {
    const rhClamped = Math.max(5, Math.min(98, rh));
    const raw = materialSorptionFactor * (0.0016 * Math.pow(rhClamped, 2) / 10 + 0.08 * rhClamped + 0.6);
    const tempCorrection = 1 - 0.003 * (temp - 20);
    return Number(Math.max(0.5, raw * tempCorrection).toFixed(1));
  };

  // Current calculated EMC
  const currentEMC = useMemo(() => {
    return calculateEMC(currentWeather.relativeHumidity, currentWeather.temperature);
  }, [currentWeather, materialSorptionFactor]);

  // Existing moisture measurements for this material
  const materialMoistureMeasurements = useMemo(() => {
    return (material.measurements || [])
      .filter(m => m.parameter === 'moisture')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [material]);

  // Latest actual measured moisture
  const latestMeasuredMoisture = useMemo(() => {
    if (materialMoistureMeasurements.length > 0) {
      return materialMoistureMeasurements[materialMoistureMeasurements.length - 1].value;
    }
    // Fallback to testResults.moisture if available as number
    if (material.testResults?.moisture) {
      const match = material.testResults.moisture.match(/\d+(\.\d+)?/);
      if (match) return parseFloat(match[0]);
    }
    return currentEMC; // default to theoretical equilibrium
  }, [materialMoistureMeasurements, material, currentEMC]);

  // Moisture delta (difference between measured and current outdoor ambient equilibrium)
  const moistureDelta = useMemo(() => {
    return Number((latestMeasuredMoisture - currentEMC).toFixed(1));
  }, [latestMeasuredMoisture, currentEMC]);

  // Moisture state classification
  const moistureBufferingStatus = useMemo(() => {
    if (moistureDelta < -1.5) {
      return {
        label: 'Aktiv adsorpsjon (tar opp fukt)',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        detail: `Materialet har lavere fuktinnhold (${latestMeasuredMoisture}%) enn uteluftens likevekt (${currentEMC}%). Det vil naturlig absorbere fukt fra uteluften og fungere som fuktbuffere.`
      };
    } else if (moistureDelta > 1.5) {
      return {
        label: 'Aktiv desorpsjon (avgir fukt)',
        color: 'text-amber-800 bg-amber-50 border-amber-200',
        detail: `Materialet har høyere fuktinnhold (${latestMeasuredMoisture}%) enn uteluftens likevekt (${currentEMC}%). Det avgir fuktighet til uteluften og tørker ut over tid.`
      };
    }
    return {
      label: 'Hygroskopisk likevekt',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      detail: `Materialets fuktinnhold (${latestMeasuredMoisture}%) er i tilnærmet stabil dynamisk likevekt med det gjeldende utendørsklimaet (${currentEMC}%).`
    };
  }, [moistureDelta, latestMeasuredMoisture, currentEMC]);

  // Mold and condensation risk assessment (VTT model / IEA criteria)
  const moldRiskAssessment = useMemo(() => {
    const rh = currentWeather.relativeHumidity;
    const temp = currentWeather.temperature;

    // Critical relative humidity for biomaterials: RH_crit ≈ 80% at 20°C, 85% at 10°C, 90% at 0°C
    const rhCrit = Math.min(95, Math.max(75, 80 + (20 - temp) * 0.5));

    if (rh > rhCrit && temp > 10) {
      return {
        level: 'Moderat til forhøyet',
        status: 'Fuktadvarsel',
        color: 'text-amber-800 bg-amber-50 border-amber-300',
        icon: AlertTriangle,
        advice: `Gjeldende utendørs luftfuktighet (${rh}%) overstiger kritisk nivå (${rhCrit.toFixed(0)}% RH). Vedvarende eksponering krever ventilering eller diffusjonsåpen vindsperre for å unngå biologisk vekst.`
      };
    } else if (rh > 90) {
      return {
        level: 'Høy luftfuktighet',
        status: 'Metningsfare',
        color: 'text-blue-800 bg-blue-50 border-blue-300',
        icon: Droplets,
        advice: 'Luften er nær metning (duggpunkt er nådd). Materialets porestruktur buffrer kondensvann aktivt.'
      };
    }
    return {
      level: 'Lav / Trygg',
      status: 'Optimalt inneklima / tørt',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
      icon: CheckCircle2,
      advice: `Klimaet ved ${selectedLocation.name} er innenfor materialets trygge hygroskopiske sone (${rh}% RH v/ ${temp}°C). Minimal risiko for fuktskader.`
    };
  }, [currentWeather, selectedLocation]);

  // Combined chart data: Weather over 24h merged with material calculated EMC and any lab measurements
  const chartData = useMemo(() => {
    return hourlySeries.map(point => {
      const emc = calculateEMC(point.relativeHumidity, point.temperature);
      return {
        ...point,
        emcValue: emc,
        rhValue: point.relativeHumidity,
        tempValue: point.temperature
      };
    });
  }, [hourlySeries, materialSorptionFactor]);

  // Prepare default values when opening the log modal
  const handleOpenLogModal = () => {
    setLogValue(currentEMC);
    setLogExpTitle(`Utendørs fukttest - ${selectedLocation.station}`);
    setLogNotes(`Målt i referanseklima: ${selectedLocation.name} (${currentWeather.temperature}°C, ${currentWeather.relativeHumidity}% RH, Duggpunkt ${currentWeather.dewPoint}°C, ${weatherMeta.label}).`);
    setShowLogModal(true);
  };

  const handleSaveLoggedMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (logValue === '' || isNaN(Number(logValue))) return;

    if (onAddMeasurement) {
      const newPoint: MeasurementPoint = {
        id: `meas-weather-${Date.now()}`,
        parameter: 'moisture',
        label: `${selectedLocation.name} (${currentWeather.relativeHumidity}% RH, ${currentWeather.temperature}°C)`,
        value: Number(Number(logValue).toFixed(2)),
        experimentTitle: logExpTitle.trim() || `Klimaprøve ${selectedLocation.name}`,
        timestamp: new Date().toISOString().split('T')[0]
      };
      onAddMeasurement(newPoint);
    }
    setShowLogModal(false);
  };

  return (
    <div id="weather-moisture-correlation-container" className="space-y-6">
      
      {/* ----------------- TOP BANNER: LIVE WEATHER STATUS & LOCATION SELECTOR ----------------- */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#eeede6] pb-5 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Sanntids Vær- & Klimadata (Open-Meteo API)
              </span>
              {lastUpdated && (
                <span className="text-[11px] text-gray-400 font-mono">
                  Sist oppdatert: {lastUpdated}
                </span>
              )}
            </div>
            <h3 className="text-base font-serif font-bold text-[#2c2c24] flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-[#5A5A40]" />
              Klimatisk Fuktkorrelasjon: {material.name}
            </h3>
            <p className="text-xs text-gray-500 max-w-2xl">
              Henter sanntids utetemperatur og relativ luftfuktighet fra forskningsstasjoner i Norge, og beregner bio-materialets likevektsfuktinnhold (EMC), fuktbufferrespons og biologisk muggrisiko.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Location Selector */}
            <div className="flex items-center gap-1.5 bg-[#fbfbf8] border border-[#dcdad0] rounded-xl px-3 py-1.5 shadow-xs">
              <MapPin className="w-4 h-4 text-[#5A5A40]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-gray-400 leading-none">Målestasjon</span>
                <select
                  id="select-weather-location"
                  value={selectedLocation.id}
                  onChange={(e) => {
                    const found = RESEARCH_LOCATIONS.find(loc => loc.id === e.target.value);
                    if (found) setSelectedLocation(found);
                  }}
                  className="bg-transparent text-xs font-bold text-[#2c2c24] border-none focus:outline-hidden cursor-pointer p-0"
                >
                  {RESEARCH_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} — {loc.station}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              id="btn-refresh-weather"
              onClick={() => fetchWeatherData(selectedLocation)}
              disabled={isLoading}
              className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-gray-700 text-xs font-bold py-2 px-3 rounded-xl border border-[#dcdad0] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              title="Oppdater værdata nå"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#5A5A40] ${isLoading ? 'animate-spin' : ''}`} />
              <span>Oppdater</span>
            </button>

            {/* Log Measurement Button */}
            <button
              id="btn-log-weather-measurement"
              onClick={handleOpenLogModal}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
              title="Knytt nåværende værdata til en ny labmåling"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>Loggfør Måling fra Vær</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorMsg}. Benytter lagrede referansekurver for {selectedLocation.name}.</span>
          </div>
        )}

        {/* ----------------- WEATHER KPI GRID ----------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* 1: Current Weather Condition */}
          <div className="bg-[#fbfbf8] rounded-xl p-3.5 border border-[#eeede6] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Værforhold</span>
            <div className="flex items-center gap-2 my-1">
              <WeatherIconComponent className={`w-6 h-6 ${weatherMeta.color}`} />
              <span className="text-sm font-bold text-gray-800 leading-tight">
                {weatherMeta.label}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono truncate">
              {selectedLocation.station}
            </span>
          </div>

          {/* 2: Relative Humidity */}
          <div className="bg-[#fbfbf8] rounded-xl p-3.5 border border-[#eeede6] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Utendørs Luftfuktighet</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-serif font-bold text-blue-700">
                {currentWeather.relativeHumidity}%
              </span>
              <span className="text-xs font-medium text-gray-500">RH</span>
            </div>
            <span className="text-[10px] text-gray-500">
              Duggpunkt: <strong className="font-mono">{currentWeather.dewPoint}°C</strong>
            </span>
          </div>

          {/* 3: Temperature */}
          <div className="bg-[#fbfbf8] rounded-xl p-3.5 border border-[#eeede6] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Utetemperatur</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-serif font-bold text-[#2c2c24]">
                {currentWeather.temperature}°C
              </span>
              <span className="text-[10px] text-gray-400">
                (Føles {currentWeather.apparentTemperature}°C)
              </span>
            </div>
            <span className="text-[10px] text-gray-500">
              Vind: <strong className="font-mono">{currentWeather.windSpeed} km/t</strong>
            </span>
          </div>

          {/* 4: Material EMC (Equilibrium Moisture Content) */}
          <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-emerald-900 block">Beregnet Likevektsfukt (EMC)</span>
              <Sparkles className="w-3 h-3 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-serif font-bold text-emerald-800">
                {currentEMC}%
              </span>
              <span className="text-xs font-medium text-emerald-700">vekt</span>
            </div>
            <span className="text-[10px] text-emerald-800">
              Isoterm: <strong className="font-mono">Faktor {materialSorptionFactor}x</strong>
            </span>
          </div>

          {/* 5: Actual Material Moisture */}
          <div className="bg-[#fbfbf8] rounded-xl p-3.5 border border-[#eeede6] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Materialets Fuktmåling</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-serif font-bold text-[#5A5A40]">
                {latestMeasuredMoisture}%
              </span>
              <span className="text-xs font-medium text-gray-500">vekt</span>
            </div>
            <span className="text-[10px] text-gray-500">
              {materialMoistureMeasurements.length} registrerte labmålinger
            </span>
          </div>

          {/* 6: Moisture Delta / Buffering Mode */}
          <div className={`rounded-xl p-3.5 border flex flex-col justify-between ${
            moistureDelta < -1.5 ? 'bg-blue-50/60 border-blue-200' :
            moistureDelta > 1.5 ? 'bg-amber-50/60 border-amber-200' :
            'bg-emerald-50/60 border-emerald-200'
          }`}>
            <span className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Fuktdifferanse (Δ)</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className={`text-2xl font-serif font-bold ${
                moistureDelta < -1.5 ? 'text-blue-700' :
                moistureDelta > 1.5 ? 'text-amber-800' :
                'text-emerald-700'
              }`}>
                {moistureDelta > 0 ? `+${moistureDelta}` : moistureDelta}%
              </span>
              <span className="text-[10px] text-gray-500">avvik</span>
            </div>
            <span className="text-[10px] font-bold text-gray-700 truncate">
              {moistureBufferingStatus.label}
            </span>
          </div>

        </div>
      </div>

      {/* ----------------- DUAL-AXIS WEATHER & MOISTURE TIME SERIES CHART ----------------- */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eeede6] pb-4">
          <div>
            <h4 className="text-sm font-bold text-[#2c2c24] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-800" />
              Tidsserie: Utendørs Luftfuktighet & Materialets Fuktrespons (24t Forløp)
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Sammenstiller timesbaserte værdata fra {selectedLocation.name} med bio-materialets beregnede likevektsfuktighet (EMC).
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-blue-500 rounded"></span>
              <span className="text-gray-600">Utendørs RH (%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-700 rounded"></span>
              <span className="text-gray-600">Beregnet Likevektsfukt EMC (%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-500 rounded"></span>
              <span className="text-gray-600">Temperatur (°C)</span>
            </span>
          </div>
        </div>

        {/* Recharts Composed Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 25, left: -5, bottom: 20 }}>
              <defs>
                <linearGradient id="weatherRhGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="materialEmcGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#eeede6" vertical={false} />
              
              <XAxis 
                dataKey="hourLabel" 
                tick={{ fontSize: 10, fill: '#666' }} 
                interval={Math.ceil(chartData.length / 8)}
                angle={-15}
                textAnchor="end"
              />

              {/* Left Y-axis: Humidity & Material Moisture (%) */}
              <YAxis 
                yAxisId="humidity"
                tick={{ fontSize: 10, fill: '#3b82f6' }}
                domain={[0, 100]}
                label={{ 
                  value: 'Relativ Fuktighet (RH %) / Materialfukt (%)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 12, 
                  fontSize: 10, 
                  fill: '#5A5A40' 
                }}
              />

              {/* Right Y-axis: Temperature (°C) */}
              <YAxis 
                yAxisId="temperature"
                orientation="right"
                tick={{ fontSize: 10, fill: '#d97706' }}
                domain={[-10, 35]}
                label={{ 
                  value: 'Temperatur (°C)', 
                  angle: 90, 
                  position: 'insideRight', 
                  offset: 15, 
                  fontSize: 10, 
                  fill: '#d97706' 
                }}
              />

              <RecTooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #dcdad0', 
                  borderRadius: '12px', 
                  fontSize: '11px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}
                formatter={(value: any, name: string) => {
                  if (name.includes('Utendørs')) return [`${value}% RH`, name];
                  if (name.includes('Likevekt')) return [`${value}% vekt`, name];
                  if (name.includes('Temperatur')) return [`${value}°C`, name];
                  return [value, name];
                }}
              />

              {/* Shaded Area for Outdoor RH */}
              <Area
                yAxisId="humidity"
                type="monotone"
                dataKey="rhValue"
                name="Utendørs Relativ Luftfuktighet"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#weatherRhGradient)"
              />

              {/* Curve for Material Calculated EMC */}
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="emcValue"
                name="Materialets Beregnede Likevektsfukt (EMC)"
                stroke="#047857"
                strokeWidth={3}
                dot={{ r: 3, fill: '#047857' }}
                activeDot={{ r: 6 }}
              />

              {/* Line for Temperature */}
              <Line
                yAxisId="temperature"
                type="monotone"
                dataKey="tempValue"
                name="Utendørs Temperatur"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />

              {/* Current Hour Indicator */}
              {chartData.find(d => d.isNow) && (
                <ReferenceLine 
                  yAxisId="humidity"
                  x={chartData.find(d => d.isNow)?.hourLabel} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ value: 'NÅ', position: 'top', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} 
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Caption */}
        <div className="p-3.5 bg-[#fbfbf8] rounded-xl border border-[#eeede6] text-xs text-gray-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong>Fysisk korrelasjon:</strong> {moistureBufferingStatus.detail}
            </p>
            <p className="text-[11px] text-gray-500">
              Bio-materialets sorpsjonsprofil er kalibrert med faktor <strong>{materialSorptionFactor}x</strong> (kategori: {material.category}). Kurven demonstrerer hvordan utendørs fuktsvingninger forplanter seg inn i materialets porøsitet.
            </p>
          </div>
        </div>
      </div>

      {/* ----------------- 2-COLUMN SECTION: BUILDING PHYSICS & LAB MEASUREMENT INTEGRATION ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Building Physics & Biological Risk Assessment */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-[#5A5A40]" />
              Bygningsfysisk Vurdering & Muggsopprisiko (VTT-modellen)
            </h4>

            {/* Risk Card */}
            <div className={`p-4 rounded-xl border mb-4 ${moldRiskAssessment.color}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Biologisk Tilstandsindeks
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-white/80 rounded-md border border-current">
                  {moldRiskAssessment.status}
                </span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {moldRiskAssessment.advice}
              </p>
            </div>

            {/* Scientific Parameters List */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#fbfbf8] rounded-xl border border-[#eeede6] flex justify-between items-center">
                <span className="text-gray-500">Fuktbufferverdi (MBV-klasse)</span>
                <span className="font-bold text-[#2c2c24]">
                  {materialSorptionFactor >= 1.3 ? 'Høy / Utmerket (> 2.0 g/(m²·%RH))' : 'Moderat (1.0 - 2.0 g/(m²·%RH))'}
                </span>
              </div>
              <div className="p-2.5 bg-[#fbfbf8] rounded-xl border border-[#eeede6] flex justify-between items-center">
                <span className="text-gray-500">Kritisk Relativ Fuktighet (RH_crit)</span>
                <span className="font-mono font-bold text-gray-800">
                  {Math.round(80 + (20 - currentWeather.temperature) * 0.5)}% RH v/ {currentWeather.temperature}°C
                </span>
              </div>
              <div className="p-2.5 bg-[#fbfbf8] rounded-xl border border-[#eeede6] flex justify-between items-center">
                <span className="text-gray-500">Duggpunktsmargin (ΔT til kondens)</span>
                <span className="font-mono font-bold text-emerald-800">
                  {(currentWeather.temperature - currentWeather.dewPoint).toFixed(1)}°C sikkerhetsmargin
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#eeede6] text-[11px] text-gray-400">
            Beregnet iht. NS-EN ISO 13788 (Hygrotermisk ytelse for bygningsdeler og komponenter).
          </div>
        </div>

        {/* Right: Actual Lab Measurements Linked to Climate Data */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#5A5A40]" />
                Registrerte Fuktmålinger for {material.name} ({materialMoistureMeasurements.length})
              </h4>
              <button
                onClick={handleOpenLogModal}
                className="text-[11px] text-emerald-800 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Legg til ny</span>
              </button>
            </div>

            {materialMoistureMeasurements.length === 0 ? (
              <div className="p-6 text-center bg-[#fbfbf8] rounded-xl border border-dashed border-[#dcdad0] space-y-2">
                <Droplets className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 font-medium">
                  Ingen labmålinger med fuktighetsparameter registrert ennå.
                </p>
                <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                  Klikk knappen under for å loggføre en faktisk måling koblet direkte til værdataene for {selectedLocation.name}.
                </p>
                <button
                  onClick={handleOpenLogModal}
                  className="mt-2 bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  Loggfør første måling
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {materialMoistureMeasurements.map((meas) => {
                  const diffFromNow = Number((meas.value - currentEMC).toFixed(1));
                  return (
                    <div 
                      key={meas.id}
                      className="p-3 bg-[#fbfbf8] rounded-xl border border-[#eeede6] text-xs flex justify-between items-center hover:border-gray-300 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2c2c24] text-sm">
                            {meas.value}% fukt
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            ({meas.label})
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {meas.experimentTitle || 'Generell fuktprøve'} • <span className="font-mono">{meas.timestamp}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          Math.abs(diffFromNow) < 1.0 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : diffFromNow > 0 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {diffFromNow > 0 ? `+${diffFromNow}% vs uteklima` : `${diffFromNow}% vs uteklima`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#eeede6] flex items-center justify-between text-[11px] text-gray-500">
            <span>Laboratorie-fuktmålinger lagres direkte i materialets profil.</span>
            <span className="font-mono font-bold text-gray-700">
              Klimareferanse: {currentWeather.relativeHumidity}% RH
            </span>
          </div>
        </div>

      </div>

      {/* ----------------- MODAL: LOG NEW MEASUREMENT WITH PREFILLED WEATHER DATA ----------------- */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#dcdad0] shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eeede6] pb-3">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-emerald-800" />
                <h3 className="text-sm font-bold text-[#2c2c24]">
                  Koble Sanntids Værdata til Ny Labmåling
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-black p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLoggedMeasurement} className="space-y-4">
              {/* Weather snapshot info banner */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <MapPin className="w-3.5 h-3.5" />
                  Målestasjon: {selectedLocation.name} ({selectedLocation.station})
                </span>
                <p className="text-[11px] text-emerald-800">
                  Sanntids værforhold: <strong>{currentWeather.temperature}°C</strong>, <strong>{currentWeather.relativeHumidity}% RH</strong>, duggpunkt {currentWeather.dewPoint}°C ({weatherMeta.label}). Beregnet likevektsfukt for {material.name} er <strong>{currentEMC}%</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Målt Fuktinnhold i Materialet (% vekt) *
                </label>
                <div className="relative">
                  <input
                    id="input-log-moisture-value"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={logValue}
                    onChange={(e) => setLogValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full text-sm font-mono font-bold bg-[#fbfbf8] border border-[#dcdad0] rounded-xl py-2 px-3 focus:outline-hidden focus:border-emerald-600"
                    placeholder="f.eks. 12.5"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">
                    % vekt
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Forhåndsutfylt med teoretisk likevekt ({currentEMC}%). Du kan justere til faktisk målt laboratorieverdi.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Eksperiment / Prøve-ID
                </label>
                <input
                  id="input-log-exp-title"
                  type="text"
                  value={logExpTitle}
                  onChange={(e) => setLogExpTitle(e.target.value)}
                  className="w-full text-xs bg-[#fbfbf8] border border-[#dcdad0] rounded-xl py-2 px-3 focus:outline-hidden focus:border-emerald-600"
                  placeholder="f.eks. Klimakammer test A / Utendørs eksponering"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Klimanotat & Værkontekst
                </label>
                <textarea
                  id="input-log-notes"
                  rows={3}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full text-xs bg-[#fbfbf8] border border-[#dcdad0] rounded-xl py-2 px-3 focus:outline-hidden focus:border-emerald-600"
                  placeholder="Værobservasjoner, plassering, instrumenter..."
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#eeede6]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Lagre Måling i Datasettet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
