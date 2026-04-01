const fs = require('fs');
const path = 'c:\\Users\\Aman kumar\\OneDrive\\Pictures\\main\\student\\StudentToolHub\\src\\tools\\niche\\AstronomyCalc.jsx';

let content = fs.readFileSync(path, 'utf8');

// Find line 542 area
const lines = content.split('\n');
console.log('Line 540:', lines[539]);
console.log('Line 541:', lines[540]);
console.log('Line 542:', lines[541]);
console.log('Line 543:', lines[542]);
console.log('Line 544:', lines[543]);
console.log('Line 545:', lines[544]);
console.log('Line 546:', lines[545]);
