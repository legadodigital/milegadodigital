import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import CookieConsent from '@/Components/CookieConsent';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div
                className="absolute left-0 top-0 h-full w-1/2 bg-contain bg-no-repeat opacity-20"
                style={{ backgroundImage: "url('/img/logo.png')" }}
            ></div>
            <div className="relative z-10">
                <Link href="/">
                    <ApplicationLogo className="h-80 w-80 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="relative z-10 mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>

            <footer className="mt-8 text-center text-gray-500 text-sm relative z-10">
                &copy; {new Date().getFullYear()} Mi Legado Virtual. Todos los derechos reservados.
            </footer>
            <CookieConsent />
        </div>
    );
}
