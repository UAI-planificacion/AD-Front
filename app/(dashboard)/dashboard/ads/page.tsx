'use client';

import { Suspense, useState }           from 'react';
import { useRouter, useSearchParams }   from 'next/navigation';

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
} from 'lucide-react';

import {
    ToggleGroup,
    ToggleGroupItem
}                               from '@/components/ui/toggle-group';
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

	const [ search, setSearch ] = useState( '' );

	// Filter states as string arrays matching ToggleGroup's props
	const [ filterTipo, setFilterTipo ]             = useState<string[]>( [] );
	const [ filterEstado, setFilterEstado ]         = useState<string[]>( [] );
	const [ filterEdificios, setFilterEdificios ]   = useState<string[]>( [] );

	const isVigent                              = filterEstado[ 0 ] === 'vigentes';
	const { data : ads, isLoading, isError }    = useAds( isVigent );

	function handleEdificiosChange( selected : string[] | string | undefined ) : void {
		if ( !selected ) {
			setFilterEdificios( [] );
		} else if ( Array.isArray( selected ) ) {
			setFilterEdificios( selected );
		} else {
			setFilterEdificios( [ selected ] );
		}
	}

	return (
		<div className="flex min-h-[calc(100vh-10rem)] flex-col gap-6 p-6 bg-background text-foreground max-w-7xl mx-auto">
			{ /* ── Header ── */ }
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
                    <div className='flex items-center gap-2'>
                        <Button
                            id        = "dashboard-back-button"
                            onClick   = { () => router.push( '/dashboard' ) }
                            variant   = "outline"
                            size      = "icon"
                        >
                            <ChevronLeft className="size-6" />
                        </Button>

                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Ad className="size-8" />
                            Publicidades
                        </h1>
                    </div>

					<p className="text-sm text-muted-foreground mt-1">
						Gestiona todas tus publicidades activas e inactivas
					</p>
				</div>

				<div className="flex items-center gap-3">
					{ /* Card vs Table View Switcher */ }
					<div className="flex items-center rounded-xl border border-border p-1 bg-muted/20">
						<button
							onClick   = { () => router.push( '/dashboard/ads?view=table' ) }
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
							onClick   = { () => router.push( '/dashboard/ads?view=card' ) }
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
						onClick   = { () => router.push( '/dashboard/ads/form' ) }
						className = "flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
					>
						<Plus className="size-4" /> Nueva Publicidad
					</button>
				</div>
			</div>

			{ /* ── Filters Row ── */ }
			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
				{ /* Search Input */ }
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

					<input
						id          = "ads-search"
						type        = "search"
						value       = { search }
						onChange    = { ( e ) => setSearch( e.target.value ) }
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

				{ /* Toggle Group for Estado */ }
				<ToggleGroup
					value         = { filterEstado }
					onValueChange = { setFilterEstado }
					className     = "flex items-center gap-1 rounded-xl border border-border p-1 bg-muted/20 shrink-0"
				>
					<ToggleGroupItem value="activa" className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
						<CheckCircle className="size-3.5" />
						Activa
					</ToggleGroupItem>

					<ToggleGroupItem value="inactiva" className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
						<XCircle className="size-3.5" />
						Inactiva
					</ToggleGroupItem>

					<ToggleGroupItem value="vigentes" className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
						<Images className="size-3.5" />
						Vigentes
					</ToggleGroupItem>
				</ToggleGroup>

				{ /* HeadquartersSelect for Edificios */ }
				<div className="w-full xl:w-115">
					<HeadquartersSelect
						defaultValues     = { filterEdificios }
						onSelectionChange = { handleEdificiosChange }
						placeholder       = "Todos los edificios"
						multiple          = { true }
						maxDisplayItems   = { 4 }
					/>
				</div>
			</div>

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
						filterEstado    = { filterEstado }
						filterEdificios = { filterEdificios }
					/>
				) : (
					<AdsTable
						ads             = { ads ?? [] }
						isLoading       = { isLoading }
						filterText      = { search }
						filterTipo      = { filterTipo }
						filterEstado    = { filterEstado }
						filterEdificios = { filterEdificios }
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
