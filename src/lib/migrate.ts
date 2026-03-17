/**
 * Migration runner — reads SQL files from supabase/migrations/ and executes them
 * against your Supabase database via the REST API.
 *
 * Usage: npm run migrate
 *
 * Note: For production Supabase projects, prefer using the Supabase CLI
 * (`supabase db push` or `supabase migration up`). This script is provided
 * as a lightweight alternative for quick local/dev setup.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '../../supabase/migrations');

async function runMigrations() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql') && f !== '000_full_schema.sql')
    .sort();

  console.log(`Found ${files.length} migration files.\n`);

  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
    console.log(`Running: ${file}...`);

    const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      console.error(`  Error in ${file}:`, error.message);
      console.error('  Migration stopped. Fix the issue and re-run.');
      process.exit(1);
    }

    console.log(`  Done.`);
  }

  console.log('\nAll migrations applied successfully.');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
