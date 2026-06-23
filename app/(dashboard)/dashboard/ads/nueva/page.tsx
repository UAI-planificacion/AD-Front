'use client';

import { AdsForm } from '../components/ads-form';


export default function NuevaAdPage(): React.JSX.Element {
    return (
        <div className="flex flex-col gap-8 p-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                    ➕ Nueva Publicidad
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Completa el formulario para crear una nueva publicidad
                </p>
            </div>

            <AdsForm mode = "create" />
        </div>
    );
}
