'use client';

import { useState }    from 'react';
import { useRouter }   from 'next/navigation';
import { Plus, Search, RefreshCw } from 'lucide-react';

import { useAds }             from '@/hooks/use-ads';
import { AdsTable }           from './components/ads-table';
import { AdsDashboardKpis }   from './components/ads-kpi-card';


type FilterActivo = 'all' | 'activa' | 'inactiva';

const FILTER_TABS: Array<{ key: FilterActivo; label: string }> = [
    { key: 'all',      label: 'Todas' },
    { key: 'activa',   label: 'Activas' },
    { key: 'inactiva', label: 'Inactivas / Históricas' },
];


export default function AdsPage(): React.JSX.Element {
    const router  = useRouter();
    const { data: ads, isLoading, isError, refetch, isFetching } = useAds();

    const [ search, setSearch ]             = useState( '' );
    const [ filterActivo, setFilterActivo ] = useState<FilterActivo>( 'all' );

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-8 p-6">

            { /* ── Header ── */ }
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground">
                        📺 Gestión de Publicidades
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Administra las publicidades que se muestran en las pantallas de los campus UAI
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        id        = "ads-refresh"
                        onClick   = { () => refetch() }
                        disabled  = { isFetching }
                        className = "rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                        aria-label = "Actualizar lista"
                    >
                        <RefreshCw className={ `size-4 ${ isFetching ? 'animate-spin' : '' }` } />
                    </button>

                    <button
                        id        = "ads-create"
                        onClick   = { () => router.push( '/dashboard/ads/nueva' ) }
                        className = "flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                    >
                        <Plus className="size-4" /> Nueva publicidad
                    </button>
                </div>
            </div>

            { /* ── KPIs ── */ }
            { ads && ads.length > 0 && <AdsDashboardKpis ads = { ads } /> }

            { /* ── Filters ── */ }
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                { /* Search */ }
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        id          = "ads-search"
                        type        = "text"
                        value       = { search }
                        onChange    = { ( e ) => setSearch( e.target.value ) }
                        placeholder = "Buscar publicidad..."
                        className   = "w-full rounded-xl border border-border bg-input py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                { /* Tabs */ }
                <div className="flex rounded-xl border border-border p-1 bg-muted/30">
                    { FILTER_TABS.map( ( tab ) => (
                        <button
                            key       = { tab.key }
                            id        = { `ads-filter-${ tab.key }` }
                            onClick   = { () => setFilterActivo( tab.key ) }
                            className = { `rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                filterActivo === tab.key
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }` }
                        >
                            { tab.label }
                        </button>
                    )) }
                </div>
            </div>

            { /* ── Content ── */ }
            { isLoading && (
                <div className="flex flex-col gap-3">
                    { Array.from({ length: 6 }).map( ( _, i ) => (
                        <div key = { i } className="h-14 animate-pulse rounded-xl bg-muted" />
                    )) }
                </div>
            ) }

            { isError && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 py-16">
                    <p className="text-sm font-semibold text-destructive">
                        No se pudo cargar la lista de publicidades
                    </p>
                    <button
                        id        = "ads-retry"
                        onClick   = { () => refetch() }
                        className = "rounded-xl border border-destructive/30 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            ) }

            { !isLoading && !isError && ads && (
                <AdsTable
                    ads          = { ads }
                    filterText   = { search }
                    filterActivo = { filterActivo }
                />
            ) }
        </div>
    );
}
