'use client';

import { useMemo, type JSX } from 'react';

import {
	MultiSelectCombobox,
	type Option,
} from './Combobox';
import { Label } from '@/components/ui/label';
import { Props } from './select-props';


const CAMPUS_BUILDINGS : Record<string, string[]> = {
	'penalolen'		: [ '1', '2', '3', '4', '5', '6' ],
	'errazuriz'		: [ '7' ],
	'vitacura'		: [ '8' ],
	'vina-del-mar'	: [ '9', '10', '14', '11', '12', '13' ],
};

const CAMPUS_OPTIONS : Option[] = [
	{
		value	: 'penalolen',
		label	: 'Peñalolén',
	},
	{
		value	: 'errazuriz',
		label	: 'Errázuriz',
	},
	{
		value	: 'vitacura',
		label	: 'Vitacura',
	},
	{
		value	: 'vina-del-mar',
		label	: 'Viña del Mar',
	},
];


export function HeadquartersSelect( {
	defaultValues,
	onSelectionChange,
	label,
	multiple        = true,
	placeholder     = 'Seleccionar Sedes',
	disabled        = false,
	className       = '',
	maxDisplayItems = 1,
} : Props ) : JSX.Element {
	// Traducir IDs de edificios a IDs de sedes seleccionadas
	const selectedCampuses = useMemo( ( ) => {
		const selected = new Set<string>( );
		const buildings = Array.isArray( defaultValues )
			? defaultValues
			: defaultValues
				? [ defaultValues ]
				: [];

		Object.entries( CAMPUS_BUILDINGS ).forEach( ( [ campusId, bIds ] ) => {
			if ( bIds.some( ( id ) => buildings.includes( id ) ) ) {
				selected.add( campusId );
			}
		} );
		return Array.from( selected );
	}, [ defaultValues ] );

	// Traducir sedes seleccionadas a todos sus edificios correspondientes
	function handleSelectionChange( selected : string[] | string | undefined ) : void {
		if ( !selected ) {
			onSelectionChange?.( [] );
			return;
		}

		const campusIds = Array.isArray( selected ) ? selected : [ selected ];
		const allBuildingIds : string[] = [];

		campusIds.forEach( ( campusId ) => {
			const bIds = CAMPUS_BUILDINGS[ campusId ];
			if ( bIds ) {
				allBuildingIds.push( ...bIds );
			}
		} );

		onSelectionChange?.( allBuildingIds );
	}

	return (
		<div className = { `flex flex-col gap-2 ${ className }` }>
			{ label && <Label htmlFor = "headquarters">{ label }</Label> }

			<MultiSelectCombobox
				options           = { CAMPUS_OPTIONS }
				defaultValues     = { selectedCampuses }
				onSelectionChange = { handleSelectionChange }
				placeholder       = { placeholder }
				disabled          = { disabled }
				multiple          = { multiple }
				maxDisplayItems   = { maxDisplayItems }
			/>
		</div>
	);
}
