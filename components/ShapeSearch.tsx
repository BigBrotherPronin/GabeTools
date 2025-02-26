"use client";

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';

// Define interfaces for type safety
interface ShapeData {
  Shape: string;
  A?: number;    // Area
  d?: number;    // Depth
  tw?: number;   // Web thickness
  bf?: number;   // Flange width
  tf?: number;   // Flange thickness
  Ix?: number;   // Moment of inertia about x-axis
  Sx?: number;   // Section modulus about x-axis
  Iy?: number;   // Moment of inertia about y-axis
  [key: string]: string | number | null | undefined;
}

interface SteelGrade {
  name: string;
  Fy: number;  // Yield strength (ksi)
}

interface CalculationDetails {
  Ix: number;
  Iy: number;
  Sx: number;
  J: number;
  ho: number;
  rts: number;
  E: number;
  Fy: number;
  term1: number;
  term2: number;
  term3: number;
  term4: number;
  term5: number;
}

interface FileSystem {
  readFile(path: string, options: { encoding: string }): Promise<string>;
}

declare global {
  interface Window {
    fs: FileSystem;
  }
}

const ShapeSearch: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<ShapeData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedShape, setSelectedShape] = useState<ShapeData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [steelGrades] = useState<SteelGrade[]>([
    { name: "A36", Fy: 36 },
    { name: "A572 Grade 50", Fy: 50 },
    { name: "A992", Fy: 50 },
    { name: "A913 Grade 65", Fy: 65 }
  ]);
  const [selectedGrade, setSelectedGrade] = useState<SteelGrade>(steelGrades[2]); // A992 default
  const [E] = useState<number>(29000); // Modulus of elasticity (ksi)
  const [customFy, setCustomFy] = useState<string>('');
  const [calculatedLr, setCalculatedLr] = useState<number | null>(null);
  const [calculationDetails, setCalculationDetails] = useState<CalculationDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEquation, setShowEquation] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/W Member Database .csv');
        const csvText = await response.text();
        const result = Papa.parse<ShapeData>(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });
        setData(result.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = data
        .map(item => item.Shape)
        .filter((shape): shape is string => 
          typeof shape === 'string' && shape.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (shape: string) => {
    setSearchTerm(shape);
    const found = data.find(item => item.Shape === shape) || null;
    setSelectedShape(found);
    setSuggestions([]);
  };

  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    return String(value);
  };

  const calculateProperties = (shape: ShapeData) => {
    if (!shape.d || !shape.bf || !shape.tf || !shape.tw) {
      alert("Missing required section dimensions");
      return null;
    }

    const d = shape.d;
    const bf = shape.bf;
    const tf = shape.tf;
    const tw = shape.tw;
    const h = d - 2 * tf;

    // Calculate section properties
    const Ix = shape.Ix || (bf * Math.pow(d, 3) / 12) - ((bf - tw) * Math.pow(h, 3) / 12);
    const Sx = shape.Sx || Ix / (d / 2);
    const Iy = shape.Iy || (2 * tf * Math.pow(bf, 3) / 12) + (h * Math.pow(tw, 3) / 12);
    const J = (1/3) * (bf * Math.pow(tf, 3) * 2 + h * Math.pow(tw, 3));
    const ho = d - tf;
    const rts = Math.sqrt(Math.sqrt(Iy * J) / Sx);

    return { Ix, Iy, Sx, J, ho, rts };
  };

  const calculateLr = () => {
    if (!selectedShape) return;

    const props = calculateProperties(selectedShape);
    if (!props) return;

    const { Sx, J, ho, rts, Ix, Iy } = props;
    const Fy = customFy ? parseFloat(customFy) : selectedGrade.Fy;

    // Calculate Lr using the AISC equation
    const term1 = 1.95 * rts;
    const term2 = E / (0.7 * Fy);
    const term3 = Math.sqrt(J / (Sx * ho));
    const term4 = 6.76 * Math.pow((0.7 * Fy * Sx * ho) / (E * J), 2);
    const term5 = Math.sqrt(1 + Math.sqrt(1 + term4));
    
    const Lr = term1 * term2 * term3 * term5;

    setCalculatedLr(Lr);
    setCalculationDetails({ Ix, Iy, Sx, J, ho, rts, E, Fy, term1, term2, term3, term4, term5 });
  };

  return (
    <div className="min-h-screen bg-white engineering-grid">
      <div className="w-full max-w-4xl mx-auto p-4">
        <button
          onClick={() => router.push('/')}
          className="mb-8 px-6 py-3 minimal-button text-gray-700 hover:text-black tracking-wider transition-all duration-200"
        >
          ← BACK
        </button>
        
        <div className="minimal-card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-widest border-b border-gray-200 pb-4">
            W MEMBER TOOL
          </h2>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a shape..."
              className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-800 focus:border-gray-400 focus:outline-none transition-all duration-200 tracking-wider"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 shadow-lg">
                {suggestions.map((shape, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 cursor-pointer text-gray-700 hover:text-black tracking-wider border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelect(shape)}
                  >
                    {shape}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedShape && (
          <div className="minimal-card p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-widest border-b border-gray-200 pb-4">
              Lateral-Torsional Buckling Calculator
            </h2>

            {/* Steel Grade Selection */}
            <div className="mb-8">
              <h3 className="text-xl text-gray-800 mb-4 font-mono">Steel Grade</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={selectedGrade.name}
                  onChange={(e) => {
                    const grade = steelGrades.find(g => g.name === e.target.value);
                    if (grade) setSelectedGrade(grade);
                  }}
                  className="p-4 bg-gray-50 border border-gray-200 text-gray-800 font-mono focus:border-gray-400 focus:outline-none"
                  disabled={!!customFy}
                >
                  {steelGrades.map((grade) => (
                    <option key={grade.name} value={grade.name}>
                      {grade.name} (Fy = {grade.Fy} ksi)
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={customFy}
                  onChange={(e) => setCustomFy(e.target.value)}
                  placeholder="Custom Fy (ksi)"
                  className="p-4 bg-gray-50 border border-gray-200 text-gray-800 font-mono focus:border-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateLr}
              className="w-full p-4 bg-gray-800 text-white hover:bg-black tracking-wider transition-all duration-200"
            >
              CALCULATE Lr
            </button>

            {/* Results */}
            {calculatedLr !== null && calculationDetails && (
              <div className="mt-8">
                <div className="p-6 bg-gray-50 border border-gray-200 text-center">
                  <div className="text-2xl text-gray-800 font-mono tracking-wider">
                    Lr = {calculatedLr.toFixed(2)} inches
                    <div className="text-sm text-gray-50 mt-2">
                      ({(calculatedLr / 12).toFixed(2)} ft)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button
                    onClick={() => setShowEquation(!showEquation)}
                    className="p-3 bg-gray-50 text-gray-700 hover:text-black font-mono tracking-wider"
                  >
                    {showEquation ? 'HIDE EQUATION' : 'VIEW EQUATION'}
                  </button>
                  
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="p-3 bg-gray-50 text-gray-700 hover:text-black font-mono tracking-wider"
                  >
                    {showDetails ? 'HIDE DETAILS' : 'VIEW DETAILS'}
                  </button>
                </div>

                {showEquation && (
                  <div className="mt-4 p-6 bg-gray-50 border border-gray-200">
                    <h4 className="mb-4 text-gray-800 font-bold font-mono">AISC Equation for Lr:</h4>
                    
                    {/* Equation visualization */}
                    <div className="overflow-x-auto pb-2">
                      <div className="min-w-max">
                        <div className="flex flex-col items-center text-gray-800 font-mono">
                          <div className="mb-6 text-center">
                            <div className="text-lg mb-2">Lr = 1.95 × rts × (E / (0.7 × Fy)) × √(J / (Sx × ho)) × √(1 + √(1 + 6.76 × ((0.7 × Fy × Sx × ho) / (E × J))²))</div>
                            <div className="h-px w-full bg-gray-200 my-2"></div>
                            <div className="grid grid-cols-5 gap-2 text-sm text-gray-700">
                              <div>Term 1</div>
                              <div>Term 2</div>
                              <div>Term 3</div>
                              <div>Term 4</div>
                              <div>Term 5</div>
                            </div>
                          </div>
                          
                          {/* Step by step calculation */}
                          <div className="grid grid-cols-1 gap-4 w-full">
                            <div className="grid grid-cols-5 gap-2 text-sm">
                              <div className="p-2 border border-gray-200 bg-gray-5">
                                <div className="mb-1 text-gray-500">1.95 × rts</div>
                                <div>= 1.95 × {calculationDetails.rts.toFixed(3)}</div>
                                <div>= {calculationDetails.term1.toFixed(3)}</div>
                              </div>
                              
                              <div className="p-2 border border-gray-200 bg-gray-5">
                                <div className="mb-1 text-gray-500">E / (0.7 × Fy)</div>
                                <div>= {calculationDetails.E} / (0.7 × {calculationDetails.Fy})</div>
                                <div>= {calculationDetails.term2.toFixed(2)}</div>
                              </div>
                              
                              <div className="p-2 border border-gray-200 bg-gray-5">
                                <div className="mb-1 text-gray-500">√(J / (Sx × ho))</div>
                                <div>= √({calculationDetails.J.toFixed(2)} / ({calculationDetails.Sx.toFixed(2)} × {calculationDetails.ho.toFixed(2)}))</div>
                                <div>= {calculationDetails.term3.toFixed(4)}</div>
                              </div>
                              
                              <div className="p-2 border border-gray-200 bg-gray-5">
                                <div className="mb-1 text-gray-500">6.76 × ((0.7 × Fy × Sx × ho) / (E × J))²</div>
                                <div>= 6.76 × ((0.7 × {calculationDetails.Fy} × {calculationDetails.Sx.toFixed(2)} × {calculationDetails.ho.toFixed(2)}) / ({calculationDetails.E} × {calculationDetails.J.toFixed(2)}))²</div>
                                <div>= {calculationDetails.term4.toFixed(4)}</div>
                              </div>
                              
                              <div className="p-2 border border-gray-200 bg-gray-5">
                                <div className="mb-1 text-gray-500">√(1 + √(1 + term4))</div>
                                <div>= √(1 + √(1 + {calculationDetails.term4.toFixed(4)}))</div>
                                <div>= {calculationDetails.term5.toFixed(4)}</div>
                              </div>
                            </div>
                            
                            <div className="p-3 border border-gray-200 bg-gray-5 text-center">
                              <div className="text-gray-500 mb-1">Final Calculation</div>
                              <div>Lr = {calculationDetails.term1.toFixed(3)} × {calculationDetails.term2.toFixed(2)} × {calculationDetails.term3.toFixed(4)} × {calculationDetails.term5.toFixed(4)}</div>
                              <div>= {calculatedLr.toFixed(2)} inches</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showDetails && (
                  <div className="mt-4 p-6 bg-gray-50 border border-gray-200 font-mono text-gray-800 text-sm">
                    {/* Existing calculation details */}
                    <h4 className="mb-4 text-gray-800 font-bold">Calculated Section Properties:</h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6">
                      <div>Ix = {calculationDetails.Ix.toFixed(2)} in⁴</div>
                      <div>Iy = {calculationDetails.Iy.toFixed(2)} in⁴</div>
                      <div>Sx = {calculationDetails.Sx.toFixed(2)} in³</div>
                      <div>J = {calculationDetails.J.toFixed(2)} in⁴</div>
                      <div>ho = {calculationDetails.ho.toFixed(2)} in</div>
                      <div>rts = {calculationDetails.rts.toFixed(3)} in</div>
                    </div>
                    
                    <h4 className="mb-4 text-gray-800 font-bold">Input Values:</h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6">
                      <div>E = {calculationDetails.E} ksi</div>
                      <div>Fy = {calculationDetails.Fy} ksi</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedShape && (
          <div className="minimal-card p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-widest">
              {selectedShape.Shape}
            </h2>
            <div className="grid grid-cols-2 gap-8">
              {Object.entries(selectedShape).map(([key, value]) => (
                key !== 'Shape' && (
                  <div key={key} className="border-b border-gray-200 pb-4">
                    <div className="text-sm text-gray-500 mb-2 tracking-wider">{key}</div>
                    <div className="text-gray-800 tracking-wider">{formatValue(value)}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeSearch;