'use client';

import { useState }                from 'react';
import {
	Image as ImageIcon,
	Video,
	Clock,
	Calendar,
	Building2,
}                                  from 'lucide-react';
import { toast }                   from 'sonner';

import { ConfirmDialog }           from '@/components/shared/ConfirmDialog';
import { useDeleteAd }             from '@/hooks/use-ads';
import type { Publicidad }         from '@/lib/models/ads';
import { AdActionsDropdown }       from './ad-actions-dropdown';


interface AdsCardViewProps {
	ads             : Publicidad[];
	filterText      : string;
	filterTipo      : string[];
	filterEstado    : string[];
	filterEdificios : string[];
}


const edificioMap : Record<number, string> = {
	1	: 'Edificio A',
	2	: 'Edificio B',
	3	: 'Edificio C',
	4	: 'Edificio D',
	5	: 'Edificio E',
	6	: 'Edificio F',
	7	: 'Edificio Errázuriz',
	8	: 'Edificio Vitacura',
	9	: 'Edificio A',
	10	: 'Edificio B',
	11	: 'Edificio D',
	12	: 'Edificio E',
	13	: 'Edificio F',
	14	: 'Edificio C',
};


function formatDate( dateStr: string ) : string {
	if ( !dateStr ) return '';
	const parts = dateStr.split( '-' );
	if ( parts.length !== 3 ) return dateStr;
	const year  = parts[ 0 ];
	const month = parts[ 1 ];
	const day   = parts[ 2 ];
	return day + '/' + month + '/' + year;
}


function formatTime( timeStr: string ) : string {
	if ( !timeStr ) return '';
	const parts = timeStr.split( ':' );
	if ( parts.length < 2 ) return timeStr;
	return parts[ 0 ] + ':' + parts[ 1 ];
}


export function AdsCardView( {
	ads,
	filterText,
	filterTipo,
	filterEstado,
	filterEdificios,
} : AdsCardViewProps ) : React.JSX.Element {
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
		<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{ filtered.map( ( ad ) => {
				const isVideo = ad.archivo_tipo.startsWith( 'video' );

				return (
					<div
						key       = { ad.id }
						className = "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md"
					>
						{ /* Card Cover (Image or Video) */ }
						<div className="relative h-40 w-full bg-muted/20 overflow-hidden shrink-0 border-b border-border/50">
							{ isVideo ? (
								<video
									src       = { ad.archivo_url }
									className = "h-full w-full object-cover pointer-events-none"
									muted
									playsInline
								/>
							) : (
								<img
									src       = { ad.archivo_url }
									alt       = { ad.nombre }
									className = "h-full w-full object-cover"
								/>
							) }

							{ /* Overlay Status Badge */ }
							<span className = { `absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-xs shadow-xs ${
								ad.activo
									? 'bg-black/85 text-white dark:bg-white dark:text-black'
									: 'bg-zinc-100/90 text-zinc-500 dark:bg-zinc-800/90 dark:text-zinc-400'
							}` }>
								{ ad.activo ? 'Activa' : 'Inactiva' }
							</span>

							{ /* Overlay Media Type Badge */ }
							<span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-background/90 dark:bg-background/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border/35 shadow-2xs">
								{ isVideo ? (
									<>
										<Video className="size-3 text-muted-foreground" />
										<span>Video</span>
									</>
								) : (
									<>
										<ImageIcon className="size-3 text-muted-foreground" />
										<span>Imagen</span>
									</>
								) }
							</span>

							{ /* Dropdown Actions Button on Cover */ }
							<div className="absolute top-2.5 right-2.5">
								<AdActionsDropdown
									adId      = { ad.id }
									adNombre  = { ad.nombre }
									onDelete  = { handleDeleteClick }
									isPending = { deleteMutation.isPending }
									variant   = "card"
									activo    = { ad.activo }
								/>
							</div>
						</div>

						{ /* Card Content */ }
						<div className="flex flex-col gap-3 p-4 flex-1">
							<div>
								<h3 className="text-sm font-bold text-foreground line-clamp-1" title = { ad.nombre }>
									{ ad.nombre }
								</h3>
								<div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
									<Clock className="size-3" />
									<span>Duración: { ad.duracion }s</span>
								</div>
							</div>

							<hr className="border-border/50" />

							{ /* Periodo de vigencia */ }
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
									<Calendar className="size-3.5 text-muted-foreground shrink-0" />
									<span className="truncate">{ formatDate( ad.fecha_inicio ) } - { formatDate( ad.fecha_fin ) }</span>
								</div>
								<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pl-5">
									<Clock className="size-3 shrink-0" />
									<span>{ formatTime( ad.hora_inicio ) } - { formatTime( ad.hora_fin ) }</span>
								</div>
							</div>

							<hr className="border-border/50" />

							{ /* Edificios asignados */ }
							<div className="flex flex-col gap-1">
								<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
									<Building2 className="size-3" /> Edificios
								</span>
								<div className="flex flex-wrap gap-1 mt-1">
									{ ad.edificios.map( ( idEdif ) => (
										<span
											key       = { idEdif }
											className = "inline-flex items-center rounded-md border border-border bg-muted/45 px-2 py-0.5 text-[10px] font-medium text-foreground"
										>
											{ edificioMap[ idEdif ] || `Edificio ${ idEdif }` }
										</span>
									) ) }
								</div>
							</div>
						</div>
					</div>
				);
			} ) }

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
