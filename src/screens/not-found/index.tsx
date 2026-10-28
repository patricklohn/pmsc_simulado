'use client';

import Link from 'next/link';
import { LuCompass } from 'react-icons/lu';
import { EmptyState } from '@components/empty-state';
import { ROUTES } from '@shell/routes';

/** Rota inexistente. */
export function NotFoundPage() {
  return (
    <EmptyState
      icon={<LuCompass />}
      title="Página não encontrada"
      description="O endereço pode ter mudado."
      action={<Link href={ROUTES.home}>Voltar ao início</Link>}
    />
  );
}
