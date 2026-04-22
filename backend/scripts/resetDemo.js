import { execSync } from 'child_process';

console.log('Resetting demo data...');
execSync('node scripts/seed.js', { stdio: 'inherit' });
console.log('Demo reset complete. Ready to record.');