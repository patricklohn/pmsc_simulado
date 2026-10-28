'use client';

import dynamic from 'next/dynamic';

/**
 * O app roda só no navegador: tema, progresso e simulados vêm do localStorage, que não existe no servidor.
 * Renderizar no servidor geraria HTML diferente do navegador (erro de hidratação).
 */
export const ClientRoot = dynamic(() => import('./app-root').then(({ AppRoot }) => AppRoot), { ssr: false });
