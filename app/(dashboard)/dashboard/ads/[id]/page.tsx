'use client';

import { useMemo, useState, type JSX } from 'react';
import { useParams, useRouter }       from 'next/navigation';
import {
	ArrowLeft,
	Pencil,
	Trash2,
	Clock,
	Calendar,
	Building2,
	Image as ImageIcon,
	Video,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAds, useDeleteAd } from '@/hooks/use-ads';
import { ConfirmDialog }       from '@/components/shared/ConfirmDialog';



const CAMPUS_MAPPING = [
	{
		name		: 'Peñalolén',
		buildings	: [ 1, 2, 3, 4, 5, 6 ],
	},
	{
		name		: 'Errázuriz',
		buildings	: [ 7 ],
	},
	{
		name		: 'Vitacura',
		buildings	: [ 8 ],
	},
	{
		name		: 'Viña del Mar',
		buildings	: [ 9, 10, 11, 12, 13, 14 ],
	},
];

function getCampusesForBuildings( buildings : number[] ) : string[] {
	const campusNames : string[] = [];
	CAMPUS_MAPPING.forEach( ( campus ) => {
		if ( campus.buildings.some( ( id ) => buildings.includes( id ) ) ) {
			campusNames.push( campus.name );
		}
	} );
	return campusNames;
}

function formatDate( dateStr : string ) : string {
	return new Date( dateStr ).toLocaleDateString( 'es-CL', {
		day		: '2-digit',
		month	: '2-digit',
		year	: 'numeric',
	} );
}


export default function AdDetailPage() : React.JSX.Element {
	const { id }   = useParams<{ id : string }>( );
	const router   = useRouter( );
	const adId     = Number( id );

	const { data : ads, isLoading } = useAds( );
	const deleteMutation           = useDeleteAd( );

	const ad = ads?.find( ( a ) => a.id === adId );


	const [ showDeleteConfirm, setShowDeleteConfirm ] = useState( false );


	function handleDelete( ) : void {
		setShowDeleteConfirm( true );
	}


	function handleConfirmDelete( ) : void {
		if ( !ad ) return;
		setShowDeleteConfirm( false );

		deleteMutation.mutate( adId, {
			onSuccess : ( ) => {
				toast.success( 'Publicidad eliminada' );
				router.push( '/dashboard/ads' );
			},
			onError : ( ) => toast.error( 'Error al eliminar' ),
		} );
	}


	if ( isLoading ) {
		return (
			<div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto bg-background text-foreground animate-pulse">
				{ /* ── Header Skeleton ── */ }
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
					<div className="space-y-2">
						<div className="h-9 w-64 rounded-lg bg-muted" />
						<div className="h-4 w-80 rounded-lg bg-muted" />
					</div>
					<div className="flex items-center gap-3">
						<div className="h-10 w-24 rounded-xl bg-muted" />
						<div className="h-10 w-24 rounded-xl bg-muted" />
					</div>
				</div>

				{ /* ── Content Grid Skeleton ── */ }
				<div className="grid gap-6 lg:grid-cols-[1fr_380px]">
					{ /* Columna Izquierda: Detalles del Anuncio */ }
					<div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
						{ /* Titulo y Estado */ }
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<div className="h-7 w-72 rounded bg-muted" />
								<div className="h-3.5 w-40 rounded bg-muted" />
							</div>
							<div className="h-6 w-16 rounded-full bg-muted" />
						</div>

						<hr className="border-border/50" />

						{ /* Tipo y Duración */ }
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="space-y-2.5">
								<div className="h-3 w-12 rounded bg-muted" />
								<div className="h-5 w-24 rounded bg-muted" />
							</div>
							<div className="space-y-2.5">
								<div className="h-3.5 w-16 rounded bg-muted" />
								<div className="h-5 w-28 rounded bg-muted" />
							</div>
						</div>

						<hr className="border-border/50" />

						{ /* Periodo de vigencia */ }
						<div className="space-y-3">
							<div className="h-3.5 w-36 rounded bg-muted" />
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="h-5 w-48 rounded bg-muted" />
								<div className="h-5 w-32 rounded bg-muted" />
							</div>
						</div>

						<hr className="border-border/50" />

						{ /* Sedes asignadas */ }
						<div className="space-y-3">
							<div className="h-3.5 w-32 rounded bg-muted" />
							<div className="flex gap-1.5">
								<div className="h-6 w-28 rounded-lg bg-muted" />
								<div className="h-6 w-24 rounded-lg bg-muted" />
							</div>
						</div>

						<hr className="border-border/50" />

						{ /* Detalles técnicos */ }
						<div className="space-y-3">
							<div className="h-3.5 w-32 rounded bg-muted" />
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
								<div className="space-y-1.5"><div className="h-3.5 w-24 rounded bg-muted" /><div className="h-4 w-16 rounded bg-muted" /></div>
								<div className="space-y-1.5"><div className="h-3.5 w-20 rounded bg-muted" /><div className="h-4 w-20 rounded bg-muted" /></div>
								<div className="space-y-1.5"><div className="h-3.5 w-16 rounded bg-muted" /><div className="h-4 w-12 rounded bg-muted" /></div>
								<div className="space-y-1.5"><div className="h-3.5 w-24 rounded bg-muted" /><div className="h-4 w-20 rounded bg-muted" /></div>
								<div className="space-y-1.5"><div className="h-3.5 w-32 rounded bg-muted" /><div className="h-4 w-20 rounded bg-muted" /></div>
							</div>
						</div>

						<hr className="border-border/50 mt-4" />

						{ /* Acciones de Fondo */ }
						<div className="flex justify-end">
							<div className="h-10 w-28 rounded-xl bg-muted" />
						</div>
					</div>

					{ /* Columna Derecha: Vista Previa */ }
					<div className="flex flex-col h-full">
						<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-4 flex-1">
							<div className="space-y-2">
								<div className="h-6 w-28 rounded bg-muted" />
								<div className="h-3.5 w-52 rounded bg-muted" />
							</div>
							<div className="rounded-xl border border-border bg-muted/20 flex-1 min-h-[350px]" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if ( !ad ) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-6 py-24">
				<p className="text-lg font-semibold text-foreground">Publicidad no encontrada</p>
				<button
					id        = "ad-detail-back"
					// onClick   = { ( ) => router.push( '/dashboard/ads' ) }
					onClick   = { router.back }
					className = "rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
				>
					← Volver al listado
				</button>
			</div>
		);
	}

	const isVideo = ad.archivo_tipo.startsWith( 'video' );

	return (
		<div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto bg-background text-foreground">
			{ /* ── Header ── */ }
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Detalle de Publicidad</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Ver y gestionar los detalles de esta publicidad
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						id        = "ad-detail-back"
						onClick   = { ( ) => router.push( '/dashboard/ads' ) }
						className = "flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 cursor-pointer"
					>
						<ArrowLeft className="size-4" /> Volver
					</button>

					<button
						id        = "ad-detail-edit"
						onClick   = { ( ) => router.push( `/dashboard/ads/form?id=${ ad.id }` ) }
						className = "flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
					>
						<Pencil className="size-4" /> Editar
					</button>
				</div>
			</div>

			{ /* ── Dos Columnas de Contenido ── */ }
			<div className="grid gap-6 lg:grid-cols-[1fr_380px]">
				{ /* ── Columna Izquierda: Detalles del Anuncio ── */ }
				<div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
					<div className="flex items-start justify-between">
						<div>
							<h2 className="text-2xl font-bold tracking-tight text-foreground">{ ad.nombre }</h2>
							<p className="text-xs text-muted-foreground mt-1">
								Creada el { formatDate( ad.fecha_creacion ) }
							</p>
						</div>

						<span className = { `inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white ${
							ad.activo ? 'bg-black dark:bg-white dark:text-black' : 'bg-zinc-400 dark:bg-zinc-600'
						}` } >
							{ ad.activo ? 'Activa' : 'Inactiva' }
						</span>
					</div>

					<hr className="border-border/50" />

					{ /* Tipo y Duración */ }
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</span>
							<div className="flex items-center gap-2 text-sm font-medium text-foreground">
								{ ad.tipo === 'video' ? (
									<>
										<Video className="size-4 text-muted-foreground" /> Video
									</>
								) : (
									<>
										<ImageIcon className="size-4 text-muted-foreground" /> Imagen
									</>
								) }
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duración</span>
							<div className="flex items-center gap-2 text-sm font-medium text-foreground">
								<Clock className="size-4 text-muted-foreground" /> { ad.duracion } segundos
							</div>
						</div>
					</div>

					<hr className="border-border/50" />

					{ /* Periodo de vigencia */ }
					<div className="flex flex-col gap-3">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Periodo de vigencia</span>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-foreground font-medium">
							<div className="flex items-center gap-2">
								<Calendar className="size-4 text-muted-foreground" />
								<span>{ formatDate( ad.fecha_inicio ) } - { formatDate( ad.fecha_fin ) }</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="size-4 text-muted-foreground" />
								<span>{ ad.hora_inicio.slice( 0, 5 ) } - { ad.hora_fin.slice( 0, 5 ) }</span>
							</div>
						</div>
					</div>

					<hr className="border-border/50" />

					{ /* Sedes asignadas */ }
					<div className="flex flex-col gap-3">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sedes asignadas</span>
						<div className="flex flex-wrap gap-1.5">
							{ getCampusesForBuildings( ad.edificios ).map( ( name ) => (
								<span
									key       = { name }
									className = "inline-flex items-center rounded-lg border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground"
								>
									{ name }
								</span>
							) ) }
						</div>
					</div>

					<hr className="border-border/50" />

					{ /* Detalles técnicos */ }
					<div className="flex flex-col gap-3">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalles técnicos</span>
						<dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
							{ [
								{
									label	: 'Tipo de archivo',
									value	: ad.archivo_tipo,
								},
								{
									label	: 'Dimensiones',
									value	: ad.archivo_dimensiones,
								},
								{
									label	: 'Tamaño',
									value	: `${ ad.archivo_tamano.toFixed( 2 ) } MB`,
								},
								{
									label	: 'Fecha de subida',
									value	: formatDate( ad.fecha_creacion ),
								},
								{
									label	: 'Última modificación',
									value	: formatDate( ad.fecha_modificacion ),
								},
							].map( ( item ) => (
								<div key = { item.label }>
									<dt className="text-xs text-muted-foreground">{ item.label }</dt>
									<dd className="mt-0.5 font-semibold text-foreground">{ item.value }</dd>
								</div>
							) ) }
						</dl>
					</div>

					<hr className="border-border/50 mt-4" />

					{ /* Acciones de Fondo */ }
					<div className="flex items-center justify-end">
						<button
							id        = "ad-detail-delete-btn"
							onClick   = { handleDelete }
							disabled  = { deleteMutation.isPending }
							className = "flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 cursor-pointer disabled:opacity-50"
						>
							<Trash2 className="size-4" /> Eliminar
						</button>
					</div>
				</div>

				{ /* ── Columna Derecha: Vista Previa Unificada ── */ }
				<div className="flex flex-col h-full">
					{ /* Card de Vista Previa */ }
					<div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-4 flex-1">
						<div>
							<h3 className="text-lg font-bold tracking-tight">Vista previa</h3>
							<p className="text-xs text-muted-foreground mt-0.5">Así se ve actualmente tu publicidad</p>
						</div>

						<div className="overflow-hidden rounded-xl border border-border bg-muted/20 flex items-center justify-center flex-1 min-h-[350px]">
							{ isVideo ? (
								<video
									src       = { ad.archivo_url }
									controls
									className = "w-full h-full object-contain rounded-xl"
								/>
							) : (
								<img
									src       = { ad.archivo_url }
									alt       = { ad.nombre }
									className = "w-full h-full object-contain rounded-xl"
								/>
							) }
						</div>
					</div>
				</div>
				<ConfirmDialog
					isOpen    = { showDeleteConfirm }
					title     = "Eliminar publicidad"
					message   = { ad ? `¿Eliminar la publicidad "${ ad.nombre }"?` : '' }
					variant   = "destructive"
					onConfirm = { handleConfirmDelete }
					onClose   = { ( ) => setShowDeleteConfirm( false ) }
				/>
			</div>
		</div>
	);
}