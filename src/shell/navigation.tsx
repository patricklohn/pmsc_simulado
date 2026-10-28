import { LuBookOpen, LuCalendarDays, LuClipboardCheck, LuHouse } from 'react-icons/lu';
import type { iNavItem } from '@components/app-shell';
import { ROUTES } from './routes';

/** Itens do menu. Os marcados com `isInBottomNav` aparecem na barra inferior do celular. */
export const NAV_ITEMS: iNavItem[] = [
  { to: ROUTES.home, label: 'Início', icon: <LuHouse aria-hidden />, isInBottomNav: true },
  { to: ROUTES.calendar, label: 'Calendário', icon: <LuCalendarDays aria-hidden />, isInBottomNav: true },
  { to: ROUTES.study, label: 'Estudo', icon: <LuBookOpen aria-hidden />, isInBottomNav: true },
  { to: ROUTES.exams, label: 'Simulado', icon: <LuClipboardCheck aria-hidden />, isInBottomNav: true },
];
