import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CookieConsent from '@/Components/CookieConsent';
import { Alert } from '@mui/material';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Inicio
                                </NavLink>
                                <NavLink
                                    href={(() => {
                                        const url = route('mensajes-postumos.index');
                                        //console.log('Mensajes Póstumos URL:', url);
                                        return url;
                                    })()}
                                    active={route().current('mensajes-postumos.index')}
                                >
                                    Mensajes Póstumos
                                </NavLink>
                                <NavLink
                                    href={route('documentos-importantes.index')}
                                    active={route().current('documentos-importantes.index')}
                                >
                                    Documentos Importantes
                                </NavLink>
                                <NavLink
                                    href={route('contactos-confianza.index')}
                                    active={route().current('contactos-confianza.index')}
                                >
                                    Contactos de Confianza
                                </NavLink>
                                <NavLink
                                    href={route('recuerdos.index')}
                                    active={route().current('recuerdos.index')}
                                >
                                    Libro de Recuerdos
                                </NavLink>
                                <NavLink
                                    href={route('video.recorder')}
                                    active={route().current('video.recorder')}
                                >
                                    Grabar Video
                                </NavLink>
                                <NavLink
                                     href={route('wishlist.index')}
                                     active={route().current('wishlist.index')}
                                 >
                                     Lista de Deseos
                                 </NavLink>
                                 <NavLink
                                     href={route('proof-of-life.verify.form')}
                                     active={route().current('proof-of-life.verify.form')}
                                 >
                                     Verificar Prueba de Vida
                                 </NavLink>
                                {user.is_admin && (
                                    <>
                                        <NavLink
                                            href={route('admin.dashboard')}
                                            active={route().current('admin.dashboard')}
                                        >
                                            Admin Dashboard
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.plans.index')}
                                            active={route().current('admin.plans.index')}
                                        >
                                            Gestionar Planes
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            {user.name}

                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('profile.security')}
                                        >
                                            Seguridad
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('payments.index')}
                                        >
                                            Historial de Pagos
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('profile.upgradePlanForm')}
                                        >
                                            Actualizar Plan
                                        </Dropdown.Link>
                                        {/* <Dropdown.Link
                                            href={route('profile.oneclick')}
                                        >
                                            Gestionar Oneclick
                                        </Dropdown.Link> */}
                                        <Dropdown.Link
                                            href={route('proof-of-life.settings.show')}
                                        >
                                            Configuración Prueba de Vida
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('mensajes-postumos.index')}
                            active={route().current('mensajes-postumos.index')}
                        >
                            Mensajes Póstumos
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('documentos-importantes.index')}
                            active={route().current('documentos-importantes.index')}
                        >
                            Documentos Importantes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('contactos-confianza.index')}
                            active={route().current('contactos-confianza.index')}
                        >
                            Contactos de Confianza
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('recuerdos.index')}
                            active={route().current('recuerdos.index')}
                        >
                            Libro de Recuerdos
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('video.recorder')}
                            active={route().current('video.recorder')}
                        >
                            Grabar Video
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('wishlist.index')}
                            active={route().current('wishlist.index')}
                        >
                            Lista de Deseos
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('proof-of-life.verify.form')}
                            active={route().current('proof-of-life.verify.form')}
                        >
                            Verificar Prueba de Vida
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('proof-of-life.settings.show')}
                            active={route().current('proof-of-life.settings.show')}
                        >
                            Configuración Prueba de Vida
                        </ResponsiveNavLink>
                        {user.is_admin && (
                            <>
                                <ResponsiveNavLink
                                    href={route('admin.dashboard')}
                                    active={route().current('admin.dashboard')}
                                >
                                    Admin Dashboard
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.plans.index')}
                                    active={route().current('admin.plans.index')}
                                >
                                    Gestionar Planes
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Perfil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('profile.security')}>
                                Seguridad
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('payments.index')}>
                                Historial de Pagos
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {user && user.proof_of_life_frequency_days === null && (
                <div className="py-4">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Alert severity="warning">
                            ¡Importante! No has configurado la frecuencia de tu prueba de vida. Por favor, <Link href={route('proof-of-life.settings.show')} className="underline">configúrala aquí</Link> para asegurar la continuidad de tu legado.
                        </Alert>
                    </div>
                </div>
            )}

            <main>{children}</main>

            <footer className="bg-white shadow py-4 mt-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    <div className="flex justify-center space-x-4 mb-2">
                        <a
                            href="/docs/Condiciones-y-Terminos-de-uso-MLV.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm"
                        >
                            Términos de Uso
                        </a>
                        <span className="text-gray-400">|</span>
                        <a
                            href="/docs/Politica-de-Privacidad-MLV.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm"
                        >
                            Política de Privacidad
                        </a>
                    </div>
                    &copy; 2025 Legado Digital. Todos los derechos reservados.
                </div>
            </footer>
            <CookieConsent />
        </div>
    );
}
