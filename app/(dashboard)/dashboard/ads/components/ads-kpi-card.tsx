'use client';

import { MonitorPlay, CheckCircle, Building2, Timer } from 'lucide-react';
import { buildKpiStats }  from '@/lib/models/ads';
import type { Publicidad, AdKpiStats } from '@/lib/models/ads';


// ─── KPI Card ────────────────────────────────────────────────────────────────

interface AdsKpiCardProps {
    label    : string;
    value    : string | number;
    icon     : React.ReactNode;
    color    : 'blue' | 'emerald' | 'violet' | 'amber';
    subtitle?: string;
}

const colorMap: Record<AdsKpiCardProps['color'], string> = {
    blue   : 'from-blue-500/10 to-blue-500/5 border-blue-500/20',
    emerald : 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    violet : 'from-violet-500/10 to-violet-500/5 border-violet-500/20',
    amber  : 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
};

const iconColorMap: Record<AdsKpiCardProps['color'], string> = {
    blue   : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    emerald : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    violet : 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    amber  : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};


export function AdsKpiCard({ label, value, icon, color, subtitle }: AdsKpiCardProps): React.JSX.Element {
    return (
        <div className={ `bg-linear-to-br ${ colorMap[ color ] } rounded-2xl border p-5 flex flex-col gap-3` }>
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    { label }
                </span>
                <div className={ `${ iconColorMap[ color ] } rounded-xl p-2` }>
                    { icon }
                </div>
            </div>

            <div>
                <p className="text-3xl font-black tracking-tight text-foreground">{ value }</p>
                { subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{ subtitle }</p>
                ) }
            </div>
        </div>
    );
}


// ─── KPI Grid ────────────────────────────────────────────────────────────────

interface AdsDashboardKpisProps {
    ads : Publicidad[];
}


export function AdsDashboardKpis({ ads }: AdsDashboardKpisProps): React.JSX.Element {
    const stats: AdKpiStats = buildKpiStats( ads );

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <AdsKpiCard
                label    = "Total Publicidades"
                value    = { stats.total }
                color    = "blue"
                icon     = { <MonitorPlay className="size-4" /> }
                subtitle = "en el sistema"
            />
            <AdsKpiCard
                label    = "Activas"
                value    = { stats.activas }
                color    = "emerald"
                icon     = { <CheckCircle className="size-4" /> }
                subtitle = "mostrándose ahora"
            />
            <AdsKpiCard
                label    = "Edificios cubiertos"
                value    = { stats.edificiosCubiertos }
                color    = "violet"
                icon     = { <Building2 className="size-4" /> }
                subtitle = "con al menos 1 ad"
            />
            <AdsKpiCard
                label    = "Duración promedio"
                value    = { `${ stats.duracionPromedio }s` }
                color    = "amber"
                icon     = { <Timer className="size-4" /> }
                subtitle = "por publicidad"
            />
        </div>
    );
}
