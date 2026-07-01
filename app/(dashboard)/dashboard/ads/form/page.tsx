'use client';

import { Suspense, useState, useEffect }    from 'react';
import { useRouter, useSearchParams }       from 'next/navigation';

import { ArrowLeft, Save }            from 'lucide-react';

import { AdsForm }          from '../components/ads-form';
import { useAds }           from '@/hooks/use-ads';
import type { Publicidad }  from '@/lib/models/ads';
import { ConfirmDialog }    from '@/components/shared/ConfirmDialog';
import { cn }               from '@/lib/utils';


function AdFormContent() : React.JSX.Element {
	const router       = useRouter( );
	const searchParams = useSearchParams( );
	const idParam      = searchParams.get( 'id' );
	const adId         = idParam ? Number( idParam ) : null;
	const modeParam    = searchParams.get( 'mode' );
	const isVigent     = modeParam !== 'historicos';

	const { data : ads, isLoading } = useAds( isVigent );
	const [ ad, setAd ]             = useState<Publicidad | undefined>( undefined );

	const [ isDirty, setIsDirty ]             = useState( false );
	const [ isPending, setIsPending ]         = useState( false );
	const [ showConfirm, setShowConfirm ]     = useState( false );
	const [ pendingAction, setPendingAction ] = useState<( ( ) => void ) | null>( null );

	useEffect( ( ) => {
		if ( ads && adId !== null ) {
			const foundAd = ads.find( ( a ) => a.id === adId );

            setAd( foundAd );
		}
	}, [ ads, adId ] );

	useEffect( ( ) => {
		if ( !isDirty ) return;

		const handleBeforeUnload = ( e : BeforeUnloadEvent ) => {
			e.preventDefault( );
			e.returnValue = '';
		};

		window.addEventListener( 'beforeunload', handleBeforeUnload );
		return ( ) => {
			window.removeEventListener( 'beforeunload', handleBeforeUnload );
		};
	}, [ isDirty ] );

	useEffect( ( ) => {
		if ( !isDirty ) return;

		const handleKeyDown = ( e : KeyboardEvent ) => {
			const isF5 = e.key === 'F5';
			const isCtrlR = e.ctrlKey && ( e.key === 'r' || e.key === 'R' );

			if ( isF5 || isCtrlR ) {
				e.preventDefault( );
				setPendingAction( ( ) => ( ) => window.location.reload( ) );
				setShowConfirm( true );
			}
		};

		window.addEventListener( 'keydown', handleKeyDown );
		return ( ) => {
			window.removeEventListener( 'keydown', handleKeyDown );
		};
	}, [ isDirty ] );

	const isEdit = adId !== null;

	function handleBackClick( ) : void {
		if ( isDirty ) {
			setPendingAction( ( ) => ( ) => router.back( ) );
			setShowConfirm( true );
		} else {
			router.back( );
		}
	}

	if ( isEdit && isLoading ) {
		return (
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 animate-pulse">
				{ /* ── Header Skeleton ── */ }
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
					<div className="space-y-2">
						<div className="h-9 w-64 rounded-lg bg-muted" />
						<div className="h-4 w-80 rounded-lg bg-muted" />
					</div>
					<div className="h-10 w-24 rounded-xl bg-muted" />
				</header>

				{ /* ── Content Grid Skeleton ── */ }
				<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
					{ /* Columna Izquierda: Form Fields */ }
					<div className="flex flex-col gap-6">
						{ /* Nombre */ }
						<div className="space-y-2">
							<div className="h-4 w-36 rounded bg-muted" />
							<div className="h-11 w-full rounded-xl bg-muted" />
						</div>

						{ /* Periodo de vigencia card */ }
						<div className="rounded-2xl border border-border bg-card/30 p-5 space-y-4">
							<div className="h-4 w-40 rounded bg-muted" />
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<div className="h-4 w-28 rounded bg-muted" />
									<div className="h-11 w-full rounded-xl bg-muted" />
								</div>
								<div className="space-y-2">
									<div className="h-4 w-32 rounded bg-muted" />
									<div className="h-11 w-full rounded-xl bg-muted" />
								</div>
							</div>
						</div>

						{ /* Sedes */ }
						<div className="space-y-2">
							<div className="h-4 w-44 rounded bg-muted" />
							<div className="h-11 w-full rounded-xl bg-muted" />
						</div>

						{ /* Duración */ }
						<div className="space-y-4">
							<div className="h-4 w-36 rounded bg-muted" />
							<div className="h-2 w-full rounded-full bg-muted" />
							<div className="flex justify-between">
								<div className="h-3 w-4 rounded bg-muted" />
								<div className="h-3 w-6 rounded bg-muted" />
								<div className="h-3 w-6 rounded bg-muted" />
							</div>
						</div>
					</div>

					{ /* Columna Derecha: Preview & Summary */ }
					<div className="flex flex-col gap-6">
						{ /* Vista previa card */ }
						<div className="rounded-2xl border border-border bg-card/30 p-5 space-y-4">
							<div className="h-4 w-36 rounded bg-muted" />
							<div className="h-[380px] w-full rounded-xl bg-muted" />
						</div>

						{ /* Resumen card */ }
						<div className="rounded-2xl border border-border bg-card/30 p-5 space-y-4">
							<div className="h-4 w-20 rounded bg-muted" />
							<div className="space-y-3">
								<div className="flex justify-between"><div className="h-4 w-16 rounded bg-muted" /><div className="h-4 w-28 rounded bg-muted" /></div>
								<div className="flex justify-between"><div className="h-4 w-12 rounded bg-muted" /><div className="h-4 w-16 rounded bg-muted" /></div>
								<div className="flex justify-between"><div className="h-4 w-16 rounded bg-muted" /><div className="h-4 w-12 rounded bg-muted" /></div>
								<div className="flex justify-between"><div className="h-4 w-12 rounded bg-muted" /><div className="h-4 w-8 rounded bg-muted" /></div>
							</div>
							<div className="h-11 w-full rounded-xl bg-muted" />
							<div className="h-10 w-full rounded-xl bg-muted" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if ( isEdit && !ad && !isLoading ) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-6 py-24">
				<p className="text-lg font-semibold text-foreground">Publicidad no encontrada</p>
				<button
					id        = "ad-form-back-error"
					onClick   = { router.back }
					className = "flex items-center gap-2 cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
				>
					<ArrowLeft className="size-4" />
					Volver al listado
				</button>
			</div>
		);
	}

	return (
		<main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
			{ /* ── Header ── */ }
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
						<Save className="size-8" />

						<span>{ isEdit ? 'Editar Publicidad' : 'Nueva Publicidad' }</span>

						{ isEdit && ad && (
							<span className = { cn(
								"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none",
								ad.activo
									? "bg-black text-white dark:bg-white dark:text-black"
									: "bg-muted text-muted-foreground"
							) } >
								{ ad.activo ? 'Activa' : 'Inactiva' }
							</span>
						) }
					</h1>

					<p className="text-sm text-muted-foreground mt-1">
						{ isEdit ? (
							'Modifica los campos que estimes conveniente'
						) : (
							'Completa el formulario para crear una nueva publicidad'
						) }
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						id        = "ad-form-back-btn"
						onClick   = { handleBackClick }
						className = "flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
					>
						<ArrowLeft className="size-4" /> Volver
					</button>

					<button
						id        = "ad-form-submit-btn"
						type      = "submit"
						form      = "ads-form"
						disabled  = { isPending }
						className = "flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer disabled:opacity-50"
					>
						{ isPending
                            ? ( isEdit
                                ? 'Guardando…'
                                : 'Creando…'
                            )
                            : ( isEdit
                                ? <><Save className="size-4" /> Guardar</>
                                : <><Save className="size-4" /> Crear publicidad</>
                            )
                        }
					</button>
				</div>
			</header>

			<AdsForm
				mode            = { isEdit ? 'edit' : 'create' }
				initialData     = { ad }
				onDirtyChange   = { setIsDirty }
				onPendingChange = { setIsPending }
			/>

			<ConfirmDialog
				isOpen    = { showConfirm }
				title     = "Descartar cambios"
				message   = "Tienes cambios sin guardar en el formulario. ¿Estás seguro de que deseas salir sin guardar?"
				variant   = "destructive"
				onConfirm = { ( ) => {
					setShowConfirm( false );
					if ( pendingAction ) pendingAction( );
				} }
				onClose   = { ( ) => setShowConfirm( false ) }
			/>
		</main>
	);
}


export default function NuevaAdPage() : React.JSX.Element {
	return (
		<Suspense fallback = {
			<div className="p-6">
				<div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
				<div className="mt-6 h-96 animate-pulse rounded-2xl bg-muted" />
			</div>
		} >
			<AdFormContent />
		</Suspense>
	);
}
