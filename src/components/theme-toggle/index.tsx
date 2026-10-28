import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu';
import { eThemePreference } from '@/types/theme';
import { Group, Option } from './styles';

const OPTIONS = [
  { value: eThemePreference.system, label: 'Sistema', icon: <LuMonitor aria-hidden /> },
  { value: eThemePreference.light, label: 'Claro', icon: <LuSun aria-hidden /> },
  { value: eThemePreference.dark, label: 'Escuro', icon: <LuMoon aria-hidden /> },
] as const;

interface iThemeToggleProps {
  value: eThemePreference;
  onChange: (value: eThemePreference) => void;
  /** Só ícones (barra lateral estreita). */
  isCompact?: boolean;
}

/** Escolha do tema: sistema, claro ou escuro. */
export function ThemeToggle({ value, onChange, isCompact = false }: iThemeToggleProps) {
  return (
    <Group role="radiogroup" aria-label="Tema">
      {OPTIONS.map((option) => (
        <Option
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          aria-label={option.label}
          title={option.label}
          $isActive={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
          {!isCompact && <span>{option.label}</span>}
        </Option>
      ))}
    </Group>
  );
}
