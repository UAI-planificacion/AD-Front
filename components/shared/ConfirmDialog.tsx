'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
}                 from '@/components/ui/dialog';


interface ConfirmDialogProps {
	isOpen		: boolean;
	title?		: string;
	message		: string;
	onConfirm	: ( ) => void;
	onClose		: ( ) => void;
	variant?	: 'primary' | 'destructive';
}


export function ConfirmDialog( {
	isOpen,
	title = 'Confirmar acción',
	message,
	onConfirm,
	onClose,
	variant = 'destructive',
} : ConfirmDialogProps ) : React.JSX.Element {
	return (
		<Dialog open = { isOpen } onOpenChange = { ( open ) => { if ( !open ) onClose(); } }>
			<DialogContent showCloseButton = { false } className="max-w-sm rounded-2xl">
				<DialogHeader>
					<DialogTitle className="text-lg font-bold text-foreground">
						{ title }
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground mt-2">
						{ message }
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="mt-4 flex gap-3">
					<Button
						variant   = "outline"
						onClick   = { onClose }
						className = "flex-1 rounded-xl cursor-pointer"
					>
						Cancelar
					</Button>
					<Button
						variant   = { variant === 'destructive' ? 'destructive' : 'default' }
						onClick   = { onConfirm }
						className = { `flex-1 rounded-xl cursor-pointer ${
							variant === 'primary'
								? 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
								: ''
						}` }
					>
						Aceptar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
