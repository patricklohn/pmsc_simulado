import { useId, type KeyboardEvent, type ReactNode } from 'react';
import { Tab, TabList } from './styles';

export interface iTabItem<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface iTabsProps<T extends string> {
  items: iTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

/** Abas com navegação por setas. O painel fica na página, com `id` de {@link tabPanelId}. */
export function Tabs<T extends string>({ items, value, onChange, label }: iTabsProps<T>) {
  const baseId = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const index = items.findIndex((item) => item.value === value);
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = items[(index + step + items.length) % items.length];
    onChange(next.value);
    document.getElementById(`${baseId}-${next.value}`)?.focus();
  };

  return (
    <TabList role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <Tab
            key={item.value}
            id={`${baseId}-${item.value}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            $isActive={isActive}
            onClick={() => onChange(item.value)}
          >
            {item.icon}
            {item.label}
          </Tab>
        );
      })}
    </TabList>
  );
}
