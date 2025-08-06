# Pile Cap Calculator - โปรแกรมออกแบบฐานรากเสาเข็ม 2 ต้น

A React-based calculator for designing 2-pile foundation caps (pile caps) according to structural engineering standards using the Ultimate Strength Design method. **Now supports Thai TIS (มอก.) standard reinforcement bars!**

## Features

- **Comprehensive Design Calculations:**
  - Load analysis (Dead, Live, and Ultimate loads)
  - Pile cap dimensions calculation
  - Pile reaction analysis
  - Flexural design with reinforcement calculation
  - Shear design (one-way and punching shear)

- **Thai Reinforcement Standards (มอก. TIS 24-2548):**
  - Standard bar diameters: DB6, DB9, DB12, DB16, DB20, DB25, DB28, DB32
  - Steel grades: SD30 (fy=295 MPa), SD40 (fy=390 MPa), SD50 (fy=490 MPa)
  - Automatic material properties based on selection
  - Bar area and weight calculations per meter
  - Custom bar count selection or automatic calculation

- **Interactive Interface:**
  - User-friendly input form with Thai language labels
  - Step-by-step calculation display
  - Real-time LaTeX formula rendering
  - Visual diagram of the pile cap plan view
  - Separate sections for main and secondary reinforcement
  - Material property validation

- **Engineering Standards:**
  - Ultimate Strength Design (USD) method
  - Standard load factors (1.4DL + 1.7LL)
  - Thai concrete and steel material standards
  - Safety factor verification
  - Reinforcement spacing and detailing checks

## Installation

1. Navigate to the project directory:

```bash
cd f:\N8N\Footing2Pile
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## Usage

1. **Input Parameters:**
   - Dead Load (PD) and Live Load (PL) in kN
   - Moments from Dead and Live loads (MxD, MxL) in kN.m
   - Pile allowable capacity (Qa) in kN
   - Pile diameter (D) and spacing (S) in mm
   - Concrete strength (fc') and steel yield strength (fy) in MPa
   - Column dimensions (bc, hc) and pile cap thickness (h_cap) in mm
   - Cover and reinforcement bar diameter in mm

2. **Calculate:**
   - Click the "คำนวณ" (Calculate) button to perform the design calculations

3. **Review Results:**
   - Navigate through 4 calculation steps using the tab buttons
   - View detailed calculations with mathematical formulas
   - Examine the pile cap plan view diagram
   - Check safety verifications (highlighted in green/red)

## Calculation Steps

1. **Step 1: Loads & Dimensions**
   - Ultimate load calculations
   - Pile cap size determination
   - Effective depth calculation

2. **Step 2: Pile Reactions**
   - Group load analysis
   - Maximum pile reaction
   - Pile capacity verification

3. **Step 3: Flexural Design**
   - Critical moment calculation
   - Required steel area
   - Reinforcement detailing

4. **Step 4: Shear Design**
   - One-way shear check
   - Punching shear verification

## Technologies Used

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **KaTeX** - LaTeX math rendering
- **SVG** - Vector graphics for diagrams

## File Structure

```text
src/
├── App.js          # Main application component
├── index.js        # React DOM entry point
├── index.css       # Global styles
public/
├── index.html      # HTML template
├── manifest.json   # PWA manifest
package.json        # Dependencies and scripts
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## ⚠️ Legal Disclaimer - คำเตือนทางกฎหมาย

**IMPORTANT: READ BEFORE USE - สำคัญ: โปรดอ่านก่อนใช้งาน**

This software is provided as an educational and preliminary calculation tool only. Users must understand and agree to the following terms:

### English Version

- This program is a preliminary calculation tool and cannot replace professional engineering design
- All calculation results must be verified and certified by a licensed structural engineer
- The developer assumes no responsibility for any damages resulting from the use of this software
- Real-world applications must comply with relevant standards and legal requirements
- Users should verify the accuracy of data and calculations before implementation

### Thai Version - เวอร์ชันภาษาไทย

- โปรแกรมนี้เป็นเครื่องมือช่วยคำนวณเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการออกแบบโดยวิศวกรผู้เชี่ยวชาญได้
- ผลการคำนวณต้องได้รับการตรวจสอบและรับรองโดยวิศวกรโครงสร้างที่มีใบอนุญาตประกอบวิชาชีพ
- ผู้พัฒนาไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดขึ้นจากการใช้งานโปรแกรมนี้
- การใช้งานในงานจริงต้องปฏิบัติตามมาตรฐานและข้อกำหนดทางกฎหมายที่เกี่ยวข้อง
- ควรตรวจสอบความถูกต้องของข้อมูลและผลการคำนวณก่อนนำไปใช้งาน

## 👨‍💻 Developer Information - ข้อมูลผู้พัฒนา

**Developer:** ธงชาติ อำแดงพิน (Thongchai Amdaengpin)

**Version:** 1.0.0

**Last Updated:** August 2025

**Standards Used:**

- มอก. TIS 24-2548 (Steel Reinforcement Standards)
- มอก. TIS 166-2549 (Concrete Standards)
- Ultimate Strength Design Method

## License

This project is for educational and professional use in structural engineering applications.

## Contributing

Feel free to submit issues and enhancement requests!
