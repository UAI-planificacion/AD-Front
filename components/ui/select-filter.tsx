'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';


export interface SelectFilterOption {
	label	: string;
	value	: string;
}

interface SelectFilterProps {
	options				: SelectFilterOption[];
	value				: string[];
	onChange			: ( selected : string[] ) => void;
	placeholder			: string;
	multiple?			: boolean;
	className?			: string;
}


export function SelectFilter( {
	options,
	value,
	onChange,
	placeholder,
	multiple = false,
	className = '',
} : SelectFilterProps ) : React.JSX.Element {
	const [ open, setOpen ] = React.useState( false );

	const selectedOptions = React.useMemo( ( ) => {
		return options.filter( ( opt ) => value.includes( opt.value ) );
	}, [ options, value ] );

	const displayText = React.useMemo( ( ) => {
		if ( selectedOptions.length === 0 ) {
			return placeholder;
		}
		if ( !multiple ) {
			return selectedOptions[ 0 ].label;
		}
		if ( selectedOptions.length === 1 ) {
			return selectedOptions[ 0 ].label;
		}
		return `${ selectedOptions.length } seleccionadas`;
	}, [ selectedOptions, placeholder, multiple ] );

	function handleSelect( optValue : string ) : void {
		if ( !multiple ) {
			// Selección única: activar o desactivar
			if ( value.includes( optValue ) ) {
				onChange( [] );
			} else {
				onChange( [ optValue ] );
			}
			setOpen( false );
		} else {
			// Selección múltiple
			if ( value.includes( optValue ) ) {
				onChange( value.filter( ( v ) => v !== optValue ) );
			} else {
				onChange( [ ...value, optValue ] );
			}
		}
	}

	return (
		<Popover open = { open } onOpenChange = { setOpen }>
			<PopoverTrigger className = { cn(
				'w-full inline-flex items-center justify-between h-10 rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted/40 transition-colors outline-hidden cursor-pointer',
				className
			) } >
				<span className="truncate">{ displayText }</span>

				<ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
			</PopoverTrigger>

			<PopoverContent className="w-48 p-1 z-9999" align="start">
				<div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto">
					{ options.map( ( option ) => {
						const isSelected = value.includes( option.value );

						return (
							<button
								key       = { option.value }
								onClick   = { ( ) : void => handleSelect( option.value ) }
								className = { cn(
									'flex items-center justify-between w-full px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent transition-colors text-left font-medium',
									isSelected && 'bg-accent text-accent-foreground'
								) }
							>
								<span className="truncate">{ option.label }</span>

								{ isSelected && <Check className="h-4 w-4 text-primary shrink-0" /> }
							</button>
						);
					} ) }
				</div>
			</PopoverContent>
		</Popover>
	);
}
