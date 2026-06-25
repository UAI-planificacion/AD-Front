"use client";

import * as React from 'react';

import {
    Calendar as CalendarIcon
}                           from 'lucide-react';
import { format }           from 'date-fns';
import { es }               from 'date-fns/locale';
import type { DateRange }   from 'react-day-picker';

import {
    Popover,
	PopoverContent,
	PopoverTrigger,
}                   from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn }       from '@/lib/utils';


interface DateRangePickerProps {
	value?       : { from?: string; to?: string };
	onChange     : ( range: { from: string; to: string } | null ) => void;
	className?   : string;
	placeholder? : string;
	disabled?    : boolean;
}


export function DateRangePicker( { value, onChange, className, placeholder = 'Seleccionar fechas', disabled = false }: DateRangePickerProps ): React.JSX.Element {
	const today = React.useMemo( () => {
		const d = new Date();
		d.setHours( 0, 0, 0, 0 );
		return d;
	}, [] );

	// Parse value to Date objects
	const [ date, setDate ] = React.useState<DateRange | undefined>( ( ) => {
		if ( !value ) return undefined;
		return {
			from : value.from ? new Date( `${ value.from }T12:00:00` ) : undefined,
			to   : value.to ? new Date( `${ value.to }T12:00:00` ) : undefined,
		};
	} );

	React.useEffect( ( ) => {
		if ( !value ) {
			setDate( undefined );
			return;
		}
		setDate( {
			from : value.from ? new Date( `${ value.from }T12:00:00` ) : undefined,
			to   : value.to ? new Date( `${ value.to }T12:00:00` ) : undefined,
		} );
	}, [ value ] );


	function handleSelect( newRange: DateRange | undefined ): void {
		setDate( newRange );
		if ( newRange?.from && newRange?.to ) {
			const fromStr = format( newRange.from, 'yyyy-MM-dd' );
			const toStr   = format( newRange.to, 'yyyy-MM-dd' );
			onChange( {
				from : fromStr,
				to   : toStr,
			} );
		} else {
			onChange( null );
		}
	}


	return (
		<div className = { cn( 'grid gap-2', className ) }>
			<Popover>
				<PopoverTrigger
					id        = "date-range-trigger"
					disabled  = { disabled }
					className = { cn(
						'w-full inline-flex items-center justify-start text-left font-normal rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors disabled:cursor-not-allowed disabled:opacity-50 h-[42px]',
						!date && 'text-muted-foreground'
					) }
				>
					<CalendarIcon className="mr-2 size-4 text-muted-foreground" />
					{ date?.from ? (
						date.to ? (
							<>
								{ format( date.from, 'd MMM yyyy', { locale: es } ) } - { format( date.to, 'd MMM yyyy', { locale: es } ) }
							</>
						) : (
							format( date.from, 'd MMM yyyy', { locale: es } )
						)
					) : (
						<span>{ placeholder }</span>
					) }
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode           = "range"
						defaultMonth   = { date?.from }
						selected       = { date }
						onSelect       = { handleSelect }
						numberOfMonths = { 2 }
						locale         = { es }
						disabled       = { { before: today } }
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

