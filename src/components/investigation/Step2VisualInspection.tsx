import React, { useState } from 'react';
import {
  ScanEye,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Maximize2,
  ShieldAlert,
  Layers,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const Step2VisualInspection: React.FC = () => {
  const { activeCase, setCaseStep, simulateAgentVisualAnalysis, isAgentRunning } = useInvestigation();
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  if (!activeCase) return null;

  const { imageDetails, defectCategory, severity } = activeCase;

  const handleReanalyze = () => {
    simulateAgentVisualAnalysis(activeCase.id);
  };

  const handleContinue = () => {
    setCaseStep(3);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[11px] block">
            Quality Engineering Disclaimer & AI Boundary
          </span>
          <p className="mt-0.5 leading-relaxed text-amber-800">
            "Visual inspection identifies the defect pattern. Root cause determination requires production evidence and investigation."
            Vision analysis is simulated for demonstration; it does not claim to replace ISO physical metrology or material certification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Visual Inspection Display (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">
                Visual Defect Inspection Frame
              </span>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                {imageDetails.fileName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`text-[11px] px-2.5 py-1 rounded font-medium border transition-colors cursor-pointer ${
                  showBoundingBoxes
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {showBoundingBoxes ? 'Defect Boxes: ON' : 'Defect Boxes: OFF'}
              </button>
            </div>
          </div>

          {/* Defect image with overlay bounding box */}
          <div className="relative bg-slate-950 p-4 flex items-center justify-center min-h-[320px] select-none">
            <div className="relative max-w-full max-h-[380px] rounded-lg overflow-hidden border border-slate-800">
              <img
                src={imageDetails.url}
                alt="Defect visual inspection"
                className="w-full h-auto object-contain block"
              />

              {/* Simulated defect detection bounding box overlay */}
              {showBoundingBoxes &&
                imageDetails.detectedBBoxes.map((box, idx) => (
                  <div
                    key={idx}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                    className="absolute border-2 border-red-500 bg-red-500/15 rounded flex flex-col justify-between pointer-events-none transition-all duration-300"
                  >
                    <span className="bg-red-600 text-white font-mono text-[9px] font-bold px-1 py-0.5 leading-none w-max shadow-xs">
                      {box.label} ({box.confidence}%)
                    </span>
                    <span className="bg-black/60 text-red-200 font-mono text-[8px] px-1 py-0.5 leading-none w-max">
                      COORD: [{box.x}%, {box.y}%]
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Image acquisition metadata */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Resolution</span>
              <span className="text-slate-700">{imageDetails.resolution}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Lighting</span>
              <span className="text-slate-700 truncate block">{imageDetails.lightingCondition}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Inspection Timestamp</span>
              <span className="text-slate-700">{imageDetails.timestamp.slice(11, 19)}</span>
            </div>
          </div>
        </div>

        {/* Right: Vision Model Classification Findings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Simulated AI Vision Classifier
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Model: ResNet-Industrial-v4.2
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Detected Defect: {defectCategory}
              </h3>
            </div>

            {/* Score Metric Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block">
                  Visual Pattern Confidence
                </span>
                <div className="text-xl font-bold font-mono text-blue-900 mt-0.5">
                  {imageDetails.simulatedVisualConfidence}%
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${imageDetails.simulatedVisualConfidence}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider block">
                  Severity Classification
                </span>
                <div className="text-xl font-bold text-amber-900 mt-0.5">
                  {severity}
                </div>
                <span className="text-[10px] text-amber-700">Tolerance Risk Threshold: Level 2</span>
              </div>
            </div>

            {/* Simulated Vision Observations */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Visual Inspection Findings
              </label>
              <ul className="space-y-2 text-xs text-slate-600">
                {imageDetails.visualObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical note */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                Next Investigation Phase
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Visual identification alone cannot reveal whether the defect originated from tool wear, fixture clamp misalignment, feed chatter, or raw billet hardness. Production records must now be retrieved.
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReanalyze}
                disabled={isAgentRunning}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Re-Run Vision Scan
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Continue to Evidence Retrieval
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
