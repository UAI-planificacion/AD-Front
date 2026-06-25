'use client';

import { useState }          from 'react';
import {
	Image as ImageIcon,
	Video,
    Ad
}                   from 'lucide-react';
import { toast }    from 'sonner';

import { 
	getCampusesForBuildings, 
	formatDate, 
	formatTime 
}                               from '../utils/ads-helpers';
import { ConfirmDialog }        from '@/components/shared/ConfirmDialog';
import { useDeleteAd }          from '@/hooks/use-ads';
import type { Publicidad }      from '@/lib/models/ads';
import { AdActionsDropdown }    from './ad-actions-dropdown';


interface AdsTableProps {
	ads             : Publicidad[];
	isLoading?      : boolean;
	filterText      : string;
	filterTipo      : string[];
	filterEstado    : string[];
	filterEdificios : string[];
}


export function AdsTable( { ads, isLoading = false, filterText, filterTipo, filterEstado, filterEdificios } : AdsTableProps ) : React.JSX.Element {
	const deleteMutation = useDeleteAd();

	const [ deleteTarget, setDeleteTarget ] = useState<{
		id		: number;
		nombre	: string;
	} | null>( null );

	if ( isLoading ) {
		return (
			<div className="overflow-x-auto rounded-xl border border-border bg-card h-[calc(100vh-23rem)]">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-border bg-muted/40">
							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Nombre</th>
							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Tipo</th>
							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Duración</th>
							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Vigencia</th>
							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Sedes</th>
							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Estado</th>
							<th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{ Array.from( { length : 6 } ).map( ( _, i ) => (
							<tr key = { i } className="border-b border-border/50 last:border-0 animate-pulse">
								<td className="px-4 py-4">
									<div className="h-4 w-40 rounded bg-muted" />
								</td>
								<td className="px-4 py-4">
									<div className="h-4 w-14 rounded bg-muted" />
								</td>
								<td className="px-4 py-4">
									<div className="h-4 w-8 rounded bg-muted" />
								</td>
								<td className="px-4 py-4">
									<div className="flex flex-col gap-1.5">
										<div className="h-3 w-28 rounded bg-muted" />
										<div className="h-2.5 w-16 rounded bg-muted" />
									</div>
								</td>
								<td className="px-4 py-4">
									<div className="h-6 w-20 rounded-lg bg-muted" />
								</td>
								<td className="px-4 py-4">
									<div className="h-6 w-16 rounded-full bg-muted" />
								</td>
								<td className="px-4 py-4 text-right">
									<div className="inline-block h-8 w-8 rounded-lg bg-muted" />
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			</div>
		);
	}

	const filtered = ads.filter( ( ad ) => {
		const matchText  = ad.nombre.toLowerCase().includes( filterText.toLowerCase() );
		const matchTipo  = filterTipo.length === 0 ? true : ad.tipo === filterTipo[ 0 ];
		const matchState =
			filterEstado.length === 0        ? true :
			filterEstado[ 0 ] === 'activa'   ? ad.activo :
			filterEstado[ 0 ] === 'vigentes' ? true :
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
                <Ad className="size-24" />

				<p className="text-sm font-medium text-muted-foreground">
					No se encontraron publicidades con los filtros aplicados
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-border bg-card h-[calc(100vh-23rem)]">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border bg-muted/40">
						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Nombre</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Tipo</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Duración</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Vigencia</th>

						<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Sedes</th>

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
									{ getCampusesForBuildings( ad.edificios ).map( ( name ) => (
										<span
											key       = { name }
											className = "inline-flex items-center rounded-lg border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground"
										>
											{ name }
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
				message   = { deleteTarget ? `¿Eliminar la publicidad "${ deleteTarget.nombre }"?` : '' }
				onConfirm = { handleConfirmDelete }
				onClose   = { ( ) => setDeleteTarget( null ) }
			/>
		</div>
	);
}
