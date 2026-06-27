'use client';

import { useState, useMemo, useEffect } from 'react';
import {
	Image as ImageIcon,
	Video,
	Ad,
	ChevronDown,
}                           from 'lucide-react';
import { toast }            from 'sonner';
import { format }           from 'date-fns';
import { es }               from 'date-fns/locale';
import type { DateRange }   from 'react-day-picker';

import {
	getCampusesForBuildings,
	formatDate,
	formatTime,
	parseLocalDate,
}                               from '../utils/ads-helpers';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
}                               from '@/components/ui/popover';
import { Calendar }             from '@/components/ui/calendar';
import { SelectFilter }         from '@/components/ui/select-filter';
import { Slider }               from '@/components/ui/slider';
import { ConfirmDialog }        from '@/components/shared/ConfirmDialog';
import { useDeleteAd }          from '@/hooks/use-ads';
import type { Publicidad }      from '@/lib/models/ads';
import { AdActionsDropdown }    from './ad-actions-dropdown';


const CAMPUS_BUILDINGS : Record<string, string[]> = {
	'penalolen'		: [ '1', '2', '3', '4', '5', '6' ],
	'errazuriz'		: [ '7' ],
	'vitacura'		: [ '8' ],
	'vina-del-mar'	: [ '9', '10', '14', '11', '12', '13' ],
};


interface AdsTableProps {
	ads                     : Publicidad[];
	isLoading?              : boolean;
	filterText              : string;
	onFilterTextChange      : ( value : string ) => void;
	filterTipo              : string[];
	onFilterTipoChange      : ( value : string[] ) => void;
	filterEstado            : string[];
	filterEdificios         : string[];
	onFilterEdificiosChange : ( value : string[] ) => void;
	filterDuracion          : { min : number | ''; max : number | '' };
	onFilterDuracionChange  : ( value : { min : number | ''; max : number | '' } ) => void;
	filterVigencia          : { from? : string; to? : string } | null;
	onFilterVigenciaChange  : ( value : { from? : string; to? : string } | null ) => void;
	isHistorical            : boolean;
}


export function AdsTable( {
	ads,
	isLoading = false,
	filterText,
	onFilterTextChange,
	filterTipo,
	onFilterTipoChange,
	filterEstado,
	filterEdificios,
	onFilterEdificiosChange,
	filterDuracion,
	onFilterDuracionChange,
	filterVigencia,
	onFilterVigenciaChange,
	isHistorical,
} : AdsTableProps ) : React.JSX.Element {
	const deleteMutation = useDeleteAd( );

	const [ deleteTarget, setDeleteTarget ] = useState<{
		id     : number;
		nombre : string;
	} | null>( null );

	const [ isDatePickerOpen, setIsDatePickerOpen ] = useState( false );
	const [ datePickerMonth, setDatePickerMonth ]   = useState<Date | undefined>( ( ) => {
		return filterVigencia?.from ? parseLocalDate( filterVigencia.from ) : undefined;
	} );

	// Sincronizar el mes del calendario cuando cambia la vigencia desde fuera
	useEffect( ( ) => {
		if ( filterVigencia?.from ) {
			setDatePickerMonth( parseLocalDate( filterVigencia.from ) );
		}
	}, [ filterVigencia ] );

	const handleDatePickerOpenChange = ( isOpen : boolean ) : void => {
		setIsDatePickerOpen( isOpen );
		if ( isOpen && filterVigencia?.from ) {
			setDatePickerMonth( parseLocalDate( filterVigencia.from ) );
		}
	};

	// Traducir IDs de edificios a sedes seleccionadas para el selector visual
	const selectedCampuses = useMemo( ( ) => {
		const selected = new Set<string>( );
		Object.entries( CAMPUS_BUILDINGS ).forEach( ( [ campusId, bIds ] ) => {
			if ( bIds.some( ( id ) => filterEdificios.includes( id ) ) ) {
				selected.add( campusId );
			}
		} );
		return Array.from( selected );
	}, [ filterEdificios ] );

	// Traducir sedes seleccionadas a todos sus edificios correspondientes al cambiar el filtro
	function handleSedesSelectionChange( campusIds : string[] ) : void {
		const allBuildingIds : string[] = [];
		campusIds.forEach( ( campusId ) => {
			const bIds = CAMPUS_BUILDINGS[ campusId ];
			if ( bIds ) {
				allBuildingIds.push( ...bIds );
			}
		} );
		onFilterEdificiosChange( allBuildingIds );
	}

	// Obtener la duración máxima dinámica del conjunto de anuncios para escalar el Slider
	const maxAdDuration = useMemo( ( ) => {
		if ( ads.length === 0 ) return 60;
		return Math.max( ...ads.map( ( a ) => a.duracion ), 60 );
	}, [ ads ] );

	if ( isLoading ) {
		return (
			<div className="overflow-x-auto rounded-xl border border-border bg-card h-[calc(100vh-17rem)]">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-border bg-muted/40">
							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground w-1/4">Nombre</th>

							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground w-1/6">Tipo</th>

							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground w-1/8">Duración</th>

							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground w-1/4">Vigencia</th>

							<th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground w-1/4">Sedes</th>

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

	const filtered = ads.filter( ( ad : Publicidad ) : boolean => {
		// 1. Nombre (insensible a mayúsculas/minúsculas)
		const matchText = ad.nombre.toLowerCase().includes( filterText.toLowerCase() );

		// 2. Tipo (Imagen / Video)
		const matchTipo = filterTipo.length === 0 ? true : ad.tipo === filterTipo[ 0 ];

		// 3. Estado Activa/Inactiva (solo en modo histórico)
		const matchState = !isHistorical || filterEstado.length === 0
            ? true
            : filterEstado[ 0 ] === 'activa'
                ? ad.activo
                : !ad.activo;

		// 4. Edificios (Sedes)
		const matchEdificios = filterEdificios.length === 0
			? true
			: ad.edificios.some(( id : number ) : boolean => filterEdificios.map( Number ).includes( id ));

		// 5. Duración (Rango)
		const minDur = filterDuracion.min !== '' ? Number( filterDuracion.min ) : null;
		const maxDur = filterDuracion.max !== '' ? Number( filterDuracion.max ) : null;
		const matchDuracion =
			( minDur === null || ad.duracion >= minDur ) &&
			( maxDur === null || ad.duracion <= maxDur );

		// 6. Vigencia (Fecha única o rango)
		let matchVigencia = true;

        if ( filterVigencia && filterVigencia.from ) {
			if ( !filterVigencia.to ) {
				// Fecha única seleccionada: empieza exactamente en esa fecha
				matchVigencia = ad.fecha_inicio === filterVigencia.from;
			} else {
				// Rango completo seleccionado: solapamiento
				matchVigencia = ad.fecha_inicio <= filterVigencia.to && ad.fecha_fin >= filterVigencia.from;
			}
		}

		return matchText && matchTipo && matchState && matchEdificios && matchDuracion && matchVigencia;
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

	return (
		<div className="overflow-x-auto rounded-xl border border-border bg-card h-[calc(100vh-17rem)]">
			<table className="w-full text-sm">
				<thead className="sticky top-0 z-10 bg-card">
					<tr className="border-b border-border bg-muted/40 align-middle h-14">
						{ /* Columna Nombre */ }
						<th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground w-1/4">
							<input
								type        = "search"
								value       = { filterText }
								onChange    = { ( e : React.ChangeEvent<HTMLInputElement> ) : void => onFilterTextChange( e.target.value ) }
								placeholder = "Buscar por Nombre..."
								className   = "w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground outline-hidden focus:border-primary transition-colors h-10 placeholder:text-muted-foreground/50"
							/>
						</th>

						{ /* Columna Tipo */ }
						<th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground w-1/6">
							<SelectFilter
								options     = { [
									{ label : 'Imagen', value : 'imagen' },
									{ label : 'Video', value : 'video' },
								] }
								value       = { filterTipo }
								onChange    = { onFilterTipoChange }
								placeholder = "Tipo"
								multiple    = { false }
							/>
						</th>

						{ /* Columna Duración */ }
						<th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground w-1/8">
							<Popover>
								<PopoverTrigger className="w-full flex items-center justify-between h-10 rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted/40 transition-colors cursor-pointer text-left outline-hidden">
									<span className="truncate">
										{ ( filterDuracion.min !== '' || filterDuracion.max !== '' ) ? (
											`Duración: ${ filterDuracion.min || '0' }-${ filterDuracion.max || '∞' }s`
										) : (
											'Duración'
										) }
									</span>

									<ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
								</PopoverTrigger>

								<PopoverContent className="w-56 p-4 flex flex-col gap-3.5" align="start">
									<span className="text-xs font-bold text-foreground">Filtrar por Duración (s)</span>

									<div className="flex flex-col gap-3 py-1 px-0.5">
										<div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
											<span>Mín: { filterDuracion.min !== '' ? filterDuracion.min : 0 }s</span>

											<span>Máx: { filterDuracion.max !== '' ? filterDuracion.max : maxAdDuration }s</span>
										</div>

										<Slider
											value          = { [ typeof filterDuracion.min === 'number' ? filterDuracion.min : 0, typeof filterDuracion.max === 'number' ? filterDuracion.max : maxAdDuration ] }
											min            = { 0 }
											max            = { maxAdDuration }
											step           = { 1 }
											onValueChange  = { ( val : number | readonly number[] ) : void => {
												if ( Array.isArray( val ) ) {
													onFilterDuracionChange( {
														min	: val[ 0 ],
														max	: val[ 1 ],
													} );
												}
											} }
											className      = "w-full"
										/>
									</div>

									{ ( filterDuracion.min !== '' || filterDuracion.max !== '' ) && (
										<button
											onClick   = { ( ) : void => onFilterDuracionChange( { min: '', max: '' } ) }
											className = "text-[10px] text-primary hover:underline text-left cursor-pointer w-fit"
										>
											Limpiar filtro
										</button>
									) }
								</PopoverContent>
							</Popover>
						</th>

						{ /* Columna Vigencia */ }
						<th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground w-1/4">
							<Popover open = { isDatePickerOpen } onOpenChange = { handleDatePickerOpenChange }>
								<PopoverTrigger className="w-full flex items-center justify-between h-10 rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted/40 transition-colors cursor-pointer text-left outline-hidden">
									<span className="truncate">
										{ filterVigencia?.from ? (
											filterVigencia.to ? (
												`${ formatDate( filterVigencia.from ) } - ${ formatDate( filterVigencia.to ) }`
											) : (
												`Desde ${ formatDate( filterVigencia.from ) }`
											)
										) : (
											'Vigencia'
										) }
									</span>

									<ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0" align="start">
									<div className="p-2 border-b border-border flex items-center justify-between bg-muted/20">
										<span className="text-xs font-bold text-foreground">Rango de Vigencia</span>

										{ filterVigencia?.from && (
											<button
												onClick   = { ( ) : void => onFilterVigenciaChange( null ) }
												className = "text-[10px] text-primary hover:underline cursor-pointer"
											>
												Limpiar
											</button>
										) }
									</div>

									<Calendar
										mode           = "range"
										month          = { datePickerMonth }
										onMonthChange  = { setDatePickerMonth }
										selected       = { {
											from : filterVigencia?.from ? parseLocalDate( filterVigencia.from ) : undefined,
											to   : filterVigencia?.to ? parseLocalDate( filterVigencia.to ) : undefined,
										} }
										onSelect       = { ( range : DateRange | undefined ) : void => {
											if ( range?.from && range?.to ) {
												onFilterVigenciaChange( {
													from : format( range.from, 'yyyy-MM-dd' ),
													to   : format( range.to, 'yyyy-MM-dd' ),
												} );
											} else if ( range?.from ) {
												onFilterVigenciaChange( {
													from : format( range.from, 'yyyy-MM-dd' ),
													to   : undefined,
												} );
											} else {
												onFilterVigenciaChange( null );
											}
										} }
										numberOfMonths = { 2 }
										locale         = { es }
									/>
								</PopoverContent>
							</Popover>
						</th>

						{ /* Columna Sedes */ }
						<th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground w-1/4">
							<SelectFilter
								options     = { [
									{ label : 'Peñalolén', value : 'penalolen' },
									{ label : 'Errázuriz', value : 'errazuriz' },
									{ label : 'Vitacura', value : 'vitacura' },
									{ label : 'Viña del Mar', value : 'vina-del-mar' },
								] }
								value       = { selectedCampuses }
								onChange    = { handleSedesSelectionChange }
								placeholder = "Sedes"
								multiple    = { true }
							/>
						</th>

						{ /* Acciones */ }
						<th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground">
							<span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 pr-2">Acciones</span>
						</th>
					</tr>
				</thead>

				<tbody>
					{ filtered.length === 0 ? (
						<tr>
							<td colSpan = { 6 } className="py-20 text-center">
								<div className="flex flex-col items-center justify-center gap-3">
									<Ad className="size-24 text-muted-foreground/40" />

									<p className="text-sm font-medium text-muted-foreground">
										No se encontraron publicidades con los filtros aplicados
									</p>
								</div>
							</td>
						</tr>
					) : (
						filtered.map( ( ad ) => (
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

										<p className="text-[11px] text-muted-foreground">
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
						) )
					) }
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
