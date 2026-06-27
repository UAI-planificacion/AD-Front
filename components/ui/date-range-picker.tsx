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
	value?       : { from? : string; to? : string };
	onChange     : ( range : { from : string; to? : string } | null ) => void;
	className?   : string;
	placeholder? : string;
	disabled?    : boolean;
}


function parseLocalDate( dateStr : string ) : Date {
	const [ year, month, day ] = dateStr.split( '-' ).map( Number );
	return new Date( year, month - 1, day );
}


export function DateRangePicker( { value, onChange, className, placeholder = 'Seleccionar fechas', disabled = false }: DateRangePickerProps ): React.JSX.Element {
	const today = React.useMemo( ( ) => {
		const d = new Date( );
		d.setHours( 0, 0, 0, 0 );
		return d;
	}, [] );

	const [ open, setOpen ] = React.useState( false );

	// Parse value to Date objects
	const [ date, setDate ] = React.useState<DateRange | undefined>( ( ) => {
		if ( !value ) {
			return undefined;
		}
		return {
			from : value.from ? parseLocalDate( value.from ) : undefined,
			to   : value.to ? parseLocalDate( value.to ) : undefined,
		};
	} );

	const [ month, setMonth ] = React.useState<Date | undefined>( ( ) => {
		if ( !value ) {
			return undefined;
		}
		return value.from ? parseLocalDate( value.from ) : undefined;
	} );

	React.useEffect( ( ) => {
		if ( !value ) {
			setDate( undefined );
			return;
		}
		const fromDate = value.from ? parseLocalDate( value.from ) : undefined;
		setDate( {
			from : fromDate,
			to   : value.to ? parseLocalDate( value.to ) : undefined,
		} );
		if ( fromDate ) {
			setMonth( fromDate );
		}
	}, [ value ] );

	const handleOpenChange = ( isOpen : boolean ) : void => {
		setOpen( isOpen );
		if ( isOpen && date?.from ) {
			setMonth( date.from );
		}
	};

	function handleSelect( newRange : DateRange | undefined ) : void {
		setDate( newRange );
		if ( newRange?.from ) {
			const fromStr = format( newRange.from, 'yyyy-MM-dd' );
			const toStr   = newRange.to ? format( newRange.to, 'yyyy-MM-dd' ) : undefined;
			onChange( {
				from	: fromStr,
				to		: toStr,
			} );
		} else {
			onChange( null );
		}
	}


	return (
		<div className = { cn( 'grid gap-2', className ) }>
			<Popover open = { open } onOpenChange = { handleOpenChange }>
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
						month          = { month }
						onMonthChange  = { setMonth }
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

