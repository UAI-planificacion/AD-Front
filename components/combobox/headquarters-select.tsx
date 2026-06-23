'use client';

import type { JSX } from 'react';

import {
	MultiSelectCombobox,
	type GroupOption,
} from './Combobox';
import { Label } from '@/components/ui/label';
import { Props } from './select-props';


const HEADQUARTERS_DATA : GroupOption[] = [
	{
		id      : 'penalolen',
		name    : 'Peñalolén',
		options : [
			{
				value : '1',
				label : 'Edificio Pregrado A',
			},
			{
				value : '2',
				label : 'Edificio Pregrado B',
			},
			{
				value : '3',
				label : 'Edificio Postgrado C',
			},
			{
				value : '4',
				label : 'Edificio Talleres D',
			},
			{
				value : '5',
				label : 'Edificio Talleres E',
			},
			{
				value : '6',
				label : 'Edificio Pregrado F',
			},
		],
	},
	{
		id      : 'errazuriz',
		name    : 'Errázuriz',
		options : [
			{
				value : '7',
				label : 'Edificio Errázuriz',
			},
		],
	},
	{
		id      : 'vitacura',
		name    : 'Vitacura',
		options : [
			{
				value : '8',
				label : 'Edificio Vitacura',
			},
		],
	},
	{
		id      : 'vina-del-mar',
		name    : 'Viña del Mar',
		options : [
			{
				value : '9',
				label : 'Edificio A',
			},
			{
				value : '10',
				label : 'Edificio B',
			},
			{
				value : '14',
				label : 'Edificio C',
			},
			{
				value : '11',
				label : 'Edificio D',
			},
			{
				value : '12',
				label : 'Edificio E',
			},
			{
				value : '13',
				label : 'Edificio F',
			},
		],
	},
];


export function HeadquartersSelect( {
	defaultValues,
	onSelectionChange,
	label,
	multiple        = true,
	placeholder     = 'Seleccionar Edificios',
	disabled        = false,
	className       = '',
	maxDisplayItems = 1,
} : Props ): JSX.Element {
	return (
		<div className = { `space-y-2 ${ className }` }>
			{ label && <Label htmlFor = "headquarters">{ label }</Label> }

			<MultiSelectCombobox
				options           = { HEADQUARTERS_DATA }
				defaultValues     = { defaultValues }
				onSelectionChange = { onSelectionChange }
				placeholder       = { placeholder }
				disabled          = { disabled }
				multiple          = { multiple }
				maxDisplayItems   = { maxDisplayItems }
			/>
		</div>
	);
}
