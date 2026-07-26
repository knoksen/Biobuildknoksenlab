import React, { useState, useEffect } from 'react';
import { 
  Beaker, 
  BookOpen, 
  ChevronRight, 
  Cpu, 
  Database, 
  FileText, 
  Flame, 
  HeartPulse, 
  HelpCircle, 
  Layers, 
  Leaf, 
  LineChart, 
  ListFilter, 
  Loader2, 
  Plus, 
  PlusCircle, 
  RefreshCw, 
  Search, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  Trash2, 
  TrendingDown, 
  Upload, 
  User, 
  Users, 
  CheckCircle, 
  Clock, 
  Droplets,
  Award,
  Download,
  Check,
  AlertTriangle,
  X,
  Camera,
  Image as ImageIcon,
  Sliders,
  Video,
  Terminal,
  Activity,
  Bot
} from 'lucide-react';
import { initialBioMaterials, initialResearchers } from './data';
import { BioMaterial, ResearchArticle, OpenQuestion, Experiment, Researcher, MeasurementPoint } from './types';
import UnrealBridge from './components/UnrealBridge';
import EierallokeringView from './components/EierallokeringView';
import { generateMaterialPDFReport, generateExperimentAndTestDataPDFReport } from './utils/pdfGenerator';

import {
  ResponsiveContainer,
  LineChart as RecLineChart,
  Line,
  BarChart as RecBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RecTooltip,
  Legend,
  AreaChart,
  Area,
  Cell
} from 'recharts';


export default function App() {
  // Load initial materials from localStorage or initialBioMaterials
  const [materials, setMaterials] = useState<BioMaterial[]>(() => {
    const saved = localStorage.getItem('biobuild_materials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing saved materials', e);
      }
    }
    return initialBioMaterials;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('biobuild_materials', JSON.stringify(materials));
  }, [materials]);

  // Global View State
  const [globalView, setGlobalView] = useState<'materials' | 'unreal' | 'eierallokering'>('materials');

  // Load initial researchers from localStorage or initialResearchers
  const [researchers, setResearchers] = useState<Researcher[]>(() => {
    const saved = localStorage.getItem('biobuild_researchers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing saved researchers', e);
      }
    }
    return initialResearchers;
  });

  // Save changes to researchers
  useEffect(() => {
    localStorage.setItem('biobuild_researchers', JSON.stringify(researchers));
  }, [researchers]);

  // Unreal Engine & MetaHuman Simulator States
  const [unrealConfig, setUnrealConfig] = useState({
    engineVersion: '5.4.3-Release',
    pixelStreamingPort: 3000,
    streamActive: true,
    fps: 60,
    shaderCount: 1450,
    shaderCompiled: true,
    lightingPreset: 'Studio Neutral',
    faceRig: {
      blink: 12,
      mouthOpen: 0,
      neckTilt: 5,
      creativeExpressiveness: 80,
      microDetails: 95
    }
  });

  const [evaChatMessages, setEvaChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hei! Jeg er Eva, din virtuelle MetaHuman-forskningspartner drevet av Unreal Engine 5 og generative AI-modeller. Hvilket bio-materiale eller hvilken eierallokering skal vi simulere i dag?' }
  ]);
  const [evaInputText, setEvaInputText] = useState('');
  const [evaIsThinking, setEvaIsThinking] = useState(false);
  const [unrealLogs, setUnrealLogs] = useState<string[]>([
    '[System] Initializing Vulkan RHI Backend...',
    '[System] Pixel Streaming Plugin Loaded. Binding to internal port 3000 Loop-Back.',
    '[MetaHuman] Synchronized MetaHuman DNA assets (Eva_v5.4.3).',
    '[Render] Dynamic lighting shadows generated.',
    '[System] Stream active: 60 FPS, Latency: 4.2ms.'
  ]);

  // Predictive AI Allocation States
  const [selectedMaterialIdForPredictiveAI, setSelectedMaterialIdForPredictiveAI] = useState<string>(materials[0]?.id || '');
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [predictedAllocation, setPredictedAllocation] = useState<{
    ownerId: string;
    confidence: number;
    reasoning: string;
    workloadFactor: string;
    successProbability: number;
  } | null>(null);

  // UI State
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [activeTab, setActiveTab] = useState<'oversikt' | 'tester' | 'artikler' | 'sporsmal' | 'eksperimenter' | 'analyse'>('oversikt');

  // New material creation states
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiMaterialName, setAiMaterialName] = useState('');
  const [aiMaterialCategory, setAiMaterialCategory] = useState<BioMaterial['category']>('Mykologiske');
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Manual material creation form
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState<BioMaterial['category']>('Mykologiske');
  const [manualDescription, setManualDescription] = useState('');
  const [manualChemical, setManualChemical] = useState('');
  const [manualBiological, setManualBiological] = useState('');
  const [manualTrl, setManualTrl] = useState(3);
  const [manualApplication, setManualApplication] = useState('');
  const [manualSuppliers, setManualSuppliers] = useState('');
  const [manualGwp, setManualGwp] = useState(0);
  const [manualRecycled, setManualRecycled] = useState(0);
  const [manualLifetime, setManualLifetime] = useState(30);
  const [manualCircularity, setManualCircularity] = useState('100% sirkulær');

  // Category suggestion state
  const [categorySuggestLoading, setCategorySuggestLoading] = useState(false);
  const [suggestedCategoryResult, setSuggestedCategoryResult] = useState<{
    suggestedCategory: BioMaterial['category'];
    reasoning: string;
    confidence: number;
  } | null>(null);

  // Sub-forms states for the active material
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleAuthors, setNewArticleAuthors] = useState('');
  const [newArticleYear, setNewArticleYear] = useState(new Date().getFullYear());
  const [newArticleJournal, setNewArticleJournal] = useState('');
  const [newArticleSummary, setNewArticleSummary] = useState('');
  const [newArticleUrl, setNewArticleUrl] = useState('');

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionImportance, setNewQuestionImportance] = useState<OpenQuestion['importance']>('Høy');

  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpHypothesis, setNewExpHypothesis] = useState('');
  const [newExpIndep, setNewExpIndep] = useState('');
  const [newExpDep, setNewExpDep] = useState('');

  // Resultatanalyse Measurement Inputs State
  const [newMeasParam, setNewMeasParam] = useState<'strength' | 'moisture' | 'gwp'>('strength');
  const [newMeasLabel, setNewMeasLabel] = useState('');
  const [newMeasValue, setNewMeasValue] = useState<number | ''>('');
  const [newMeasExpId, setNewMeasExpId] = useState('');
  const [selectedAnalyseMetric, setSelectedAnalyseMetric] = useState<'styrke' | 'fuktighet' | 'gwp'>('styrke');


  // AI Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { 
      role: 'assistant', 
      content: 'Hei! Jeg er din vitenskapelige AI-partner for BioBuild Lab. Spør meg om kjemi, biologiske mekanismer, nordiske brannkrav eller fuktstyring knyttet til materialene dine.' 
    }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);

  // Active experiment logs
  const [activeExpLogText, setActiveExpLogText] = useState<{ [expId: string]: string }>({});
  const [activeExpResultText, setActiveExpResultText] = useState<{ [expId: string]: string }>({});

  // Camera & Photo State
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80');
  const [compareViewMode, setCompareViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [photoDescription, setPhotoDescription] = useState('');
  const [selectedExpIdForPhoto, setSelectedExpIdForPhoto] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Gemini Visuell AI Analyse
  const [selectedGeminiModel, setSelectedGeminiModel] = useState<string>('gemini-3.6-flash');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    integrityScore: number;
    overallCondition: string;
    defectsDetected: string[];
    detailedAnalysis: string;
    recommendations: string[];
    usedModel: string;
  } | null>(null);

  // Get active material
  const activeMaterial = materials.find(m => m.id === selectedMaterialId) || materials[0];

  // Auto-select experiment when material changes or is initialized
  useEffect(() => {
    if (activeMaterial && activeMaterial.experiments && activeMaterial.experiments.length > 0) {
      setSelectedExpIdForPhoto(activeMaterial.experiments[0].id);
    } else {
      setSelectedExpIdForPhoto('');
    }
    // Clean up camera stream
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    };
  }, [selectedMaterialId]);

  // Clean up camera stream when active tab changes
  useEffect(() => {
    if (activeTab !== 'tester' && cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }, [activeTab]);

  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleStartCamera = async () => {
    setCameraError(null);
    setIsCameraStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Error starting camera:', err);
      setCameraError('Kunne ikke koble til kameraet. Vennligst sjekk kameratilgang og tillatelser.');
    } finally {
      setIsCameraStarting(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        handleStopCamera();
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImageWithGemini = async () => {
    if (!capturedImage) return;
    setIsAnalyzingImage(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capturedImage,
          referenceImage,
          materialName: activeMaterial ? activeMaterial.name : 'Bio-materiale',
          model: selectedGeminiModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunne ikke analysere testbildet med Gemini.');
      }

      const data = await response.json();
      setAiAnalysisResult(data);

      // Auto-fill or append summary to photoDescription if empty
      const autoSummary = `[Gemini Visuell AI-Analyse (${data.usedModel})]: Status: ${data.overallCondition} (${data.integrityScore}% integritet). Observasjoner: ${data.defectsDetected.join(', ')}. Vurdering: ${data.detailedAnalysis}`;
      if (!photoDescription.trim()) {
        setPhotoDescription(autoSummary);
      }
    } catch (err: any) {
      console.error('Visuell AI analysefeil:', err);
      setAnalysisError(err.message || 'Feil ved tilkobling til Gemini API for visuell analyse.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleSaveCapturedPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImage || !selectedExpIdForPhoto || !activeMaterial) return;

    const dateStr = new Date().toLocaleDateString('no-NO') + ' ' + new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
    const descriptionText = photoDescription.trim() || 'Fysisk testresultat registrert med laboratoriekamera.';
    let logMessage = `${dateStr}: [Foto-dokumentasjon] ${descriptionText} |||image:${capturedImage}`;
    if (referenceImage) {
      logMessage += `|||ref:${referenceImage}`;
    }

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          experiments: m.experiments.map(exp => {
            if (exp.id === selectedExpIdForPhoto) {
              return {
                ...exp,
                logs: [...exp.logs, logMessage]
              };
            }
            return exp;
          })
        };
      }
      return m;
    }));

    setCapturedImage(null);
    setPhotoDescription('');
    alert('Foto og logg med før-og-etter sammenligning ble lagret i eksperimentets historikk!');
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeasValue === '' || !newMeasLabel.trim() || !activeMaterial) return;

    const selectedExp = activeMaterial.experiments.find(exp => exp.id === newMeasExpId);

    const newPoint = {
      id: `meas-${Date.now()}`,
      parameter: newMeasParam,
      label: newMeasLabel.trim(),
      value: Number(newMeasValue),
      experimentTitle: selectedExp ? selectedExp.title : undefined,
      timestamp: new Date().toLocaleDateString('no-NO')
    };

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          measurements: [...(m.measurements || []), newPoint]
        };
      }
      return m;
    }));

    setNewMeasLabel('');
    setNewMeasValue('');
    setNewMeasExpId('');
  };

  const handleDeleteMeasurement = (measId: string) => {
    if (!activeMaterial) return;
    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          measurements: (m.measurements || []).filter(item => item.id !== measId)
        };
      }
      return m;
    }));
  };

  // Generate Strength over time data
  const getStrengthData = () => {
    const finalStrength = activeMaterial?.testResults?.strengthMpa || 5;
    
    // Default curve points for standard materials or interpolated for new materials
    let baseline = [
      { day: 1, verdi: Number((finalStrength * 0.1).toFixed(2)), type: 'Estimert herdeforløp' },
      { day: 3, verdi: Number((finalStrength * 0.35).toFixed(2)), type: 'Estimert herdeforløp' },
      { day: 7, verdi: Number((finalStrength * 0.65).toFixed(2)), type: 'Estimert herdeforløp' },
      { day: 14, verdi: Number((finalStrength * 0.85).toFixed(2)), type: 'Estimert herdeforløp' },
      { day: 28, verdi: finalStrength, type: 'Målverdi (Sluttfasthet)' },
    ];

    if (activeMaterial?.id === 'mat-1') {
      baseline = [
        { day: 1, verdi: 0.01, type: 'Estimert herdeforløp' },
        { day: 3, verdi: 0.04, type: 'Estimert herdeforløp' },
        { day: 7, verdi: 0.10, type: 'Estimert herdeforløp' },
        { day: 14, verdi: 0.16, type: 'Estimert herdeforløp' },
        { day: 28, verdi: 0.20, type: 'Målverdi (Sluttfasthet)' },
      ];
    } else if (activeMaterial?.id === 'mat-2') {
      baseline = [
        { day: 1, verdi: 0.05, type: 'Estimert herdeforløp' },
        { day: 3, verdi: 0.18, type: 'Estimert herdeforløp' },
        { day: 7, verdi: 0.40, type: 'Estimert herdeforløp' },
        { day: 14, verdi: 0.65, type: 'Estimert herdeforløp' },
        { day: 28, verdi: 0.80, type: 'Målverdi (Sluttfasthet)' },
      ];
    } else if (activeMaterial?.id === 'mat-3') {
      baseline = [
        { day: 1, verdi: 12.5, type: 'Estimert herdeforløp' },
        { day: 3, verdi: 24.0, type: 'Estimert herdeforløp' },
        { day: 7, verdi: 32.5, type: 'Estimert herdeforløp' },
        { day: 14, verdi: 38.0, type: 'Estimert herdeforløp' },
        { day: 28, verdi: 42.0, type: 'Målverdi (Sluttfasthet)' },
      ];
    }

    // Merge in custom strength measurements from activeMaterial.measurements
    const customPoints = (activeMaterial?.measurements || [])
      .filter(m => m.parameter === 'strength')
      .map(m => {
        // Try to parse day number from label, e.g. "Dag 12" -> 12, or default to 15
        const dayMatch = m.label.match(/\d+/);
        const parsedDay = dayMatch ? parseInt(dayMatch[0], 10) : 15;
        return {
          day: parsedDay,
          verdi: m.value,
          type: m.experimentTitle ? `Måling: ${m.experimentTitle}` : 'Egendefinert måling',
          id: m.id
        };
      });

    // Combine and sort by day
    const combined = [...baseline, ...customPoints].sort((a, b) => a.day - b.day);
    return combined;
  };

  // Generate Moisture absorption over RH % data
  const getMoistureData = () => {
    let baseline = [
      { rh: 10, verdi: 1.2, type: 'Referansekurve' },
      { rh: 30, verdi: 3.5, type: 'Referansekurve' },
      { rh: 50, verdi: 6.8, type: 'Referansekurve' },
      { rh: 70, verdi: 9.5, type: 'Referansekurve' },
      { rh: 90, verdi: 12.0, type: 'Referansekurve' },
    ];

    if (activeMaterial?.id === 'mat-1') {
      baseline = [
        { rh: 10, verdi: 1.2, type: 'Referansekurve' },
        { rh: 30, verdi: 3.5, type: 'Referansekurve' },
        { rh: 50, verdi: 6.8, type: 'Referansekurve' },
        { rh: 70, verdi: 9.5, type: 'Referansekurve' },
        { rh: 90, verdi: 12.0, type: 'Referansekurve' },
      ];
    } else if (activeMaterial?.id === 'mat-2') {
      baseline = [
        { rh: 10, verdi: 2.0, type: 'Referansekurve' },
        { rh: 30, verdi: 4.8, type: 'Referansekurve' },
        { rh: 50, verdi: 8.5, type: 'Referansekurve' },
        { rh: 70, verdi: 12.2, type: 'Referansekurve' },
        { rh: 90, verdi: 16.5, type: 'Referansekurve' },
      ];
    } else if (activeMaterial?.id === 'mat-3') {
      baseline = [
        { rh: 10, verdi: 0.5, type: 'Referansekurve' },
        { rh: 30, verdi: 1.2, type: 'Referansekurve' },
        { rh: 50, verdi: 2.1, type: 'Referansekurve' },
        { rh: 70, verdi: 3.2, type: 'Referansekurve' },
        { rh: 90, verdi: 4.5, type: 'Referansekurve' },
      ];
    } else {
      const isMoistureHigh = activeMaterial?.testResults?.moisture?.toLowerCase().includes('høy') || false;
      const factor = isMoistureHigh ? 1.5 : 1.0;
      baseline = [
        { rh: 10, verdi: Number((0.8 * factor).toFixed(1)), type: 'Referansekurve' },
        { rh: 30, verdi: Number((2.2 * factor).toFixed(1)), type: 'Referansekurve' },
        { rh: 50, verdi: Number((4.5 * factor).toFixed(1)), type: 'Referansekurve' },
        { rh: 70, verdi: Number((7.0 * factor).toFixed(1)), type: 'Referansekurve' },
        { rh: 90, verdi: Number((10.0 * factor).toFixed(1)), type: 'Referansekurve' },
      ];
    }

    // Merge in custom moisture measurements
    const customPoints = (activeMaterial?.measurements || [])
      .filter(m => m.parameter === 'moisture')
      .map(m => {
        const rhMatch = m.label.match(/\d+/);
        const parsedRh = rhMatch ? parseInt(rhMatch[0], 10) : 50;
        return {
          rh: parsedRh,
          verdi: m.value,
          type: m.experimentTitle ? `Måling: ${m.experimentTitle}` : 'Egendefinert måling',
          id: m.id
        };
      });

    const combined = [...baseline, ...customPoints].sort((a, b) => a.rh - b.rh);
    return combined;
  };

  // Generate GWP Comparison Data
  const getGwpBenchmarkData = () => {
    const list = materials.map(m => ({
      name: m.name.length > 20 ? m.name.substring(0, 18) + '...' : m.name,
      gwp: m.epd?.gwp || 0,
      isCurrent: m.id === activeMaterial?.id,
      originalName: m.name
    }));

    const hasConcreteRef = list.some(item => item.originalName.toLowerCase().includes('tradisjonell betong') || item.originalName.toLowerCase().includes('referansebetong'));
    if (!hasConcreteRef) {
      list.push({
        name: 'Tradisjonell Betong',
        gwp: 380,
        isCurrent: false,
        originalName: 'Tradisjonell Portlandbetong'
      });
      list.push({
        name: 'EPS-Isolasjon (EPS)',
        gwp: 2.5,
        isCurrent: false,
        originalName: 'Ekspandert polystyren'
      });
    }

    return list.sort((a, b) => a.gwp - b.gwp);
  };



  const handleSelectMaterial = (id: string) => {
    setSelectedMaterialId(id);
    // Keep active tab if valid, or reset to 'oversikt'
    setActiveTab('oversikt');
  };

  // Categories list
  const categories: string[] = ['Alle', 'Mykologiske', 'Plantebaserte', 'Alger & Bakterier', 'Tre & Kork', 'Annet'];

  // Filtered materials
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.chemicalComposition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.biologicalComposition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset to initial data helper
  const handleResetData = () => {
    if (window.confirm('Er du sikker på at du vil tilbakestille lab-databasen til opprinnelige test-materialer? Eventuelle egne endringer vil gå tapt.')) {
      setMaterials(initialBioMaterials);
      setSelectedMaterialId(initialBioMaterials[0].id);
      localStorage.removeItem('biobuild_materials');
    }
  };

  // Export to JSON helper
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(materials, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BioBuild_Evidence_Lab_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 1. GENERATE NEW BIO-MATERIAL (AI GEMINI PROXIED)
  const handleAiGenerateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMaterialName.trim()) return;

    setIsAiGenerating(true);
    setAiError(null);

    try {
      const response = await fetch('/api/gemini/generate-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialName: aiMaterialName,
          category: aiMaterialCategory
        })
      });

      if (!response.ok) {
        throw new Error(`Serveren returnerte status ${response.status}`);
      }

      const data = await response.json();
      
      // Construct a valid new material object with full data
      const generatedMaterial: BioMaterial = {
        id: `gen-${Date.now()}`,
        name: data.name || aiMaterialName,
        category: aiMaterialCategory,
        description: data.description || 'Ingen vitenskapelig beskrivelse ble returnert.',
        chemicalComposition: data.chemicalComposition || 'Kjemisk analyse under behandling.',
        biologicalComposition: data.biologicalComposition || 'Biologisk analyse under behandling.',
        trl: Number(data.trl) || 3,
        applicationAreas: data.applicationAreas || ['Forskningsoppsett'],
        suppliers: data.suppliers || ['BioBuild Norge Partner'],
        epd: {
          gwp: typeof data.epd?.gwp === 'number' ? data.epd.gwp : 0.0,
          recycledContent: typeof data.epd?.recycledContent === 'number' ? data.epd.recycledContent : 50,
          lifetime: typeof data.epd?.lifetime === 'number' ? data.epd.lifetime : 30,
          circularity: data.epd?.circularity || '100% resirkulerbar'
        },
        testResults: {
          fire: data.testResults?.fire || 'Brannkarakteristikk ikke testet i laboratorium ennå.',
          moisture: data.testResults?.moisture || 'Hygroskopiske fuktighetsegenskaper ikke fullført.',
          strength: data.testResults?.strength || 'Styrke under vurdering.',
          durability: data.testResults?.durability || 'Bestandighet i tøffe miljøer er uavklart.',
          fireRating: data.testResults?.fireRating || 'Ikke testet',
          strengthMpa: typeof data.testResults?.strengthMpa === 'number' ? data.testResults.strengthMpa : 0.1,
          durabilityYears: typeof data.testResults?.durabilityYears === 'number' ? data.testResults.durabilityYears : 15
        },
        healthRisk: data.healthRisk || 'Utslipps- og allergikarakteristikk ikke fastsatt.',
        articles: [],
        openQuestions: data.openQuestions?.map((q: any, i: number) => ({
          id: `q-gen-${Date.now()}-${i}`,
          question: q.question || 'Åpent forskningsspørsmål om fuktighet.',
          importance: q.importance || 'Medium',
          status: q.status || 'Åpen'
        })) || [],
        experiments: data.hypotheses?.map((h: any, i: number) => ({
          id: `exp-gen-${Date.now()}-${i}`,
          title: h.title || 'Generert testsyklus',
          hypothesis: h.hypothesis || 'Hypotese om økt stabilitet.',
          independentVariable: h.independentVariable || 'Variabel A',
          dependentVariable: h.dependentVariable || 'Variabel B',
          status: 'Utkast',
          startDate: new Date().toISOString().split('T')[0],
          logs: ['00.00.00: Forsøksoppsett generert automatisk av BioBuild AI-Lab.']
        })) || []
      };

      setMaterials(prev => [generatedMaterial, ...prev]);
      setSelectedMaterialId(generatedMaterial.id);
      setAiMaterialName('');
      setShowAddModal(false);
      setActiveTab('oversikt');
    } catch (err: any) {
      console.error('AI generation error:', err);
      setAiError(err.message || 'Klarte ikke å koble til AI Studio. Vennligst sjekk om din GEMINI_API_KEY er lagt inn i Secrets-panelet.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // 2. CREATE MANUAL MATERIAL
  const handleCreateManualMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const newMaterial: BioMaterial = {
      id: `manual-${Date.now()}`,
      name: manualName,
      category: manualCategory,
      description: manualDescription || 'Generell beskrivelse av nytt bio-materiale.',
      chemicalComposition: manualChemical || 'Uoppgitt / Under analyse',
      biologicalComposition: manualBiological || 'Uoppgitt / Under dyrking',
      trl: Number(manualTrl) || 3,
      applicationAreas: manualApplication ? manualApplication.split(',').map(s => s.trim()) : ['Ikke definert'],
      suppliers: manualSuppliers ? manualSuppliers.split(',').map(s => s.trim()) : ['BioBuild Partner'],
      epd: {
        gwp: Number(manualGwp) || 0,
        recycledContent: Number(manualRecycled) || 0,
        lifetime: Number(manualLifetime) || 30,
        circularity: manualCircularity || '100% komposterbar'
      },
      testResults: {
        fire: 'Ikke testet brannmotstand.',
        moisture: 'Ikke målt hygroskopisk buffer.',
        strength: 'Ikke utført mekanisk testing.',
        durability: 'Holdbarhet ikke sertifisert.',
        fireRating: 'N/A',
        strengthMpa: 0.1,
        durabilityYears: Number(manualLifetime) || 30
      },
      healthRisk: 'Uten kjente VOC-gasser ved romtemperatur.',
      articles: [],
      openQuestions: [],
      experiments: []
    };

    setMaterials(prev => [newMaterial, ...prev]);
    setSelectedMaterialId(newMaterial.id);
    
    // Clear form
    setManualName('');
    setManualDescription('');
    setManualChemical('');
    setManualBiological('');
    setManualTrl(3);
    setManualApplication('');
    setManualSuppliers('');
    setManualGwp(0);
    setManualRecycled(0);
    setManualLifetime(30);
    setManualCircularity('100% sirkulær');

    setShowAddModal(false);
    setActiveTab('oversikt');
  };

  // 2b. SUGGEST CATEGORY FROM DESCRIPTION (AI / LOCAL ALGORITHM)
  const handleSuggestCategory = async (name: string, description: string) => {
    if (!name.trim() && !description.trim()) return;

    setCategorySuggestLoading(true);
    setSuggestedCategoryResult(null);

    try {
      const res = await fetch('/api/gemini/suggest-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });

      if (!res.ok) {
        throw new Error('Category suggestion API failed');
      }

      const data = await res.json();
      setSuggestedCategoryResult(data);
    } catch (err) {
      console.warn('Category suggestion API failed, running intelligent local keyword algorithm fallback...', err);

      const text = (name + ' ' + description).toLowerCase();
      let cat: BioMaterial['category'] = 'Plantebaserte';
      let reasoning = '';
      let confidence = 85;

      if (text.match(/mycel|sopp|kitin|ganoderma|pleurotus|spore|hyfe|mykolog/i)) {
        cat = 'Mykologiske';
        reasoning = 'Teksten påviste soppstruktur, kitin, mykologiske sporer eller mycelium-baserte egenskaper.';
        confidence = 94;
      } else if (text.match(/alge|bakteri|alginat|cyanobakteri|kalkstein|bio-sement|micp|diatome|spirulina|tang|tare/i)) {
        cat = 'Alger & Bakterier';
        reasoning = 'Teksten identifiserte alginat, bakterieluer eller biokjemisk kalkutfelling.';
        confidence = 91;
      } else if (text.match(/tre|kork|gran|furu|massivtre|clt|spon|flis|lignin|bark|trefiber/i)) {
        cat = 'Tre & Kork';
        reasoning = 'Teksten viser kjennetegn på trefibre, lignin, massivtre eller korkkomposisjoner.';
        confidence = 89;
      } else if (text.match(/hamp|lin|halm|strå|jute|fiber|plante|cellulose|biomasse|bambus|frø|stengel/i)) {
        cat = 'Plantebaserte';
        reasoning = 'Teksten refererer til plantefibre, halm/strå eller vegetabilsk biomasse.';
        confidence = 88;
      } else {
        cat = 'Plantebaserte';
        reasoning = 'Anbefalt primærkategori basert på generell bio-basert matriks.';
        confidence = 74;
      }

      setSuggestedCategoryResult({
        suggestedCategory: cat,
        reasoning,
        confidence
      });
    } finally {
      setCategorySuggestLoading(false);
    }
  };

  // 3. DELETE MATERIAL
  const handleDeleteMaterial = (id: string, name: string) => {
    if (materials.length <= 1) {
      alert('Du må ha minst ett aktivt bio-materiale i lab-databasen.');
      return;
    }
    if (window.confirm(`Er du sikker på at du vil slette materialprofilen "${name}" fra laben?`)) {
      const remaining = materials.filter(m => m.id !== id);
      setMaterials(remaining);
      setSelectedMaterialId(remaining[0].id);
    }
  };

  // 4. ADD RESEARCH ARTICLE FOR SELECTED MATERIAL
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim() || !activeMaterial) return;

    const newArticle: ResearchArticle = {
      id: `art-${Date.now()}`,
      title: newArticleTitle,
      authors: newArticleAuthors || 'Ukjent forfatter',
      year: Number(newArticleYear) || new Date().getFullYear(),
      journal: newArticleJournal || 'Egen dokumentasjon',
      summary: newArticleSummary || 'Ingen sammendrag fylt ut.',
      url: newArticleUrl || '#'
    };

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          articles: [...m.articles, newArticle]
        };
      }
      return m;
    }));

    // Clear form
    setNewArticleTitle('');
    setNewArticleAuthors('');
    setNewArticleYear(new Date().getFullYear());
    setNewArticleJournal('');
    setNewArticleSummary('');
    setNewArticleUrl('');
  };

  // 5. ADD OPEN QUESTION
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !activeMaterial) return;

    const newQuestion: OpenQuestion = {
      id: `q-${Date.now()}`,
      question: newQuestionText,
      importance: newQuestionImportance,
      status: 'Åpen'
    };

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          openQuestions: [...m.openQuestions, newQuestion]
        };
      }
      return m;
    }));

    setNewQuestionText('');
  };

  // 6. ADD MANUAL EXPERIMENT
  const handleAddExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !activeMaterial) return;

    const newExp: Experiment = {
      id: `exp-${Date.now()}`,
      title: newExpTitle,
      hypothesis: newExpHypothesis || 'Hypotese om biologisk ytelse.',
      independentVariable: newExpIndep || 'Kontrollfaktor',
      dependentVariable: newExpDep || 'Målbart resultat',
      status: 'Utkast',
      startDate: new Date().toISOString().split('T')[0],
      logs: [`${new Date().toLocaleDateString('no-NO')}: Eksperiment opprettet og satt til utkast.`]
    };

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          experiments: [...m.experiments, newExp]
        };
      }
      return m;
    }));

    // Clear form
    setNewExpTitle('');
    setNewExpHypothesis('');
    setNewExpIndep('');
    setNewExpDep('');
  };

  // 7. AUTO-GENERATE EXPERIMENT FROM OPEN QUESTION (AI)
  const [generatingExpId, setGeneratingExpId] = useState<string | null>(null);
  
  const handleAiExploreQuestion = async (questionObj: OpenQuestion) => {
    if (!activeMaterial) return;
    setGeneratingExpId(questionObj.id);

    try {
      const response = await fetch('/api/gemini/generate-experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialName: activeMaterial.name,
          question: questionObj.question
        })
      });

      if (!response.ok) {
        throw new Error('Feil under kommunikasjon med Gemini server.');
      }

      const expData = await response.json();

      // Formulate a beautiful experiment
      const generatedExp: Experiment = {
        id: `exp-ai-${Date.now()}`,
        title: expData.title || `Forsøk: ${questionObj.question.substring(0, 30)}...`,
        hypothesis: expData.hypothesis || 'En vitenskapelig hypotese.',
        independentVariable: expData.independentVariable || 'Endret faktor',
        dependentVariable: expData.dependentVariable || 'Måleparameter',
        status: 'Aktiv',
        startDate: new Date().toISOString().split('T')[0],
        logs: [
          `${new Date().toLocaleDateString('no-NO')}: Generert automatisk av BioBuild AI-Lab basert på spørsmålet: "${questionObj.question}".`,
          ...((expData.stepByStepPlan as string[])?.map((step, idx) => `Trinn ${idx + 1}: ${step}`) || ['Forsøket er klargjort for fysisk utførelse i BioBuild-laboratoriet.'])
        ]
      };

      // Set materials and transition question status to "Under utforsking"
      setMaterials(prev => prev.map(m => {
        if (m.id === activeMaterial.id) {
          const updatedQuestions = m.openQuestions.map(q => {
            if (q.id === questionObj.id) {
              return { ...q, status: 'Under utforsking' as const };
            }
            return q;
          });
          return {
            ...m,
            openQuestions: updatedQuestions,
            experiments: [generatedExp, ...m.experiments]
          };
        }
        return m;
      }));

      // Switch to experiments tab and show notification
      setActiveTab('eksperimenter');
      alert(`AI har utformet et fullstendig forsøk: "${generatedExp.title}". Det er lagt til som Aktivt under eksperiment-fanen.`);

    } catch (err: any) {
      console.error('Error generating experiment:', err);
      alert('Klarte ikke å generere forsøksoppsett med AI. Sjekk din internettforbindelse og at du har konfigurert API-nøkkel.');
    } finally {
      setGeneratingExpId(null);
    }
  };

  // 8. ADD MANUAL LOG TO EXPERIMENT
  const handleAddLog = (expId: string) => {
    const text = activeExpLogText[expId];
    if (!text || !text.trim() || !activeMaterial) return;

    const dateStr = new Date().toLocaleDateString('no-NO') + ' ' + new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
    const logMessage = `${dateStr}: ${text}`;

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          experiments: m.experiments.map(exp => {
            if (exp.id === expId) {
              return {
                ...exp,
                logs: [...exp.logs, logMessage]
              };
            }
            return exp;
          })
        };
      }
      return m;
    }));

    setActiveExpLogText(prev => ({ ...prev, [expId]: '' }));
  };

  // 9. COMPLETE EXPERIMENT & ENTER RESULT
  const handleCompleteExperiment = (expId: string) => {
    const results = activeExpResultText[expId] || 'Eksperiment fullført. Data logget til BioBuild Lab.';
    if (!activeMaterial) return;

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          experiments: m.experiments.map(exp => {
            if (exp.id === expId) {
              return {
                ...exp,
                status: 'Fullført' as const,
                endDate: new Date().toISOString().split('T')[0],
                results,
                logs: [...exp.logs, `${new Date().toLocaleDateString('no-NO')}: Forsøket ble formelt avsluttet med konklusjon.`]
              };
            }
            return exp;
          })
        };
      }
      return m;
    }));

    setActiveExpResultText(prev => ({ ...prev, [expId]: '' }));
  };

  // UPDATE EXP STATUS DIRECTLY (Draft / Active / Completed)
  const handleUpdateExpStatus = (expId: string, status: Experiment['status']) => {
    if (!activeMaterial) return;
    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          experiments: m.experiments.map(exp => {
            if (exp.id === expId) {
              return {
                ...exp,
                status,
                logs: [...exp.logs, `${new Date().toLocaleDateString('no-NO')}: Status endret til ${status}.`]
              };
            }
            return exp;
          })
        };
      }
      return m;
    }));
  };

  // UPDATE OPEN QUESTION STATUS DIRECTLY
  const handleUpdateQuestionStatus = (qId: string, status: OpenQuestion['status']) => {
    if (!activeMaterial) return;
    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        return {
          ...m,
          openQuestions: m.openQuestions.map(q => {
            if (q.id === qId) {
              return { ...q, status };
            }
            return q;
          })
        };
      }
      return m;
    }));
  };

  // 10. AI LAB CHAT
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentChatInput.trim()) return;

    const userMessage = currentChatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setCurrentChatInput('');
    setIsChatSending(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          })),
          contextMaterial: activeMaterial
        })
      });

      if (!response.ok) {
        throw new Error('Klarte ikke koble til serveren for AI-svar.');
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Beklager, jeg opplevde en kommunikasjonsfeil. Kontroller at din GEMINI_API_KEY er registrert i Secrets-panelet til høyre i AI Studio.' 
        }
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleQuickChatPrompt = (prompt: string) => {
    setCurrentChatInput(prompt);
    // Submit slightly delayed so the user sees the input appear
    setTimeout(() => {
      // Direct call
      setIsChatSending(true);
      fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: prompt }].map(m => ({
            role: m.role,
            content: m.content
          })),
          contextMaterial: activeMaterial
        })
      })
      .then(res => res.json())
      .then(data => {
        setChatMessages(prev => [
          ...prev, 
          { role: 'user', content: prompt },
          { role: 'assistant', content: data.reply }
        ]);
      })
      .catch(err => {
        console.error(err);
        setChatMessages(prev => [
          ...prev,
          { role: 'user', content: prompt },
          { role: 'assistant', content: 'Feil ved innhenting av data fra Gemini.' }
        ]);
      })
      .finally(() => {
        setIsChatSending(false);
      });
    }, 150);
  };

  // 11. PREDICT RESEARCH OWNER (AI)
  const handlePredictOwner = async () => {
    const targetMaterial = materials.find(m => m.id === selectedMaterialIdForPredictiveAI);
    if (!targetMaterial) return;

    setPredictionLoading(true);
    setPredictionError(null);
    setPredictedAllocation(null);

    try {
      const response = await fetch('/api/gemini/predict-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material: targetMaterial,
          researchers: researchers
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      setPredictedAllocation(data);

      // Add a cool system log to the Unreal/MetaHuman panel too
      setUnrealLogs(prev => [
        `[Predictive AI] Ran allocation analysis on "${targetMaterial.name}".`,
        `[Predictive AI] Optimal Owner: ${researchers.find(r => r.id === data.ownerId)?.name || 'Ukjent'} (Confidence: ${data.confidence}%).`,
        ...prev
      ]);

    } catch (err: any) {
      console.warn('AI Predict Owner API failed, running high-fidelity local predictive engine fallback...', err);
      
      // RUN SCIENTIFIC LOCAL PREDICTIVE ALGORITHM FALLBACK
      // Simulate think delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      let matchedOwnerId = 'res-1'; // Default
      let maxScore = -1;
      const scores: { [key: string]: number } = {};

      const descLower = (targetMaterial.description || '').toLowerCase() + ' ' + (targetMaterial.name || '').toLowerCase();
      const compLower = (targetMaterial.chemicalComposition || '').toLowerCase() + ' ' + (targetMaterial.biologicalComposition || '').toLowerCase();
      const combinedText = descLower + ' ' + compLower;

      researchers.forEach(res => {
        let score = 0;
        // Match expertise tags
        res.expertise.forEach(exp => {
          if (combinedText.includes(exp.toLowerCase().substring(0, 5))) {
            score += 2.5;
          }
        });

        // Category matching
        if (targetMaterial.category === 'Mykologiske' && res.id === 'res-1') {
          score += 6.0;
        } else if (targetMaterial.category === 'Alger & Bakterier' && res.id === 'res-2') {
          score += 6.0;
        } else if (targetMaterial.category === 'Plantebaserte' && res.id === 'res-4') {
          score += 6.0;
        }

        // Carbon check
        if (targetMaterial.epd?.gwp !== undefined && targetMaterial.epd.gwp < 0 && res.id === 'res-3') {
          score += 4.0;
        }

        // Mechanical properties match
        if (targetMaterial.testResults?.strengthMpa !== undefined && targetMaterial.testResults.strengthMpa > 10 && res.id === 'res-2') {
          score += 3.0;
        }

        // Workload dampener to prevent over-allocation (load balance)
        score -= (res.activeHours * 0.015);

        // MetaHuman partner gets a random innovative bonus
        if (res.id === 'res-5') {
          score += 1.5; // Always moderate option
        }

        scores[res.id] = score;

        if (score > maxScore) {
          maxScore = score;
          matchedOwnerId = res.id;
        }
      });

      // Formulate detailed reasoning and workload descriptions dynamically
      const matchedRes = researchers.find(r => r.id === matchedOwnerId) || researchers[0];
      let reasoning = '';
      let workloadFactor = '';
      let confidence = Math.min(98, Math.max(72, Math.floor(80 + maxScore * 3)));
      let successProbability = Math.min(99, Math.max(65, Math.floor(matchedRes.successRate - (matchedRes.activeHours > 130 ? 5 : 0) + (maxScore > 5 ? 4 : -2))));

      if (matchedRes.id === 'res-1') {
        reasoning = `Materialets mykologiske profil og organiske sammensetning krever spisskompetanse innen kitinstrukturering og sopphyfer. Dr. Marianne Jensen ble valgt fordi hennes forskningshistorikk viser banebrytende resultater med Ganoderma-isolering.`;
        workloadFactor = `Dr. Marianne Jensen har for øyeblikket en moderat arbeidsmengde på ${matchedRes.activeHours} aktive timer. Hun har tilstrekkelig kapasitet til å lede dette studiet.`;
      } else if (matchedRes.id === 'res-2') {
        reasoning = `Materialets høye trykkfasthetskrav eller bakteriebaserte kalksteinsutfelling (MICP) samsvarer perfekt med Prof. Lars Solbergs bakgrunn innen bio-sementering og strukturell mekanikk.`;
        workloadFactor = `Prof. Lars Solbergs nåværende belastning er på ${matchedRes.activeHours} timer. Han har tilgjengelig kjerneforskningstid til å koordinere fasthetstestingene.`;
      } else if (matchedRes.id === 'res-3') {
        reasoning = `Dette materialets ekstremt lave drivhuspotensial (GWP) og sterke sirkulære insentiver krever Dr. Elena Rostova sin dype kompetanse innen EPD-livsløpsvurderinger og miljømessig optimalisering.`;
        workloadFactor = `Dr. Elena Rostova har en lav belastning på ${matchedRes.activeHours} timer, noe som gjør henne ideell til å lede dette livsløpsstudiet umiddelbart.`;
      } else if (matchedRes.id === 'res-4') {
        reasoning = `Med materialets fiberholdige sammensetning og fokus på plante-biomasse som hampkalk og plantefiber, er Dr. Johan Dahl den absolutt mest kvalifiserte kandidaten for å optimalisere den termiske herde-matrisen.`;
        workloadFactor = `Dr. Johan Dahl har ${matchedRes.activeHours} timer belastning. Arbeidsbelastningen er balansert og gir god tid til laboppfølging.`;
      } else {
        reasoning = `Dette tverrfaglige eller uavklarte materialet krever avansert generativ materialsyntese. MetaHuman-partneren Eva-01 ble valgt for å kjøre prediktive 3D-simuleringer i Unreal-miljøet før fysisk støping.`;
        workloadFactor = `Eva-01 (MetaHuman) kjører i sky-instanser og har ubegrenset simultankapasitet på tvers av prosjektene.`;
      }

      setPredictedAllocation({
        ownerId: matchedOwnerId,
        confidence,
        reasoning,
        workloadFactor,
        successProbability
      });

      setUnrealLogs(prev => [
        `[Predictive AI] Ran local allocation analysis on "${targetMaterial.name}".`,
        `[Predictive AI] Optimal Owner: ${matchedRes.name} (Confidence: ${confidence}%).`,
        ...prev
      ]);
    } finally {
      setPredictionLoading(false);
    }
  };

  // 12. APPROVE & ASSIGN OWNER
  const handleApproveOwner = () => {
    if (!predictedAllocation) return;
    const { ownerId } = predictedAllocation;
    const targetMaterial = materials.find(m => m.id === selectedMaterialIdForPredictiveAI);
    if (!targetMaterial) return;

    // Update material owner
    setMaterials(prev => prev.map(m => {
      if (m.id === targetMaterial.id) {
        return { ...m, ownerId };
      }
      return m;
    }));

    // Update researcher hours
    setResearchers(prev => prev.map(res => {
      if (res.id === ownerId) {
        return { ...res, activeHours: res.activeHours + 25 }; // add 25 research hours for owning this material
      }
      return res;
    }));

    // Create a cool notification log
    setUnrealLogs(prev => [
      `[Database] Successfully assigned "${targetMaterial.name}" to ${researchers.find(r => r.id === ownerId)?.name}.`,
      `[Database] Research owner updated in live schema. Allocated 25 research hours.`,
      ...prev
    ]);

    // Clear prediction card so user sees success state
    setPredictedAllocation(null);
  };

  // 13. CHAT WITH METAHUMAN EVA-01
  const handleSendEvaMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!evaInputText.trim()) return;

    const userMessage = evaInputText;
    setEvaChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setEvaInputText('');
    setEvaIsThinking(true);

    // Let's adjust the mouth and expression sliders to look interactive!
    setUnrealConfig(prev => ({
      ...prev,
      faceRig: {
        ...prev.faceRig,
        mouthOpen: 35,
        blink: 0,
        neckTilt: 15
      }
    }));

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'assistant', content: 'Du er Eva-01, en virtuell MetaHuman-forskningspartner generert i Unreal Engine 5. Svar som en intelligent, futuristisk, engasjerende AI-rådgiver på norsk.' },
            ...evaChatMessages, 
            { role: 'user', content: userMessage }
          ].map(m => ({
            role: m.role,
            content: m.content
          })),
          contextMaterial: materials.find(m => m.id === selectedMaterialIdForPredictiveAI)
        })
      });

      if (!response.ok) {
        throw new Error('MetaHuman API failed');
      }

      const data = await response.json();
      setEvaChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      
      // Update logs too
      setUnrealLogs(prev => [
        `[Eva-01] Responded: "${data.reply.substring(0, 30)}..."`,
        ...prev
      ]);

    } catch (err: any) {
      console.warn('Eva Gemini chat failed, using local fallback response', err);
      await new Promise(resolve => setTimeout(resolve, 800));

      const responseFallback = `Interessant innspill! Som din MetaHuman-partner i Unreal Engine har jeg simulert dette scenarioet. Vi bør se på hvordan cellestrukturen i materialet reagerer under kontinuerlig stressbelastning i det virtuelle klimakammeret.`;
      
      setEvaChatMessages(prev => [...prev, { role: 'assistant', content: responseFallback }]);
    } finally {
      setEvaIsThinking(false);
      // Reset sliders to normal listening/idle state
      setUnrealConfig(prev => ({
        ...prev,
        faceRig: {
          ...prev.faceRig,
          mouthOpen: 0,
          blink: 12,
          neckTilt: 5
        }
      }));
    }
  };


  // Helper colors for TRL
  const getTrlBg = (trl: number) => {
    if (trl >= 8) return 'bg-emerald-700 text-white';
    if (trl >= 5) return 'bg-[#5A5A40] text-white';
    return 'bg-amber-600 text-white';
  };

  // Helper colors for Categories
  const getCategoryColor = (cat: BioMaterial['category']) => {
    switch (cat) {
      case 'Mykologiske': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Plantebaserte': return 'bg-green-100 text-green-900 border-green-200';
      case 'Alger & Bakterier': return 'bg-cyan-100 text-cyan-900 border-cyan-200';
      case 'Tre & Kork': return 'bg-stone-100 text-stone-900 border-stone-200';
      default: return 'bg-slate-100 text-slate-900 border-slate-200';
    }
  };

  return (
    <div id="biobuild-root" className="min-h-screen bg-[#f5f5f0] text-[#2c2c24] flex flex-col font-sans selection:bg-[#5A5A40]/20 selection:text-[#2c2c24]">
      
      {/* ----------------- TOP UTILITY STRIP / INFO ----------------- */}
      <div className="bg-[#eeede6] border-b border-[#e2e1d5] text-[11px] py-1.5 px-4 md:px-8 flex justify-between items-center text-xs text-[#2c2c24]/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full inline-block animate-pulse"></span>
            <strong>ALIVE HOUSES</strong> Forskningsdatabase v3.4
          </span>
          <span className="hidden sm:inline-block">|</span>
          <span className="hidden sm:inline">Aktivt prosjekt: <strong>Karbon-negative biologiske vegger</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="btn-export"
            onClick={handleExportData}
            className="hover:text-[#5A5A40] flex items-center gap-1 transition-colors font-medium"
            title="Eksporter hele lab-databasen til en JSON-fil"
          >
            <Download className="w-3.5 h-3.5" /> Eksporter data (JSON)
          </button>
          <span>•</span>
          <button 
            id="btn-reset"
            onClick={handleResetData}
            className="hover:text-red-700 flex items-center gap-1 transition-colors font-medium text-xs"
            title="Slett endringer og gjenopprett standard bio-materialer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Gjenopprett standard
          </button>
        </div>
      </div>

      {/* ----------------- HEADER NAVIGATION ----------------- */}
      <header id="app-header" className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-5 border-b border-[#e2e1d5] bg-white/55 backdrop-blur-sm sticky top-0 z-10 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-[#5A5A40] rounded-full flex items-center justify-center shadow-inner text-white transform transition hover:scale-105">
            <Beaker className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase font-serif italic text-[#3c3c34]">
              BioBuild <span className="font-normal opacity-70">Evidence Lab</span>
            </h1>
            <p className="text-[10px] tracking-widest uppercase opacity-65 font-semibold text-[#5A5A40]">
              The Scientific Engine for Alive Houses — Kunnskap & Forsøksstyring
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-6 text-xs mr-4 py-2 px-3 border border-[#e2e1d5] rounded-xl bg-white/80">
            <div className="text-center">
              <span className="block text-[10px] uppercase opacity-50 font-bold">Materialer</span>
              <span className="font-serif italic text-sm font-bold">{materials.length}</span>
            </div>
            <div className="w-px h-6 bg-[#e2e1d5]"></div>
            <div className="text-center">
              <span className="block text-[10px] uppercase opacity-50 font-bold">Forskning</span>
              <span className="font-serif italic text-sm font-bold">
                {materials.reduce((sum, m) => sum + m.articles.length, 0)} artikler
              </span>
            </div>
            <div className="w-px h-6 bg-[#e2e1d5]"></div>
            <div className="text-center">
              <span className="block text-[10px] uppercase opacity-50 font-bold">Sirkulære mål</span>
              <span className="font-serif italic text-sm font-bold text-[#5A5A40]">Carbon-Neg</span>
            </div>
          </div>

          <button 
            id="btn-toggle-chat"
            onClick={() => setShowChatDrawer(!showChatDrawer)}
            className={`flex items-center gap-2 text-xs uppercase tracking-wider font-semibold py-2 px-3.5 rounded-full transition-all border ${
              showChatDrawer 
                ? 'bg-[#5A5A40] text-white border-[#5A5A40]' 
                : 'bg-[#eeede6] text-[#2c2c24] hover:bg-[#e2e1d5] border-[#dcdad0]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Lab-partner {showChatDrawer ? 'Aktiv' : 'Spør'}</span>
          </button>

          <button 
            id="btn-open-add-modal"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold bg-[#5A5A40] text-white py-2 px-4 rounded-full hover:bg-[#4a4a34] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nytt Materiale</span>
          </button>
        </div>
      </header>

      {/* ----------------- GLOBAL WORKSPACE SELECTOR ----------------- */}
      <div id="global-workspace-selector" className="bg-[#eeede6]/50 border-b border-[#e2e1d5] px-4 md:px-8 py-3 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            id="btn-view-materials"
            onClick={() => setGlobalView('materials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              globalView === 'materials'
                ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                : 'bg-white text-[#2c2c24]/80 border-[#e2e1d5] hover:bg-white/80'
            }`}
          >
            <Beaker className="w-3.5 h-3.5" />
            <span>🧪 Bio-Materialer Lab</span>
          </button>
          <button
            id="btn-view-unreal"
            onClick={() => setGlobalView('unreal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              globalView === 'unreal'
                ? 'bg-indigo-950 text-white border-indigo-950 shadow-sm'
                : 'bg-white text-[#2c2c24]/80 border-[#e2e1d5] hover:bg-white/80'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>🎮 Unreal & MetaHuman Bridge</span>
          </button>
          <button
            id="btn-view-eierallokering"
            onClick={() => setGlobalView('eierallokering')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              globalView === 'eierallokering'
                ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                : 'bg-white text-[#2c2c24]/80 border-[#e2e1d5] hover:bg-white/80'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-500" />
            <span>📊 AI Eierallokering & Statistikk</span>
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#2c2c24]/60 bg-white/40 px-3 py-1 rounded-lg border border-[#e2e1d5]">
          <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>Unreal Port 3000 Loop-Back: AKTIV</span>
        </div>
      </div>

      {globalView === 'materials' && (
        /* ----------------- CORE WORKSPACE GRID ----------------- */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">

        
        {/* ================= LEFT SIDEBAR: REGISTRY & SEARCH ================= */}
        <aside id="material-sidebar" className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          
          {/* Search & Filter Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e1d5] flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c2c24]/60 flex items-center justify-between">
              <span>Søk & Utvalg</span>
              <Database className="w-3.5 h-3.5" />
            </h3>
            
            {/* Text Search */}
            <div className="relative">
              <input
                id="sidebar-search-input"
                type="text"
                placeholder="Søk i biologiske profiler..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#5A5A40] text-[#2c2c24]"
              />
              <Search className="w-4 h-4 text-[#2c2c24]/40 absolute left-3 top-2.5" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2.5 top-2.5 text-[10px] text-gray-400 hover:text-black font-semibold"
                >
                  Nullstill
                </button>
              )}
            </div>

            {/* Category selection pill filter */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase text-[#2c2c24]/50">Kategorifilter:</span>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] px-2.5 py-1 rounded-md transition-all font-medium border ${
                      selectedCategory === cat 
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm' 
                        : 'bg-[#fcfcf9] text-[#2c2c24]/80 border-[#e2e1d5] hover:bg-[#eeede6]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active materials list */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e1d5] flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c2c24]/60">
                Registrerte Organismer & Materialer ({filteredMaterials.length})
              </h3>
              <span className="text-[10px] bg-[#eeede6] py-0.5 px-2 rounded font-mono font-bold text-xs">
                TRL 1-9
              </span>
            </div>

            {filteredMaterials.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#e2e1d5] rounded-xl bg-[#fdfdfb]">
                <HelpCircle className="w-8 h-8 text-amber-600 mb-2" />
                <p className="text-xs font-medium text-gray-500">Ingen materialer matcher søkekriteriene.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('Alle'); }}
                  className="mt-3 text-[10px] text-[#5A5A40] font-bold uppercase tracking-wider underline hover:opacity-85"
                >
                  Nullstill filtre
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[400px] lg:max-h-[500px]">
                {filteredMaterials.map((mat) => {
                  const isActive = mat.id === activeMaterial?.id;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => handleSelectMaterial(mat.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                        isActive 
                          ? 'bg-[#eeede6] border-[#5A5A40]/50 shadow-sm' 
                          : 'bg-[#fcfcf9] hover:bg-[#eeede6]/45 border-[#e2e1d5]'
                      }`}
                    >
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMaterial(mat.id, mat.name);
                        }}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-md text-red-600 transition-all duration-200"
                        title="Slett denne profilen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex justify-between items-start pr-4">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border ${getCategoryColor(mat.category)}`}>
                          {mat.category}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${getTrlBg(mat.trl)}`}>
                          TRL {mat.trl}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold font-serif italic mt-1.5 text-[#2c2c24] group-hover:text-[#5A5A40] transition-colors">
                        {mat.name}
                      </h4>
                      
                      <p className="text-[11px] opacity-75 line-clamp-2 mt-1 leading-relaxed">
                        {mat.description}
                      </p>

                      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-[#f0f0e8] text-[9px] font-semibold text-gray-500">
                        <span className="flex items-center gap-1 text-emerald-800">
                          <Leaf className="w-2.5 h-2.5" /> GWP: {mat.epd?.gwp}
                        </span>
                        <span>
                          {mat.openQuestions.length} spm • {mat.experiments.length} forsøk
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#eeede6]">
              <div className="bg-[#fcfcf9] rounded-xl p-3 border border-amber-200/60 bg-amber-50/20 text-[11px]">
                <p className="font-semibold text-amber-900 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-700" /> AI-Lab Generator
                </p>
                <p className="text-gray-600 mb-2">Generer fullstendige hypotetiske biologiske materialer i sanntid.</p>
                <button 
                  onClick={() => { setShowAddModal(true); }}
                  className="w-full text-center py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300 text-amber-900 font-bold uppercase tracking-wider rounded-lg transition-colors text-[10px]"
                >
                  Bruk AI Generator
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= CENTER COLUMN: THE MAIN EVIDENCE PANEL ================= */}
        <main id="evidence-dashboard" className="flex-1 flex flex-col gap-6 overflow-hidden">
          
          {/* Missing selection guard */}
          {!activeMaterial ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-[#e2e1d5] shadow-sm flex flex-col items-center justify-center flex-1">
              <Beaker className="w-12 h-12 text-[#5A5A40] opacity-40 mb-3 animate-bounce" />
              <h2 className="text-xl font-serif italic text-gray-700">Ingen aktive materialer valgt</h2>
              <p className="text-xs text-gray-500 max-w-sm mt-1">Vennligst velg et biologisk byggemateriale fra listen til venstre, eller generer et nytt med AI-motoren.</p>
            </div>
          ) : (
            <>
              {/* HEADER DETAILS DISPLAY (Top Detail Card) */}
              <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-[#e2e1d5] relative overflow-hidden">
                {/* Visual TRL level watermarked */}
                <div className="absolute top-0 right-0 p-6 text-right select-none pointer-events-none">
                  <div className="text-6xl md:text-7xl font-serif italic font-extrabold text-[#5A5A40] opacity-10">
                    TRL {activeMaterial.trl}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest font-bold opacity-30 mt-1">
                    Technology Readiness Level
                  </div>
                </div>

                <div className="max-w-2xl relative z-1">
                  <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase border ${getCategoryColor(activeMaterial.category)}`}>
                        {activeMaterial.category}
                      </span>
                      <span className="text-[11px] font-mono opacity-50 font-bold">
                        ID: {activeMaterial.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        id="btn-download-pdf-report"
                        onClick={() => {
                          const owner = researchers.find(r => r.id === activeMaterial.ownerId);
                          generateMaterialPDFReport(activeMaterial, owner);
                        }}
                        className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
                        title="Generer og last ned generell materialrapport"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-200" />
                        <span>Materialrapport</span>
                      </button>

                      <button
                        id="btn-download-experiment-pdf-report"
                        onClick={() => {
                          const owner = researchers.find(r => r.id === activeMaterial.ownerId);
                          generateExperimentAndTestDataPDFReport(activeMaterial, owner);
                        }}
                        className="flex items-center gap-1.5 bg-[#2c5282] hover:bg-[#1a365d] text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
                        title="Eksporter alle eksperimenter, logger og testdata til PDF"
                      >
                        <Beaker className="w-3.5 h-3.5 text-blue-200" />
                        <span>Eksporter Eksperiment- & Testdata (PDF)</span>
                      </button>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c2c24] font-bold">
                    {activeMaterial.name}
                  </h2>
                  <p className="text-xs md:text-sm text-[#5a5a4a] leading-relaxed mt-2 max-w-xl">
                    {activeMaterial.description}
                  </p>
                </div>

                {/* Key Quick Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#f0f0e8] relative z-1">
                  <div className="border-l-2 border-[#5A5A40] pl-3.5">
                    <div className="text-[9px] uppercase tracking-widest opacity-55 font-bold mb-0.5">Brannytelse</div>
                    <div className="text-sm font-serif italic font-bold text-gray-800">
                      {activeMaterial.testResults?.fireRating || 'Mangler data'}
                    </div>
                  </div>
                  <div className="border-l-2 border-[#5A5A40] pl-3.5">
                    <div className="text-[9px] uppercase tracking-widest opacity-55 font-bold mb-0.5">Mekanisk Styrke</div>
                    <div className="text-sm font-serif italic font-bold text-gray-800">
                      {activeMaterial.testResults?.strengthMpa ? `${activeMaterial.testResults.strengthMpa} MPa` : 'Ikke testet'}
                    </div>
                  </div>
                  <div className="border-l-2 border-[#5A5A40] pl-3.5">
                    <div className="text-[9px] uppercase tracking-widest opacity-55 font-bold mb-0.5">Dampåpenhet</div>
                    <div className="text-sm font-serif italic font-bold text-emerald-800">
                      {activeMaterial.testResults?.moisture?.includes('mugg') || activeMaterial.testResults?.moisture?.includes('fukt') ? 'Høy hygroskopisk' : 'Moderat'}
                    </div>
                  </div>
                  <div className="border-l-2 border-[#5A5A40] pl-3.5">
                    <div className="text-[9px] uppercase tracking-widest opacity-55 font-bold mb-0.5">Karbonavtrykk (GWP)</div>
                    <div className={`text-sm font-serif italic font-bold ${activeMaterial.epd?.gwp < 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {activeMaterial.epd?.gwp} kg CO₂ eq/kg
                    </div>
                  </div>
                </div>
              </div>

              {/* TABS SELECTOR */}
              <div className="flex border-b border-[#e2e1d5] overflow-x-auto gap-2 bg-[#eeede6]/45 p-1 rounded-xl">
                <button
                  id="tab-btn-oversikt"
                  onClick={() => setActiveTab('oversikt')}
                  className={`text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'oversikt'
                      ? 'bg-white text-[#5A5A40] shadow-xs border-b-2 border-[#5A5A40]'
                      : 'text-[#2c2c24]/70 hover:bg-[#eeede6] hover:text-[#2c2c24]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Sammensetning & EPD
                </button>
                <button
                  id="tab-btn-tester"
                  onClick={() => setActiveTab('tester')}
                  className={`text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'tester'
                      ? 'bg-white text-[#5A5A40] shadow-xs border-b-2 border-[#5A5A40]'
                      : 'text-[#2c2c24]/70 hover:bg-[#eeede6] hover:text-[#2c2c24]'
                  }`}
                >
                  <Beaker className="w-3.5 h-3.5" />
                  Tekniske Lab-tester
                </button>
                <button
                  id="tab-btn-artikler"
                  onClick={() => setActiveTab('artikler')}
                  className={`text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'artikler'
                      ? 'bg-white text-[#5A5A40] shadow-xs border-b-2 border-[#5A5A40]'
                      : 'text-[#2c2c24]/70 hover:bg-[#eeede6] hover:text-[#2c2c24]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Forskning & Dokumentasjon ({activeMaterial.articles.length})
                </button>
                <button
                  id="tab-btn-sporsmal"
                  onClick={() => setActiveTab('sporsmal')}
                  className={`text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'sporsmal'
                      ? 'bg-white text-[#5A5A40] shadow-xs border-b-2 border-[#5A5A40]'
                      : 'text-[#2c2c24]/70 hover:bg-[#eeede6] hover:text-[#2c2c24]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Åpne Spørsmål ({activeMaterial.openQuestions.length})
                </button>
                <button
                  id="tab-btn-eksperimenter"
                  onClick={() => setActiveTab('eksperimenter')}
                  className={`text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'eksperimenter'
                      ? 'bg-white text-[#5A5A40] shadow-xs border-b-2 border-[#5A5A40]'
                      : 'text-[#2c2c24]/70 hover:bg-[#eeede6] hover:text-[#2c2c24]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Hypoteser & Forsøk ({activeMaterial.experiments.length})
                </button>
                <button
                  id="tab-btn-analyse"
                  onClick={() => setActiveTab('analyse')}
                  className={`text-xs uppercase tracking-wider font-bold py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'analyse'
                      ? 'bg-white text-[#5A5A40] shadow-xs border-b-2 border-[#5A5A40]'
                      : 'text-[#2c2c24]/70 hover:bg-[#eeede6] hover:text-[#2c2c24]'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  Resultatanalyse
                </button>
              </div>

              {/* ================= ACTIVE TAB PANEL CONTAINER ================= */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-6">

                {/* ----------------- TAB: OVERSIKT & SAMMENSETNING ----------------- */}
                {activeTab === 'oversikt' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Chemical & Biological Composition */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-4 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5" /> Biologisk & Kjemisk Sammensetning
                        </h3>

                        <div className="mb-4">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Kjemisk Oppbygning:</span>
                          <p className="text-xs text-gray-700 bg-[#f9f9f7] p-3 rounded-xl border border-[#eeede6] leading-relaxed">
                            {activeMaterial.chemicalComposition}
                          </p>
                        </div>

                        <div className="mb-4">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Biologisk Organisme/Materiale:</span>
                          <p className="text-xs text-gray-700 bg-[#f9f9f7] p-3 rounded-xl border border-[#eeede6] leading-relaxed font-sans">
                            {activeMaterial.biologicalComposition}
                          </p>
                        </div>
                      </div>

                      {/* Chemical composition analyzer styling from the Natural Tones HTML design request */}
                      <div className="pt-4 border-t border-[#f0f0e8] mt-4">
                        <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-2.5">
                          Estimert kjemisk molekylær-analyse (%)
                        </div>
                        <div className="flex gap-1 h-3.5">
                          <div className="flex-[1] bg-[#5A5A40] rounded-l-xs" title="Organisk karbonbindemiddel (Hamp/Tre)"></div>
                          <div className="flex-[0.5] bg-[#8a8a6c]" title="Biopolymerer (Kitin/Hemicellulose)"></div>
                          <div className="flex-[0.3] bg-[#bcbc9f]" title="Hydrauliske krystaller / Kalkkrystaller"></div>
                          <div className="flex-[0.1] bg-[#e2e1d5] rounded-r-xs" title="Annet / Mineralvann"></div>
                        </div>
                        <div className="flex justify-between text-[8px] mt-1.5 font-mono opacity-70">
                          <span>Kulefiber (55%)</span>
                          <span>Biopolymerer (25%)</span>
                          <span>Bindemiddel (15%)</span>
                          <span>Fukt (5%)</span>
                        </div>
                      </div>
                    </div>

                    {/* EPD & Miljøregnskap (Environmental Product Declaration) */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-4 flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-800" /> Miljøregnskap & EPD-data
                      </h3>

                      <div className="space-y-4">
                        
                        {/* Carbon Negative highlight badge */}
                        {activeMaterial.epd?.gwp < 0 ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-start gap-2.5">
                            <TrendingDown className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-800">Karbonlagrende Materiale</div>
                              <p className="text-[10px] text-emerald-950/80 leading-relaxed mt-0.5">
                                Dette materialet har et negativt karbonavtrykk på {activeMaterial.epd?.gwp} kg CO₂-ekvivalenter per kilo, og lagrer atmosfærisk CO₂ i byggets livsløp.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-[11px] uppercase tracking-wider text-amber-800">Lavutslipps-Kandidat</div>
                              <p className="text-[10px] text-amber-950/80 leading-relaxed mt-0.5">
                                GWP på {activeMaterial.epd?.gwp} kg CO₂-ekvivalenter per kilo. Fremdeles drastisk lavere enn standard mineralull eller XPS-isolering.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#f9f9f7] p-3 rounded-xl border border-[#eeede6]">
                            <span className="text-[9px] uppercase font-bold text-gray-500 block">Sirkulært innhold</span>
                            <span className="text-xl font-serif italic font-bold text-[#2c2c24]">{activeMaterial.epd?.recycledContent}%</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">Høstet avfall / gjenvunnet</span>
                          </div>
                          <div className="bg-[#f9f9f7] p-3 rounded-xl border border-[#eeede6]">
                            <span className="text-[9px] uppercase font-bold text-gray-500 block">Designet levetid</span>
                            <span className="text-xl font-serif italic font-bold text-[#2c2c24]">{activeMaterial.epd?.lifetime} år</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">Beregnet holdbarhetsklasse</span>
                          </div>
                        </div>

                        <div className="bg-[#f9f9f7] p-3.5 rounded-xl border border-[#eeede6] space-y-1">
                          <span className="text-[9px] uppercase font-bold text-gray-500 block">Endt livsløp & Nedbrytbarhet (Circularity)</span>
                          <p className="text-xs text-[#2c2c24] font-medium leading-relaxed">
                            {activeMaterial.epd?.circularity}
                          </p>
                        </div>

                        <div className="bg-[#f9f9f7] p-3.5 rounded-xl border border-[#eeede6]">
                          <span className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Miljø- og Helserisiko (Helse- & VOC-utslipp)</span>
                          <div className="flex gap-2 items-start mt-1">
                            <HeartPulse className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {activeMaterial.healthRisk}
                            </p>
                          </div>
                        </div>

                        {activeMaterial.suppliers.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">Forskningspartnere & Leverandører:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {activeMaterial.suppliers.map((s, idx) => (
                                <span key={idx} className="text-[10px] px-2.5 py-1 bg-[#eeede6] rounded-md font-semibold text-[#2c2c24]/80 flex items-center gap-1">
                                  <Users className="w-2.5 h-2.5" /> {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- TAB: LAB TESTER & TEKNISKE METRIKKER ----------------- */}
                {activeTab === 'tester' && (
                  <div className="space-y-6">
                    {/* Top Export Banner */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#cbd5e1] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Beaker className="w-5 h-5 text-amber-100" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b]">
                            Testresultater & Laboratoriedata for {activeMaterial.name}
                          </h3>
                          <p className="text-[11px] text-[#475569] mt-0.5">
                            Oversikt over brann-, fukt-, styrke- og bestandighetstester med målinger og bilder.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const owner = researchers.find(r => r.id === activeMaterial.ownerId);
                          generateExperimentAndTestDataPDFReport(activeMaterial, owner);
                        }}
                        className="bg-[#2c5282] hover:bg-[#1a365d] text-white text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
                        title="Eksporter testdata og eksperiment-logger til PDF"
                      >
                        <FileText className="w-4 h-4 text-blue-200" />
                        <span>Eksporter Testdata (PDF)</span>
                      </button>
                    </div>

                    {/* Kamera Foto-dokumentasjon & Før-og-Etter Sammenligning */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-sm space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeede6] pb-4">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-[#5A5A40]" /> Foto-dokumentasjon & Før-og-Etter Sammenligning
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Sammenlign referansebilde (Før-bilde) med nye testresultater (Etter-bilde) side-om-side eller med interaktiv glidende sammenligning.
                          </p>
                        </div>
                        {activeMaterial.experiments && activeMaterial.experiments.length > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <label className="text-[10px] uppercase font-bold text-gray-500 whitespace-nowrap">Velg eksperiment:</label>
                            <select
                              id="photo-exp-selector"
                              value={selectedExpIdForPhoto}
                              onChange={(e) => setSelectedExpIdForPhoto(e.target.value)}
                              className="bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40] font-medium max-w-xs"
                            >
                              {activeMaterial.experiments.map(exp => (
                                <option key={exp.id} value={exp.id}>
                                  {exp.title} ({exp.status})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Content rendering */}
                      {!activeMaterial.experiments || activeMaterial.experiments.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-[#e2e1d5] rounded-xl bg-[#fdfdfb] flex flex-col items-center justify-center">
                          <Beaker className="w-8 h-8 text-[#5A5A40] opacity-40 mb-2" />
                          <p className="text-xs font-medium text-gray-500">Ingen pågående eller registrerte eksperimenter for dette materialet.</p>
                          <button
                            onClick={() => setActiveTab('eksperimenter')}
                            className="mt-3 text-[10px] bg-[#5A5A40] hover:bg-[#4a4a34] text-white py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-colors"
                          >
                            Opprett et eksperiment først
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          
                          {/* 1. Referansebilde (Før-bilde) Administrasjonspanel */}
                          <div className="bg-[#fcfcf9] p-4 rounded-2xl border border-[#eeede6] space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e293b] flex items-center gap-1.5">
                                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700" /> Referansebilde (Før-bilde / Ubehandlet prøvestykke)
                                </span>
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                  Last inn et baseline-foto av materialet før påkjenning for side-om-side sammenligning.
                                </p>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap shrink-0">
                                <label className="bg-white hover:bg-stone-50 text-[#2c2c24] border border-[#dcdad0] py-1.5 px-3 rounded-xl text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs">
                                  <Upload className="w-3 h-3 text-emerald-800" />
                                  <span>Last opp Før-bilde</span>
                                  <input type="file" accept="image/*" onChange={handleReferenceImageUpload} className="hidden" />
                                </label>

                                {referenceImage && (
                                  <button
                                    onClick={() => setReferenceImage(null)}
                                    className="text-[10px] text-red-600 hover:text-red-800 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    Fjern referanse
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                              <span className="text-[10px] font-bold uppercase text-gray-400 whitespace-nowrap">Standard referanser:</span>
                              <button
                                type="button"
                                onClick={() => setReferenceImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80')}
                                className="text-[10px] bg-white hover:bg-[#eeede6] text-gray-700 border border-[#e2e1d5] py-1 px-2.5 rounded-lg font-medium whitespace-nowrap transition-colors"
                              >
                                🌿 Ubehandlet Biomatrise
                              </button>
                              <button
                                type="button"
                                onClick={() => setReferenceImage('https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&auto=format&fit=crop&q=80')}
                                className="text-[10px] bg-white hover:bg-[#eeede6] text-gray-700 border border-[#e2e1d5] py-1 px-2.5 rounded-lg font-medium whitespace-nowrap transition-colors"
                              >
                                🌾 Kysthalm (0 timer)
                              </button>
                              <button
                                type="button"
                                onClick={() => setReferenceImage('https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80')}
                                className="text-[10px] bg-white hover:bg-[#eeede6] text-gray-700 border border-[#e2e1d5] py-1 px-2.5 rounded-lg font-medium whitespace-nowrap transition-colors"
                              >
                                🪵 Mycelium (Før test)
                              </button>
                            </div>
                          </div>

                          {/* 2. Mode Switcher & Viewports */}
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f0f4f8] p-2.5 rounded-xl border border-[#cbd5e1]">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e293b] flex items-center gap-1">
                                  <Sliders className="w-3.5 h-3.5 text-[#2c5282]" /> Visningsmodus:
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#cbd5e1] shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setCompareViewMode('slider')}
                                  className={`text-[10px] uppercase font-bold py-1 px-3 rounded-md transition-all flex items-center gap-1 ${
                                    compareViewMode === 'slider'
                                      ? 'bg-[#2c5282] text-white shadow-2xs'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <Sliders className="w-3 h-3" />
                                  <span>Glidende Sammenligning</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCompareViewMode('side-by-side')}
                                  className={`text-[10px] uppercase font-bold py-1 px-3 rounded-md transition-all flex items-center gap-1 ${
                                    compareViewMode === 'side-by-side'
                                      ? 'bg-[#2c5282] text-white shadow-2xs'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <Layers className="w-3 h-3" />
                                  <span>Side-om-side Grid</span>
                                </button>
                              </div>
                            </div>

                            {/* Viewports Rendering */}
                            {compareViewMode === 'slider' ? (
                              /* ================= GLIDENDE SPLIT SLIDER VIEW ================= */
                              <div className="space-y-3">
                                <div className="relative rounded-2xl overflow-hidden bg-[#1e293b] aspect-video border border-[#cbd5e1] select-none shadow-inner flex items-center justify-center">
                                  
                                  {/* BASE IMAGE: FØR (REFERANSE) */}
                                  {referenceImage ? (
                                    <img
                                      src={referenceImage}
                                      alt="Før (Referanse)"
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-xs bg-stone-900">
                                      <span>Ingen referansebilde innlastet</span>
                                    </div>
                                  )}

                                  <div className="absolute top-3 left-3 bg-emerald-900/90 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-xs flex items-center gap-1 z-10">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    <span>FØR (Referanse)</span>
                                  </div>

                                  {/* OVERLAY IMAGE: ETTER (TESTRESULTAT) */}
                                  <div
                                    className="absolute inset-0 overflow-hidden transition-none z-20"
                                    style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                                  >
                                    {cameraStream ? (
                                      <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                      />
                                    ) : capturedImage ? (
                                      <img
                                        src={capturedImage}
                                        alt="Etter (Testresultat)"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-stone-800/90 flex flex-col items-center justify-center text-center p-6 text-white">
                                        <Camera className="w-8 h-8 text-blue-300 opacity-60 mb-2" />
                                        <p className="text-xs text-gray-200">Start kamera eller last opp testbilde for live overlay</p>
                                      </div>
                                    )}

                                    <div className="absolute top-3 right-3 bg-blue-900/90 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-xs flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                      <span>ETTER (Testresultat)</span>
                                    </div>
                                  </div>

                                  {/* VERTICAL DIVIDER & HANDLE */}
                                  <div
                                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] cursor-ew-resize z-30"
                                    style={{ left: `${sliderPosition}%` }}
                                  >
                                    <div className="absolute top-1/2 -translate-y-1/2 -ml-3.5 w-8 h-8 rounded-full bg-white text-gray-900 text-xs font-bold shadow-lg flex items-center justify-center border-2 border-[#2c5282]">
                                      ⇄
                                    </div>
                                  </div>

                                </div>

                                {/* Slider Control Bar */}
                                <div className="bg-[#fcfcf9] p-3 rounded-xl border border-[#eeede6] space-y-1.5">
                                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-700">
                                    <span className="text-emerald-700 flex items-center gap-1">
                                      ← FØR: {100 - sliderPosition}% synlig
                                    </span>
                                    <span className="text-gray-500 font-mono">Dra glider for å avdekke tilstand</span>
                                    <span className="text-blue-700 flex items-center gap-1">
                                      ETTER: {sliderPosition}% synlig →
                                    </span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sliderPosition}
                                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                                    className="w-full accent-[#2c5282] cursor-pointer h-2 bg-gray-200 rounded-lg"
                                  />
                                </div>
                              </div>
                            ) : (
                              /* ================= SIDE-OM-SIDE GRID VIEW ================= */
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                {/* LEFT FRAME: FØR (REFERANSE) */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> FØR (Referanseprøve)
                                    </span>
                                  </div>
                                  <div className="relative rounded-xl overflow-hidden bg-stone-100 aspect-video border border-[#cbd5e1] flex items-center justify-center">
                                    {referenceImage ? (
                                      <img
                                        src={referenceImage}
                                        alt="Før (Referanse)"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="text-center p-4 text-xs text-gray-400">
                                        Ingen referanse innlastet
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* RIGHT FRAME: ETTER (TESTRESULTAT) */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> ETTER (Testresultat)
                                    </span>
                                  </div>
                                  <div className="relative rounded-xl overflow-hidden bg-stone-100 aspect-video border border-[#cbd5e1] flex items-center justify-center">
                                    {cameraStream ? (
                                      <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                      />
                                    ) : capturedImage ? (
                                      <img
                                        src={capturedImage}
                                        alt="Etter (Testresultat)"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="text-center p-4 text-xs text-gray-400">
                                        Start kamera eller last opp bilde
                                      </div>
                                    )}
                                  </div>
                                </div>

                              </div>
                            )}

                            {/* Camera Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="flex gap-2 flex-wrap">
                                {!cameraStream && !capturedImage && (
                                  <>
                                    <button
                                      onClick={handleStartCamera}
                                      disabled={isCameraStarting}
                                      className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                                    >
                                      {isCameraStarting ? (
                                        <>
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          <span>Aktiverer...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Camera className="w-3.5 h-3.5" />
                                          <span>Start Kamera</span>
                                        </>
                                      )}
                                    </button>
                                    <label className="bg-[#eeede6] text-[#2c2c24] border border-[#dcdad0] py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#e2e1d5] cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs">
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Last opp testbilde</span>
                                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                  </>
                                )}

                                {cameraStream && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={handleCapturePhoto}
                                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                                    >
                                      <Camera className="w-4 h-4" />
                                      <span>Ta Bilde Nå</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleStopCamera}
                                      className="bg-[#eeede6] hover:bg-[#e2e1d5] text-[#2c2c24] border border-[#dcdad0] py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                      Deaktiver kamera
                                    </button>
                                  </>
                                )}

                                {capturedImage && (
                                  <button
                                    type="button"
                                    onClick={() => { setCapturedImage(null); handleStartCamera(); }}
                                    className="bg-[#eeede6] hover:bg-[#e2e1d5] text-[#2c2c24] border border-[#dcdad0] py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                                  >
                                    Ta nytt bilde
                                  </button>
                                )}
                              </div>

                              {cameraError && (
                                <p className="text-[11px] text-red-600 font-semibold">{cameraError}</p>
                              )}
                            </div>
                          </div>

                          {/* 2b. Gemini Visuell Materialanalyse Modul */}
                          <div className="bg-[#f7f9fa] border border-[#cbd5e1] rounded-2xl p-4.5 space-y-4 my-4 shadow-2xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-purple-100 text-purple-800 border border-purple-200">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                    Gemini Visuell Material-Integritetsanalyse
                                  </h4>
                                  <p className="text-[11px] text-slate-500">
                                    Automatisk oppdagelse av sprekker, fuktmerker, delaminering og biologisk nedbrytning via visuell AI.
                                  </p>
                                </div>
                              </div>

                              {/* Modellvelger */}
                              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-300 shrink-0">
                                <span className="text-[10px] font-bold text-slate-500 uppercase px-1">API Modell:</span>
                                <select
                                  value={selectedGeminiModel}
                                  onChange={(e) => setSelectedGeminiModel(e.target.value)}
                                  className="text-[11px] font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-1"
                                >
                                  <option value="gemini-3.6-flash">Gemini 3.6 Flash (Standard Vision)</option>
                                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Dyp Mikroskopi)</option>
                                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Hurtigskann)</option>
                                </select>
                              </div>
                            </div>

                            {/* Analyse-knapp */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={handleAnalyzeImageWithGemini}
                                disabled={!capturedImage || isAnalyzingImage}
                                className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-40 cursor-pointer"
                              >
                                {isAnalyzingImage ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                                    <span>Gjennomfører AI-Analyse med {selectedGeminiModel}...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 text-amber-300" />
                                    <span>Kjør Visuell Integritetsanalyse på Testbilde</span>
                                  </>
                                )}
                              </button>

                              {!capturedImage && (
                                <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                                  ⚠️ Ta eller last opp et testbilde for å aktivere visuell AI-analyse
                                </span>
                              )}
                            </div>

                            {analysisError && (
                              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                                <span>{analysisError}</span>
                              </div>
                            )}

                            {/* Visning av Analyseresultat */}
                            {aiAnalysisResult && (
                              <div className="bg-white border border-purple-200 rounded-xl p-4 space-y-3.5 shadow-xs">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                                      aiAnalysisResult.integrityScore >= 80 
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                        : aiAnalysisResult.integrityScore >= 50 
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                        : 'bg-red-100 text-red-800 border border-red-300'
                                    }`}>
                                      Integritet: {aiAnalysisResult.integrityScore}%
                                    </div>
                                    <span className="text-xs font-bold text-slate-800">{aiAnalysisResult.overallCondition}</span>
                                  </div>

                                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
                                    Modell: {aiAnalysisResult.usedModel}
                                  </span>
                                </div>

                                {/* Oppdagede avvik / defekter */}
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                                    Oppdagede Visuelle Indikatorer & Defekter:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {aiAnalysisResult.defectsDetected.map((defect, i) => (
                                      <span key={i} className="text-xs bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                                        <Search className="w-3 h-3 text-purple-600" />
                                        {defect}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Detaljert analyse */}
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Faglig Visuell Vurdering:
                                  </span>
                                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                    {aiAnalysisResult.detailedAnalysis}
                                  </p>
                                </div>

                                {/* Anbefalinger */}
                                {aiAnalysisResult.recommendations && aiAnalysisResult.recommendations.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                      Anbefalte Laboratorietiltak:
                                    </span>
                                    <ul className="text-xs text-slate-700 space-y-1">
                                      {aiAnalysisResult.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                          <span className="text-purple-600 font-bold">•</span>
                                          <span>{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Kopier til loggkommentar knapp */}
                                <div className="pt-2 border-t border-slate-100 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const summary = `[AI Visuell Analyse (${aiAnalysisResult.usedModel})]: Status: ${aiAnalysisResult.overallCondition} (${aiAnalysisResult.integrityScore}% integritet). Observasjoner: ${aiAnalysisResult.defectsDetected.join(', ')}. Vurdering: ${aiAnalysisResult.detailedAnalysis}`;
                                      setPhotoDescription(summary);
                                    }}
                                    className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Overfør AI-analyse til loggkommentar</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 3. Photo details & Log Submissions */}
                          <div className="border-t border-[#f0f0e8] pt-5">
                            <form onSubmit={handleSaveCapturedPhoto} className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Valgt eksperiment:</label>
                                  <div className="p-2.5 bg-[#f9f9f7] rounded-xl border border-[#eeede6] text-xs font-semibold text-gray-800">
                                    {activeMaterial.experiments.find(e => e.id === selectedExpIdForPhoto)?.title || 'Ingen valgt'}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Sammenligningsstatus:</label>
                                  <div className="p-2.5 bg-[#f0f4f8] rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#1e293b] flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                    <span>
                                      {referenceImage ? 'Før-og-Etter Sammenligning klar' : 'Kun testbilde (Ingen referanse)'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Beskrivelse / Loggkommentar *</label>
                                <textarea
                                  required
                                  rows={2}
                                  placeholder="Beskriv observasjonen ved sammenligning. F.eks. 'Observert 15% fukt-svelging i overflaten sammenlignet med ubehandlet referanseprøve', 'Ingen fargeendring eller overflatesprekker etter 1000 sykluser'."
                                  value={photoDescription}
                                  onChange={(e) => setPhotoDescription(e.target.value)}
                                  className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40] text-[#2c2c24]"
                                ></textarea>
                              </div>

                              <div>
                                <button
                                  type="submit"
                                  disabled={!capturedImage}
                                  className="w-full bg-[#5A5A40] hover:bg-[#4a4a34] text-white py-2.5 px-5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-xs"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Lagre Før-og-Etter sammenligning i eksperiment-logg</span>
                                </button>
                              </div>
                            </form>
                          </div>

                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-5 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Fysiske Testresultater og Laboratorie-evaluering
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Brannmotstand (Fire) */}
                        <div className="bg-[#f9f9f7] p-5 rounded-2xl border border-[#eeede6] flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                                <Flame className="w-4 h-4 text-amber-700" /> Brannmotstand (ISO 1182)
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-bold font-mono">
                                Klasse {activeMaterial.testResults?.fireRating || 'Ikke målt'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {activeMaterial.testResults?.fire}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#eeede6]/80 text-[10px] text-gray-500 font-medium">
                            Status: Brannegenskaper bekreftet i vertikal branntestovn.
                          </div>
                        </div>

                        {/* Fuktmotstand & Hygroskopiske egenskaper */}
                        <div className="bg-[#f9f9f7] p-5 rounded-2xl border border-[#eeede6] flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                                <Droplets className="w-4 h-4 text-blue-700" /> Fuktoppførsel (EN ISO 12571)
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md font-bold">
                                Dampåpen
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {activeMaterial.testResults?.moisture}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#eeede6]/80 text-[10px] text-gray-500 font-medium">
                            Karakter: Fungerer som fuktbuffer i lukkede rom.
                          </div>
                        </div>

                        {/* Mekanisk Styrke (Strength) */}
                        <div className="bg-[#f9f9f7] p-5 rounded-2xl border border-[#eeede6] flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                                <Cpu className="w-4 h-4 text-stone-700" /> Trykk- & Strekkfasthet
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-stone-200 text-stone-900 rounded-md font-bold font-mono">
                                {activeMaterial.testResults?.strengthMpa ? `${activeMaterial.testResults.strengthMpa} MPa` : 'N/A'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed mb-4">
                              {activeMaterial.testResults?.strength}
                            </p>
                          </div>

                          {/* Dynamic visual strength meter */}
                          <div className="pt-2 border-t border-[#eeede6]/80">
                            <div className="flex justify-between text-[9px] text-gray-500 mb-1 font-semibold">
                              <span>Mekanisk trykkfasthetsskala</span>
                              <span>Maks testet: {activeMaterial.testResults?.strengthMpa || 0.1} MPa</span>
                            </div>
                            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#5A5A40] h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(((activeMaterial.testResults?.strengthMpa || 0.1) / 45) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
                              <span>Isolasjon (0.1 MPa)</span>
                              <span>Lettbetong (1.5 MPa)</span>
                              <span>Strukturell betong (35+ MPa)</span>
                            </div>
                          </div>
                        </div>

                        {/* Bestandighet / Holdbarhet (Durability) */}
                        <div className="bg-[#f9f9f7] p-5 rounded-2xl border border-[#eeede6] flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                                <ShieldAlert className="w-4 h-4 text-emerald-700" /> Biologisk Bestandighet & Forringelse
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md font-bold font-mono">
                                {activeMaterial.testResults?.durabilityYears || 25} År
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {activeMaterial.testResults?.durability}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#eeede6]/80 text-[10px] text-gray-500 font-medium">
                            Risiko: Redusert bestandighet ved permanent vannmetning.
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Possible application areas (Mulige bruksområder) */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-3">
                        Identifiserte og Godkjente Bruksområder i Bygg
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {activeMaterial.applicationAreas.map((area, idx) => (
                          <div key={idx} className="p-3 bg-[#fcfcf9] rounded-xl border border-[#e2e1d5] flex items-center gap-2">
                            <div className="w-5 h-5 bg-[#5A5A40]/10 text-[#5A5A40] rounded-full flex items-center justify-center font-bold text-xs">
                              {idx + 1}
                            </div>
                            <span className="text-xs font-semibold text-[#2c2c24]">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- TAB: FORSKNINGSARTIKLER & EPDER ----------------- */}
                {activeTab === 'artikler' && (
                  <div className="space-y-6">
                    
                    {/* Add research article form */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-4 flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4" /> Registrer Vitenskapelig Artikkel eller EPD-dokument
                      </h3>
                      <form onSubmit={handleAddArticle} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Tittel på artikkel *</label>
                            <input
                              type="text"
                              required
                              placeholder="F.eks. Hygrothermal behavior of mycelium insulation"
                              value={newArticleTitle}
                              onChange={(e) => setNewArticleTitle(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Forfattere *</label>
                            <input
                              type="text"
                              required
                              placeholder="F.eks. Hansson, J., NTNU Forskningsgruppe"
                              value={newArticleAuthors}
                              onChange={(e) => setNewArticleAuthors(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Utgivelsesår</label>
                            <input
                              type="number"
                              placeholder="F.eks. 2026"
                              value={newArticleYear}
                              onChange={(e) => setNewArticleYear(Number(e.target.value))}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Tidsskrift / Organisasjon</label>
                            <input
                              type="text"
                              placeholder="F.eks. SINTEF Academic"
                              value={newArticleJournal}
                              onChange={(e) => setNewArticleJournal(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Kilde-URL</label>
                            <input
                              type="text"
                              placeholder="URL-lenke til PDF/DOI"
                              value={newArticleUrl}
                              onChange={(e) => setNewArticleUrl(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Sammendrag / Konklusjon</label>
                          <textarea
                            rows={2}
                            placeholder="Kort beskrivelse av resultatene og relevans for Alive Houses..."
                            value={newArticleSummary}
                            onChange={(e) => setNewArticleSummary(e.target.value)}
                            className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                          ></textarea>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-[#5A5A40] text-white px-5 py-2 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#4a4a34] transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Registrer i databasen
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Articles List */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c2c24]/60 mb-4">
                        Knyttede Forskningartikler & Godkjenninger ({activeMaterial.articles.length})
                      </h3>

                      {activeMaterial.articles.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-[#e2e1d5] rounded-2xl text-gray-500 text-xs">
                          Ingen eksterne artikler eller EPD-dokumenter er registrert for dette materialet ennå.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {activeMaterial.articles.map((art) => (
                            <div key={art.id} className="p-4 bg-[#f9f9f7] rounded-xl border border-[#eeede6] hover:border-[#5A5A40]/40 transition-colors">
                              <div className="flex justify-between items-start gap-4">
                                <h4 className="text-xs font-bold font-serif italic text-gray-900">{art.title}</h4>
                                <span className="text-[10px] bg-stone-200 text-stone-800 py-0.5 px-2 rounded-md font-bold font-mono">
                                  {art.year}
                                </span>
                              </div>
                              
                              <p className="text-[10px] text-gray-500 font-semibold mt-1">
                                Av {art.authors} — <span className="italic">{art.journal}</span>
                              </p>

                              <p className="text-xs text-gray-700 leading-relaxed mt-2 bg-white/60 p-2.5 rounded-lg border border-[#f0f0e8]">
                                {art.summary}
                              </p>

                              {art.url && art.url !== '#' && (
                                <div className="mt-3 text-right">
                                  <a 
                                    href={art.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] text-[#5A5A40] font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                                  >
                                    Vis full kilde <ChevronRight className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ----------------- TAB: ÅPNE SPØRSMÅL ----------------- */}
                {activeTab === 'sporsmal' && (
                  <div className="space-y-6">
                    
                    {/* Add Question Form */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-4 flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4" /> Registrer Ubesvart Forskningsspørsmål
                      </h3>
                      <form onSubmit={handleAddQuestion} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Hva er det ubesvarte spørsmålet / hypotesen? *</label>
                          <input
                            type="text"
                            required
                            placeholder="F.eks. Hvordan påvirker kaldt kystklima den biologiske levedyktigheten til sporene?"
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                          />
                        </div>
                        <div className="w-36">
                          <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Prioritet</label>
                          <select
                            value={newQuestionImportance}
                            onChange={(e) => setNewQuestionImportance(e.target.value as any)}
                            className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40] font-medium"
                          >
                            <option value="Høy">Høy prioritet</option>
                            <option value="Medium">Medium prioritet</option>
                            <option value="Lav">Lav prioritet</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="bg-[#5A5A40] text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#4a4a34] transition-all"
                        >
                          Registrer
                        </button>
                      </form>
                    </div>

                    {/* Questions list with AI-pipeline triggers */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c2c24]/60">
                          Åpne Spørsmål & Vitenskapelige Uklarheter ({activeMaterial.openQuestions.length})
                        </h3>
                        <span className="text-[10px] text-gray-400 italic">
                          Klikk "AI Forslag" for å utforme et test-laboratorieforsøk
                        </span>
                      </div>

                      {activeMaterial.openQuestions.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-[#e2e1d5] rounded-2xl text-gray-500 text-xs">
                          Ingen ubesvarte spørsmål registrert ennå. Materialet regnes som fullstendig dokumentert.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {activeMaterial.openQuestions.map((q) => (
                            <div key={q.id} className="p-4 bg-[#f9f9f7] rounded-xl border border-[#eeede6] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#5A5A40]/40 transition-colors">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                                    q.importance === 'Høy' ? 'bg-red-100 text-red-900' :
                                    q.importance === 'Medium' ? 'bg-amber-100 text-amber-900' :
                                    'bg-stone-200 text-stone-800'
                                  }`}>
                                    {q.importance} Imp
                                  </span>
                                  <span className="text-[10px] text-gray-400">• Status: <strong>{q.status}</strong></span>
                                </div>
                                <p className="text-xs font-semibold text-gray-800">
                                  {q.question}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {/* Toggle Status */}
                                <select
                                  value={q.status}
                                  onChange={(e) => handleUpdateQuestionStatus(q.id, e.target.value as any)}
                                  className="text-[10px] bg-white border border-[#dcdad0] rounded-lg p-1 font-medium focus:outline-none"
                                >
                                  <option value="Åpen">Åpen</option>
                                  <option value="Under utforsking">I arbeid</option>
                                  <option value="Løst">Løst</option>
                                </select>

                                {/* Gemini automated pipeline trigger */}
                                <button
                                  onClick={() => handleAiExploreQuestion(q)}
                                  disabled={generatingExpId !== null}
                                  className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300 text-amber-900 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                                >
                                  {generatingExpId === q.id ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      Planlegger...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3 h-3 text-amber-600" />
                                      AI Forslag
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ----------------- TAB: EXPERIMENTER & HYPOTESER ----------------- */}
                {activeTab === 'eksperimenter' && (
                  <div className="space-y-6">
                    {/* Top Export PDF Banner */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#cbd5e1] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2c5282] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Beaker className="w-5 h-5 text-blue-100" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b]">
                            Eksperimenter & Lab-logger for {activeMaterial.name}
                          </h3>
                          <p className="text-[11px] text-[#475569] mt-0.5">
                            {activeMaterial.experiments?.length || 0} registrert(e) eksperiment(er) med tilknyttede målinger og loggoppføringer.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const owner = researchers.find(r => r.id === activeMaterial.ownerId);
                          generateExperimentAndTestDataPDFReport(activeMaterial, owner);
                        }}
                        className="bg-[#2c5282] hover:bg-[#1a365d] text-white text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
                        title="Eksporter alt til formatert PDF"
                      >
                        <FileText className="w-4 h-4 text-blue-200" />
                        <span>Eksporter Test- & Eksperimentrapport (PDF)</span>
                      </button>
                    </div>

                    {/* Add Experiment Form */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-4 flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4" /> Start Manuelt Lab-Eksperiment / Testsyklus
                      </h3>
                      <form onSubmit={handleAddExperiment} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Eksperiment-tittel *</label>
                            <input
                              type="text"
                              required
                              placeholder="F.eks. Fryse- og tinetest av mycelblokk"
                              value={newExpTitle}
                              onChange={(e) => setNewExpTitle(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Vitenskapelig Hypotese</label>
                            <input
                              type="text"
                              placeholder="F.eks. Materialet vil tåle 50 fryse/tine-sykluser uten tap av elastisitet."
                              value={newExpHypothesis}
                              onChange={(e) => setNewExpHypothesis(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Uavhengig Variabel (Det vi kontrollerer)</label>
                            <input
                              type="text"
                              placeholder="F.eks. Antall fryse-sykluser"
                              value={newExpIndep}
                              onChange={(e) => setNewExpIndep(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Avhengig Variabel (Det vi måler)</label>
                            <input
                              type="text"
                              placeholder="F.eks. Trykkfasthet i MPa etter eksponering"
                              value={newExpDep}
                              onChange={(e) => setNewExpDep(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-[#5A5A40] text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#4a4a34] transition-all flex items-center gap-1"
                          >
                            <Beaker className="w-3.5 h-3.5" /> Start Testsyklus
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Experiments Timeline List */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c2c24]/60">
                        Pågående og Avsluttede Forsøk ({activeMaterial.experiments.length})
                      </h3>

                      {activeMaterial.experiments.length === 0 ? (
                        <div className="bg-white p-8 text-center border border-dashed border-[#e2e1d5] rounded-2xl text-gray-500 text-xs">
                          Ingen laboratorieforsøk eller aktive hypoteser er lagt inn for dette materialet.
                        </div>
                      ) : (
                        activeMaterial.experiments.map((exp) => (
                          <div 
                            key={exp.id} 
                            className={`rounded-2xl p-6 border ${
                              exp.status === 'Fullført' 
                                ? 'bg-stone-50 border-[#e2e1d5] text-[#2c2c24]' 
                                : exp.status === 'Aktiv'
                                  ? 'bg-white border-[#5A5A40] shadow-sm'
                                  : 'bg-white/60 border-dashed border-gray-300'
                            }`}
                          >
                            {/* Header */}
                            <div className="flex justify-between items-start flex-wrap gap-2 pb-4 border-b border-[#f0f0e8]">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                                    exp.status === 'Fullført' ? 'bg-gray-200 text-gray-800' :
                                    exp.status === 'Aktiv' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                                    'bg-amber-100 text-amber-900'
                                  }`}>
                                    {exp.status}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-semibold">
                                    Startet: {exp.startDate} {exp.endDate ? `| Avsluttet: ${exp.endDate}` : ''}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold font-serif italic text-gray-900 mt-1">
                                  {exp.title}
                                </h4>
                              </div>

                              {/* Action controls */}
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500">Status:</span>
                                <select
                                  value={exp.status}
                                  onChange={(e) => handleUpdateExpStatus(exp.id, e.target.value as any)}
                                  className="text-[10px] bg-white border border-[#dcdad0] rounded-lg p-1 focus:outline-none"
                                >
                                  <option value="Utkast">Utkast</option>
                                  <option value="Aktiv">Aktiv</option>
                                  <option value="Fullført">Fullført</option>
                                </select>
                              </div>
                            </div>

                            {/* Hypothesis & variables details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                              <div className="md:col-span-1 bg-[#f9f9f7] p-3 rounded-xl border border-[#eeede6]">
                                <span className="text-[9px] uppercase font-bold text-gray-400 block">Vitenskapelig Hypotese:</span>
                                <p className="font-serif italic text-gray-800 mt-0.5">{exp.hypothesis}</p>
                              </div>
                              <div className="md:col-span-1 bg-[#f9f9f7] p-3 rounded-xl border border-[#eeede6]">
                                <span className="text-[9px] uppercase font-bold text-gray-400 block">Uavhengig Variabel:</span>
                                <p className="font-medium text-gray-800 mt-0.5">{exp.independentVariable}</p>
                              </div>
                              <div className="md:col-span-1 bg-[#f9f9f7] p-3 rounded-xl border border-[#eeede6]">
                                <span className="text-[9px] uppercase font-bold text-gray-400 block">Avhengig Variabel (Måling):</span>
                                <p className="font-medium text-gray-800 mt-0.5">{exp.dependentVariable}</p>
                              </div>
                            </div>

                            {/* Logs Timeline */}
                            <div className="space-y-2 mt-2">
                              <span className="text-[9px] uppercase font-bold text-gray-500 block">Eksperimentell Logg & Historikk:</span>
                              <div className="bg-[#eeede6]/40 p-3.5 rounded-xl max-h-60 overflow-y-auto space-y-2 text-[11px] font-mono">
                                {exp.logs.map((log, idx) => {
                                  const hasImage = log.includes('|||image:');
                                  if (hasImage) {
                                    const [text, imagePart] = log.split('|||image:');
                                    let testImg = imagePart;
                                    let refImg: string | null = null;
                                    if (imagePart.includes('|||ref:')) {
                                      const parts = imagePart.split('|||ref:');
                                      testImg = parts[0];
                                      refImg = parts[1];
                                    }

                                    return (
                                      <div key={idx} className="border-l-2 border-[#5A5A40]/40 pl-2 py-1.5 text-gray-700 space-y-1.5">
                                        <div>{text}</div>

                                        {refImg ? (
                                          <div className="flex items-center gap-3 flex-wrap pt-1">
                                            <div className="space-y-0.5">
                                              <span className="text-[9px] font-bold uppercase text-emerald-700 font-sans block">Før (Referanse)</span>
                                              <div 
                                                className="relative group w-24 h-16 rounded-lg overflow-hidden border border-emerald-300 bg-gray-100 cursor-pointer shadow-2xs hover:shadow-xs transition-all" 
                                                onClick={() => setLightboxImage(refImg!)}
                                              >
                                                <img src={refImg} alt="Referansebilde" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                                  <span className="text-[8px] text-white bg-black/50 px-1 py-0.5 rounded font-sans uppercase">Før</span>
                                                </div>
                                              </div>
                                            </div>

                                            <span className="text-gray-400 font-bold text-xs">→</span>

                                            <div className="space-y-0.5">
                                              <span className="text-[9px] font-bold uppercase text-blue-700 font-sans block">Etter (Testresultat)</span>
                                              <div 
                                                className="relative group w-24 h-16 rounded-lg overflow-hidden border border-blue-300 bg-gray-100 cursor-pointer shadow-2xs hover:shadow-xs transition-all" 
                                                onClick={() => setLightboxImage(testImg)}
                                              >
                                                <img src={testImg} alt="Testresultat" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                                  <span className="text-[8px] text-white bg-black/50 px-1 py-0.5 rounded font-sans uppercase">Etter</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div 
                                            className="relative group w-28 h-20 rounded-lg overflow-hidden border border-[#dcdad0] bg-gray-100 cursor-pointer shadow-xs hover:shadow-sm transition-all" 
                                            onClick={() => setLightboxImage(testImg)}
                                          >
                                            <img src={testImg} alt="Loggvedlegg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                              <span className="text-[9px] text-white bg-black/50 px-1.5 py-0.5 rounded font-sans tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">Zoom</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                  return (
                                    <div key={idx} className="border-l-2 border-[#5A5A40]/40 pl-2 py-0.5 text-gray-700">
                                      {log}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Add log entry tool */}
                            {exp.status !== 'Fullført' && (
                              <div className="flex gap-2 mt-3 items-center">
                                <input
                                  type="text"
                                  placeholder="Skriv ny observasjon eller laboratorielogg..."
                                  value={activeExpLogText[exp.id] || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setActiveExpLogText(prev => ({ ...prev, [exp.id]: val }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddLog(exp.id);
                                  }}
                                  className="flex-1 bg-white border border-[#dcdad0] rounded-lg py-1 px-3 text-xs focus:outline-none"
                                />
                                <button
                                  onClick={() => handleAddLog(exp.id)}
                                  className="bg-[#5A5A40] text-white py-1 px-3 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#4a4a34] transition-all shrink-0"
                                >
                                  Loggfør
                                </button>
                              </div>
                            )}

                            {/* Results & Conclusion display */}
                            {exp.status === 'Fullført' && exp.results && (
                              <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200/60 rounded-xl">
                                <span className="text-[9px] uppercase font-bold text-emerald-800 block">Eksperiment-konklusjon & Resultat:</span>
                                <p className="text-xs text-emerald-950 font-medium leading-relaxed mt-0.5">
                                  {exp.results}
                                </p>
                              </div>
                            )}

                            {/* Complete experiment action widget */}
                            {exp.status === 'Aktiv' && (
                              <div className="mt-4 pt-3 border-t border-[#f0f0e8] flex flex-col sm:flex-row gap-2 justify-between items-end">
                                <div className="flex-1 w-full">
                                  <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Skriv inn endelig vitenskapelig konklusjon for å fullføre:</label>
                                  <input
                                    type="text"
                                    placeholder="F.eks. Hypotesen ble bekreftet. Tilsetningen ga 35% mindre vannoppsuging..."
                                    value={activeExpResultText[exp.id] || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setActiveExpResultText(prev => ({ ...prev, [exp.id]: val }));
                                    }}
                                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                                  />
                                </div>
                                <button
                                  onClick={() => handleCompleteExperiment(exp.id)}
                                  className="bg-emerald-700 text-white py-1.5 px-4 rounded-lg text-xs uppercase tracking-wider font-bold hover:bg-emerald-800 transition-all shrink-0 w-full sm:w-auto"
                                >
                                  Fullfør forsøket
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ----------------- TAB: RESULTATANALYSE & YTELSESGRAFER ----------------- */}
                {activeTab === 'analyse' && (
                  <div className="space-y-6">
                    {/* Header & General Info */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeede6] pb-4 mb-6">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                            <LineChart className="w-4 h-4 text-[#5A5A40]" /> Resultatanalyse & Ytelsesgrafer
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Visualiser og sammenlign bio-materialets fysiske testdata, herdeprosesser, og EPD karbonregnskap.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-gray-400">Aktivt materiale:</span>
                          <span className="text-xs font-bold text-gray-800 bg-[#f9f9f7] border border-[#dcdad0] py-1 px-3 rounded-lg">
                            {activeMaterial?.name}
                          </span>
                        </div>
                      </div>

                      {/* KPI Dashboard Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#f9f9f7] rounded-xl p-4 border border-[#eeede6] text-center">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Maks Trykkfasthet</span>
                          <span className="text-2xl font-serif font-bold text-[#5A5A40]">
                            {activeMaterial?.testResults?.strengthMpa ? `${activeMaterial.testResults.strengthMpa} MPa` : 'N/A'}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">Sluttfasthet v/ 28 dager</span>
                        </div>

                        <div className="bg-[#f9f9f7] rounded-xl p-4 border border-[#eeede6] text-center">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Drivhuspotensial (GWP)</span>
                          <span className={`text-2xl font-serif font-bold ${activeMaterial?.epd?.gwp !== undefined && activeMaterial.epd.gwp < 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                            {activeMaterial?.epd?.gwp !== undefined ? `${activeMaterial.epd.gwp} kg` : 'N/A'}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">CO₂ eq / kg materiale</span>
                        </div>

                        <div className="bg-[#f9f9f7] rounded-xl p-4 border border-[#eeede6] text-center">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Sirkulær Andel</span>
                          <span className="text-2xl font-serif font-bold text-[#5A5A40]">
                            {activeMaterial?.epd?.recycledContent ? `${activeMaterial.epd.recycledContent}%` : 'N/A'}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">Gjenvunnet innhold</span>
                        </div>

                        <div className="bg-[#f9f9f7] rounded-xl p-4 border border-[#eeede6] text-center">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Designlevetid</span>
                          <span className="text-2xl font-serif font-bold text-[#5A5A40]">
                            {activeMaterial?.epd?.lifetime ? `${activeMaterial.epd.lifetime} år` : 'N/A'}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">Forventet brukstid i bygg</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart & Interaction Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left side: Visualizations */}
                      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs flex flex-col justify-between">
                        <div>
                          {/* Inner Tabs for chart switching */}
                          <div className="flex border-b border-[#eeede6] pb-3 mb-5 gap-4 overflow-x-auto">
                            <button
                              onClick={() => setSelectedAnalyseMetric('styrke')}
                              className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all whitespace-nowrap ${
                                selectedAnalyseMetric === 'styrke'
                                  ? 'bg-[#5A5A40] text-white font-bold'
                                  : 'text-gray-500 hover:bg-stone-100'
                              }`}
                            >
                              Styrkeutvikling (MPa)
                            </button>
                            <button
                              onClick={() => setSelectedAnalyseMetric('fuktighet')}
                              className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all whitespace-nowrap ${
                                selectedAnalyseMetric === 'fuktighet'
                                  ? 'bg-[#5A5A40] text-white font-bold'
                                  : 'text-gray-500 hover:bg-stone-100'
                              }`}
                            >
                              Fuktabsorpsjon (%)
                            </button>
                            <button
                              onClick={() => setSelectedAnalyseMetric('gwp')}
                              className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all whitespace-nowrap ${
                                selectedAnalyseMetric === 'gwp'
                                  ? 'bg-[#5A5A40] text-white font-bold'
                                  : 'text-gray-500 hover:bg-stone-100'
                              }`}
                            >
                              Karbonregnskap (GWP Benchmark)
                            </button>
                          </div>

                          {/* Chart Container */}
                          <div className="h-80 w-full mt-2">
                            {selectedAnalyseMetric === 'styrke' && (
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={getStrengthData()}
                                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="colorStrength" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.4}/>
                                      <stop offset="95%" stopColor="#5A5A40" stopOpacity={0.0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#eeede6" />
                                  <XAxis 
                                    dataKey="day" 
                                    tick={{ fontSize: 10, fill: '#666' }} 
                                    label={{ value: 'Dager', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#666' }} 
                                  />
                                  <YAxis 
                                    tick={{ fontSize: 10, fill: '#666' }} 
                                    label={{ value: 'Styrke (MPa)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#666' }} 
                                  />
                                  <RecTooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #dcdad0', borderRadius: '8px', fontSize: '11px' }}
                                    formatter={(value: any, name: any, props: any) => [`${value} MPa`, `Type: ${props.payload.type}`]}
                                    labelFormatter={(label) => `Dag ${label}`}
                                  />
                                  <Legend wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
                                  <Area 
                                    name="Mekanisk fasthet" 
                                    type="monotone" 
                                    dataKey="verdi" 
                                    stroke="#5A5A40" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorStrength)" 
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            )}

                            {selectedAnalyseMetric === 'fuktighet' && (
                              <ResponsiveContainer width="100%" height="100%">
                                <RecLineChart
                                  data={getMoistureData()}
                                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#eeede6" />
                                  <XAxis 
                                    dataKey="rh" 
                                    tick={{ fontSize: 10, fill: '#666' }} 
                                    label={{ value: 'Relativ Luftfuktighet (RH %)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#666' }} 
                                  />
                                  <YAxis 
                                    tick={{ fontSize: 10, fill: '#666' }} 
                                    label={{ value: 'Vannabsorpsjon (% vekt)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#666' }} 
                                  />
                                  <RecTooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #dcdad0', borderRadius: '8px', fontSize: '11px' }}
                                    formatter={(value: any, name: any, props: any) => [`${value}%`, `Type: ${props.payload.type}`]}
                                    labelFormatter={(label) => `RH: ${label}%`}
                                  />
                                  <Legend wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
                                  <Line 
                                    name="Fuktighetsopptak" 
                                    type="monotone" 
                                    dataKey="verdi" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2.5}
                                    activeDot={{ r: 6 }} 
                                  />
                                </RecLineChart>
                              </ResponsiveContainer>
                            )}

                            {selectedAnalyseMetric === 'gwp' && (
                              <ResponsiveContainer width="100%" height="100%">
                                <RecBarChart
                                  data={getGwpBenchmarkData()}
                                  margin={{ top: 15, right: 10, left: -10, bottom: 20 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#eeede6" vertical={false} />
                                  <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 9, fill: '#666' }} 
                                    interval={0}
                                    angle={-15}
                                    textAnchor="end"
                                  />
                                  <YAxis 
                                    tick={{ fontSize: 10, fill: '#666' }} 
                                    label={{ value: 'kg CO₂ eq/kg', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#666' }} 
                                  />
                                  <RecTooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #dcdad0', borderRadius: '8px', fontSize: '11px' }}
                                    formatter={(value: any) => [`${value} kg CO₂ eq/kg`, 'Karbonintensitet']}
                                  />
                                  <Bar 
                                    dataKey="gwp" 
                                    name="Drivhuspotensial (GWP)"
                                    radius={[4, 4, 0, 0]}
                                  >
                                    {getGwpBenchmarkData().map((entry, index) => {
                                      let fill = '#a8a29e'; // Default gray for reference
                                      if (entry.isCurrent) {
                                        fill = '#5A5A40'; // Deep signature color for current material
                                      } else if (entry.gwp < 0) {
                                        fill = '#10b981'; // Bright green for carbon-negative
                                      } else if (entry.gwp > 100) {
                                        fill = '#ef4444'; // Red for heavy GWP
                                      } else if (entry.gwp > 0) {
                                        fill = '#f59e0b'; // Amber for standard positive GWP
                                      }
                                      return <Cell key={`cell-${index}`} fill={fill} />;
                                    })}
                                  </Bar>
                                </RecBarChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </div>

                        {/* Chart Legend Explanation */}
                        <div className="mt-4 p-3 bg-[#fcfcf9] rounded-xl border border-[#eeede6] text-[11px] text-gray-500">
                          {selectedAnalyseMetric === 'styrke' && (
                            <p><strong>Note:</strong> Kurven viser en interpolert referanseutvikling fram til materialets sluttfasthet etter 28 dager herding. Eventuelle manuelle labmålinger du legger inn under vil integreres direkte som faktiske plot-punkter på tidslinjen.</p>
                          )}
                          {selectedAnalyseMetric === 'fuktighet' && (
                            <p><strong>Note:</strong> Viser hygroskopisk balanse og evnen til å absorbere fuktighet under varierende relativ luftfuktighet (RH). Bio-materialer fungerer ofte som effektive fukt-buffere i innendørs konstruksjoner.</p>
                          )}
                          {selectedAnalyseMetric === 'gwp' && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span><strong>Fargeforklaring:</strong></span>
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#5A5A40] rounded"></span> Aktivt Materiale</span>
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#10b981] rounded"></span> Karbonnegativ (Nettobinder CO₂)</span>
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#f59e0b] rounded"></span> Lavt CO₂ avtrykk</span>
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#ef4444] rounded"></span> Høyt CO₂ avtrykk (Sement-ref)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side: Input & registered log data */}
                      <div className="space-y-6">
                        
                        {/* New Lab Measurement Input Form */}
                        <div className="bg-white rounded-2xl p-5 border border-[#e2e1d5] shadow-xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] border-b border-[#eeede6] pb-2.5 mb-4 flex items-center gap-1.5">
                            <PlusCircle className="w-4 h-4" /> Registrer lab-måling
                          </h4>
                          
                          <form onSubmit={handleSaveMeasurement} className="space-y-3.5">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Måleparameter</label>
                              <select
                                value={newMeasParam}
                                onChange={(e) => {
                                  const val = e.target.value as any;
                                  setNewMeasParam(val);
                                  // Auto-fill a sensible label/value helper
                                  if (val === 'strength') {
                                    setNewMeasLabel('Dag 14 (Trykktest)');
                                  } else if (val === 'moisture') {
                                    setNewMeasLabel('75% RH eksponering');
                                  } else {
                                    setNewMeasLabel('EPD revidert GWP');
                                  }
                                }}
                                className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40] font-medium"
                              >
                                <option value="strength">Styrke / Fasthet (MPa)</option>
                                <option value="moisture">Fuktighetsabsorpsjon (% vekt)</option>
                                <option value="gwp">EPD Karbonavtrykk (kg CO₂ eq/kg)</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Måleverdi (Tall)</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.001"
                                  required
                                  placeholder={newMeasParam === 'strength' ? 'F.eks. 0.65' : newMeasParam === 'moisture' ? 'F.eks. 11.2' : 'F.eks. -1.45'}
                                  value={newMeasValue}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setNewMeasValue(val === '' ? '' : Number(val));
                                  }}
                                  className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                                />
                                <span className="absolute right-3 top-1.5 text-[10px] font-bold text-gray-400">
                                  {newMeasParam === 'strength' ? 'MPa' : newMeasParam === 'moisture' ? '%' : 'kg CO₂ eq/kg'}
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                                {newMeasParam === 'strength' ? 'Dag eller Testpunkt (f.eks. "Dag 14")' : newMeasParam === 'moisture' ? 'RH % eller Testpunkt (f.eks. "75% RH")' : 'Revisjonsetikett (f.eks. "Batch B")'}
                              </label>
                              <input
                                type="text"
                                required
                                placeholder={newMeasParam === 'strength' ? 'Skriv f.eks. "Dag 14"' : newMeasParam === 'moisture' ? 'Skriv f.eks. "75% RH"' : 'Skriv f.eks. "Batch B"'}
                                value={newMeasLabel}
                                onChange={(e) => setNewMeasLabel(e.target.value)}
                                className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                              />
                            </div>

                            {activeMaterial?.experiments && activeMaterial.experiments.length > 0 && (
                              <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Tilknytt laboratorieforsøk (valgfritt)</label>
                                <select
                                  value={newMeasExpId}
                                  onChange={(e) => setNewMeasExpId(e.target.value)}
                                  className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40] font-medium text-gray-700"
                                >
                                  <option value="">Ingen (Generell laboratorietest)</option>
                                  {activeMaterial.experiments.map(exp => (
                                    <option key={exp.id} value={exp.id}>
                                      {exp.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <button
                              type="submit"
                              className="w-full bg-[#5A5A40] hover:bg-[#4a4a34] text-white py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-colors shadow-xs"
                            >
                              Lagre i laboratorie-databasen
                            </button>
                          </form>
                        </div>

                        {/* List of custom registered measurements */}
                        <div className="bg-white rounded-2xl p-5 border border-[#e2e1d5] shadow-xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] border-b border-[#eeede6] pb-2.5 mb-3">
                            Registrerte Lab-målinger ({activeMaterial?.measurements?.length || 0})
                          </h4>

                          {!activeMaterial?.measurements || activeMaterial.measurements.length === 0 ? (
                            <p className="text-[10px] text-gray-400 italic text-center py-4">
                              Ingen egendefinerte målinger registrert for dette materialet ennå. Bruk skjemaet over til å plotte nye testpunkter.
                            </p>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {activeMaterial.measurements.map((meas) => (
                                <div key={meas.id} className="p-2.5 bg-[#f9f9f7] rounded-xl border border-[#eeede6] text-[11px] flex justify-between items-center hover:border-gray-300 transition-colors">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                        meas.parameter === 'strength' ? 'bg-[#5A5A40]' :
                                        meas.parameter === 'moisture' ? 'bg-blue-500' : 'bg-emerald-600'
                                      }`}></span>
                                      <span className="font-bold text-gray-800">
                                        {meas.value} {meas.parameter === 'strength' ? 'MPa' : meas.parameter === 'moisture' ? '%' : 'kg CO₂ eq/kg'}
                                      </span>
                                      <span className="text-gray-400">({meas.label})</span>
                                    </div>
                                    <div className="text-[9px] text-gray-400">
                                      {meas.experimentTitle ? `Tilknyttet: ${meas.experimentTitle}` : 'Generell test'} • {meas.timestamp}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteMeasurement(meas.id)}
                                    className="text-gray-400 hover:text-red-600 p-1"
                                    title="Slett måling"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>
            </>
          )}

        </main>

        {/* ================= RIGHT SIDEBAR: COLLAPSIBLE AI CHAT DRAWER ================= */}
        {showChatDrawer && (
          <aside id="ai-chat-drawer" className="w-full lg:w-80 bg-white rounded-2xl border border-[#e2e1d5] shadow-md p-4 flex flex-col gap-3.5 shrink-0 h-[500px] lg:h-auto overflow-hidden">
            <div className="flex justify-between items-center pb-2 border-b border-[#f0f0e8]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c2c24] font-serif">
                  BioBuild Lab-partner
                </h3>
              </div>
              <button 
                onClick={() => setShowChatDrawer(false)}
                className="p-1 hover:bg-[#f5f5f0] rounded-md text-gray-400 hover:text-black"
                title="Skjul AI-Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-500/5 p-2.5 rounded-xl border border-amber-200/50 text-[10px] text-amber-900 leading-relaxed">
              <strong>Kontekst:</strong> Jeg har tilgang til alle dine registrerte bio-materialer. Spørsmål du stiller vil ta utgangspunkt i <strong>{activeMaterial?.name || 'ingen valgt'}</strong>.
            </div>

            {/* Chat message flow */}
            <div className="flex-1 overflow-y-auto space-y-3 p-1 max-h-[300px] lg:max-h-none">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col gap-1 text-xs max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <span className="text-[8px] uppercase tracking-wide opacity-50 font-bold">
                    {msg.role === 'user' ? 'Forsker' : 'BioBuild AI-Lab'}
                  </span>
                  <div className={`p-2.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#5A5A40] text-white rounded-tr-none' 
                      : 'bg-[#eeede6] text-[#2c2c24] rounded-tl-none border border-[#dcdad0]'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatSending && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5A5A40]" />
                  <span>AI-partner formulerer svar...</span>
                </div>
              )}
            </div>

            {/* Suggestion prompt chips */}
            {activeMaterial && (
              <div className="pt-2 border-t border-[#f0f0e8] space-y-1">
                <span className="text-[8px] font-bold uppercase text-gray-400 block">Foreslåtte spørsmål:</span>
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleQuickChatPrompt(`Hvordan kan vi forbedre brannytelsen for ${activeMaterial.name}?`)}
                    className="text-[10px] text-left p-1 hover:bg-[#f5f5f0] text-[#5A5A40] font-medium rounded truncate border border-[#eeede6]"
                  >
                    💡 Hvordan forbedre brannytelsen?
                  </button>
                  <button 
                    onClick={() => handleQuickChatPrompt(`Foreslå en fukttestmetode for ${activeMaterial.name} tilpasset vestlandsklima.`)}
                    className="text-[10px] text-left p-1 hover:bg-[#f5f5f0] text-[#5A5A40] font-medium rounded truncate border border-[#eeede6]"
                  >
                    💧 Fukttest for vestlandsklima?
                  </button>
                </div>
              </div>
            )}

            {/* Input form */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2 mt-auto pt-2 border-t border-[#f0f0e8]">
              <input
                type="text"
                disabled={isChatSending}
                placeholder="Spør om biologi, EPD, ISO..."
                value={currentChatInput}
                onChange={(e) => setCurrentChatInput(e.target.value)}
                className="flex-1 bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
              />
              <button
                type="submit"
                disabled={isChatSending || !currentChatInput.trim()}
                className="bg-[#5A5A40] text-white p-2 rounded-xl hover:bg-[#4a4a34] transition-all shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </aside>
        )}

      </div>
      )}

      {/* ================= UNREAL ENGINE & METAHUMAN BRIDGE WORKSPACE ================= */}
      {globalView === 'unreal' && (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col justify-start">
          <UnrealBridge
            unrealConfig={unrealConfig}
            setUnrealConfig={setUnrealConfig}
            evaChatMessages={evaChatMessages}
            evaInputText={evaInputText}
            setEvaInputText={setEvaInputText}
            evaIsThinking={evaIsThinking}
            unrealLogs={unrealLogs}
            handleSendEvaMessage={handleSendEvaMessage}
          />
        </div>
      )}

      {/* ================= AI RESEARCH OWNER PREDICTIVE WORKSPACE ================= */}
      {globalView === 'eierallokering' && (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col justify-start">
          <EierallokeringView
            materials={materials}
            researchers={researchers}
            selectedMaterialIdForPredictiveAI={selectedMaterialIdForPredictiveAI}
            setSelectedMaterialIdForPredictiveAI={setSelectedMaterialIdForPredictiveAI}
            predictionLoading={predictionLoading}
            predictionError={predictionError}
            predictedAllocation={predictedAllocation}
            handlePredictOwner={handlePredictOwner}
            handleApproveOwner={handleApproveOwner}
          />
        </div>
      )}


      {/* ================= FOOTER STATUS BAR ================= */}
      <footer id="app-footer" className="bg-[#2c2c24] text-[#bcbc9f] py-4 px-4 md:px-8 text-[10px] uppercase tracking-[0.2em] font-mono mt-auto border-t border-[#1c1c14] flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          <span className="flex items-center gap-1.5 text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            Node: HQ-OSLO-01 (Klar)
          </span>
          <span>System Sync: 100%</span>
          <span>Sikkerhet: TLS 1.3</span>
          <span className="hidden md:inline">Operatør: {new Date().toLocaleDateString('no-NO')}</span>
        </div>
        <div className="opacity-55 text-center">
          © 2026 BioBuild Norway — Alive Houses Framework
        </div>
      </footer>

      {/* ================= MODAL DIALOG: ADD/GENERATE MATERIAL ================= */}
      {showAddModal && (
        <div id="add-material-modal" className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#fcfcf9] rounded-[24px] border border-[#e2e1d5] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[#e2e1d5]">
              <div>
                <h3 className="text-lg font-serif italic text-gray-900 font-bold">
                  Legg til BioBuild Materiale
                </h3>
                <p className="text-xs text-gray-500">
                  Utvid Alive Houses kunnskapsbasen enten ved å fylle ut manuelt eller la AI generere profilen.
                </p>
              </div>
              <button 
                onClick={() => { setShowAddModal(false); setAiError(null); }}
                className="p-1 hover:bg-[#eeede6] rounded-md text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Generation Sub-Section */}
            <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-200/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Metode 1: Generer øyeblikkelig med AI
              </h4>
              <p className="text-[11px] text-gray-600">
                Oppgi navnet på en tenkt eller ekte bio-arkitektonisk organisme (f.eks. "Blåskjell-biokompositt", "Alge-polyuretan", "Mycelium skinnpaneler"), så vil Gemini utforme kjemiske analyser, EPD, brannklasser og forskningshypoteser.
              </p>
              <form onSubmit={handleAiGenerateMaterial} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  disabled={isAiGenerating}
                  placeholder="F.eks. Mycelium Skumplate, Biologisk Kalkmørtel..."
                  value={aiMaterialName}
                  onChange={(e) => setAiMaterialName(e.target.value)}
                  className="flex-1 bg-white border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                />
                <select
                  value={aiMaterialCategory}
                  onChange={(e) => setAiMaterialCategory(e.target.value as any)}
                  className="bg-white border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40] font-semibold"
                >
                  <option value="Mykologiske">Mykologiske</option>
                  <option value="Plantebaserte">Plantebaserte</option>
                  <option value="Alger & Bakterier">Alger & Bakterier</option>
                  <option value="Tre & Kork">Tre & Kork</option>
                  <option value="Annet">Annet</option>
                </select>
                <button
                  type="submit"
                  disabled={isAiGenerating || !aiMaterialName.trim()}
                  className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white py-2 px-5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Forsker...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generer med AI
                    </>
                  )}
                </button>
              </form>

              {aiError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl text-[11px] font-semibold mt-2">
                  ⚠️ {aiError}
                </div>
              )}
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#e2e1d5]"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">ELLER</span>
              <div className="flex-grow border-t border-[#e2e1d5]"></div>
            </div>

            {/* Manual input form */}
            <form onSubmit={handleCreateManualMaterial} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Metode 2: Fyll ut manuelt
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Materialnavn *</label>
                  <input
                    type="text"
                    required
                    placeholder="F.eks. Skalldyr-klinkers, Lin-isolering"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Kategori</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none"
                  >
                    <option value="Mykologiske">Mykologiske (sopp)</option>
                    <option value="Plantebaserte">Plantebaserte (hamp, lin, strå)</option>
                    <option value="Alger & Bakterier">Alger & Bakterier</option>
                    <option value="Tre & Kork">Tre & Kork</option>
                    <option value="Annet">Annet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Vitenskapelig Beskrivelse</label>
                <textarea
                  rows={2}
                  placeholder="Kort beskrivelse av hva materialet gjør og hvordan det bidrar til Alive Houses..."
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs focus:outline-none"
                ></textarea>
              </div>

              {/* AI Category Suggestion when 'Annet' is selected */}
              {manualCategory === 'Annet' && (
                <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-3.5 space-y-2.5 text-xs text-amber-950 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900 text-xs">
                      <Sparkles className="w-4 h-4 text-amber-600" /> Du har valgt kategorien 'Annet'
                    </span>
                    <button
                      type="button"
                      id="btn-suggest-category"
                      onClick={() => handleSuggestCategory(manualName, manualDescription)}
                      disabled={categorySuggestLoading || (!manualName.trim() && !manualDescription.trim())}
                      className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-bold py-1.5 px-3 rounded-xl text-[11px] transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {categorySuggestLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyserer beskrivelse...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Foreslå kategori basert på beskrivelse
                        </>
                      )}
                    </button>
                  </div>

                  {(!manualName.trim() && !manualDescription.trim()) && (
                    <p className="text-[11px] text-amber-800/80 italic">
                      Skriv inn materialnavn og/eller en kort beskrivelse for å få et spesifikt kategoriforslag.
                    </p>
                  )}

                  {suggestedCategoryResult && (
                    <div className="bg-white border border-amber-200/90 rounded-xl p-3 space-y-2 text-[11px] shadow-2xs">
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <span className="text-amber-950 flex items-center gap-1.5 text-xs">
                          Foreslått kategori: <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">{suggestedCategoryResult.suggestedCategory}</span>
                        </span>
                        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-bold">
                          {suggestedCategoryResult.confidence}% sikkerhet
                        </span>
                      </div>
                      <p className="text-gray-600 text-[11px] leading-relaxed">
                        {suggestedCategoryResult.reasoning}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setManualCategory(suggestedCategoryResult.suggestedCategory);
                          setSuggestedCategoryResult(null);
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 mt-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-200" /> Velg '{suggestedCategoryResult.suggestedCategory}' som kategori
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Kjemisk sammensetning</label>
                  <input
                    type="text"
                    placeholder="Molekyler, bindemidler, mineraler"
                    value={manualChemical}
                    onChange={(e) => setManualChemical(e.target.value)}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Biologisk oppbygning</label>
                  <input
                    type="text"
                    placeholder="Organismer, levende celler, sporer, hampfiber"
                    value={manualBiological}
                    onChange={(e) => setManualBiological(e.target.value)}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">TRL-Nivå (1-9)</label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={manualTrl}
                    onChange={(e) => setManualTrl(Number(e.target.value))}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">EPD GWP (kg CO2/kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualGwp}
                    onChange={(e) => setManualGwp(Number(e.target.value))}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Resirkulert %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={manualRecycled}
                    onChange={(e) => setManualRecycled(Number(e.target.value))}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Levetid (år)</label>
                  <input
                    type="number"
                    value={manualLifetime}
                    onChange={(e) => setManualLifetime(Number(e.target.value))}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Sirkularitetstype</label>
                  <input
                    type="text"
                    placeholder="F.eks. 100% biologisk komposterbar"
                    value={manualCircularity}
                    onChange={(e) => setManualCircularity(e.target.value)}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Bruksområder (kommadelt)</label>
                  <input
                    type="text"
                    placeholder="Kledning, Isolering, Akustikk"
                    value={manualApplication}
                    onChange={(e) => setManualApplication(e.target.value)}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Leverandører (kommadelt)</label>
                  <input
                    type="text"
                    placeholder="SINTEF, NTNU, BioBygg AS"
                    value={manualSuppliers}
                    onChange={(e) => setManualSuppliers(e.target.value)}
                    className="w-full bg-white border border-[#dcdad0] rounded-xl py-2 px-3.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#e2e1d5]">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setAiError(null); }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-widest transition-all"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-widest transition-all"
                >
                  Lagre manuelt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for zooming in on captured photos */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => setLightboxImage(null)}
              className="bg-white/15 hover:bg-white/30 text-white rounded-full p-2 transition-all flex items-center justify-center"
              title="Lukk"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-stone-900" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxImage} 
              alt="Høyoppløselig testresultat" 
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <div className="p-4 bg-stone-900/90 text-stone-300 text-xs flex justify-between items-center border-t border-white/10">
              <span className="font-semibold">BioBuild Evidence Lab - Foto-dokumentasjon</span>
              <button 
                onClick={() => setLightboxImage(null)}
                className="text-stone-400 hover:text-white transition-all underline decoration-dotted"
              >
                Lukk forhåndsvisning
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
