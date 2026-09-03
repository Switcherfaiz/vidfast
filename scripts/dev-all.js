import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function run(label, command, args, cwd = root) {
  const child = spawn(command, args, { stdio: 'inherit', shell: true, cwd });
  child.on('exit', (code) => {
    if (code) console.error(`${label} exited with code ${code}`);
  });
  return child;
}

run('backend', 'npm', ['run', 'dev', '--prefix', 'backend']);
run('web', 'npm', ['run', 'dev']);
