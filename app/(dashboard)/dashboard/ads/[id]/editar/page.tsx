'use client';

import { useParams }   from 'next/navigation';
import { useAds }      from '@/hooks/use-ads';
import { AdsForm }     from '../../components/ads-form';


export default function EditarAdPage(): React.JSX.Element {
    const { id }                      = useParams<{ id: string }>();
    const adId                        = Number( id );
    const { data: ads, isLoading }    = useAds();
    const ad                          = ads?.find( ( a ) => a.id === adId );

    if ( isLoading ) {
        return (
            <div className="p-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
                <div className="mt-6 h-96 animate-pulse rounded-2xl bg-muted" />
            </div>
        );
    }

    if ( !ad ) {
        return (
            <div className="flex items-center justify-center p-6 py-24">
                <p className="text-sm text-muted-foreground">Publicidad no encontrada</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                    ✏️ Editar Publicidad
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{ ad.nombre }</span>
                    {' '}— Solo puedes modificar los edificios asignados
                </p>
            </div>

            <AdsForm mode = "edit" initialData = { ad } />
        </div>
    );
}
