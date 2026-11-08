import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  ArrowRight,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { DefectCategory, DefectSeverity } from '../../types';
import { DEFECT_IMAGES } from '../../mock/seedData';

export const Step1ReportDefect: React.FC = () => {
  const { createNewCase, notify } = useInvestigation();

  const [componentName, setComponentName] = useState('Precision Optical Housing (Rev D)');
  const [componentId, setComponentId] = useState('POH-6061-042');
  const [batchId, setBatchId] = useState('B-205');
  const [manufacturingLine, setManufacturingLine] = useState('CNC Line 3 — 5-Axis Cell');
  const [machineId, setMachineId] = useState('CNC-DMU50-L3');
  const [inspectionDate, setInspectionDate] = useState('2026-11-08');
  const [defectCategory, setDefectCategory] = useState<DefectCategory>('Surface Scratches');
  const [severity, setSeverity] = useState<DefectSeverity>('Medium');
  const [inspectorName, setInspectorName] = useState('Rajesh Sharma (Lead Quality Engineer)');
  const [description, setDescription] = useState(
    'Abrasive linear scratch cluster detected on sealing face Datum A following finish face-milling operation. Depth estimated 8-12 µm.'
  );
  const [previewImage, setPreviewImage] = useState<string>(DEFECT_IMAGES.surfaceScratches);
  const [imageFileName, setImageFileName] = useState('POH_B205_Flange_Scan.svg');

  // Handle local image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
          notify('Defect Image Loaded', `Image file "${file.name}" ready for inspection.`, 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Change sample image presets matching defect categories
  const handleCategorySelect = (cat: DefectCategory) => {
    setDefectCategory(cat);
    if (cat === 'Surface Scratches') {
      setPreviewImage(DEFECT_IMAGES.surfaceScratches);
      setImageFileName('POH_Flange_Scratches.svg');
      setDescription('Concentric scratch marks on finish face milling envelope breaching Ra 0.8µm.');
    } else if (cat === 'Dimensional Deviation') {
      setPreviewImage(DEFECT_IMAGES.dimensionalDeviation);
      setImageFileName('AMH_Bore_Deviation.svg');
      setDescription('Bore step diameter oversized by +0.18 mm against ISO H7 tolerance limits.');
    } else if (cat === 'Burr Formation') {
      setPreviewImage(DEFECT_IMAGES.burrFormation);
      setImageFileName('HVB_Exit_Burr.svg');
      setDescription('Heavy rollover exit burr height 0.42mm along cross-drilled hydraulic ports.');
    } else if (cat === 'Surface Cracks') {
      setPreviewImage(DEFECT_IMAGES.surfaceCracks);
      setImageFileName('TSH_Thermal_Crack_FPI.svg');
      setDescription('Critical fluorescent penetrant indication showing 1.2mm thermal micro-crack.');
    }
  };

  const handleStartInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentName || !batchId || !machineId) {
      notify('Missing Required Fields', 'Please complete all required manufacturing fields.', 'warning');
      return;
    }

    createNewCase({
      componentName,
      componentId,
      batchId,
      manufacturingLine,
      machineId,
      inspectionDate,
      defectCategory,
      severity,
      description,
      inspectorName,
      imageDetails: {
        url: previewImage,
        fileName: imageFileName,
        timestamp: new Date().toISOString(),
        resolution: '4096 x 3072 px',
        lightingCondition: 'Oblique Polarized LED 1,800 Lux',
        simulatedVisualConfidence: 94.2,
        visualObservations: [
          `Visual feature profile matches ${defectCategory} signature.`,
          'Localized coordinates detected in finish machined sector.',
          'Production telemetry and historical records required for root cause investigation.',
        ],
        detectedBBoxes: [
          {
            x: 52,
            y: 35,
            width: 24,
            height: 16,
            label: defectCategory,
            confidence: 94.2,
          },
        ],
      },
    });
  };

  return (
    <form onSubmit={handleStartInvestigation} className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Step 1 — Report Defect & Image Upload</h2>
          <p className="text-xs text-slate-500 mt-1">
            Capture defect details from the manufacturing line inspection station and initialize the multi-stage AI investigation agent.
          </p>
        </div>

        {/* Defect Category Preset Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Defect Category (4 Supported Industrial Classes)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                'Surface Scratches',
                'Dimensional Deviation',
                'Burr Formation',
                'Surface Cracks',
              ] as DefectCategory[]
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                  defectCategory === cat
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-slate-400">CLASS</span>
                  {defectCategory === cat && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Manufacturing Metadata Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Component Name *
            </label>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Component ID / Part Number *
            </label>
            <input
              type="text"
              value={componentId}
              onChange={(e) => setComponentId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Production Batch ID *
            </label>
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manufacturing Line *
            </label>
            <select
              value={manufacturingLine}
              onChange={(e) => setManufacturingLine(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="CNC Line 3 — 5-Axis Cell">CNC Line 3 — 5-Axis Cell</option>
              <option value="CNC Line 2 — Turning Center">CNC Line 2 — Turning Center</option>
              <option value="CNC Line 1 — High-Speed 3-Axis">CNC Line 1 — High-Speed 3-Axis</option>
              <option value="CNC Line 4 — Inconel Specialist Cell">CNC Line 4 — Inconel Specialist Cell</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Machine ID *
            </label>
            <input
              type="text"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inspection Date *
            </label>
            <input
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Defect Severity Level *
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as DefectSeverity)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Low">Low — Cosmetic / Non-Functional</option>
              <option value="Medium">Medium — Sealing Surface / Minor Deviation</option>
              <option value="High">High — Critical Tolerance Exceeded</option>
              <option value="Critical">Critical — Structural Micro-crack / FPI Flaw</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reporting Inspector Name *
            </label>
            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Defect Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Visual Defect Observation & Engineering Notes *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="Describe location, orientation, toolpath stage, and initial visual findings..."
          />
        </div>

        {/* Defect Image Upload & Live Browser Preview */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Defect Inspection Image (Optical Scan / Camera Capture)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Dropzone */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Upload inspection image"
              />
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-semibold text-slate-800">
                Click or drag & drop inspection photo
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                PNG, JPG, or SVG up to 15MB. Preview processed entirely in-browser.
              </p>
              <span className="mt-3 inline-flex items-center px-2 py-1 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                Current: {imageFileName}
              </span>
            </div>

            {/* Live Visual Preview Card */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  OPTICAL PREVIEW
                </span>
                <span className="text-slate-400">{defectCategory}</span>
              </div>

              <div className="w-full h-44 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
                <img
                  src={previewImage}
                  alt="Defect Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2">
                <span>Sensor: 4K Macro CCD</span>
                <span>Zoom: 4.5x Optical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => notify('Draft Saved', 'Inspection form draft cached in local state.', 'info')}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Start Investigation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
