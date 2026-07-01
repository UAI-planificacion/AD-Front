'use client';

import { useRouter } from 'next/navigation';

import {
	MonitorPlay,
	CheckCircle,
	Ad,
	Clock,
	CalendarDays,
} from 'lucide-react';

import { useAds }           from '@/hooks/use-ads';
import { buildKpiStats }    from '@/lib/models/ads';


export default function DashboardPage(): React.JSX.Element {
	const router = useRouter( );

    const {
        data: ads,
        isLoading,
        isError
    } = useAds( );

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


    const getTodayLocalDateString = ( ) : string => {
		const today = new Date( );

        const year  = today.getFullYear( );
		const month = String( today.getMonth( ) + 1 ).padStart( 2, '0' );
		const day   = String( today.getDate( ) ).padStart( 2, '0' );

        return `${ year }-${ month }-${ day }`;
	};


    const getFutureLocalDateString = ( daysAhead : number ) : string => {
		const date = new Date( );

        date.setDate( date.getDate( ) + daysAhead );

        const year  = date.getFullYear( );
		const month = String( date.getMonth( ) + 1 ).padStart( 2, '0' );
		const day   = String( date.getDate( ) ).padStart( 2, '0' );

        return `${ year }-${ month }-${ day }`;
	};

	const todayStr         = getTodayLocalDateString( );
	const maxFutureDateStr = getFutureLocalDateString( 3 );

	const activeCount      = ads.filter( ( a ) => a.activo ).length;
	const inactiveCount    = ads.length - activeCount;
	const activePercentage = ads.length > 0 ? Math.round( ( activeCount / ads.length ) * 100 ) : 0;

	const expiringToday    = ads.filter( ( a ) => a.activo && a.fecha_fin === todayStr ).length;
	const expiringSoon     = ads.filter( ( a ) => a.activo && a.fecha_fin > todayStr && a.fecha_fin <= maxFutureDateStr ).length;
	const scheduledCount   = ads.filter( ( a ) => a.activo && a.fecha_inicio > todayStr ).length;

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

						<p className="text-xs text-muted-foreground mt-1">
							{ `${ activeCount } activas, ${ inactiveCount } inactivas` }
						</p>
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

						<p className="text-xs text-muted-foreground mt-1">
							{ `${ activePercentage }% del total en circulación` }
						</p>
					</div>
				</div>

                { /* Card 5: Por Vencer */ }
				<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-36">
					<div className="flex items-center justify-between text-muted-foreground">
						<span className="text-sm font-medium text-foreground">Por Vencer (3 días)</span>

						<Clock className="size-4 text-muted-foreground" />
					</div>

					<div className="mt-2">
						<span className="text-3xl font-bold tracking-tight">
							{ expiringToday + expiringSoon }
						</span>

						<p className="text-xs text-muted-foreground mt-1">
							{ expiringToday === 0
								? 'Hoy no caduca ninguna'
								: expiringToday === 1
									? 'Hoy caduca 1 publicidad'
									: `Hoy caducan ${ expiringToday } publicidades`
							}
						</p>
					</div>
				</div>

				{ /* Card 6: Programadas */ }
				<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-36">
					<div className="flex items-center justify-between text-muted-foreground">
						<span className="text-sm font-medium text-foreground">Programadas</span>

						<CalendarDays className="size-4 text-muted-foreground" />
					</div>

					<div className="mt-2">
						<span className="text-3xl font-bold tracking-tight">{ scheduledCount }</span>

						<p className="text-xs text-muted-foreground mt-1">
							{ `${ scheduledCount } anuncios por iniciar a futuro` }
						</p>
					</div>
				</div>
			</div>

			{ /* ── Bottom Section ── */ }
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{ /* Column Left: Guía de Uso */ }
				<div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-6">
					<div>
						<h2 className="text-lg font-bold text-foreground">Guía de Uso de la Aplicación</h2>

						<p className="text-sm text-muted-foreground mt-0.5">
							Sigue estos pasos para gestionar tus publicidades en las pantallas verticales
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-1.5 p-4 rounded-xl border border-border/40 bg-muted/5">
							<div className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-lg bg-black text-white text-xs font-bold dark:bg-white dark:text-black">1</span>
								<h3 className="font-semibold text-foreground">Crear una Publicidad</h3>
							</div>
							<p className="text-sm text-muted-foreground pl-8">
								Sube imágenes en formato vertical (9:16) o videos de hasta 60 segundos de duración máxima.
							</p>
						</div>

						<div className="space-y-1.5 p-4 rounded-xl border border-border/40 bg-muted/5">
							<div className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-lg bg-black text-white text-xs font-bold dark:bg-white dark:text-black">2</span>
								<h3 className="font-semibold text-foreground">Configurar la Vigencia</h3>
							</div>
							<p className="text-sm text-muted-foreground pl-8">
								Define el rango de fechas en el calendario y el horario diario (ej. de 08:00 a 20:00) de proyección.
							</p>
						</div>

						<div className="space-y-1.5 p-4 rounded-xl border border-border/40 bg-muted/5">
							<div className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-lg bg-black text-white text-xs font-bold dark:bg-white dark:text-black">3</span>
								<h3 className="font-semibold text-foreground">Asignar Edificios</h3>
							</div>
							<p className="text-sm text-muted-foreground pl-8">
								Selecciona las ubicaciones y edificios de los campus donde deseas mostrar la publicidad.
							</p>
						</div>

						<div className="space-y-1.5 p-4 rounded-xl border border-border/40 bg-muted/5">
							<div className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-lg bg-black text-white text-xs font-bold dark:bg-white dark:text-black">4</span>
								<h3 className="font-semibold text-foreground">Monitoreo y Acciones</h3>
							</div>
							<p className="text-sm text-muted-foreground pl-8">
								Visualiza detalles en tiempo real, edita edificios asignados o elimina anuncios expirados desde la sección de Publicidades.
							</p>
						</div>
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
				</div>
			</div>
		</div>
	);
}
