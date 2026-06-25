'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter }                          from 'next/navigation';

import { toast }        from 'sonner';
import { CalendarDays } from 'lucide-react';

import type {
    Publicidad,
    UpdateAdDto
}                                   from '@/lib/models/ads';
import { useCreateAd, useUpdateAd } from '@/hooks/use-ads';
import { AdsUploader }              from './ads-uploader';
import { DateRangePicker }          from '@/components/ui/date-range-picker';
import { TimeRangePicker }          from '@/components/ui/time-range-picker';
import { HeadquartersSelect }       from '@/components/combobox/headquarters-select';
import { cn }                       from '@/lib/utils';
import { Label }                    from '@/components/ui/label';
import { getCampusesForBuildings }  from '../utils/ads-helpers';


function areArraysEqual( a : number[], b : number[] ) : boolean {
	if ( a.length !== b.length ) return false;
	const sortedA = [ ...a ].sort( );
	const sortedB = [ ...b ].sort( );
	return sortedA.every( ( val, i ) => val === sortedB[ i ] );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface AdsFormProps {
	mode             : 'create' | 'edit';
	initialData?     : Publicidad;
	onDirtyChange?   : ( isDirty : boolean ) => void;
	onPendingChange? : ( isPending : boolean ) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function AdsForm( { mode, initialData, onDirtyChange, onPendingChange }: AdsFormProps ): React.JSX.Element {
	const router      = useRouter( );
	const createMutation = useCreateAd( );
	const updateMutation = useUpdateAd( );

	// Field state
	const [ nombre, setNombre ]           = useState( initialData?.nombre       ?? '' );
	const [ tipo, setTipo ]               = useState<'imagen' | 'video'>( initialData?.tipo ?? 'imagen' );
	const [ duracion, setDuracion ]       = useState( initialData?.duracion      ?? 10 );
	const [ fechaInicio, setFechaInicio ] = useState( initialData?.fecha_inicio  ?? '' );
	const [ fechaFin, setFechaFin ]       = useState( initialData?.fecha_fin     ?? '' );
	const [ horaInicio, setHoraInicio ]   = useState( initialData?.hora_inicio   ?? '08:00:00' );
	const [ horaFin, setHoraFin ]         = useState( initialData?.hora_fin      ?? '23:59:00' );
	const [ edificios, setEdificios ]     = useState<number[]>( initialData?.edificios ?? [] );
	const [ archivoUrl, setArchivoUrl ]   = useState( initialData?.archivo_url   ?? '' );
	const [ file, setFile ]               = useState<File | null>( null );
	const [ activo, setActivo ]           = useState( initialData?.activo        ?? true );

	// Error state
	const [ errors, setErrors ] = useState<Partial<Record<string, string>>>( { } );

	const isPending = createMutation.isPending || updateMutation.isPending;

	useEffect( ( ) => {
		if ( onPendingChange ) {
			onPendingChange( isPending );
		}
	}, [ isPending, onPendingChange ] );

	useEffect( ( ) => {
		if ( mode === 'edit' && initialData && !initialData.activo ) {
			if ( fechaInicio !== initialData.fecha_inicio || fechaFin !== initialData.fecha_fin ) {
				setActivo( true );
			}
		}
	}, [ fechaInicio, fechaFin, initialData, mode ] );

	useEffect( ( ) => {
		if ( !onDirtyChange ) return;

		let dirty = false;
		if ( mode === 'create' ) {
			dirty =
				nombre !== '' ||
				tipo !== 'imagen' ||
				duracion !== 10 ||
				fechaInicio !== '' ||
				fechaFin !== '' ||
				horaInicio !== '08:00:00' ||
				horaFin !== '23:59:00' ||
				edificios.length > 0 ||
				file !== null;
		} else {
			dirty =
				nombre !== ( initialData?.nombre ?? '' ) ||
				tipo !== ( initialData?.tipo ?? 'imagen' ) ||
				duracion !== ( initialData?.duracion ?? 10 ) ||
				fechaInicio !== ( initialData?.fecha_inicio ?? '' ) ||
				fechaFin !== ( initialData?.fecha_fin ?? '' ) ||
				horaInicio !== ( initialData?.hora_inicio ?? '08:00:00' ) ||
				horaFin !== ( initialData?.hora_fin ?? '23:59:00' ) ||
				!areArraysEqual( edificios, initialData?.edificios ?? [] ) ||
				activo !== ( initialData?.activo ?? true ) ||
				file !== null;
		}

		onDirtyChange( dirty );
	}, [
		nombre,
		tipo,
		duracion,
		fechaInicio,
		fechaFin,
		horaInicio,
		horaFin,
		edificios,
		activo,
		file,
		initialData,
		mode,
		onDirtyChange,
	] );


	function handleEdificiosChange( selected : string[] | string | undefined ) : void {
		if ( !selected ) {
			setEdificios( [] );
		} else if ( Array.isArray( selected ) ) {
			setEdificios( selected.map( Number ) );
		} else {
			setEdificios( [ Number( selected ) ] );
		}
	}


	function handleFileChange( selectedFile: File | null ): void {
		setFile( selectedFile );

        if ( selectedFile ) {
			if ( selectedFile.type.startsWith( 'video/' ) ) {
				setTipo( 'video' );
			} else {
				setTipo( 'imagen' );
			}
		}
	}


	function validate( ): boolean {
		const newErrors: Partial<Record<string, string>> = { };
		const today = new Date( );
		today.setHours( 0, 0, 0, 0 );

		if ( !nombre.trim( ) )       newErrors.nombre       = 'El nombre es obligatorio';

		if ( !fechaInicio ) {
			newErrors.fechaInicio   = 'La fecha de inicio es obligatoria';
		} else if ( mode === 'create' ) {
			const start = new Date( `${ fechaInicio }T00:00:00` );
			if ( start < today ) {
				newErrors.fechaInicio = 'La fecha de inicio no puede ser anterior al día de hoy';
			}
		}

		if ( !fechaFin ) {
			newErrors.fechaFin      = 'La fecha de fin es obligatoria';
		} else if ( mode === 'create' ) {
			const end = new Date( `${ fechaFin }T00:00:00` );
			if ( end < today ) {
				newErrors.fechaFin = 'La fecha de fin no puede ser anterior al día de hoy';
			}
		}

		if ( edificios.length === 0 ) newErrors.edificios   = 'Selecciona al menos una sede';
		if ( mode === 'create' && !file && !archivoUrl )
			newErrors.archivo = 'Debes subir un archivo';

		setErrors( newErrors );
		return Object.keys( newErrors ).length === 0;
	}


	async function handleSubmit( e: FormEvent ): Promise<void> {
		e.preventDefault( );
		if ( !validate( ) ) return;

		try {
			if ( mode === 'edit' && initialData ) {
				const dto : UpdateAdDto = {
					nombre			: nombre,
					fecha_inicio	: fechaInicio,
					fecha_fin		: fechaFin,
					hora_inicio		: horaInicio.substring( 0, 5 ),
					hora_fin		: horaFin.substring( 0, 5 ),
					duracion		: Number( duracion ),
					edificios		: edificios,
					activo			: activo,
				};
				await updateMutation.mutateAsync( { id : initialData.id, dto } );
				toast.success( 'Publicidad actualizada correctamente' );
			} else {
				const formData = new FormData();
				formData.append( 'nombre', nombre );
				if ( file ) {
					formData.append( 'archivo', file );
				}
				formData.append( 'duracion', String( duracion ) );
				formData.append( 'fecha_inicio', fechaInicio );
				formData.append( 'fecha_fin', fechaFin );
				formData.append( 'hora_inicio', horaInicio.substring( 0, 5 ) );
				formData.append( 'hora_fin', horaFin.substring( 0, 5 ) );
				formData.append( 'archivo_dimensiones', '384x1080' );
				edificios.forEach( ( id ) => {
					formData.append( 'edificios', String( id ) );
				} );

				await createMutation.mutateAsync( formData );
				toast.success( 'Publicidad creada correctamente' );
			}

			router.push( '/dashboard/ads' );
		} catch {
			toast.error( 'Ocurrió un error. Intenta de nuevo.' );
		}
	}


	const isCreate          = mode === 'create';
    const maxDuration       = 60;
	const percentage        = (( duracion - 1 ) / ( maxDuration - 1 )) * 100;
	const backgroundStyle   = {
		background : `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${ percentage }%, var(--color-border) ${ percentage }%, var(--color-border) 100%)`,
	};


	return (
		<form id="ads-form" onSubmit = { handleSubmit } className = { isCreate ? "max-w-7xl mx-auto w-full flex flex-col gap-6" : "grid gap-8 lg:grid-cols-[1fr_380px]" }>
			{ /* ── LEFT: Fields ── */ }
			<div className = { cn( "flex flex-col gap-6", isCreate ? "w-full" : "" ) }>
				{ /* Nombre */ }
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="ads-nombre">
						Nombre de la publicidad
					</Label>

					<input
						id          = "ads-nombre"
						type        = "text"
						value       = { nombre }
						onChange    = { ( e ) => setNombre( e.target.value ) }
						placeholder = "Ej: Bienvenida Formal 2025"
						className   = "rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
					/>
					{ errors.nombre && <p className="text-xs text-destructive">{ errors.nombre }</p> }
				</div>

				{ /* Vigencia */ }
				<div className="rounded-2xl border border-border bg-muted/20 p-4">
					<h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						<CalendarDays className="size-3.5" /> Periodo de vigencia
					</h3>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-center'>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 col-span-2">
                                <Label>
                                    Rango de fechas
                                </Label>

                                <DateRangePicker
                                    value    = { { from: fechaInicio, to: fechaFin } }
                                    onChange = { ( range ) => {
                                        setFechaInicio( range?.from ?? '' );
                                        setFechaFin( range?.to ?? '' );
                                    } }
                                />
                                { ( errors.fechaInicio || errors.fechaFin ) && (
                                    <p className="text-xs text-destructive">
                                        { errors.fechaInicio || errors.fechaFin }
                                    </p>
                                ) }
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 col-span-2">
                                <Label>
                                    Horario de vigencia
                                </Label>

                                <TimeRangePicker
                                    startTime = { horaInicio }
                                    endTime   = { horaFin }
                                    onChange  = { ( start, end ) => {
                                        setHoraInicio( start );
                                        setHoraFin( end );
                                    } }
                                />
                            </div>
                        </div>
                    </div>
				</div>

				{ /* Edificios */ }
				<div className="flex flex-col gap-1.5">
					<HeadquartersSelect
						defaultValues     = { edificios.map( String ) }
						onSelectionChange = { handleEdificiosChange }
						label             = "Sedes donde se mostrará"
						maxDisplayItems   = { 5 }
					/>
					{ errors.edificios && <p className="text-xs text-destructive">{ errors.edificios }</p> }
				</div>

                { /* Archivo — solo en create */ }
				{ mode === 'create' && (
					<div className="flex flex-col gap-1.5">
                        <Label>
							Archivo de la publicidad
						</Label>

						<AdsUploader
							value            = { file }
							onChange         = { handleFileChange }
							onDurationDetect = { ( duration ) => setDuracion( Math.round( duration ) ) }
						/>

						{ errors.archivo && <p className="text-xs text-destructive">{ errors.archivo }</p> }
					</div>
				) }

                {/* Duración */}
                { ( file || ( mode === 'edit' && initialData ) ) && tipo !== 'video' && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="ads-duracion">
                            Duración (segundos)
                        </label>

                        <div className="flex flex-col mt-2">
                            <input
                                id        = "ads-duracion"
                                type      = "range"
                                min       = { 1 }
                                max       = { maxDuration }
                                value     = { duracion }
                                onChange  = { ( e ) => setDuracion( Number( e.target.value ) ) }
                                style     = { backgroundStyle }
                                className = "h-1.5 w-full cursor-pointer appearance-none rounded-lg border border-border outline-hidden [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md"
                            />

                            <div className="flex justify-between text-xs text-muted-foreground mt-1.5 px-0.5 select-none font-medium">
                                <span>1s</span>
                                <span className="font-semibold text-primary">{ duracion }s</span>
                                <span>{ maxDuration }s</span>
                            </div>
                        </div>
                    </div>
                )}
			</div>

			{ /* ── RIGHT: Preview + Actions (Solo en modo edición) ── */ }
			{ !isCreate && (
				<div className="flex flex-col gap-6">
					{ /* Preview panel */ }
					<div className="sticky top-6">
						{ initialData && (
							<div className="mb-6 rounded-2xl border border-border bg-card p-4">
								<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vista previa actual</p>
								{ initialData.archivo_tipo.startsWith( 'video' ) ? (
									<video
										src       = { initialData.archivo_url }
										controls
										className = "w-full rounded-xl object-cover"
										style     = { { maxHeight: '320px' } }
									/>
								) : (
									<img
										src       = { initialData.archivo_url }
										alt       = { initialData.nombre }
										className = "w-full rounded-xl object-contain bg-muted"
										style     = { { maxHeight: '320px' } }
									/>
								) }
							</div>
						) }

						{ /* Summary card */ }
						<div className="rounded-2xl border border-border bg-card p-4">
							<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resumen</p>

							<div className="flex flex-col gap-2 text-xs">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Nombre</span>

									<span className="font-medium text-foreground truncate max-w-[140px]">{ nombre || '—' }</span>
								</div>

								<div className="flex justify-between">
									<span className="text-muted-foreground">Tipo</span>

									<span className="font-medium text-foreground">{ tipo }</span>
								</div>

								<div className="flex justify-between">
									<span className="text-muted-foreground">Duración</span>

									<span className="font-medium text-foreground">{ duracion }s</span>
								</div>

								<div className="flex justify-between">
									<span className="text-muted-foreground">Sedes</span>

									<span className="font-medium text-foreground">{ getCampusesForBuildings( edificios ).length }</span>
								</div>

								<div className="flex justify-between items-center mt-1 pt-2 border-t border-border/50">
									<span className="text-muted-foreground font-semibold">Estado</span>

									<span className = { cn(
										"inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold select-none transition-all duration-300",
										activo
											? "bg-black text-white dark:bg-white dark:text-black"
											: "bg-muted text-muted-foreground"
									) } >
										{ activo ? 'Activa' : 'Inactiva' }
									</span>
								</div>
							</div>

						</div>
					</div>
				</div>
			) }
		</form>
	);
}
