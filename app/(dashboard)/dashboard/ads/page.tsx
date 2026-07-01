'use client';

import {
    Suspense,
    useState,
    useMemo,
    useEffect
} from 'react';
import {
    useRouter,
    useSearchParams
} from 'next/navigation';

import {
	Plus,
	Search,
	Image as ImageIcon,
	Video,
	CheckCircle,
	XCircle,
	LayoutGrid,
	Table,
	Images,
	Ad,
	ChevronLeft,
	Clock,
} from 'lucide-react';

import {
	ToggleGroup,
	ToggleGroupItem
}                               from '@/components/ui/toggle-group';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
}                               from '@/components/ui/popover';
import { DateRangePicker }      from '@/components/ui/date-range-picker';
import { Slider }               from '@/components/ui/slider';
import { useAds }               from '@/hooks/use-ads';
import { AdsTable }             from './components/ads-table';
import { AdsCardView }          from './components/ads-card-view';
import { HeadquartersSelect }   from '@/components/combobox/headquarters-select';
import { Button }               from '@/components/ui/button';


function AdsPageContent() : React.JSX.Element {
	const router        = useRouter();
	const searchParams  = useSearchParams();
	const viewParam     = searchParams.get( 'view' );
	const viewMode      = viewParam === 'card' ? 'card' : 'table';

	const [ search, setSearch ] = useState( ( ) => searchParams.get( 'q' ) || '' );
	const [ debouncedSearch, setDebouncedSearch ] = useState( ( ) => searchParams.get( 'q' ) || '' );

	// Estados de filtro (datasetMode es string[] por compatibilidad con Base UI ToggleGroup)
	const [ datasetMode, setDatasetMode ]         = useState<string[]>( ( ) => {
		const mode = searchParams.get( 'mode' );
		return mode ? [ mode ] : [ 'vigentes' ];
	} );
	const [ filterActivo, setFilterActivo ]       = useState<string[]>( ( ) => {
		const status = searchParams.get( 'status' );
		return status ? status.split( ',' ) : [ ];
	} );
	const [ filterTipo, setFilterTipo ]           = useState<string[]>( ( ) => {
		const tipo = searchParams.get( 'tipo' );
		return tipo ? tipo.split( ',' ) : [ ];
	} );
	const [ filterEdificios, setFilterEdificios ] = useState<string[]>( ( ) => {
		const edificios = searchParams.get( 'edificios' );
		return edificios ? edificios.split( ',' ) : [ ];
	} );
	const [ filterDuracion, setFilterDuracion ]   = useState<{ min : number | ''; max : number | '' }>( ( ) => {
		const min = searchParams.get( 'durMin' );
		const max = searchParams.get( 'durMax' );
		return {
			min	: min ? Number( min ) : '',
			max	: max ? Number( max ) : '',
		};
	} );
	const [ filterVigencia, setFilterVigencia ]   = useState<{ from? : string; to? : string } | null>( ( ) => {
		const from = searchParams.get( 'from' );
		const to = searchParams.get( 'to' );
		return from ? { from, to : to || undefined } : null;
	} );

	const isVigentes                         = datasetMode[ 0 ] === 'vigentes';
	const { data : ads, isLoading, isError } = useAds( isVigentes );

	// Obtener la duración máxima dinámica del conjunto de anuncios para escalar el Slider
	const maxAdDuration = useMemo( ( ) => {
		if ( !ads || ads.length === 0 ) return 60;
		return Math.max( ...ads.map( ( a ) => a.duracion ), 60 );
	}, [ ads ] );

	// Debounce para la búsqueda en la URL
	useEffect( ( ) => {
		const timer = setTimeout( ( ) => {
			setDebouncedSearch( search );
		}, 300 );

		return ( ) => clearTimeout( timer );
	}, [ search ] );

	// Sincronizar estados locales a la URL
	useEffect( ( ) => {
		const params = new URLSearchParams( window.location.search );

		if ( debouncedSearch ) {
			params.set( 'q', debouncedSearch );
		} else {
			params.delete( 'q' );
		}

		if ( datasetMode[ 0 ] && datasetMode[ 0 ] !== 'vigentes' ) {
			params.set( 'mode', datasetMode[ 0 ] );
		} else {
			params.delete( 'mode' );
		}

		if ( filterActivo.length > 0 ) {
			params.set( 'status', filterActivo.join( ',' ) );
		} else {
			params.delete( 'status' );
		}

		if ( filterTipo.length > 0 ) {
			params.set( 'tipo', filterTipo.join( ',' ) );
		} else {
			params.delete( 'tipo' );
		}

		if ( filterEdificios.length > 0 ) {
			params.set( 'edificios', filterEdificios.join( ',' ) );
		} else {
			params.delete( 'edificios' );
		}

		if ( filterDuracion.min !== '' ) {
			params.set( 'durMin', String( filterDuracion.min ) );
		} else {
			params.delete( 'durMin' );
		}

		if ( filterDuracion.max !== '' ) {
			params.set( 'durMax', String( filterDuracion.max ) );
		} else {
			params.delete( 'durMax' );
		}

		if ( filterVigencia?.from ) {
			params.set( 'from', filterVigencia.from );
			if ( filterVigencia.to ) {
				params.set( 'to', filterVigencia.to );
			} else {
				params.delete( 'to' );
			}
		} else {
			params.delete( 'from' );
			params.delete( 'to' );
		}

		const currentString = new URLSearchParams( window.location.search ).toString();
		const newString     = params.toString();

		if ( currentString !== newString ) {
			router.replace( `?${ newString }`, { scroll : false } );
		}
	}, [ debouncedSearch, datasetMode, filterActivo, filterTipo, filterEdificios, filterDuracion, filterVigencia, router ] );

	// Sincronizar cambios de la URL (back/forward) al estado local
	useEffect( ( ) => {
		const timer = setTimeout( ( ) => {
			const qParam = searchParams.get( 'q' ) || '';
			if ( qParam !== search ) {
				setSearch( qParam );
			}

			const modeParam = searchParams.get( 'mode' ) || 'vigentes';
			if ( modeParam !== datasetMode[ 0 ] ) {
				setDatasetMode( [ modeParam ] );
			}

			const statusParam = searchParams.get( 'status' );
			const newStatus   = statusParam ? statusParam.split( ',' ) : [ ];
			if ( JSON.stringify( newStatus ) !== JSON.stringify( filterActivo ) ) {
				setFilterActivo( newStatus );
			}

			const tipoParam = searchParams.get( 'tipo' );
			const newTipo   = tipoParam ? tipoParam.split( ',' ) : [ ];
			if ( JSON.stringify( newTipo ) !== JSON.stringify( filterTipo ) ) {
				setFilterTipo( newTipo );
			}

			const edificiosParam = searchParams.get( 'edificios' );
			const newEdificios   = edificiosParam ? edificiosParam.split( ',' ) : [ ];
			if ( JSON.stringify( newEdificios ) !== JSON.stringify( filterEdificios ) ) {
				setFilterEdificios( newEdificios );
			}

			const durMinParam = searchParams.get( 'durMin' );
			const durMaxParam = searchParams.get( 'durMax' );
			const newDurMin   = durMinParam ? Number( durMinParam ) : '';
			const newDurMax   = durMaxParam ? Number( durMaxParam ) : '';
			if ( newDurMin !== filterDuracion.min || newDurMax !== filterDuracion.max ) {
				setFilterDuracion( {
					min	: newDurMin,
					max	: newDurMax,
				} );
			}

			const fromParam   = searchParams.get( 'from' );
			const toParam     = searchParams.get( 'to' );
			const newVigencia = fromParam ? {
				from	: fromParam,
				to		: toParam || undefined,
			} : null;
			if ( JSON.stringify( newVigencia ) !== JSON.stringify( filterVigencia ) ) {
				setFilterVigencia( newVigencia );
			}
		}, 0 );

		return ( ) => clearTimeout( timer );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ searchParams ] );

	function handleEdificiosChange( selected : string[] | string | undefined ) : void {
		if ( !selected ) {
			setFilterEdificios( [] );
		} else if ( Array.isArray( selected ) ) {
			setFilterEdificios( selected );
		} else {
			setFilterEdificios( [ selected ] );
		}
	}

	function handleVigenciaChange( range : { from : string; to? : string } | null ) : void {
		setFilterVigencia( range );
	}

	function handleViewModeChange( mode : 'table' | 'card' ) : void {
		const params = new URLSearchParams( searchParams.toString() );
		params.set( 'view', mode );
		router.push( `?${ params.toString() }` );
	}

	return (
		<div className="flex min-h-[calc(100vh-10rem)] flex-col gap-4 p-3 sm:p-6 bg-background text-foreground max-w-7xl mx-auto">
			{ /* ── Header ── */ }
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="grid sm:flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Button
                                id        = "dashboard-back-button"
                                onClick   = { ( ) => router.push( '/dashboard' ) }
                                variant   = "outline"
                                size      = "icon"
                            >
                                <ChevronLeft className="size-6" />
                            </Button>

                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                                <Ad className="size-6 sm:size-8" />
                                Publicidades
                            </h1>
                        </div>

                        <p className="text-sm text-muted-foreground mt-1 sm:hidden">
                            Gestiona todas tus publicidades activas e inactivas
                        </p>

                        <div className="flex flex-wrap items-center gap-4 sm:ml-5">
                            <ToggleGroup
                                value         = { datasetMode }
                                className     = "flex items-center gap-1 rounded-xl border border-border p-1 bg-muted/20 w-fit"
                                onValueChange = { ( val : string[] ) : void => {
                                    if ( val.length > 0 ) {
                                        setDatasetMode( val );
                                    }
                                } }
                            >
                                <ToggleGroupItem
                                    value       = "vigentes"
                                    className   = "px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                                    title       = "Vigentes"
                                >
                                    <Images className="size-4" />
                                    <span className="flex sm:hidden md:flex">Vigentes</span>
                                </ToggleGroupItem>

                                <ToggleGroupItem
                                    value     = "historicos"
                                    className = "px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                                    title="Históricos"
                                >
                                    <Clock className="size-4" />
                                    <span className="flex sm:hidden md:flex">Históricos</span>
                                </ToggleGroupItem>
                            </ToggleGroup>

                            { !isVigentes && (
                                <ToggleGroup
                                    value         = { filterActivo }
                                    onValueChange = { setFilterActivo }
                                    className     = "flex items-center gap-1 rounded-xl border border-border p-1 bg-muted/20 w-fit"
                                >
                                    <ToggleGroupItem
                                        value     = "activa"
                                        className = "px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                                        title="Activa"
                                    >
                                        <CheckCircle className="size-4 text-emerald-500" />
                                        <span className="flex sm:hidden md:flex">Activa</span>
                                    </ToggleGroupItem>

                                    <ToggleGroupItem
                                        value     = "inactiva"
                                        className = "px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                                        title="Inactiva"
                                    >
                                        <XCircle className="size-4 text-rose-500" />
                                        <span className="flex sm:hidden md:flex">Inactiva</span>
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            ) }
                        </div>
					</div>

					<p className="text-sm text-muted-foreground mt-1 hidden sm:flex">
						Gestiona todas tus publicidades activas e inactivas
					</p>
				</div>

				<div className="flex items-center gap-3">
					{ /* Card vs Table View Switcher */ }
					<div className="flex items-center rounded-xl border border-border p-1 bg-muted/20">
						<button
							onClick   = { ( ) => handleViewModeChange( 'table' ) }
							className = { `p-1.5 rounded-lg transition-colors cursor-pointer ${
								viewMode === 'table'
									? 'bg-background text-foreground shadow-2xs'
									: 'text-muted-foreground hover:text-foreground'
							}` }
							title     = "Vista de tabla"
						>
							<Table className="size-4" />
						</button>

						<button
							onClick   = { ( ) => handleViewModeChange( 'card' ) }
							className = { `p-1.5 rounded-lg transition-colors cursor-pointer ${
								viewMode === 'card'
									? 'bg-background text-foreground shadow-2xs'
									: 'text-muted-foreground hover:text-foreground'
							}` }
							title     = "Vista de tarjetas"
						>
							<LayoutGrid className="size-4" />
						</button>
					</div>

					<button
						id        = "ads-create"
						onClick   = { ( ) => router.push( `/dashboard/ads/form?${ searchParams.toString( ) }` ) }
						className = "flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
					>
						<Plus className="size-4" />
                        <span className="hidden lg:flex">Nueva Publicidad</span>
					</button>
				</div>
			</div>

			{ /* ── Card View Secondary Filters Row ── */ }
			{ viewMode === 'card' && (
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center animate-in fade-in duration-200">
					{ /* Search Input */ }
					<div className="relative w-full sm:w-72">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

						<input
							id          = "ads-search"
							type        = "search"
							value       = { search }
							onChange    = { ( e : React.ChangeEvent<HTMLInputElement> ) : void => setSearch( e.target.value ) }
							placeholder = "Buscar publicidades..."
							className   = "w-full rounded-xl border border-border py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
					</div>

					{ /* Toggle Group for Tipo */ }
					<ToggleGroup
						value         = { filterTipo }
						onValueChange = { setFilterTipo }
						className     = "flex items-center gap-1 rounded-xl border border-border p-1 bg-muted/20 shrink-0"
					>
						<ToggleGroupItem value="imagen" className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
							<ImageIcon className="size-3.5" />
							Imagen
						</ToggleGroupItem>

						<ToggleGroupItem value="video" className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
							<Video className="size-3.5" />
							Video
						</ToggleGroupItem>
					</ToggleGroup>

					{ /* HeadquartersSelect for Edificios */ }
					<div className="w-full sm:w-72 xl:w-64">
						<HeadquartersSelect
							defaultValues     = { filterEdificios }
							onSelectionChange = { handleEdificiosChange }
							placeholder       = "Todas las sedes"
							multiple          = { true }
							maxDisplayItems   = { 3 }
						/>
					</div>

					{ /* Popover for Duración */ }
					<Popover>
						<PopoverTrigger className="flex h-[42px] items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 outline-hidden transition-colors cursor-pointer w-full sm:w-72 md:w-52">
							<span className="text-muted-foreground">Duración</span>

							{ ( filterDuracion.min !== '' || filterDuracion.max !== '' ) ? (
								<span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
									{ filterDuracion.min || '0' }-{ filterDuracion.max || '∞' }s
								</span>
							) : (
								<span className="text-xs text-muted-foreground/60">Todos</span>
							) }
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
											setFilterDuracion( {
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
									onClick   = { ( ) : void => setFilterDuracion( { min: '', max: '' } ) }
									className = "text-[10px] text-primary hover:underline text-left cursor-pointer w-fit"
								>
									Limpiar filtro
								</button>
							) }
						</PopoverContent>
					</Popover>

					{ /* DateRangePicker for Vigencia */ }
					<DateRangePicker
						value       = { filterVigencia || undefined }
						onChange    = { handleVigenciaChange }
						placeholder = "Rango de vigencia"
						className   = "w-full sm:w-64"
					/>
				</div>
			) }

			{ isError && (
				<div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-destructive">
					<p className="text-sm font-semibold">Error al cargar las publicidades</p>
					<p className="text-xs text-muted-foreground">Por favor, intenta de nuevo más tarde.</p>
				</div>
			) }

			{ !isError && (
				viewMode === 'card' ? (
					<AdsCardView
						ads             = { ads ?? [] }
						isLoading       = { isLoading }
						filterText      = { search }
						filterTipo      = { filterTipo }
						filterEstado    = { !isVigentes ? filterActivo : [] }
						filterEdificios = { filterEdificios }
						filterDuracion  = { filterDuracion }
						filterVigencia  = { filterVigencia }
					/>
				) : (
					<AdsTable
						ads                     = { ads ?? [] }
						isLoading               = { isLoading }
						filterText              = { search }
						onFilterTextChange      = { setSearch }
						filterTipo              = { filterTipo }
						onFilterTipoChange      = { setFilterTipo }
						filterEstado            = { !isVigentes ? filterActivo : [] }
						filterEdificios         = { filterEdificios }
						onFilterEdificiosChange = { handleEdificiosChange }
						filterDuracion          = { filterDuracion }
						onFilterDuracionChange  = { setFilterDuracion }
						filterVigencia          = { filterVigencia }
						onFilterVigenciaChange  = { setFilterVigencia }
						isHistorical            = { !isVigentes }
					/>
				)
			) }
		</div>
	);
}


export default function AdsPage() : React.JSX.Element {
	return (
		<Suspense fallback = {
			<div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6 p-6 bg-background">
				<div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
				<div className="mt-6 h-96 animate-pulse rounded-2xl bg-muted" />
			</div>
		} >
			<AdsPageContent />
		</Suspense>
	);
}
