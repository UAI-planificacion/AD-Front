'use client';

import { useState }          from 'react';
import {
	Image as ImageIcon,
	Video,
}                            from 'lucide-react';
import { toast }             from 'sonner';

import { ConfirmDialog }     from '@/components/shared/ConfirmDialog';
import { useDeleteAd }       from '@/hooks/use-ads';
import type { Publicidad }   from '@/lib/models/ads';
import { AdActionsDropdown } from './ad-actions-dropdown';


interface AdsTableProps {
	ads             : Publicidad[];
	filterText      : string;
	filterTipo      : string[];
	filterEstado    : string[];
	filterEdificios : string[];
}

const edificioMap: Record<number, string> = {
	1  : 'Edificio A',
	2  : 'Edificio B',
	3  : 'Edificio C',
	4  : 'Edificio D',
	5  : 'Edificio E',
	6  : 'Edificio F',
	7  : 'Edificio Errázuriz',
	8  : 'Edificio Vitacura',
	9  : 'Edificio A',
	10 : 'Edificio B',
	11 : 'Edificio D',
	12 : 'Edificio E',
	13 : 'Edificio F',
	14 : 'Edificio C',
};


function formatDate( dateStr: string ): string {
	if ( !dateStr ) return '';
	const parts = dateStr.split( '-' );
	if ( parts.length !== 3 ) return dateStr;
	const year = parts[ 0 ];
	const month = parts[ 1 ];
	const day = parts[ 2 ];
	return `${ day }/${ month }/${ year }`;
}


function formatTime( timeStr: string ): string {
	if ( !timeStr ) return '';
	const parts = timeStr.split( ':' );
	if ( parts.length < 2 ) return timeStr;
	return `${ parts[ 0 ] }:${ parts[ 1 ] }`;
}


export function AdsTable( { ads, filterText, filterTipo, filterEstado, filterEdificios } : AdsTableProps ) : React.JSX.Element {
	const deleteMutation = useDeleteAd();

	const [ deleteTarget, setDeleteTarget ] = useState<{
		id		: number;
		nombre	: string;
	} | null>( null );

	const filtered = ads.filter( ( ad ) => {
		const matchText  = ad.nombre.toLowerCase().includes( filterText.toLowerCase() );
		const matchTipo  = filterTipo.length === 0 ? true : ad.tipo === filterTipo[ 0 ];
		const matchState =
			filterEstado.length === 0      ? true :
			filterEstado[ 0 ] === 'activa' ? ad.activo :
			!ad.activo;
		const matchEdificios = filterEdificios.length === 0
			? true
			: ad.edificios.some( ( id ) => filterEdificios.map( Number ).includes( id ) );
		return matchText && matchTipo && matchState && matchEdificios;
	} );

	function handleDeleteClick( id : number, nombre : string ) : void {
		setDeleteTarget( {
			id,
			nombre,
		} );
	}

	function handleConfirmDelete() : void {
		if ( !deleteTarget ) return;
		const { id } = deleteTarget;
		setDeleteTarget( null );

		deleteMutation.mutate( id, {
			onSuccess	: ( ) => toast.success( 'Publicidad eliminada correctamente' ),
			onError		: ( ) => toast.error( 'Error al eliminar la publicidad' ),
		} );
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
		<div className="overflow-x-auto rounded-xl border border-border bg-card h-[calc(100vh-20rem)]">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border bg-muted/40">
						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Nombre</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Tipo</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Duración</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Vigencia</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Edificios</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Estado</th>

						<th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground">Acciones</th>
					</tr>
				</thead>

				<tbody>
					{ filtered.map( ( ad ) => (
						<tr
							key       = { ad.id }
							className = "border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
						>
							<td className="px-4 py-3.5">
								<p className="font-semibold text-foreground">{ ad.nombre }</p>
							</td>

							<td className="px-4 py-3.5">
								<div className="flex items-center gap-1.5 text-muted-foreground">
									{ ad.tipo === 'video' ? (
										<>
											<Video className="size-4" />

											<span className="font-semibold text-xs">Video</span>
										</>
									) : (
										<>
											<ImageIcon className="size-4" />

											<span className="font-semibold text-xs">Imagen</span>
										</>
									) }
								</div>
							</td>

							<td className="px-4 py-3.5 font-semibold text-foreground">
								{ ad.duracion }s
							</td>

							<td className="px-4 py-3.5">
								<div className="flex flex-col gap-0.5">
									<p className="text-xs font-semibold text-foreground">
										{ formatDate( ad.fecha_inicio ) } - { formatDate( ad.fecha_fin ) }
									</p>

									<p className="text-[10px] text-muted-foreground">
										{ formatTime( ad.hora_inicio ) } - { formatTime( ad.hora_fin ) }
									</p>
								</div>
							</td>

							<td className="px-4 py-3.5">
								<div className="flex flex-wrap gap-1.5">
									{ ad.edificios.map( ( id ) => (
										<span
											key       = { id }
											className = "inline-flex items-center rounded-lg border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground"
										>
											{ edificioMap[ id ] || `Edificio ${ id }` }
										</span>
									) ) }
								</div>
							</td>

							<td className="px-4 py-3.5">
								{ ad.activo ? (
									<span className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-black">
										Activa
									</span>
								) : (
									<span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
										Inactiva
									</span>
								) }
							</td>

							<td className="px-4 py-3.5 text-right">
								<AdActionsDropdown
									adId      = { ad.id }
									adNombre  = { ad.nombre }
									onDelete  = { handleDeleteClick }
									isPending = { deleteMutation.isPending }
									variant   = "table"
									activo    = { ad.activo }
								/>
							</td>
						</tr>
					) ) }
				</tbody>
			</table>

			<ConfirmDialog
				isOpen    = { deleteTarget !== null }
				title     = "Eliminar publicidad"
				message   = { deleteTarget ? `¿Eliminar la publicidad "${ deleteTarget.nombre }"? Esta acción no se puede deshacer.` : '' }
				onConfirm = { handleConfirmDelete }
				onClose   = { ( ) => setDeleteTarget( null ) }
			/>
		</div>
	);
}
