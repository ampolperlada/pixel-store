<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .box { fill: #e3f2fd; stroke: #1976d2; stroke-width: 2; }
      .start-end { fill: #c8e6c9; stroke: #388e3c; stroke-width: 2; }
      .decision { fill: #fff3e0; stroke: #f57c00; stroke-width: 2; }
      .text { font-family: Arial, sans-serif; font-size: 12px; text-anchor: middle; }
      .title { font-size: 14px; font-weight: bold; }
      .arrow { stroke: #333; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
    </marker>
  </defs>
  
  <!-- Title -->
  <text x="400" y="30" class="text title" fill="#333">Pre-Deployment Checklist - Exit Clearance System</text>
  
  <!-- Start -->
  <ellipse cx="400" cy="70" rx="60" ry="25" class="start-end"/>
  <text x="400" y="75" class="text">START</text>
  
  <!-- Step 1 -->
  <rect x="320" y="120" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="140" class="text title">1. Project Overview</text>
  <text x="400" y="155" class="text">Create PDF document</text>
  
  <!-- Step 2 -->
  <rect x="320" y="200" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="220" class="text title">2. Architecture Diagram</text>
  <text x="400" y="235" class="text">Draw system structure</text>
  
  <!-- Step 3 -->
  <rect x="320" y="280" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="300" class="text title">3. Database ERD</text>
  <text x="400" y="315" class="text">Design table relationships</text>
  
  <!-- Step 4 -->
  <rect x="320" y="360" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="380" class="text title">4. Flow Diagram</text>
  <text x="400" y="395" class="text">User journey flowchart</text>
  
  <!-- Step 5 -->
  <rect x="320" y="440" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="460" class="text title">5. Security Check</text>
  <text x="400" y="475" class="text">Validate inputs & auth</text>
  
  <!-- Step 6 -->
  <rect x="320" y="520" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="540" class="text title">6. Backup Plan</text>
  <text x="400" y="555" class="text">Code + DB backup</text>
  
  <!-- Step 7 -->
  <rect x="320" y="600" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="620" class="text title">7. Testing</text>
  <text x="400" y="635" class="text">End-to-end testing</text>
  
  <!-- Decision -->
  <polygon points="400,680 450,720 400,760 350,720" class="decision"/>
  <text x="400" y="720" class="text">All steps</text>
  <text x="400" y="735" class="text">complete?</text>
  
  <!-- Step 8 -->
  <rect x="320" y="800" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="820" class="text title">8. Organize Files</text>
  <text x="400" y="835" class="text">Structure deliverables</text>
  
  <!-- Step 9 -->
  <rect x="320" y="880" width="160" height="50" rx="5" class="box"/>
  <text x="400" y="900" class="text title">9. Prepare Demo</text>
  <text x="400" y="915" class="text">Practice presentation</text>
  
  <!-- End -->
  <ellipse cx="400" cy="980" rx="80" ry="25" class="start-end"/>
  <text x="400" y="985" class="text">READY TO DEPLOY!</text>
  
  <!-- Fix Issues -->
  <rect x="550" y="695" width="120" height="50" rx="5" class="box"/>
  <text x="610" y="715" class="text">Fix Issues</text>
  <text x="610" y="730" class="text">& Re-test</text>
  
  <!-- Arrows -->
  <line x1="400" y1="95" x2="400" y2="120" class="arrow"/>
  <line x1="400" y1="170" x2="400" y2="200" class="arrow"/>
  <line x1="400" y1="250" x2="400" y2="280" class="arrow"/>
  <line x1="400" y1="330" x2="400" y2="360" class="arrow"/>
  <line x1="400" y1="410" x2="400" y2="440" class="arrow"/>
  <line x1="400" y1="490" x2="400" y2="520" class="arrow"/>
  <line x1="400" y1="570" x2="400" y2="600" class="arrow"/>
  <line x1="400" y1="650" x2="400" y2="680" class="arrow"/>
  <line x1="400" y1="760" x2="400" y2="800" class="arrow"/>
  <line x1="400" y1="850" x2="400" y2="880" class="arrow"/>
  <line x1="400" y1="930" x2="400" y2="955" class="arrow"/>
  
  <!-- Decision arrows -->
  <line x1="450" y1="720" x2="550" y2="720" class="arrow"/>
  <text x="500" y="715" class="text" font-size="10">No</text>
  
  <line x1="610" y1="695" x2="610" y2="650" class="arrow"/>
  <line x1="610" y1="650" x2="450" y2="650" class="arrow"/>
  <line x1="450" y1="650" x2="450" y2="680" class="arrow"/>
  
  <text x="380" y="775" class="text" font-size="10">Yes</text>
</svg>