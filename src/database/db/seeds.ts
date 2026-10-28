import * as path from 'node:path';
import type { Kysely } from 'kysely';
import { getDb } from './kysely';
import type { DB } from './model';

type tSeedModule = { default: (db: Kysely<DB>) => Promise<void> };

/** `pnpm migrate:seed <nome>`: roda seeds de `src/database/seeds` (ex.: `pnpm migrate:seed 01_content`). */
async function runSeed() {
  const seedNames = process.argv.slice(2);
  if (seedNames.length === 0) {
    console.error('❌ Informe ao menos um seed. Ex: pnpm migrate:seed 01_content');
    process.exit(1);
  }

  const db = getDb();
  try {
    for (const seedName of seedNames) {
      const seedPath = path.join(import.meta.dirname, `../seeds/${seedName}.ts`);
      let seedModule: tSeedModule;
      try {
        seedModule = await import(seedPath);
      } catch {
        console.error(`❌ Seed "${seedName}" não encontrado em: ${seedPath}`);
        process.exit(1);
      }
      if (typeof seedModule.default !== 'function') {
        console.error(`❌ Seed "${seedName}" não exporta uma função default`);
        process.exit(1);
      }
      console.info(`🌱 Rodando seed: ${seedName}`);
      await seedModule.default(db);
      console.info(`✅ Seed "${seedName}" concluído`);
    }
  } finally {
    await db.destroy();
  }
}

runSeed().catch((err) => {
  console.error('❌ Falha ao rodar seed:', err);
  process.exit(1);
});
