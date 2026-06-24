'use client';

import { Suspense, useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { AdsForm }          from '../components/ads-form';
import { useAds }           from '@/hooks/use-ads';
import type { Publicidad }  from '@/lib/models/ads';


function AdFormContent() : React.JSX.Element {
	const router       = useRouter();
	const searchParams = useSearchParams();
	const idParam      = searchParams.get( 'id' );
	const adId         = idParam ? Number( idParam ) : null;

	const { data : ads, isLoading } = useAds();
	const [ ad, setAd ]             = useState<Publicidad | undefined>( undefined );

	useEffect( ( ) => {
		if ( ads && adId !== null ) {
			const foundAd = ads.find( ( a ) => a.id === adId );
			setAd( foundAd );
		}
	}, [ ads, adId ] );

	const isEdit = adId !== null;

	if ( isEdit && isLoading ) {
		return (
			<div className="p-6">
				<div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
				<div className="mt-6 h-96 animate-pulse rounded-2xl bg-muted" />
			</div>
		);
	}

	if ( isEdit && !ad && !isLoading ) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-6 py-24">
				<p className="text-lg font-semibold text-foreground">Publicidad no encontrada</p>
				<button
					id        = "ad-form-back-error"
					onClick   = { () => router.push( '/dashboard/ads' ) }
					className = "rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted cursor-pointer"
				>
					← Volver al listado
				</button>
			</div>
		);
	}

	return (
		<main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
			{ /* ── Header ── */ }
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-black tracking-tight text-foreground">
						{ isEdit ? '✏️ Editar Publicidad' : '➕ Nueva Publicidad' }
					</h1>
					<p className="text-sm text-muted-foreground">
						{ isEdit ? (
							<>
								<span className="font-semibold text-foreground">{ ad?.nombre }</span>
								{ ' ' }— Modifica los campos que estimes conveniente
							</>
						) : (
							'Completa el formulario para crear una nueva publicidad'
						) }
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						id        = "ad-form-back-btn"
						onClick   = { () => router.push( '/dashboard/ads' ) }
						className = "flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
					>
						<ArrowLeft className="size-4" /> Volver
					</button>
				</div>
			</header>

			<AdsForm mode = { isEdit ? 'edit' : 'create' } initialData = { ad } />
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
