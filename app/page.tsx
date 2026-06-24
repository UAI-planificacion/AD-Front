
'use client';

import React                 from 'react';
import { useRouter }         from 'next/navigation';
import { 
	LayoutDashboard, 
	Tv, 
	UploadCloud, 
	CalendarDays, 
	Clock, 
	ShieldCheck, 
	ArrowRight,
	Sparkles,
    Ad
}                            from 'lucide-react';

export default function Home() : React.JSX.Element {
	const router = useRouter( );

	return (
		<div className="relative min-h-[calc(100vh-10rem)] flex flex-col justify-between overflow-hidden bg-background text-foreground">
			{ /* Background decorative glows */ }
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

			<main className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center">
				<div className="grid gap-12 lg:grid-cols-12 items-center">
					{ /* Hero Text Left */ }
					<div className="lg:col-span-7 flex flex-col gap-6 text-left">
						<div className="inline-flex items-center gap-2 self-start rounded-full border border-border/60 bg-muted/30 px-3.5 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-xs select-none">
							<Sparkles className="size-3 text-primary animate-pulse" />
							<span>Plataforma Oficial de Gestión UAI</span>
						</div>

						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
							Controla tus <br className="hidden sm:block" />
							<span className="bg-linear-to-r from-primary to-zinc-500 bg-clip-text text-transparent">
								Publicidades
							</span> con precisión.
						</h1>

						<p className="text-base sm:text-lg text-muted-foreground max-w-xl">
							Sube, programa y segmenta el material informativo de las pantallas universitarias. Administra periodos de vigencia exactos y ubicaciones específicas en todos los campus de la Universidad Adolfo Ibáñez.
						</p>

						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
							<button
								id        = "landing-hero-primary-btn"
								onClick   = { ( ) => router.push( '/dashboard' ) }
								className = "flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
							>
								<LayoutDashboard className="size-4" /> Ir al Dashboard <ArrowRight className="size-4" />
							</button>
						</div>
					</div>

					{ /* Visual Graphics Right */ }
					<div className="lg:col-span-5 flex flex-col gap-6">
						{ /* Decorative Preview Grid */ }
						<div className="relative rounded-2xl border border-border/80 bg-card/40 p-5 shadow-xl backdrop-blur-md">
							<div className="absolute -top-3 -right-3 size-12 rounded-xl bg-primary/10 blur-xl pointer-events-none" />

							<div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
								<div className="flex items-center gap-2">
									<div className="size-2.5 rounded-full bg-destructive/60" />
									<div className="size-2.5 rounded-full bg-yellow-500/60" />
									<div className="size-2.5 rounded-full bg-emerald-500/60" />
								</div>
								<span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Publicidades Activas</span>
							</div>

							<div className="grid grid-cols-5 gap-3">
								{ /* Ad Card 1 */ }
								<div className="relative rounded-xl border border-border overflow-hidden h-36 group bg-muted/10">
									<img
										src       = "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80"
										alt       = "Campaña Talleres"
										className = "absolute inset-0 size-full object-cover opacity-80 transition-transform group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-between p-2.5">
										<Ad className="size-4 text-white drop-shadow-md" />
										<div className="text-left">
											<p className="text-[9px] font-bold text-white leading-tight drop-shadow-md truncate">Talleres 2026</p>
											<p className="text-[7px] text-zinc-300 drop-shadow-xs">Peñalolén</p>
										</div>
									</div>
								</div>

								{ /* Ad Card 2 */ }
								<div className="relative rounded-xl border border-border overflow-hidden h-36 group bg-muted/10">
									<img
										src       = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80"
										alt       = "Bienvenida UAI"
										className = "absolute inset-0 size-full object-cover opacity-80 transition-transform group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-between p-2.5">
										<Ad className="size-4 text-white drop-shadow-md" />
										<div className="text-left">
											<p className="text-[9px] font-bold text-white leading-tight drop-shadow-md truncate">Bienvenida 2026</p>
											<p className="text-[7px] text-zinc-300 drop-shadow-xs">Todas las sedes</p>
										</div>
									</div>
								</div>

								{ /* Ad Card 3 */ }
								<div className="relative rounded-xl border border-border overflow-hidden h-36 group bg-muted/10">
									<img
										src       = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80"
										alt       = "Postgrados UAI"
										className = "absolute inset-0 size-full object-cover opacity-80 transition-transform group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-between p-2.5">
										<Ad className="size-4 text-white drop-shadow-md" />
										<div className="text-left">
											<p className="text-[9px] font-bold text-white leading-tight drop-shadow-md truncate">Admisión 2026</p>
											<p className="text-[7px] text-zinc-300 drop-shadow-xs">Vitacura</p>
										</div>
									</div>
								</div>

								{ /* Ad Card 4 (Destacado/Activo animado) */ }
								<div className="relative rounded-xl border border-primary/40 overflow-hidden h-36 group shadow-inner ring-1 ring-primary/20">
									<img
										src       = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80"
										alt       = "Charlas UAI"
										className = "absolute inset-0 size-full object-cover opacity-90 transition-transform group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-between p-2.5">
										<div className="flex justify-between items-start">
											<Ad className="size-4 text-primary animate-pulse drop-shadow-md" />
											<span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
										</div>
										<div className="text-left">
											<p className="text-[9px] font-bold text-white leading-tight drop-shadow-md truncate">Charla Liderazgo</p>
											<p className="text-[7px] text-primary font-semibold drop-shadow-xs">En vivo</p>
										</div>
									</div>
								</div>

								{ /* Ad Card 5 */ }
								<div className="relative rounded-xl border border-border overflow-hidden h-36 group bg-muted/10">
									<img
										src       = "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=300&q=80"
										alt       = "Biblioteca"
										className = "absolute inset-0 size-full object-cover opacity-80 transition-transform group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-between p-2.5">
										<Ad className="size-4 text-white drop-shadow-md" />
										<div className="text-left">
											<p className="text-[9px] font-bold text-white leading-tight drop-shadow-md truncate">Horarios Biblio</p>
											<p className="text-[7px] text-zinc-300 drop-shadow-xs">Viña del Mar</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{ /* Small dynamic stats bar */ }
						<div className="grid grid-cols-2 gap-4">
							<div className="rounded-xl border border-border/50 bg-card/30 p-3 flex items-center gap-3">
								<div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
									<ShieldCheck className="size-4" />
								</div>
								<div className="text-left">
									<p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Estado Servidor</p>
									<p className="text-xs font-bold text-foreground">Operativo (100%)</p>
								</div>
							</div>

							<div className="rounded-xl border border-border/50 bg-card/30 p-3 flex items-center gap-3">
								<div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
									<Tv className="size-4" />
								</div>
								<div className="text-left">
									<p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Sedes Activas</p>
									<p className="text-xs font-bold text-foreground">Sedes Conectadas</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{ /* Features Grid Section */ }
				<div className="mt-16 sm:mt-24 border-t border-border/50 pt-12 sm:pt-16">
					<h2 className="text-2xl font-black text-center mb-10 tracking-tight">Capacidades del Sistema</h2>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<div className="rounded-2xl border border-border bg-card/30 p-5 hover:bg-card/50 transition-colors">
							<UploadCloud className="size-6 text-primary mb-3" />
							<h3 className="font-bold text-sm mb-1.5">Subida Optimizada</h3>
							<p className="text-xs text-muted-foreground">Soporte completo de imágenes y videos adaptados a la proporción vertical de tótems universitarios.</p>
						</div>

						<div className="rounded-2xl border border-border bg-card/30 p-5 hover:bg-card/50 transition-colors">
							<CalendarDays className="size-6 text-primary mb-3" />
							<h3 className="font-bold text-sm mb-1.5">Periodo de Vigencia</h3>
							<p className="text-xs text-muted-foreground">Programa rangos de fechas exactos evitando la visualización de contenido obsoleto en los campus.</p>
						</div>

						<div className="rounded-2xl border border-border bg-card/30 p-5 hover:bg-card/50 transition-colors">
							<Clock className="size-6 text-primary mb-3" />
							<h3 className="font-bold text-sm mb-1.5">Horarios Flexibles</h3>
							<p className="text-xs text-muted-foreground">Configura rangos de horas de emisión diarios con precisión de minutos para audiencias específicas.</p>
						</div>

						<div className="rounded-2xl border border-border bg-card/30 p-5 hover:bg-card/50 transition-colors">
							<Tv className="size-6 text-primary mb-3" />
							<h3 className="font-bold text-sm mb-1.5">Distribución Modular</h3>
							<p className="text-xs text-muted-foreground">Selecciona individualmente los edificios y sedes donde deseas emitir cada campaña informativa.</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
