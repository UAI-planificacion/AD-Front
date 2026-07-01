'use client';

import React            from 'react';
import { useRouter }    from 'next/navigation';

import { Ad } from 'lucide-react';

import { authClient }  from '@/lib/auth-client';
import { LoginButton } from '@/components/shared/auth/login-button';


export default function Home( ) : React.JSX.Element {
	const router                       = useRouter( );
	const { data: session, isPending } = authClient.useSession( );

	return (
		<div className="relative min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-background text-foreground px-6">
			{ /* Decorative glow in the center background */ }
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

			<div className="relative flex flex-col items-center gap-8 text-center max-w-md w-full">
				<div className="flex size-14 items-center justify-center rounded-2xl border border-border/80 bg-muted/40 shadow-xs backdrop-blur-xs select-none">
					<Ad className="size-7 text-primary" />
				</div>

				<div className="space-y-3">
					<h1 className="text-3xl sm:text-4xl font-black tracking-tight">
						Gestión de Publicidades
					</h1>

					<p className="text-sm text-muted-foreground">
						Plataforma oficial para la programación y distribución de contenidos en pantallas universitarias.
					</p>
				</div>

				{ isPending ? (
					<div className="h-10 w-44 rounded-xl bg-muted animate-pulse" />
				) : session ? (
					<button
						id        = "landing-dashboard-btn"
						onClick   = { ( ) => router.push( '/dashboard' ) }
						className = "w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 hover:scale-[1.01] active:scale-[0.99] dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
					>
						Ir al Dashboard
					</button>
				) : (
					<LoginButton />
				) }
			</div>
		</div>
	);
}
