'use client';

import { cn } from '@/lib/utils';
import type { AdTipo } from '@/lib/models/ads';


interface AdsStatusBadgeProps {
    activo : boolean;
}

interface AdsTypeBadgeProps {
    tipo : AdTipo;
}


export function AdsStatusBadge({ activo }: AdsStatusBadgeProps): React.JSX.Element {
    return (
        <span className={ cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            activo
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        ) }>
            <span className={ cn(
                'size-1.5 rounded-full',
                activo ? 'bg-emerald-500' : 'bg-zinc-400'
            ) } />
            { activo ? 'Activa' : 'Inactiva' }
        </span>
    );
}


export function AdsTypeBadge({ tipo }: AdsTypeBadgeProps): React.JSX.Element {
    const isVideo = tipo === 'video';

    return (
        <span className={ cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            isVideo
                ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
        ) }>
            { isVideo ? '🎬' : '🖼' }
            { isVideo ? 'Video' : 'Imagen' }
        </span>
    );
}
