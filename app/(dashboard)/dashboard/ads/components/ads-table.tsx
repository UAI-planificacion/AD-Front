'use client';

import { useState }                     from 'react';
import { Trash2, Pencil, Eye, MoreHorizontal } from 'lucide-react';
import { useRouter }                    from 'next/navigation';
import { toast }                        from 'sonner';

import { useDeleteAd }      from '@/hooks/use-ads';
import { AdsStatusBadge, AdsTypeBadge } from './ads-badges';
import type { Publicidad }  from '@/lib/models/ads';


interface AdsTableProps {
    ads         : Publicidad[];
    filterText  : string;
    filterActivo : 'all' | 'activa' | 'inactiva';
}


function formatDate( dateStr: string ): string {
    return new Date( dateStr ).toLocaleDateString( 'es-CL', {
        day   : '2-digit',
        month : 'short',
        year  : 'numeric',
    });
}


export function AdsTable({ ads, filterText, filterActivo }: AdsTableProps): React.JSX.Element {
    const router   = useRouter();
    const deleteMutation = useDeleteAd();
    const [ openMenu, setOpenMenu ] = useState<number | null>( null );

    const filtered = ads.filter( ( ad ) => {
        const matchText  = ad.nombre.toLowerCase().includes( filterText.toLowerCase() );
        const matchState =
            filterActivo === 'all'       ? true :
            filterActivo === 'activa'    ? ad.activo :
            !ad.activo;
        return matchText && matchState;
    });


    function handleDelete( id: number, nombre: string ): void {
        if ( !confirm( `¿Eliminar la publicidad "${ nombre }"? Esta acción no se puede deshacer.` ) ) return;

        deleteMutation.mutate( id, {
            onSuccess : () => toast.success( 'Publicidad eliminada correctamente' ),
            onError   : () => toast.error( 'Error al eliminar la publicidad' ),
        });
    }


    if ( filtered.length === 0 ) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="text-5xl">📺</div>
                <p className="text-sm font-medium text-muted-foreground">
                    No se encontraron publicidades con los filtros aplicados
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duración</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vigencia</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edificios</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    { filtered.map( ( ad ) => (
                        <tr
                            key       = { ad.id }
                            className = "border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
                        >
                            <td className="px-4 py-3">
                                <p className="font-medium text-foreground line-clamp-1 max-w-[200px]">{ ad.nombre }</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">{ ad.archivo_dimensiones }</p>
                            </td>

                            <td className="px-4 py-3">
                                <AdsTypeBadge tipo = { ad.tipo } />
                            </td>

                            <td className="px-4 py-3 tabular-nums text-muted-foreground">
                                { ad.duracion }s
                            </td>

                            <td className="px-4 py-3">
                                <p className="text-xs text-foreground">{ formatDate( ad.fecha_inicio ) }</p>
                                <p className="text-xs text-muted-foreground">→ { formatDate( ad.fecha_fin ) }</p>
                            </td>

                            <td className="px-4 py-3">
                                <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums">
                                    { ad.edificios.length }
                                </span>
                            </td>

                            <td className="px-4 py-3">
                                <AdsStatusBadge activo = { ad.activo } />
                            </td>

                            <td className="px-4 py-3 text-right">
                                <div className="relative inline-block">
                                    <button
                                        id          = { `ads-menu-${ ad.id }` }
                                        onClick     = { () => setOpenMenu( openMenu === ad.id ? null : ad.id ) }
                                        className   = "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        aria-label  = "Abrir menú de acciones"
                                    >
                                        <MoreHorizontal className="size-4" />
                                    </button>

                                    { openMenu === ad.id && (
                                        <>
                                            <div
                                                className = "fixed inset-0 z-10"
                                                onClick   = { () => setOpenMenu( null ) }
                                            />
                                            <div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-border bg-popover p-1 shadow-lg">
                                                <button
                                                    id        = { `ads-view-${ ad.id }` }
                                                    onClick   = { () => { setOpenMenu( null ); router.push( `/dashboard/ads/${ ad.id }` ); } }
                                                    className = "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                                                >
                                                    <Eye className="size-3.5" /> Ver detalle
                                                </button>

                                                <button
                                                    id        = { `ads-edit-${ ad.id }` }
                                                    onClick   = { () => { setOpenMenu( null ); router.push( `/dashboard/ads/${ ad.id }/editar` ); } }
                                                    className = "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                                                >
                                                    <Pencil className="size-3.5" /> Editar
                                                </button>

                                                <div className="my-1 h-px bg-border" />

                                                <button
                                                    id        = { `ads-delete-${ ad.id }` }
                                                    onClick   = { () => { setOpenMenu( null ); handleDelete( ad.id, ad.nombre ); } }
                                                    disabled  = { deleteMutation.isPending }
                                                    className = "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="size-3.5" /> Eliminar
                                                </button>
                                            </div>
                                        </>
                                    ) }
                                </div>
                            </td>
                        </tr>
                    ) ) }
                </tbody>
            </table>
        </div>
    );
}
