// ═══════════════════════════════════════════════════════════════
// LAYOUT FIX — Apply to CalculusSolver.jsx + every other tool
//              that I (Claude) wrote with the same pattern
// ═══════════════════════════════════════════════════════════════
//
// The problem: My tools build a FULL standalone app inside a single
// component — with their own sticky header, viewport height, 2-column
// sidebar layout. When placed inside your Dashboard (which already has
// a sidebar + fixed layout), these things stack on top of each other
// and cause overflow, clipping, and the empty right-side gap.
//
// 4 surgical changes fix all of it:
// ───────────────────────────────────────────────────────────────


// ╔══════════════════════════════════════════════════════════════╗
// ║  CHANGE 1 — STYLES string  (around line 20-25)              ║
// ╚══════════════════════════════════════════════════════════════╝

// FIND exactly this inside the .n { } block in STYLES:
  `min-height:100vh;
    background-image:linear-gradient(rgba(0,212,255,.012) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,212,255,.012) 1px,transparent 1px);
    background-size:32px 32px;animation:gridmove 16s linear infinite`

// REPLACE WITH: (just delete those lines — nothing)
// Result: .n becomes just background+color+font, no height/animation fighting Dashboard


// FIND exactly this inside .m { } block:
// `min-height:100vh`
//
// REPLACE WITH: (delete)


// ╔══════════════════════════════════════════════════════════════╗
// ║  CHANGE 2 — Outermost <div> in return()  (around line 350)  ║
// ╚══════════════════════════════════════════════════════════════╝

// FIND:
  // `<div className={T} style={{ fontFamily: 'Space Grotesk,sans-serif' }}>`

// REPLACE WITH:
  // `<div className={T} style={{ fontFamily: 'Space Grotesk,sans-serif', width: '100%', minWidth: 0 }}>`


// ╔══════════════════════════════════════════════════════════════╗
// ║  CHANGE 3 — Top bar sticky (around line 360)                ║
// ╚══════════════════════════════════════════════════════════════╝

// FIND:
// position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)',

// REPLACE WITH:
// position: 'relative', zIndex: 10,

// WHY: sticky+top:0 sticks to VIEWPORT, not the tool container.
// Inside the Dashboard scroll area it floats over your nav bar.


// ╔══════════════════════════════════════════════════════════════╗
// ║  CHANGE 4 — Body 2-column grid  (around line 420)           ║
// ╚══════════════════════════════════════════════════════════════╝

// FIND:
// display: 'grid', gridTemplateColumns: '1fr 276px', minHeight: 'calc(100vh - 130px)', gap: 0

// REPLACE WITH:
// display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 276px', minHeight: 0, gap: 0

// WHY: '1fr' without minmax(0,1fr) allows the column to grow beyond
// container width. 'calc(100vh - 130px)' forces full-screen height.
// Both cause the right-side overflow and empty space you see.


// ═══════════════════════════════════════════════════════════════
// SAME 4 CHANGES APPLY TO EVERY OTHER TOOL I WROTE
// ═══════════════════════════════════════════════════════════════
// Any tool with:
//   - min-height:100vh   → DELETE
//   - position:'sticky'  → change to position:'relative'
//   - gridTemplateColumns: '1fr Xpx' → wrap with minmax(0,1fr)
//   - minHeight:'calc(100vh...)' → change to minHeight: 0
//   - outermost div has no width → add width:'100%', minWidth:0
//
// Files to check:
//   - IntegralCalculator.jsx
//   - MatrixAlgebra.jsx  
//   - PhysicsKinematics.jsx
//   - ChemistryBalancer.jsx
//   - GPACalculator.jsx
//   - UnitConverter.jsx
//   - StudentBudgeting.jsx
//   - StudentLoanRepayment.jsx
//   - AudioConverter.jsx
//   - BackgroundRemover.jsx
//   - BulkImageResizer.jsx
//   (any tool with the neon/light theme toggle pattern)
// ═══════════════════════════════════════════════════════════════