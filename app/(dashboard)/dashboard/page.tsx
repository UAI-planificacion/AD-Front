'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
	MonitorPlay,
	CheckCircle,
	Building2,
	Timer,
	Eye,
	X,
	BookOpen,
    Ad,
} from 'lucide-react';

import { useAds }           from '@/hooks/use-ads';
import { buildKpiStats }    from '@/lib/models/ads';


export default function DashboardPage(): React.JSX.Element {
	const router                            = useRouter();
	const { data: ads, isLoading, isError } = useAds();
	const [ showGuide, setShowGuide ]       = useState( false );

	if ( isLoading ) {
		return (
			<div className="flex min-h-[calc(100vh-10rem)] flex-col gap-8 p-6 bg-background text-foreground max-w-7xl mx-auto">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
						<div className="h-4 w-72 animate-pulse rounded-lg bg-muted" />
					</div>

					<div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{ Array.from( { length : 4 } ).map( ( _, i ) => (
						<div key = { i } className="h-32 animate-pulse rounded-2xl bg-muted" />
					) ) }
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col">
						<div className="space-y-2">
							<div className="h-6 w-48 animate-pulse rounded-lg bg-muted" />
							<div className="h-4 w-64 animate-pulse rounded-lg bg-muted" />
						</div>

						<div className="mt-6 flex flex-col divide-y divide-border/50">
							{ Array.from( { length : 4 } ).map( ( _, i ) => (
								<div key = { i } className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
									<div className="flex flex-col gap-2">
										<div className="h-4 w-48 animate-pulse rounded-lg bg-muted" />
										<div className="flex items-center gap-2">
											<div className="h-4 w-12 animate-pulse rounded-full bg-muted" />
											<div className="h-3.5 w-24 animate-pulse rounded-lg bg-muted" />
										</div>
									</div>

									<div className="h-4 w-10 animate-pulse rounded-lg bg-muted" />
								</div>
							))}
						</div>
					</div>

					<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between gap-6">
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="h-6 w-60 animate-pulse rounded-lg bg-muted" />
								<div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
							</div>

							<div className="space-y-3">
								<div className="h-3 w-40 animate-pulse rounded-lg bg-muted" />

								<div className="space-y-2">
									{ Array.from( { length : 5 } ).map( ( _, i ) => (
										<div key = { i } className="flex items-center gap-2">
											<div className="h-3 w-3 animate-pulse rounded-full bg-muted shrink-0" />
											<div className = { `h-4 animate-pulse rounded-lg bg-muted ${
												i === 0 ? 'w-4/5' :
												i === 1 ? 'w-3/4' :
												i === 2 ? 'w-2/3' :
												i === 3 ? 'w-1/2' : 'w-5/6'
											}` } />
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
					</div>
				</div>
			</div>
		);
	}

	if ( isError || !ads ) {
		return (
			<div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 p-6 bg-background">
				<p className="text-sm font-semibold text-destructive">
					No se pudieron cargar los datos del dashboard
				</p>
			</div>
		);
	}

	const stats = buildKpiStats( ads );

	const recentAds = [ ...ads ]
		.sort( ( a, b ) => new Date( b.fecha_creacion ).getTime() - new Date( a.fecha_creacion ).getTime() )
		.slice( 0, 4 );

	return (
		<div className="flex min-h-[calc(100vh-10rem)] flex-col gap-8 p-6 bg-background text-foreground max-w-7xl mx-auto">
			{ /* ── Header ── */ }
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

					<p className="text-sm text-muted-foreground mt-1">
						Gestiona tus publicidades para pantallas verticales
					</p>
				</div>

				<button
					id        = "dashboard-create-ad"
					onClick   = { () => router.push( '/dashboard/ads' ) }
					className = "flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
				>
					<Ad className="size-4" />Publicidades
				</button>
			</div>

			{ /* ── KPI Grid ── */ }
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{ /* Card 1: Total */ }
				<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-36">
					<div className="flex items-center justify-between text-muted-foreground">
						<span className="text-sm font-medium text-foreground">Total Publicidades</span>

						<MonitorPlay className="size-4 text-muted-foreground" />
					</div>

					<div className="mt-2">
						<span className="text-3xl font-bold tracking-tight">{ stats.total }</span>

						<p className="text-xs text-muted-foreground mt-1">+2 desde el mes pasado</p>
					</div>
				</div>

				{ /* Card 2: Activas */ }
				<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-36">
					<div className="flex items-center justify-between text-muted-foreground">
						<span className="text-sm font-medium text-foreground">Publicidades Activas</span>

						<CheckCircle className="size-4 text-muted-foreground" />
					</div>

					<div className="mt-2">
						<span className="text-3xl font-bold tracking-tight">{ stats.activas }</span>

						<p className="text-xs text-muted-foreground mt-1">-1 desde la semana pasada</p>
					</div>
				</div>

				{ /* Card 3: Edificios */ }
				<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-36">
					<div className="flex items-center justify-between text-muted-foreground">
						<span className="text-sm font-medium text-foreground">Edificios Cubiertos</span>

						<Building2 className="size-4 text-muted-foreground" />
					</div>

					<div className="mt-2">
						<span className="text-3xl font-bold tracking-tight">{ stats.edificiosCubiertos }</span>

						<p className="text-xs text-muted-foreground mt-1">+1 desde el mes pasado</p>
					</div>
				</div>

				{ /* Card 4: Tiempo Promedio */ }
				<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-36">
					<div className="flex items-center justify-between text-muted-foreground">
						<span className="text-sm font-medium text-foreground">Tiempo Promedio</span>

						<Timer className="size-4 text-muted-foreground" />
					</div>

					<div className="mt-2">
						<span className="text-3xl font-bold tracking-tight">{ stats.duracionPromedio }s</span>

						<p className="text-xs text-muted-foreground mt-1">+2s desde el mes pasado</p>
					</div>
				</div>
			</div>

			{ /* ── Bottom Section ── */ }
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{ /* Column Left: Publicidades Recientes */ }
				<div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col">
					<div>
						<h2 className="text-lg font-bold text-foreground">Publicidades Recientes</h2>

						<p className="text-sm text-muted-foreground mt-0.5">
							Las últimas publicidades agregadas al sistema
						</p>
					</div>

					<div className="mt-6 flex flex-col divide-y divide-border/50">
						{ recentAds.length === 0 ? (
							<p className="text-sm text-muted-foreground py-6 text-center">
								No hay publicidades registradas.
							</p>
						) : (
							recentAds.map( ( ad ) => (
								<div key = { ad.id } className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
									<div className="flex flex-col gap-1.5">
										<span className="text-sm font-semibold text-foreground">{ ad.nombre }</span>

										<div className="flex items-center gap-2">
											{ ad.activo ? (
												<span className="rounded-full bg-black text-white px-2.5 py-0.5 text-[10px] font-bold dark:bg-white dark:text-black">
													Activa
												</span>
											) : (
												<span className="rounded-full bg-zinc-100 text-zinc-500 px-2.5 py-0.5 text-[10px] font-bold dark:bg-zinc-800 dark:text-zinc-400">
													Inactiva
												</span>
											) }

											<span className="text-xs text-muted-foreground">
												{ ad.tipo === 'video' ? 'Video' : 'Imagen' } • { ad.duracion }s
											</span>
										</div>
									</div>

									<button
										id        = { `recent-view-${ ad.id }` }
										onClick   = { () => router.push( `/dashboard/ads/${ ad.id }` ) }
										className = "flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
									>
										<Eye className="size-3.5" /> Ver
									</button>
								</div>
							) )
						) }
					</div>
				</div>

				{ /* Column Right: Recomendaciones */ }
				<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between gap-6">
					<div className="space-y-4">
						<div>
							<h2 className="text-lg font-bold text-foreground">Recomendaciones para publicidades</h2>

							<p className="text-sm text-muted-foreground mt-0.5">
								Las publicidades se mostrarán en el 20% derecho de la pantalla.
							</p>
						</div>

						<div className="space-y-3">
							<p className="text-xs font-bold text-foreground uppercase tracking-wider">
								Proporciones recomendadas:
							</p>

							<ul className="space-y-2 text-sm text-muted-foreground">
								<li className="flex items-start gap-2">
									<span>•</span>

									<span>Relación de aspecto: 9:16 (vertical)</span>
								</li>

								<li className="flex items-start gap-2">
									<span>•</span>

									<span>Resolución mínima: 1080x1920 px</span>
								</li>

								<li className="flex items-start gap-2">
									<span>•</span>

									<span>Formatos de imagen: JPG, PNG</span>
								</li>

								<li className="flex items-start gap-2">
									<span>•</span>

									<span>Formatos de video: MP4, WebM</span>
								</li>

								<li className="flex items-start gap-2">
									<span>•</span>

									<span>Duración máxima de videos: 60 segundos</span>
								</li>
							</ul>
						</div>
					</div>

					<button
						id        = "view-guide-btn"
						onClick   = { () => setShowGuide( true ) }
						className = "w-full rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 cursor-pointer"
					>
						Ver guía completa
					</button>
				</div>
			</div>

			{ /* ── Guide Modal ── */ }
			{ showGuide && (
				<div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
					<div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl flex flex-col gap-4 text-foreground">
						<button
							onClick   = { () => setShowGuide( false ) }
							className = "absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
							aria-label = "Cerrar guía"
						>
							<X className="size-5" />
						</button>

						<div className="flex items-center gap-2 mt-2">
							<BookOpen className="size-5 text-primary" />

							<h3 className="text-lg font-bold">Guía de Uso de la Aplicación</h3>
						</div>

						<div className="mt-2 space-y-4 text-sm text-muted-foreground">
							<div className="space-y-1">
								<p className="font-semibold text-foreground">1. Crear una Publicidad</p>

								<p>
									Haz clic en el botón <strong>&quot;Nueva Publicidad&quot;</strong>. Sube una imagen de aspecto vertical (9:16) o un video de hasta 60 segundos de duración.
								</p>
							</div>

							<div className="space-y-1">
								<p className="font-semibold text-foreground">2. Configurar la Vigencia</p>

								<p>
									Define el rango de fechas en el calendario y el horario diario (ej. de 08:00 a 20:00) en el que se proyectará el anuncio en las pantallas.
								</p>
							</div>

							<div className="space-y-1">
								<p className="font-semibold text-foreground">3. Asignar Edificios</p>

								<p>
									Selecciona las ubicaciones y edificios de los campus donde deseas mostrar la publicidad utilizando el selector de sedes.
								</p>
							</div>

							<div className="space-y-1">
								<p className="font-semibold text-foreground">4. Monitoreo y Acciones</p>

								<p>
									En la sección de Publicidades podrás ver el listado completo, ver detalles de visualización, editar los edificios asignados o eliminar anuncios expirados.
								</p>
							</div>
						</div>

						<button
							onClick   = { () => setShowGuide( false ) }
							className = "mt-4 w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
						>
							Entendido
						</button>
					</div>
				</div>
			) }
		</div>
	);
}
