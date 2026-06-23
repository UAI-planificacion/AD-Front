'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone }                       from 'react-dropzone';
import { Upload, X, Film, Image as ImageIcon } from 'lucide-react';
import { cn }                                from '@/lib/utils';


interface AdsUploaderProps {
	value?    : File | null;
	onChange  : ( file: File | null ) => void;
	disabled? : boolean;
}


const ACCEPTED_TYPES = {
	'image/png'  : [ '.png' ],
	'image/jpeg' : [ '.jpg', '.jpeg' ],
	'image/webp' : [ '.webp' ],
	'video/mp4'  : [ '.mp4' ],
	'video/webm' : [ '.webm' ],
};


function formatBytes( bytes: number ): string {
	if ( bytes === 0 ) return '0 B';
	const k     = 1024;
	const sizes = [ 'B', 'KB', 'MB', 'GB' ];
	const i     = Math.floor( Math.log( bytes ) / Math.log( k ) );
	return `${ parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( 1 ) ) } ${ sizes[ i ] }`;
}


export function AdsUploader( { value, onChange, disabled = false }: AdsUploaderProps ): React.JSX.Element {
	const [ imagePreview, setImagePreview ] = useState<string | null>( null );
	const [ videoUrl, setVideoUrl ]         = useState<string | null>( null );

	// Revocar el object URL del video al desmontar o cambiar
	useEffect( () => {
		return () => {
			if ( videoUrl ) URL.revokeObjectURL( videoUrl );
		};
	}, [ videoUrl ] );


	const onDrop = useCallback( ( acceptedFiles: File[] ) => {
		const file = acceptedFiles[ 0 ];
		if ( !file ) return;

		onChange( file );

		if ( file.type.startsWith( 'image/' ) ) {
			// Limpiar video anterior
			if ( videoUrl ) {
				URL.revokeObjectURL( videoUrl );
				setVideoUrl( null );
			}
			const reader  = new FileReader();
			reader.onload = ( e ) => setImagePreview( e.target?.result as string );
			reader.readAsDataURL( file );
		} else if ( file.type.startsWith( 'video/' ) ) {
			// Limpiar imagen anterior
			setImagePreview( null );
			if ( videoUrl ) URL.revokeObjectURL( videoUrl );
			setVideoUrl( URL.createObjectURL( file ) );
		}
	}, [ onChange, videoUrl ] );


	const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
		onDrop,
		accept   : ACCEPTED_TYPES,
		maxFiles : 1,
		disabled,
	});

	const isVideo  = value?.type.startsWith( 'video/' );
	const isImage  = value?.type.startsWith( 'image/' );
	const hasError = fileRejections.length > 0;


	function handleClear( e: React.MouseEvent ): void {
		e.stopPropagation();
		onChange( null );
		setImagePreview( null );
		if ( videoUrl ) {
			URL.revokeObjectURL( videoUrl );
			setVideoUrl( null );
		}
	}


	return (
		<div className="flex flex-col gap-3">
			<div
				{ ...getRootProps() }
				id        = "ads-uploader"
				className = { cn(
					'relative cursor-pointer rounded-2xl border-2 border-dashed p-4 transition-all',
					isDragActive && 'border-primary bg-primary/5 scale-[1.01]',
					!isDragActive && 'border-border hover:border-primary/50 hover:bg-muted/40',
					hasError && 'border-destructive/50 bg-destructive/5',
					disabled && 'cursor-not-allowed opacity-50',
					value && 'border-solid border-border bg-muted/20',
				) }
			>
				<input { ...getInputProps() } />

				{ value ? (
					<div className="flex flex-col gap-3">
						{ /* Badge de tipo */ }
						<div className="flex items-center justify-between">
							{ isVideo ? (
								<span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
									<Film className="size-3" />
									Tipo: Video
								</span>
							) : (
								<span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
									<ImageIcon className="size-3" />
									Tipo: Imagen
								</span>
							) }

							{ /* Botón limpiar */ }
							<button
								id         = "ads-uploader-clear"
								type       = "button"
								onClick    = { handleClear }
								className  = "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
								aria-label = "Quitar archivo"
							>
								<X className="size-4" />
							</button>
						</div>

						{ /* Preview visual */ }
						{ isVideo && videoUrl ? (
							<video
								src          = { videoUrl }
								controls
								className    = "w-full max-h-56 rounded-xl object-contain bg-black"
								preload      = "metadata"
							/>
						) : isImage && imagePreview ? (
							<img
								src       = { imagePreview }
								alt       = "Vista previa"
								className = "w-full max-h-56 rounded-xl object-contain bg-muted/40"
							/>
						) : null }

						{ /* Info archivo */ }
						<div className="flex items-center gap-3">
							<div className={ cn(
								'flex size-8 shrink-0 items-center justify-center rounded-lg',
								isVideo ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-sky-100 dark:bg-sky-900/30',
							) }>
								{ isVideo
									? <Film className="size-4 text-violet-600 dark:text-violet-400" />
									: <ImageIcon className="size-4 text-sky-600 dark:text-sky-400" />
								}
							</div>

							<div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
								<p className="truncate text-sm font-semibold text-foreground">{ value.name }</p>
								<p className="text-xs text-muted-foreground">
									{ value.type } · { formatBytes( value.size ) }
								</p>
								<p className="text-[11px] text-muted-foreground/70">Haz clic para cambiar el archivo</p>
							</div>
						</div>
					</div>
				) : (
					<div className="flex min-h-[130px] flex-col items-center justify-center gap-3">
						<div className={ cn(
							'flex size-12 items-center justify-center rounded-2xl transition-transform',
							isDragActive ? 'scale-110 bg-primary/10' : 'bg-muted',
						) }>
							<Upload className={ cn( 'size-5', isDragActive ? 'text-primary' : 'text-muted-foreground' ) } />
						</div>

						<div className="text-center">
							<p className="text-sm font-semibold text-foreground">
								{ isDragActive ? 'Suelta el archivo aquí' : 'Arrastra un archivo o haz clic para seleccionar' }
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Imágenes: PNG, JPG, WebP · Videos: MP4, WebM
							</p>
						</div>
					</div>
				) }
			</div>

			{ hasError && (
				<p className="text-xs text-destructive">
					Archivo no válido. Solo se aceptan imágenes (PNG, JPG, WebP) y videos (MP4, WebM).
				</p>
			) }
		</div>
	);
}
