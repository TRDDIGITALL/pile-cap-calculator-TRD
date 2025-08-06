import React, { useState } from 'react';

// Helper component to render LaTeX formulas
const Latex = ({ children }) => {
  if (typeof window !== 'undefined' && window.katex) {
    return <span dangerouslySetInnerHTML={{ __html: window.katex.renderToString(String.raw`${children}`, { throwOnError: false }) }} />;
  }
  return <span>{children}</span>;
};

// Component to render the pile cap diagram
const Diagram = ({ results }) => {
  if (!results) return null;

  const { L, B, S, D, bc, hc } = results.dims;
  const { mainBars, secondaryBars } = results;
  const scale = 300 / L; // Scale diagram to fit width
  const svgWidth = L * scale + 40;
  const svgHeight = B * scale + 40;

  const capX = 20;
  const capY = 20;
  const capWidth = L * scale;
  const capHeight = B * scale;

  const pile1X = capX + (L/2 - S/2) * scale;
  const pile2X = capX + (L/2 + S/2) * scale;
  const pileY = capY + (B/2) * scale;
  const pileRadius = (D/2) * scale;

  const colX = capX + (L/2 - bc/2) * scale;
  const colY = capY + (B/2 - hc/2) * scale;
  const colWidth = bc * scale;
  const colHeight = hc * scale;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">แบบแปลนฐานราก (Plan View)</h3>
      <svg width={svgWidth} height={svgHeight} className="mx-auto">
        {/* Pile Cap */}
        <rect x={capX} y={capY} width={capWidth} height={capHeight} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
        
        {/* Piles */}
        <circle cx={pile1X} cy={pileY} r={pileRadius} fill="#a1a1aa" stroke="#4b5563" />
        <circle cx={pile2X} cy={pileY} r={pileRadius} fill="#a1a1aa" stroke="#4b5563" />
        
        {/* Column */}
        <rect x={colX} y={colY} width={colWidth} height={colHeight} fill="white" stroke="#4b5563" strokeWidth="1.5" />

        {/* Centerlines */}
        <line x1={capX} y1={capY + capHeight/2} x2={capX + capWidth} y2={capY + capHeight/2} stroke="#9ca3af" strokeDasharray="4" />
        <line x1={capX + capWidth/2} y1={capY} x2={capX + capWidth/2} y2={capY + capHeight} stroke="#9ca3af" strokeDasharray="4" />

        {/* Dimensions */}
        <text x={capX + capWidth/2} y={capY - 10} textAnchor="middle" className="text-xs fill-gray-600">L = {L.toFixed(2)} m</text>
        <text x={capX - 10} y={capY + capHeight/2} textAnchor="middle" transform={`rotate(-90, ${capX-10}, ${capY + capHeight/2})`} className="text-xs fill-gray-600">B = {B.toFixed(2)} m</text>
        
        {/* Reinforcement Info */}
        <text x={capX + capWidth/2} y={capY + capHeight + 20} textAnchor="middle" className="text-xs fill-blue-600 font-semibold">
          เหล็กเสริมหลัก (แกน X): {mainBars.count} DB {mainBars.dia} @ {mainBars.spacing.toFixed(0)} mm
        </text>
         <text x={capX + capWidth/2} y={capY + capHeight + 35} textAnchor="middle" className="text-xs fill-blue-600 font-semibold">
          เหล็กเสริมรอง (แกน Y): {secondaryBars.count} DB {secondaryBars.dia} @ {secondaryBars.spacing.toFixed(0)} mm
        </text>
      </svg>
    </div>
  );
};

// Thai TIS (มอก.) standard reinforcement bar data
const THAI_REBAR_STANDARDS = {
  // Standard bar diameters according to TIS 24-2548 (Thai Industrial Standard)
  diameters: [
    { dia: 6, area: 28.3, weight: 0.222 },
    { dia: 9, area: 63.6, weight: 0.499 },
    { dia: 12, area: 113.1, weight: 0.888 },
    { dia: 16, area: 201.1, weight: 1.578 },
    { dia: 20, area: 314.2, weight: 2.466 },
    { dia: 25, area: 490.9, weight: 3.854 },
    { dia: 28, area: 615.8, weight: 4.834 },
    { dia: 32, area: 804.2, weight: 6.313 }
  ],
  // Steel grade properties (TIS 24-2548)
  grades: [
    { grade: 'SD30', fy: 295, description: 'เหล็กเสริมคอนกรีต SD30 (fy = 295 MPa)' },
    { grade: 'SD40', fy: 390, description: 'เหล็กเสริมคอนกรีต SD40 (fy = 390 MPa)' },
    { grade: 'SD50', fy: 490, description: 'เหล็กเสริมคอนกรีต SD50 (fy = 490 MPa)' }
  ]
};

// Thai TIS standard concrete grades
const THAI_CONCRETE_STANDARDS = {
  // Standard concrete grades according to TIS 166-2549 (Thai Industrial Standard for Ready Mixed Concrete)
  grades: [
    { grade: 'C15/20', fc: 15, description: 'คอนกรีต C15/20 (fc\' = 15 MPa) - งานทั่วไป' },
    { grade: 'C20/25', fc: 20, description: 'คอนกรีต C20/25 (fc\' = 20 MPa) - งานโครงสร้างเบา' },
    { grade: 'C25/30', fc: 25, description: 'คอนกรีต C25/30 (fc\' = 25 MPa) - งานโครงสร้างทั่วไป' },
    { grade: 'C30/37', fc: 30, description: 'คอนกรีต C30/37 (fc\' = 30 MPa) - งานโครงสร้างปานกลาง' },
    { grade: 'C35/45', fc: 35, description: 'คอนกรีต C35/45 (fc\' = 35 MPa) - งานโครงสร้างหนัก' },
    { grade: 'C40/50', fc: 40, description: 'คอนกรีต C40/50 (fc\' = 40 MPa) - งานโครงสร้างพิเศษ' },
    { grade: 'C45/55', fc: 45, description: 'คอนกรีต C45/55 (fc\' = 45 MPa) - งานโครงสร้างความแข็งแรงสูง' },
    { grade: 'C50/60', fc: 50, description: 'คอนกรีต C50/60 (fc\' = 50 MPa) - งานโครงสร้างความแข็งแรงสูงมาก' }
  ],
  // Material properties
  properties: {
    gamma_concrete: 24, // kN/m³ - Unit weight of concrete
    elastic_modulus_factor: 4700, // Ec = 4700√fc' (MPa) according to TIS
    poisson_ratio: 0.2, // Poisson's ratio for concrete
    thermal_expansion: 10e-6 // per °C
  }
};

// Main App Component
export default function App() {
  const [inputs, setInputs] = useState({
    PD: 48,
    PL: 30,
    MxD: 0,
    MxL: 0,
    Qa: 400, // kN (Allowable capacity)
    D: 300, // mm
    S: 900, // mm
    concrete_grade: 'C25/30', // Concrete grade
    fc: 25, // MPa (will be updated based on concrete_grade)
    steel_grade: 'SD40', // Steel grade
    fy: 390, // MPa (will be updated based on steel_grade)
    bc: 400, // mm
    hc: 550, // mm
    h_cap: 600, // mm
    CL: 70, // mm
    main_bar_dia: 16, // mm - Main reinforcement
    sec_bar_dia: 12, // mm - Secondary reinforcement
    custom_main_bars: false, // Allow custom bar selection
    custom_main_count: 8, // Custom number of main bars
    custom_sec_bars: false, // Allow custom secondary bar selection
    custom_sec_count: 6, // Custom number of secondary bars
  });
  const [results, setResults] = useState(null);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : (parseFloat(value) || 0);
    
    // Handle string values for select inputs
    if (name === 'steel_grade' || name === 'concrete_grade' || name === 'main_bar_dia' || name === 'sec_bar_dia') {
      newValue = value;
    }
    
    setInputs(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Update fy when steel grade changes
      if (name === 'steel_grade') {
        const selectedGrade = THAI_REBAR_STANDARDS.grades.find(g => g.grade === value);
        if (selectedGrade) {
          updated.fy = selectedGrade.fy;
        }
      }
      
      // Update fc when concrete grade changes
      if (name === 'concrete_grade') {
        const selectedGrade = THAI_CONCRETE_STANDARDS.grades.find(g => g.grade === value);
        if (selectedGrade) {
          updated.fc = selectedGrade.fc;
        }
      }
      
      return updated;
    });
    setResults(null); // Reset results when inputs change
  };

  const handleCalculate = () => {
    // Convert units to m and kN for consistency
    const D = inputs.D / 1000;
    const S = inputs.S / 1000;
    const bc = inputs.bc / 1000;
    const hc = inputs.hc / 1000;
    const h_cap = inputs.h_cap / 1000;
    const CL = inputs.CL / 1000;
    const main_bar_dia = parseFloat(inputs.main_bar_dia) / 1000;
    const sec_bar_dia = parseFloat(inputs.sec_bar_dia) / 1000;

    // Get bar properties from TIS standards
    const mainBarData = THAI_REBAR_STANDARDS.diameters.find(bar => bar.dia === parseFloat(inputs.main_bar_dia));
    const secBarData = THAI_REBAR_STANDARDS.diameters.find(bar => bar.dia === parseFloat(inputs.sec_bar_dia));

    // --- Step 1: Loads & Dimensions ---
    const Pu = 1.4 * inputs.PD + 1.7 * inputs.PL;
    const Mux = 1.4 * inputs.MxD + 1.7 * inputs.MxL;
    const edge_dist = 150 / 1000; // Standard edge distance
    const L = S + 2 * (D/2) + 2 * edge_dist;
    const B = D + 2 * edge_dist;
    const W_cap = L * B * h_cap * 24; // gamma_concrete = 24 kN/m^3
    const Pu_group = Pu + 1.4 * W_cap;
    const d_eff = h_cap - CL - main_bar_dia; // Effective depth

    // --- Step 2: Pile Reactions ---
    const n_piles = 2;
    const R_u_max = (Pu_group / n_piles) + (Math.abs(Mux) / S);
    const Qu = inputs.Qa * 1.7; // Estimated ultimate capacity
    const safety_factor = Qu / R_u_max;

    // --- Step 3: Flexural Design ---
    const phi_f = 0.9; // Flexure reduction factor
    const crit_dist_M = S/2 - bc/2;
    const Mu_crit = R_u_max * crit_dist_M;
    const Rn = Mu_crit / (phi_f * B * Math.pow(d_eff, 2)) / 1000; // Convert to MN/m^2 (MPa)
    const rho_req = (0.85 * inputs.fc / inputs.fy) * (1 - Math.sqrt(1 - (2 * Rn) / (0.85 * inputs.fc)));
    let As_req = rho_req * B * d_eff;
    const As_min1 = (0.25 * Math.sqrt(inputs.fc) / inputs.fy) * B * d_eff;
    const As_min2 = (1.4 / inputs.fy) * B * d_eff;
    const As_min = Math.max(As_min1, As_min2);
    const As_final = Math.max(As_req, As_min);
    
    // Main reinforcement calculation
    const main_bar_area = mainBarData ? mainBarData.area / 1000000 : Math.PI * Math.pow(main_bar_dia / 2, 2); // Convert mm² to m²
    
    let num_main_bars, main_bar_spacing;
    if (inputs.custom_main_bars) {
      num_main_bars = inputs.custom_main_count;
      main_bar_spacing = (B > 0 && num_main_bars > 1) ? (B - 2*CL - main_bar_dia) / (num_main_bars - 1) * 1000 : 0;
    } else {
      num_main_bars = Math.ceil(As_final / main_bar_area);
      main_bar_spacing = (B > 0 && num_main_bars > 1) ? (B - 2*CL - main_bar_dia) / (num_main_bars - 1) * 1000 : 0;
    }
    
    const As_provided_main = num_main_bars * main_bar_area;

    // Secondary reinforcement (distribution)
    const As_secondary = Math.max(As_min, 0.2 * As_provided_main); // Minimum or 20% of main reinforcement
    const sec_bar_area = secBarData ? secBarData.area / 1000000 : Math.PI * Math.pow(sec_bar_dia / 2, 2); // Convert mm² to m²
    
    let num_sec_bars, sec_bar_spacing;
    if (inputs.custom_sec_bars) {
      num_sec_bars = inputs.custom_sec_count;
      sec_bar_spacing = (L > 0 && num_sec_bars > 1) ? (L - 2*CL - sec_bar_dia) / (num_sec_bars - 1) * 1000 : 0;
    } else {
      num_sec_bars = Math.ceil(As_secondary / sec_bar_area);
      sec_bar_spacing = (L > 0 && num_sec_bars > 1) ? (L - 2*CL - sec_bar_dia) / (num_sec_bars - 1) * 1000 : 0;
    }
    
    const As_provided_sec = num_sec_bars * sec_bar_area;

    // --- Step 4: Shear Design ---
    const phi_v = 0.75; // Shear reduction factor
    // One-way shear
    const crit_dist_V1 = S/2 - bc/2 - d_eff;
    const Vu_1way = crit_dist_V1 > 0 ? R_u_max : 0;
    const Vc_1way = phi_v * (1/6) * Math.sqrt(inputs.fc) * B * d_eff * 1000; // in kN
    
    // Punching shear
    const V_punch = Pu; // Ultimate load from column
    const b0 = 2 * (bc + d_eff) + 2 * (hc + d_eff);
    const beta = Math.max(hc, bc) / Math.min(hc, bc);
    const vc_p1 = (1/6) * (1 + 2/beta) * Math.sqrt(inputs.fc);
    const vc_p2 = (1/12) * (2 + (40 * d_eff) / b0) * Math.sqrt(inputs.fc);
    const vc_p3 = (1/3) * Math.sqrt(inputs.fc);
    const vc_punch = Math.min(vc_p1, vc_p2, vc_p3);
    const Vc_punch = phi_v * vc_punch * b0 * d_eff * 1000; // in kN

    setResults({
      loads: { Pu, Mux, W_cap, Pu_group },
      dims: { L, B, h_cap, d_eff, S, D, bc, hc },
      reactions: { R_u_max, Qu, safety_factor },
      flexure: { Mu_crit, Rn, rho_req, As_min, As_final, As_provided_main, As_provided_sec },
      mainBars: { 
        count: num_main_bars, 
        dia: parseFloat(inputs.main_bar_dia), 
        spacing: main_bar_spacing,
        area_provided: As_provided_main * 10000, // Convert to cm²
        area_required: As_final * 10000, // Convert to cm²
        weight: mainBarData ? mainBarData.weight : 0
      },
      secondaryBars: { 
        count: num_sec_bars, 
        dia: parseFloat(inputs.sec_bar_dia), 
        spacing: sec_bar_spacing,
        area_provided: As_provided_sec * 10000, // Convert to cm²
        area_required: As_secondary * 10000, // Convert to cm²
        weight: secBarData ? secBarData.weight : 0
      },
      shear: { Vu_1way, Vc_1way, V_punch, Vc_punch },
      steel_grade: inputs.steel_grade,
      concrete_grade: inputs.concrete_grade
    });
  };
  
  const renderStepContent = () => {
     if (!results) {
      return <div className="text-center text-gray-500 mt-8">กรุณากรอกข้อมูลและกดปุ่ม "คำนวณ" เพื่อดูผลลัพธ์</div>;
    }
    switch(step) {
        case 1: 
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">ขั้นตอนที่ 1: น้ำหนักบรรทุกและขนาดฐานราก</h3>
                    <div>
                        <p>น้ำหนักบรรทุกประลัย (Ultimate Load), <Latex>P_u</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`P_u = 1.4 P_D + 1.7 P_L = 1.4(${inputs.PD}) + 1.7(${inputs.PL}) = ${results.loads.Pu.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div>
                        <p>โมเมนต์ประลัย (Ultimate Moment), <Latex>M_{"\\text{ux}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`M_{\\text{ux}} = 1.4 M_{xD} + 1.7 M_{xL} = 1.4(${inputs.MxD}) + 1.7(${inputs.MxL}) = ${results.loads.Mux.toFixed(2)}`}</Latex> kN.m</p>
                    </div>
                    <div>
                        <p>ขนาดความยาวฐานราก (Pile Cap Length), L:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`L = S + D + 2 \\times \\text{edge} = ${inputs.S/1000} + ${inputs.D/1000} + 2(0.15) = ${results.dims.L.toFixed(2)}`}</Latex> m</p>
                    </div>
                    <div>
                        <p>ขนาดความกว้างฐานราก (Pile Cap Width), B:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`B = D + 2 \\times \\text{edge} = ${inputs.D/1000} + 2(0.15) = ${results.dims.B.toFixed(2)}`}</Latex> m</p>
                    </div>
                    <div>
                        <p>น้ำหนักฐานราก (Pile Cap Weight), <Latex>W_{"\\text{cap}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`W_{\\text{cap}} = L \\times B \\times h_{\\text{cap}} \\times \\gamma_c = ${results.dims.L.toFixed(2)} \\times ${results.dims.B.toFixed(2)} \\times ${inputs.h_cap/1000} \\times 24 = ${results.loads.W_cap.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div>
                        <p>ความลึกประสิทธิผล (Effective Depth), d:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`d = h_{\\text{cap}} - \\text{Cover} - d_{\\text{bar}} = ${inputs.h_cap} - ${inputs.CL} - ${inputs.main_bar_dia} = ${(results.dims.d_eff * 1000).toFixed(0)}`}</Latex> mm</p>
                    </div>
                </div>
            );
        case 2: 
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">ขั้นตอนที่ 2: แรงในเสาเข็ม (Pile Reactions)</h3>
                    <div>
                        <p>น้ำหนักลงกลุ่มเสาเข็มประลัย (Total Ultimate Group Load), <Latex>P_{"\\text{group,u}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`P_{\\text{group,u}} = P_u + 1.4 W_{\\text{cap}} = ${results.loads.Pu.toFixed(2)} + 1.4(${results.loads.W_cap.toFixed(2)}) = ${results.loads.Pu_group.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div>
                        <p>แรงในเสาเข็มสูงสุด (Max Pile Reaction), <Latex>R_{"\\text{u,max}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`R_{\\text{u,max}} = \\frac{P_{\\text{group,u}}}{n} + \\frac{|M_{\\text{ux}}|}{S} = \\frac{${results.loads.Pu_group.toFixed(2)}}{2} + \\frac{${Math.abs(results.loads.Mux).toFixed(2)}}{${inputs.S/1000}} = ${results.reactions.R_u_max.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div>
                        <p>กำลังรับน้ำหนักประลัยของเสาเข็ม (Ultimate Pile Capacity), <Latex>Q_u</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`Q_u \\approx 1.7 Q_a = 1.7 \\times ${inputs.Qa} = ${results.reactions.Qu.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div className={results.reactions.safety_factor > 1 ? "text-green-600" : "text-red-600"}>
                        <p>ตรวจสอบกำลังเสาเข็ม:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md">
                            <Latex>{`R_{\\text{u,max}} = ${results.reactions.R_u_max.toFixed(2)} \\text{ kN} \\ ${results.reactions.safety_factor > 1 ? '\\le' : '>'} \\ Q_u = ${results.reactions.Qu.toFixed(2)} \\text{ kN}`}</Latex> {results.reactions.safety_factor > 1 ? " (OK)" : " (NOT OK)"}
                        </p>
                    </div>
                </div>
            );
        case 3: 
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">ขั้นตอนที่ 3: การออกแบบรับโมเมนต์ดัด (Flexural Design)</h3>
                    <div>
                        <p>โมเมนต์ดัดที่หน้าตัดวิกฤต (Moment at Critical Section), <Latex>M_{"\\text{u,crit}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`M_{\\text{u,crit}} = R_{\\text{u,max}} \\times (S/2 - b_c/2) = ${results.reactions.R_u_max.toFixed(2)} \\times (${inputs.S/2000} - ${inputs.bc/2000}) = ${results.flexure.Mu_crit.toFixed(2)}`}</Latex> kN.m</p>
                    </div>
                    <div>
                        <p>ปริมาณเหล็กเสริมที่ต้องการ (Required Steel Area), <Latex>A_{"\\text{s,req}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`A_{\\text{s,req}} = ${results.flexure.As_final * 10000 > 0 ? (results.flexure.As_final * 10000).toFixed(2) : '0.00'}`}</Latex> cm²</p>
                    </div>
                    <div>
                        <p>ปริมาณเหล็กเสริมน้อยสุด (Minimum Steel Area), <Latex>A_{"\\text{s,min}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`A_{\\text{s,min}} = ${(results.flexure.As_min * 10000).toFixed(2)}`}</Latex> cm²</p>
                    </div>
                    <div>
                        <p>ปริมาณเหล็กเสริมที่จัดให้ (Provided Steel Area), <Latex>A_{"\\text{s,provided}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`A_{\\text{s,provided}} = ${results.mainBars.area_provided.toFixed(2)}`}</Latex> cm²</p>
                    </div>
                    <div className="text-blue-600">
                        <p>สรุปเหล็กเสริมหลัก (แกน X) - เกรด {results.steel_grade}:</p>
                        <p className="font-mono bg-blue-50 p-2 rounded-md">
                          เลือกใช้ {results.mainBars.count} DB {results.mainBars.dia} @ {results.mainBars.spacing.toFixed(0)} mm
                          <br/>
                          <span className="text-sm">พื้นที่เหล็ก: {results.mainBars.area_provided.toFixed(2)} cm² (ต้องการ: {results.mainBars.area_required.toFixed(2)} cm²)</span>
                          {results.mainBars.weight > 0 && (
                            <br/>
                          )}
                          {results.mainBars.weight > 0 && (
                            <span className="text-sm">น้ำหนัก: {(results.mainBars.weight * results.mainBars.count * (results.dims.B)).toFixed(2)} kg/m</span>
                          )}
                        </p>
                    </div>
                    <div className="text-green-600">
                        <p>สรุปเหล็กเสริมรอง (แกน Y) - เกรด {results.steel_grade}:</p>
                        <p className="font-mono bg-green-50 p-2 rounded-md">
                          เลือกใช้ {results.secondaryBars.count} DB {results.secondaryBars.dia} @ {results.secondaryBars.spacing.toFixed(0)} mm
                          <br/>
                          <span className="text-sm">พื้นที่เหล็ก: {results.secondaryBars.area_provided.toFixed(2)} cm² (ต้องการ: {results.secondaryBars.area_required.toFixed(2)} cm²)</span>
                          {results.secondaryBars.weight > 0 && (
                            <br/>
                          )}
                          {results.secondaryBars.weight > 0 && (
                            <span className="text-sm">น้ำหนัก: {(results.secondaryBars.weight * results.secondaryBars.count * (results.dims.L)).toFixed(2)} kg/m</span>
                          )}
                        </p>
                    </div>
                </div>
            );
        case 4: 
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">ขั้นตอนที่ 4: การออกแบบรับแรงเฉือน (Shear Design)</h3>
                    <div>
                        <p>แรงเฉือนแบบคาน (One-Way Shear), <Latex>V_{"\\text{u, 1-way}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`V_u = ${results.shear.Vu_1way.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div>
                        <p>คอนกรีตรับแรงเฉือนแบบคานได้, <Latex>\\phi V_{"\\text{c, 1-way}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`\\phi V_c = ${results.shear.Vc_1way.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div className={results.shear.Vc_1way > results.shear.Vu_1way ? "text-green-600" : "text-red-600"}>
                        <p>ตรวจสอบแรงเฉือนแบบคาน:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md">
                            <Latex>{`V_u ${results.shear.Vc_1way > results.shear.Vu_1way ? '\\le' : '>'} \\phi V_c`}</Latex> {results.shear.Vc_1way > results.shear.Vu_1way ? " (OK)" : " (NOT OK, Increase depth)"}
                        </p>
                    </div>
                    <hr className="my-4"/>
                    <div>
                        <p>แรงเฉือนแบบเจาะ (Punching Shear), <Latex>V_{"\\text{u, punch}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`V_u = P_u = ${results.shear.V_punch.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div>
                        <p>คอนกรีตรับแรงเฉือนแบบเจาะได้, <Latex>\\phi V_{"\\text{c, punch}"}</Latex>:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md"><Latex>{`\\phi V_c = ${results.shear.Vc_punch.toFixed(2)}`}</Latex> kN</p>
                    </div>
                    <div className={results.shear.Vc_punch > results.shear.V_punch ? "text-green-600" : "text-red-600"}>
                        <p>ตรวจสอบแรงเฉือนแบบเจาะ:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded-md">
                            <Latex>{`V_u ${results.shear.Vc_punch > results.shear.V_punch ? '\\le' : '>'} \\phi V_c`}</Latex> {results.shear.Vc_punch > results.shear.V_punch ? " (OK)" : " (NOT OK, Increase depth)"}
                        </p>
                    </div>
                </div>
            );
        default: return null;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">โปรแกรมออกแบบฐานรากเสาเข็ม 2 ต้น (Pile Cap)</h1>
          <p className="text-md text-gray-600 mt-2">คำนวณตามหลักวิศวกรรมมาตรฐาน (วิธีหน่วยแรงประลัย)</p>
          <p className="text-sm text-green-600 mt-1">รองรับเหล็กเสริมมาตรฐาน มอก. TIS 24-2548 และคอนกรีตมาตรฐาน มอก. TIS 166-2549</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-3 mb-6">ข้อมูลอินพุต</h2>
            <div className="space-y-4">
              {/* Basic Load Inputs */}
              {['PD', 'PL', 'MxD', 'MxL', 'Qa'].map(key => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    { {PD: 'น้ำหนักบรรทุกคงที่ (PD)', PL: 'น้ำหนักบรรทุกจร (PL)', MxD: 'โมเมนต์จาก นน.คงที่ (MxD)', MxL: 'โมเมนต์จาก นน.จร (MxL)', Qa: 'กำลังรับ นน. ปลอดภัยของเสาเข็ม (Qa)'}[key] }
                     ({ {PD: 'kN', PL: 'kN', MxD: 'kN.m', MxL: 'kN.m', Qa: 'kN'}[key] })
                  </label>
                  <input type="number" name={key} id={key} value={inputs[key]} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              ))}
              
              {/* Geometric Inputs */}
              {['D', 'S', 'bc', 'hc', 'h_cap', 'CL'].map(key => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    { {D: 'ขนาดเส้นผ่านศูนย์กลางเสาเข็ม (D)', S: 'ระยะห่างระหว่างศูนย์กลางเสาเข็ม (S)', bc: 'ความกว้างเสาตอม่อ (bc)', hc: 'ความลึกเสาตอม่อ (hc)', h_cap: 'ความหนาฐานราก (h_cap)', CL: 'ระยะหุ้มคอนกรีต (Cover)'}[key] }
                     ({ {D: 'mm', S: 'mm', bc: 'mm', hc: 'mm', h_cap: 'mm', CL: 'mm'}[key] })
                  </label>
                  <input type="number" name={key} id={key} value={inputs[key]} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              ))}

              {/* Material Properties */}
              <div>
                <label htmlFor="concrete_grade" className="block text-sm font-medium text-gray-700">
                  เกรดคอนกรีต (ตาม มอก. TIS 166-2549)
                </label>
                <select name="concrete_grade" id="concrete_grade" value={inputs.concrete_grade} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  {THAI_CONCRETE_STANDARDS.grades.map(grade => (
                    <option key={grade.grade} value={grade.grade}>{grade.description}</option>
                  ))}
                </select>
              </div>

              {/* Automatic fc display */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  กำลังอัดของคอนกรีต (fc') (MPa)
                </label>
                <input type="number" name="fc" value={inputs.fc} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm cursor-not-allowed" />
                <p className="text-xs text-gray-500 mt-1">*อัตโนมัติตามเกรดคอนกรีตที่เลือก</p>
              </div>

              {/* Steel Grade Selection */}
              <div>
                <label htmlFor="steel_grade" className="block text-sm font-medium text-gray-700">
                  เกรดเหล็กเสริม (ตาม มอก. TIS 24-2548)
                </label>
                <select name="steel_grade" id="steel_grade" value={inputs.steel_grade} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  {THAI_REBAR_STANDARDS.grades.map(grade => (
                    <option key={grade.grade} value={grade.grade}>{grade.description}</option>
                  ))}
                </select>
              </div>

              {/* Automatic fy display */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  กำลังครากของเหล็กเสริม (fy) (MPa)
                </label>
                <input type="number" name="fy" value={inputs.fy} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm cursor-not-allowed" />
                <p className="text-xs text-gray-500 mt-1">*อัตโนมัติตามเกรดเหล็กที่เลือก</p>
              </div>

              <hr className="my-4 border-gray-300" />
              
              {/* Main Reinforcement Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">เหล็กเสริมหลัก (แกน X)</h3>
                
                <div>
                  <label htmlFor="main_bar_dia" className="block text-sm font-medium text-gray-700">
                    ขนาดเหล็กเสริมหลัก (mm)
                  </label>
                  <select name="main_bar_dia" id="main_bar_dia" value={inputs.main_bar_dia} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    {THAI_REBAR_STANDARDS.diameters.map(bar => (
                      <option key={bar.dia} value={bar.dia}>DB {bar.dia} (พื้นที่ {bar.area} mm², น้ำหนัก {bar.weight} kg/m)</option>
                    ))}
                  </select>
                </div>

                <div className="mt-3">
                  <label className="flex items-center">
                    <input type="checkbox" name="custom_main_bars" checked={inputs.custom_main_bars} onChange={handleInputChange} className="mr-2" />
                    <span className="text-sm font-medium text-gray-700">กำหนดจำนวนเหล็กเสริมหลักเอง</span>
                  </label>
                </div>

                {inputs.custom_main_bars && (
                  <div className="mt-3">
                    <label htmlFor="custom_main_count" className="block text-sm font-medium text-gray-700">
                      จำนวนเหล็กเสริมหลัก (เส้น)
                    </label>
                    <input type="number" min="2" name="custom_main_count" id="custom_main_count" value={inputs.custom_main_count} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                )}
              </div>

              {/* Secondary Reinforcement Section */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">เหล็กเสริมรอง (แกน Y)</h3>
                
                <div>
                  <label htmlFor="sec_bar_dia" className="block text-sm font-medium text-gray-700">
                    ขนาดเหล็กเสริมรอง (mm)
                  </label>
                  <select name="sec_bar_dia" id="sec_bar_dia" value={inputs.sec_bar_dia} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    {THAI_REBAR_STANDARDS.diameters.map(bar => (
                      <option key={bar.dia} value={bar.dia}>DB {bar.dia} (พื้นที่ {bar.area} mm², น้ำหนัก {bar.weight} kg/m)</option>
                    ))}
                  </select>
                </div>

                <div className="mt-3">
                  <label className="flex items-center">
                    <input type="checkbox" name="custom_sec_bars" checked={inputs.custom_sec_bars} onChange={handleInputChange} className="mr-2" />
                    <span className="text-sm font-medium text-gray-700">กำหนดจำนวนเหล็กเสริมรองเอง</span>
                  </label>
                </div>

                {inputs.custom_sec_bars && (
                  <div className="mt-3">
                    <label htmlFor="custom_sec_count" className="block text-sm font-medium text-gray-700">
                      จำนวนเหล็กเสริมรอง (เส้น)
                    </label>
                    <input type="number" min="2" name="custom_sec_count" id="custom_sec_count" value={inputs.custom_sec_count} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleCalculate} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              คำนวณ
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            {results && (
              <div className="flex justify-center space-x-2 mb-6 border-b pb-4">
                  <button onClick={() => setStep(1)} className={`px-4 py-2 rounded-md text-sm font-medium ${step === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>1. น้ำหนักและขนาด</button>
                  <button onClick={() => setStep(2)} className={`px-4 py-2 rounded-md text-sm font-medium ${step === 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>2. แรงในเสาเข็ม</button>
                  <button onClick={() => setStep(3)} className={`px-4 py-2 rounded-md text-sm font-medium ${step === 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>3. ออกแบบรับโมเมนต์</button>
                  <button onClick={() => setStep(4)} className={`px-4 py-2 rounded-md text-sm font-medium ${step === 4 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>4. ออกแบบรับแรงเฉือน</button>
              </div>
            )}
            <div className="calculation-steps">
              {renderStepContent()}
            </div>
            {results && <Diagram results={results} />}
          </div>
        </div>

        {/* Footer with Legal Disclaimer and Developer Credit */}
        <footer className="mt-12 bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
          <div className="space-y-4">
            {/* Legal Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <h3 className="text-lg font-bold text-red-700 mb-2">⚠️ คำเตือนทางกฎหมายและความรับผิดชอบ</h3>
              <div className="text-sm text-red-700 space-y-2">
                <p>• โปรแกรมนี้เป็นเครื่องมือช่วยคำนวณเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการออกแบบโดยวิศวกรผู้เชี่ยวชาญได้</p>
                <p>• ผลการคำนวณต้องได้รับการตรวจสอบและรับรองโดยวิศวกรโครงสร้างที่มีใบอนุญาตประกอบวิชาชีพ</p>
                <p>• ผู้พัฒนาไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดขึ้นจากการใช้งานโปรแกรมนี้</p>
                <p>• การใช้งานในงานจริงต้องปฏิบัติตามมาตรฐานและข้อกำหนดทางกฎหมายที่เกี่ยวข้อง</p>
                <p>• ควรตรวจสอบความถูกต้องของข้อมูลและผลการคำนวณก่อนนำไปใช้งาน</p>
              </div>
            </div>

            {/* Developer Credit */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <h3 className="text-lg font-bold text-blue-700 mb-2">👨‍💻 ข้อมูลผู้พัฒนา</h3>
              <div className="text-sm text-blue-700">
                <p><strong>ผู้พัฒนา:</strong> ธงชาติ อำแดงพิน</p>
                <p><strong>เวอร์ชัน:</strong> 1.0.0</p>
                <p><strong>อัปเดตล่าสุด:</strong> สิงหาคม 2568</p>
                <p><strong>มาตรฐานที่ใช้:</strong> มอก. TIS 24-2548 (เหล็กเสริม), มอก. TIS 166-2549 (คอนกรีต)</p>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              © 2568 โปรแกรมออกแบบฐานรากเสาเข็ม 2 ต้น | พัฒนาโดย ธงชาติ อำแดงพิน | เพื่อการศึกษาและการใช้งานเบื้องต้น
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
