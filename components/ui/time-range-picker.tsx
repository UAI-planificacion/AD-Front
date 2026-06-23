"use client";

import * as React from 'react';
import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';


// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeRangePickerProps {
	startTime  : string;
	endTime    : string;
	onChange   : ( start: string, end: string ) => void;
	className? : string;
	disabled?  : boolean;
}

type Period = 'AM' | 'PM';

interface TimeState {
	hour   : number;    // 1-12
	minute : number;    // 0, 5, 10, … 55
	period : Period;
}

interface NumberGridProps {
	values          : number[];
	selected        : number;
	disabledValues? : number[];
	formatLabel?    : ( v: number ) => string;
	onChange        : ( v: number ) => void;
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

const HOURS   = [ 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
const MINUTES = [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ];


function to24( hour: number, period: Period ): number {
	if ( period === 'AM' ) return hour === 12 ? 0 : hour;
	return hour === 12 ? 12 : hour + 12;
}


function from24( h24: number ): { hour: number; period: Period } {
	if ( h24 === 0 )  return { hour: 12, period: 'AM' };
	if ( h24 < 12 )   return { hour: h24, period: 'AM' };
	if ( h24 === 12 ) return { hour: 12, period: 'PM' };
	return { hour: h24 - 12, period: 'PM' };
}


function toTotalMinutes( state: TimeState ): number {
	return to24( state.hour, state.period ) * 60 + state.minute;
}


function formatDisplay( state: TimeState ): string {
	const h24 = to24( state.hour, state.period );
	const mm  = state.minute.toString().padStart( 2, '0' );
	return `${ h24.toString().padStart( 2, '0' ) }:${ mm }`;
}


function to24String( state: TimeState ): string {
	return `${ formatDisplay( state ) }:00`;
}


function parseTimeString( time: string ): TimeState {
	const parts  = time.split( ':' );
	const h24    = parseInt( parts[ 0 ] || '8', 10 );
	const rawMin = parseInt( parts[ 1 ] || '0', 10 );
	// Snap minute to nearest 5-step
	const minute = Math.round( rawMin / 5 ) * 5 % 60;
	const { hour, period } = from24( h24 );
	return { hour, minute, period };
}


// ─── NumberGrid (sub-component reutilizable) ──────────────────────────────────

function NumberGrid( { values, selected, disabledValues = [], formatLabel, onChange }: NumberGridProps ): React.JSX.Element {
	return (
		<div className="grid grid-cols-4 gap-1">
			{ values.map( ( v ) => {
				const isSelected  = v === selected;
				const isDisabled  = disabledValues.includes( v );
				const label       = formatLabel ? formatLabel( v ) : v.toString().padStart( 2, '0' );

				return (
					<button
						key       = { v }
						type      = "button"
						disabled  = { isDisabled }
						onClick   = { ( ) => onChange( v ) }
						className = { cn(
							'flex items-center justify-center rounded-md text-xs font-medium h-7 w-full transition-all duration-100 select-none',
							isSelected
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'bg-muted/50 text-foreground hover:bg-muted',
							isDisabled && 'opacity-30 cursor-not-allowed pointer-events-none',
						) }
					>
						{ label }
					</button>
				);
			} ) }
		</div>
	);
}


// ─── PeriodToggle ────────────────────────────────────────────────────────────

interface PeriodToggleProps {
	value    : Period;
	onChange : ( p: Period ) => void;
}

function PeriodToggle( { value, onChange }: PeriodToggleProps ): React.JSX.Element {
	return (
		<div className="flex rounded-lg border border-border overflow-hidden text-xs font-semibold">
			{ ( [ 'AM', 'PM' ] as Period[] ).map( ( p ) => (
				<button
					key       = { p }
					type      = "button"
					onClick   = { ( ) => onChange( p ) }
					className = { cn(
						'flex-1 py-1.5 transition-all duration-100 select-none',
						value === p
							? 'bg-primary text-primary-foreground'
							: 'bg-background text-muted-foreground hover:bg-muted'
					) }
				>
					{ p }
				</button>
			) ) }
		</div>
	);
}


// ─── TimePicker (un selector completo hora + minuto + AM/PM) ─────────────────

interface TimePickerProps {
	label           : string;
	value           : TimeState;
	disabledHours?  : number[];
	disabledMinutes?: number[];
	onChange        : ( t: TimeState ) => void;
}

function TimePicker( { label, value, disabledHours = [], disabledMinutes = [], onChange }: TimePickerProps ): React.JSX.Element {
	function handleHour( h: number ): void {
		onChange( { ...value, hour: h } );
	}

	function handleMinute( m: number ): void {
		onChange( { ...value, minute: m } );
	}

	function handlePeriod( p: Period ): void {
		onChange( { ...value, period: p } );
	}

	return (
		<div className="flex flex-col gap-3">
			<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
				{ label }
			</span>

			{ /* AM/PM Toggle */ }
			<PeriodToggle value = { value.period } onChange = { handlePeriod } />

			{ /* Hours Grid (12, 1, 2... 11) */ }
			<div className="flex flex-col gap-1">
				<span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">Hora</span>
				<NumberGrid
					values         = { HOURS }
					selected       = { value.hour }
					disabledValues = { disabledHours }
					formatLabel    = { ( v ) => v.toString() }
					onChange       = { handleHour }
				/>
			</div>

			{ /* Minutes Grid (00, 05, 10... 55) */ }
			<div className="flex flex-col gap-1">
				<span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">Minuto</span>
				<NumberGrid
					values         = { MINUTES }
					selected       = { value.minute }
					disabledValues = { disabledMinutes }
					formatLabel    = { ( v ) => v.toString().padStart( 2, '0' ) }
					onChange       = { handleMinute }
				/>
			</div>
		</div>
	);
}


// ─── TimeRangePicker ──────────────────────────────────────────────────────────

export function TimeRangePicker( { startTime, endTime, onChange, className, disabled = false }: TimeRangePickerProps ): React.JSX.Element {
	const [ start, setStart ] = React.useState<TimeState>( ( ) => parseTimeString( startTime ) );
	const [ end, setEnd ]     = React.useState<TimeState>( ( ) => parseTimeString( endTime ) );

	React.useEffect( ( ) => { setStart( parseTimeString( startTime ) ); }, [ startTime ] );
	React.useEffect( ( ) => { setEnd( parseTimeString( endTime ) ); }, [ endTime ] );


	function handleStartChange( next: TimeState ): void {
		const startTotal = toTotalMinutes( next );
		let   nextEnd    = end;

		// Si el fin queda igual o antes que el inicio, avanzamos el fin
		if ( toTotalMinutes( end ) <= startTotal ) {
			const advancedMin = startTotal + 5;
			const h24         = Math.floor( advancedMin / 60 ) % 24;
			const m           = advancedMin % 60;
			// Snap minuto al múltiplo de 5 más cercano
			const snappedM    = Math.ceil( m / 5 ) * 5 % 60;
			const snappedH24  = snappedM === 0 && m > 0 ? ( h24 + 1 ) % 24 : h24;
			const { hour, period } = from24( snappedH24 );
			nextEnd = { hour, minute: snappedM, period };
		}

		setStart( next );
		setEnd( nextEnd );
		onChange( to24String( next ), to24String( nextEnd ) );
	}


	function handleEndChange( next: TimeState ): void {
		// No permitir fin <= inicio
		if ( toTotalMinutes( next ) <= toTotalMinutes( start ) ) return;
		setEnd( next );
		onChange( to24String( start ), to24String( next ) );
	}


	// Calcular horas/minutos deshabilitados para el selector "Hasta"
	const startTotal = toTotalMinutes( start );

	const disabledEndHours: number[] = HOURS.filter( ( h ) => {
		// Deshabilitar horas donde todos sus minutos quedarían <= startTotal
		// Consideramos el período actual del end
		const h24Max = to24( h, end.period );
		return h24Max * 60 + 55 <= startTotal;
	} );

	const disabledEndMinutes: number[] = MINUTES.filter( ( m ) => {
		const h24End = to24( end.hour, end.period );
		return h24End * 60 + m <= startTotal;
	} );


	const startLabel = `${ formatDisplay( start ) } ${ start.period }`;
	const endLabel   = `${ formatDisplay( end ) } ${ end.period }`;


	return (
		<div className = { cn( 'grid gap-2', className ) }>
			<Popover>
				<PopoverTrigger
					id        = "time-range-trigger"
					disabled  = { disabled }
					className = { cn(
						'w-full inline-flex items-center justify-start text-left font-normal rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors disabled:cursor-not-allowed disabled:opacity-50 h-[42px]',
					) }
				>
					<Clock className="mr-2 size-4 text-muted-foreground" />
					<span>{ startLabel } — { endLabel }</span>
				</PopoverTrigger>

				<PopoverContent className="w-auto p-0" align="start">
					<div className="flex flex-col gap-0">
						{ /* Header */ }
						<div className="px-4 pt-4 pb-3 border-b border-border">
							<h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Horario de vigencia</h4>
							<p className="text-sm font-semibold text-foreground mt-0.5">
								{ startLabel } — { endLabel }
							</p>
						</div>

						{ /* Pickers side by side */ }
						<div className="flex divide-x divide-border">
							<div className="p-4 min-w-[190px]">
								<TimePicker
									label   = "Desde"
									value   = { start }
									onChange = { handleStartChange }
								/>
							</div>
							<div className="p-4 min-w-[190px]">
								<TimePicker
									label           = "Hasta"
									value           = { end }
									disabledHours   = { disabledEndHours }
									disabledMinutes = { disabledEndMinutes }
									onChange        = { handleEndChange }
								/>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
