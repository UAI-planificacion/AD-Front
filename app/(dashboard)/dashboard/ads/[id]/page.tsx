'use client';

import { useParams, useRouter }  from 'next/navigation';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { toast }                 from 'sonner';

import { useAds, useDeleteAd }   from '@/hooks/use-ads';
import { AdsStatusBadge, AdsTypeBadge } from '../components/ads-badges';


function formatDate( dateStr: string ): string {
    return new Date( dateStr ).toLocaleDateString( 'es-CL', {
        day   : '2-digit',
        month : 'long',
        year  : 'numeric',
    });
}


export default function AdDetailPage(): React.JSX.Element {
    const { id }   = useParams<{ id: string }>();
    const router   = useRouter();
    const adId     = Number( id );

    const { data: ads, isLoading } = useAds();
    const deleteMutation           = useDeleteAd();

    const ad = ads?.find( ( a ) => a.id === adId );


    function handleDelete(): void {
        if ( !ad ) return;
        if ( !confirm( `¿Eliminar la publicidad "${ ad.nombre }"?` ) ) return;

        deleteMutation.mutate( adId, {
            onSuccess : () => {
                toast.success( 'Publicidad eliminada' );
                router.push( '/dashboard/ads' );
            },
            onError : () => toast.error( 'Error al eliminar' ),
        });
    }

    if ( isLoading ) {
        return (
            <div className="p-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="h-64 animate-pulse rounded-2xl bg-muted" />
                    <div className="h-64 animate-pulse rounded-2xl bg-muted" />
                </div>
            </div>
        );
    }

    if ( !ad ) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-6 py-24">
                <p className="text-lg font-semibold text-foreground">Publicidad no encontrada</p>
                <button
                    id        = "ad-detail-back"
                    onClick   = { () => router.push( '/dashboard/ads' ) }
                    className = "rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
                >
                    ← Volver al listado
                </button>
            </div>
        );
    }

    const isVideo = ad.archivo_tipo.startsWith( 'video' );

    return (
        <div className="flex flex-col gap-8 p-6">

            { /* Header */ }
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                    <button
                        id        = "ad-detail-back-btn"
                        onClick   = { () => router.push( '/dashboard/ads' ) }
                        className = "rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:bg-muted"
                        aria-label = "Volver"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-foreground line-clamp-1">{ ad.nombre }</h1>
                        <div className="mt-1 flex items-center gap-2">
                            <AdsTypeBadge tipo = { ad.tipo } />
                            <AdsStatusBadge activo = { ad.activo } />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        id        = "ad-detail-edit"
                        onClick   = { () => router.push( `/dashboard/ads/${ adId }/editar` ) }
                        className = "flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                        <Pencil className="size-4" /> Editar edificios
                    </button>
                    <button
                        id        = "ad-detail-delete"
                        onClick   = { handleDelete }
                        disabled  = { deleteMutation.isPending }
                        className = "flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                    >
                        <Trash2 className="size-4" /> Eliminar
                    </button>
                </div>
            </div>

            { /* Content */ }
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

                { /* Preview */ }
                <div className="flex flex-col gap-6">
                    <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
                        { isVideo ? (
                            <video
                                src       = { ad.archivo_url }
                                controls
                                className = "w-full"
                                style     = {{ maxHeight: '480px' }}
                            />
                        ) : (
                            <img
                                src       = { ad.archivo_url }
                                alt       = { ad.nombre }
                                className = "w-full object-contain"
                                style     = {{ maxHeight: '480px' }}
                            />
                        ) }
                    </div>

                    { /* Technical details */ }
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detalles técnicos</p>
                        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                            { [
                                { label: 'Tipo de archivo', value: ad.archivo_tipo },
                                { label: 'Dimensiones',     value: ad.archivo_dimensiones },
                                { label: 'Tamaño',          value: `${ ad.archivo_tamano.toFixed( 2 ) } MB` },
                                { label: 'Duración',        value: `${ ad.duracion }s` },
                                { label: 'Hora inicio',     value: ad.hora_inicio },
                                { label: 'Hora fin',        value: ad.hora_fin },
                            ].map( ( item ) => (
                                <div key = { item.label }>
                                    <dt className="text-xs text-muted-foreground">{ item.label }</dt>
                                    <dd className="mt-0.5 font-semibold text-foreground">{ item.value }</dd>
                                </div>
                            )) }
                        </dl>
                    </div>
                </div>

                { /* Info panel */ }
                <div className="flex flex-col gap-4">

                    { /* Vigencia */ }
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Periodo de vigencia</p>
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Inicio</span>
                                <span className="font-semibold text-foreground">{ formatDate( ad.fecha_inicio ) }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fin</span>
                                <span className="font-semibold text-foreground">{ formatDate( ad.fecha_fin ) }</span>
                            </div>
                        </div>
                    </div>

                    { /* Edificios */ }
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edificios asignados</p>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                { ad.edificios.length }
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            { ad.edificios.map( ( id ) => (
                                <span
                                    key       = { id }
                                    className = "rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground"
                                >
                                    Edificio { id }
                                </span>
                            )) }
                        </div>
                    </div>

                    { /* Fechas sistema */ }
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Registro del sistema</p>
                        <div className="flex flex-col gap-3 text-xs text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Creada</span>
                                <span>{ new Date( ad.fecha_creacion ).toLocaleString( 'es-CL' ) }</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Modificada</span>
                                <span>{ new Date( ad.fecha_modificacion ).toLocaleString( 'es-CL' ) }</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
