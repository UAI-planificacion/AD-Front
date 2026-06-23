'use client';

import { authClient } from '@/lib/auth-client';

export default function DashboardPage(): React.JSX.Element {
    const { data: session } = authClient.useSession();

    const user = session?.user;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
            <div className="w-full max-w-2xl space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        { user?.name
                            ? `Hola, ${ user.name.split( ' ' )[ 0 ] } 👋`
                            : 'Bienvenido al Dashboard'
                        }
                    </h1>

                    { user?.email && (
                        <p className="text-sm text-muted-foreground">{ user.email }</p>
                    ) }
                </div>

                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Has iniciado sesión correctamente en{' '}
                    <span className="font-semibold text-foreground">Este proyecto</span>.
                    Tu sesión está activa y protegida.
                </p>
            </div>
        </div>
    );
}
