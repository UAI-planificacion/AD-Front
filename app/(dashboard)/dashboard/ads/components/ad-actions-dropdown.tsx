'use client';

import {
	Trash2,
	Pencil,
	Eye,
	MoreVertical,
	MoreHorizontal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


interface AdActionsDropdownProps {
	adId		: number;
	adNombre	: string;
	onDelete	: ( id : number, nombre : string ) => void;
	isPending	: boolean;
	variant		: 'card' | 'table';
	activo		: boolean;
}


export function AdActionsDropdown( {
	adId,
	adNombre,
	onDelete,
	isPending,
	variant,
	activo,
} : AdActionsDropdownProps ) : React.JSX.Element {
	const router = useRouter();

	const isCard = variant === 'card';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				id        = { isCard ? `ads-card-menu-${ adId }` : `ads-menu-${ adId }` }
				className = {
					isCard
						? 'flex size-7 items-center justify-center rounded-full border border-border/40 bg-background/80 dark:bg-background/40 hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs focus:outline-none'
						: 'rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer focus:outline-none'
				}
				aria-label = { isCard ? 'Acciones' : 'Abrir menú de acciones' }
			>
				{ isCard ? (
					<MoreVertical className="size-4" />
				) : (
					<MoreHorizontal className="size-4" />
				) }
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-40 rounded-xl">
				<DropdownMenuItem
					id        = { isCard ? `ads-card-view-${ adId }` : `ads-view-${ adId }` }
					onClick   = { ( ) => router.push( `/dashboard/ads/${ adId }` ) }
					className = "gap-2 cursor-pointer"
				>
					<Eye className="size-3.5" />
					<span>Ver detalle</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					id        = { isCard ? `ads-card-edit-${ adId }` : `ads-edit-${ adId }` }
					onClick   = { ( ) => router.push( `/dashboard/ads/form?id=${ adId }` ) }
					className = "gap-2 cursor-pointer"
				>
					<Pencil className="size-3.5" />
					<span>Editar</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					id           = { isCard ? `ads-card-delete-${ adId }` : `ads-delete-${ adId }` }
					onClick      = { ( ) => onDelete( adId, adNombre ) }
					disabled     = { isPending || !activo }
					className    = "gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
				>
					<Trash2 className="size-3.5" />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
