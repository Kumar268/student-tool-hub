# ADD QUADRATIC SOLVER TO tools.js

## Location
Find this section in `src/data/tools.js` (around line 455):

```javascript
  {
    id: 76,
    name: 'Scientific Calculator',
    description: 'Advanced calculator with trigonometry, logs, and more',
    category: 'academic',
    icon: 'Calculator',
    slug: 'scientific-calculator',
    tags: ['math', 'science', 'calculator']
  },
```

## Add This Entry AFTER Scientific Calculator:

```javascript
  {
    id: 77,
    name: 'Quadratic Equation Solver',
    description: 'Solve quadratic equations with step-by-step solutions and discriminant analysis',
    category: 'academic',
    icon: 'Calculator',
    slug: 'quadratic-solver',
    tags: ['math', 'algebra', 'quadratic', 'equation', 'roots']
  },
```

## Update Next Entry
Change the Typing Speed Test ID from 77 to 78:

```javascript
  {
    id: 78,  // Changed from 77
    name: 'Typing Speed Test',
    description: 'Test and improve your Words Per Minute (WPM)',
    category: 'niche',
    icon: 'Keyboard',
    slug: 'typing-speed-test',
    tags: ['typing', 'speed', 'wpm']
  },
```

## IMPORTANT: Update All Subsequent IDs
After adding the Quadratic tool, you need to increment ALL tool IDs after 77 by 1.

This means:
- ID 77 → 78 (Typing Speed Test)
- ID 78 → 79 (next tool)
- ID 79 → 80 (next tool)
- ... and so on until the last tool

## Quick Find & Replace Method:
Use your editor's find & replace with regex:

1. Find: `id: 77,`
   Replace with: `id: 78,`

2. Find: `id: 78,`
   Replace with: `id: 79,`

Continue this pattern for all remaining tools.

OR use this PowerShell script in the project root:

```powershell
$file = "src\data\tools.js"
$content = Get-Content $file -Raw

# Add the new tool after ID 76
$newTool = @"
  {
    id: 77,
    name: 'Quadratic Equation Solver',
    description: 'Solve quadratic equations with step-by-step solutions and discriminant analysis',
    category: 'academic',
    icon: 'Calculator',
    slug: 'quadratic-solver',
    tags: ['math', 'algebra', 'quadratic', 'equation', 'roots']
  },
"@

# Find the position after Scientific Calculator
$pattern = "(\s+id: 76,\s+name: 'Scientific Calculator',.*?tags: \['math', 'science', 'calculator'\]\s+\},)"
$content = $content -replace $pattern, "`$1`n$newTool"

# Increment all IDs from 77 onwards
for ($i = 100; $i -ge 77; $i--) {
    $content = $content -replace "id: $i,", "id: $($i+1),"
}

$content | Set-Content $file -NoNewline
Write-Host "✅ Quadratic Solver added to tools.js"
```

Save this as `add-quadratic-tool.ps1` and run:
```bash
powershell -ExecutionPolicy Bypass -File add-quadratic-tool.ps1
```
