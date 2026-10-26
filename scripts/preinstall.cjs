const fs = require('fs');

// 1. Enforce that only pnpm is used across the workspace
const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.startsWith('pnpm/')) {
  console.error('Use pnpm instead');
  process.exit(1);
}

// 2. Clean up foreign lockfiles (package-lock.json, yarn.lock) if accidentally generated
const foreignLockfiles = ['package-lock.json', 'yarn.lock'];
for (const file of foreignLockfiles) {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  } catch {
    // Ignore cleanup errors
  }
}
