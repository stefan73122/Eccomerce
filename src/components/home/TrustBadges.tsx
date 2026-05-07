import * as Icons from 'lucide-react';
import { TRUST_BADGES } from '@/data/constants';

function toPascalCase(str: string): string {
  return str.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function getDynamicIcon(iconName: string) {
  const pascalName = toPascalCase(iconName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons: Record<string, any> = Icons;
  return icons[pascalName] || Icons.Package;
}

export default function TrustBadges() {
  return (
    <div className="flex flex-col items-center gap-8 px-4 sm:px-6 lg:px-20 py-10 lg:py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl lg:text-[28px] font-bold text-[var(--text-dark)]">¿Por qué elegirnos?</h2>
        <p className="text-sm text-[var(--text-light)]">Miles de clientes confían en nosotros en todas nuestras tiendas regionales.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {TRUST_BADGES.map((badge, index) => {
          const Icon = getDynamicIcon(badge.icon);
          return (
            <div key={index} className="flex flex-col items-center rounded-xl bg-[var(--bg-light)] p-5 sm:p-6 gap-3">
              <div className="w-14 h-14 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                <Icon size={24} className="text-[var(--primary)]" />
              </div>
              <h3 className="text-[15px] font-bold text-[var(--text-dark)] text-center">{badge.title}</h3>
              <p className="text-[13px] text-[var(--text-light)] leading-relaxed text-center">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
