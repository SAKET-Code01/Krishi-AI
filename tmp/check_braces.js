const fs = require('fs');
const content = fs.readFileSync('backend/server.js', 'utf8');
const open = (content.match(/\{/g) || []).length;
const close = (content.match(/\}/g) || []).length;
const openRound = (content.match(/\(/g) || []).length;
const closeRound = (content.match(/\)/g) || []).length;
console.log(`Braces: { ${open}, } ${close} (Balance: ${open - close})`);
console.log(`Parentheses: ( ${openRound}, ) ${closeRound} (Balance: ${openRound - closeRound})`);
