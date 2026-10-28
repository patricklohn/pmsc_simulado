import { readFileSync, readdirSync } from 'node:fs';
import * as path from 'node:path';
import type { iEssayData } from '@/types/essay';
import type { iNotice, iSchedule } from '@/types/notice';
import type { iQuestion } from '@/types/question';
import type { iSubject } from '@/types/subject';

const DATA_DIR = path.join(import.meta.dirname, 'data');

const readJson = <T>(...parts: string[]): T => JSON.parse(readFileSync(path.join(DATA_DIR, ...parts), 'utf8')) as T;
const readFolder = <T>(folder: string): T[] =>
  readdirSync(path.join(DATA_DIR, folder))
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => readJson<T>(folder, file));

/**
 * Conteúdo inicial (os JSON do app antes do banco). Usado só pelo seed `01_content` e pelo teste que valida os
 * arquivos; o app lê tudo do banco.
 */
export function loadContentFiles() {
  return {
    notice: readJson<iNotice>('edital.json'),
    schedule: readJson<iSchedule>('cronograma.json'),
    essay: readJson<iEssayData>('redacao.json'),
    subjects: readFolder<iSubject>('materias'),
    questions: readFolder<iQuestion[]>('questoes').flat(),
  };
}
