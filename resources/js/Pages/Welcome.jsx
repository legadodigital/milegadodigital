import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo'; // Import the ApplicationLogo component

export default function Welcome({ auth, plans }) {
    return (
        <>
            <Head title="Bienvenido a Legado Digital" />
            <div
                className="min-h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/img/bg.jpg')" }}
            >
                {/* Header and Navigation */}
                <header className="bg-black/70 text-white p-4 fixed w-full z-20 shadow-md">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-white mr-2" />
                                <span className="text-xl font-bold">Legado Digital</span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-6">
                            <a href="#inicio" className="hover:text-gray-300">Inicio</a>
                            <a href="#quienes-somos" className="hover:text-gray-300">Quienes Somos</a>
                            <a href="#que-es" className="hover:text-gray-300">Qué es Legado Digital</a>
                            <a href="#precios" className="hover:text-gray-300">Precios</a>
                            <a href="#contactenos" className="hover:text-gray-300">Contáctenos</a>
                        </nav>
                        <div className="hidden md:flex space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="font-semibold text-white hover:text-gray-200 focus:outline focus:outline-2 focus:rounded-sm focus:outline-earthy-green-500"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="font-semibold text-white hover:text-gray-200 focus:outline focus:outline-2 focus:rounded-sm focus:outline-earthy-green-500"
                                    >
                                        Iniciar Sesión
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        className="ml-4 font-semibold text-white hover:text-gray-200 focus:outline focus:outline-2 focus:rounded-sm focus:outline-earthy-green-500"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                        {/* Mobile menu button (optional, for later implementation) */}
                        <div className="md:hidden">
                            {/* You can add a hamburger icon here for mobile menu */}
                        </div>
                    </div>
                </header>

                <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-black/50 pt-20"> {/* Added pt-20 to account for fixed header */}
                    <div className="max-w-7xl mx-auto p-6 lg:p-8">
                        {/* Inicio Section */}
                        <section id="inicio" className="min-h-screen flex items-center justify-center text-white text-center">
                            <div>
                                <h1 className="text-5xl font-bold mb-4">Legado Digital</h1>
                                <p className="text-xl">Preserva tu historia, trasciende el tiempo.</p>
                            </div>
                        </section>

                        {/* Quienes Somos Section */}
                        <section id="quienes-somos" className="min-h-screen flex items-center justify-center text-white bg-black/60 p-8 rounded-lg my-16">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-4">Quienes Somos</h2>
                                <p className="text-lg leading-relaxed">
                                    Somos un equipo apasionado por la preservación de la memoria y el legado personal. Creemos que cada vida es una historia que merece ser contada y recordada. Nuestra misión es proporcionar una plataforma segura y accesible para que las personas puedan organizar y compartir sus recuerdos más preciados, mensajes y documentos importantes con sus seres queridos, asegurando que su influencia perdure a través del tiempo.
                                </p>
                                <p className="text-lg leading-relaxed mt-4">
                                    En Legado Digital, combinamos tecnología innovadora con un profundo respeto por la privacidad y la seguridad. Nos esforzamos por crear una experiencia intuitiva y significativa, permitiendo a nuestros usuarios construir un legado digital duradero que trascienda generaciones.
                                </p>
                            </div>
                        </section>

                        {/* Qué es Legado Digital Section (existing content) */}
                        <section id="que-es" className="mt-16">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 lg:gap-8">
                                <div className="scale-100 p-6 bg-black/50 rounded-lg shadow-2xl flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-earthy-green-500">
                                    <div>
                                        <h2 className="mt-6 text-xl font-semibold text-white">
                                        Perdura en el tiempo, aunque ya no estés aquí.
                                        </h2>

                                        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                                        En Legado Digital, creemos que los lazos de amor y amistad trascienden el tiempo y el espacio. Por eso, hemos creado un santuario digital donde puedes preservar tus recuerdos más preciados, compartir mensajes de amor y sabiduría, y asegurarte de que tu historia continúe inspirando a tus seres queridos, incluso cuando ya no estés físicamente con ellos.
                                        </p>
                                        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                                        Imagina poder enviar un mensaje de cumpleaños a tu hijo desde el más allá, compartir una última historia con tu pareja, o dejar un consejo de vida para tus nietos. Con Legado Digital, puedes hacer todo esto y más. Te ofrecemos un espacio seguro y privado para que puedas organizar tus pensamientos, subir fotos y videos, y programar la entrega de mensajes póstumos a las personas que más amas.
                                        </p>
                                        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                                        Porque el amor no muere, se transforma. Y tu legado merece ser eterno.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Pricing Section (existing content) */}
                        <section id="precios" className="mt-16 text-white">
                            <h2 className="text-3xl font-bold text-center mb-8">Nuestros Planes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {plans.map((plan) => (
                                    <div key={plan.id} className="bg-black/50 p-6 rounded-lg shadow-lg flex flex-col">
                                        <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                                        <p className="text-4xl font-extrabold mb-4">${plan.price}<span className="text-lg font-medium">/mes</span></p>
                                        <p className="text-gray-300 mb-6 flex-grow">{plan.description}</p>
                                        <ul className="mb-6 space-y-2">
                                            {plan.features.map((feature) => (
                                                <li key={feature.id} className="flex items-center">
                                                    <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                    {feature.feature_code.replace(/_/g, ' ')}: {feature.value}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={route('register')} // Or a specific plan registration route
                                            className="mt-auto block w-full text-center bg-earthy-green-500 hover:bg-earthy-green-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Elegir Plan
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Contactenos Section */}
                        <section id="contactenos" className="min-h-screen flex items-center justify-center text-white bg-black/60 p-8 rounded-lg my-16">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-4">Contáctenos</h2>
                                <p className="text-lg leading-relaxed">
                                    ¿Tienes preguntas o necesitas ayuda? No dudes en contactarnos.
                                </p>
                                <p className="text-lg leading-relaxed mt-4">
                                    Puedes enviarnos un correo electrónico a: <a href="mailto:info@legadodigital.com" className="text-earthy-green-500 hover:underline">info@legadodigital.com</a>
                                </p>
                                <p className="text-lg leading-relaxed mt-2">
                                    O llámanos al: +123 456 7890
                                </p>
                            </div>
                        </section>

                        <div className="flex justify-center mt-16 px-6 sm:items-center sm:justify-between">
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
                                <div className="flex items-center gap-4">
                                    <a
                                        href="https://github.com/sponsors/taylorotwell"
                                        className="group inline-flex items-center hover:text-gray-700 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            className="-mt-px mr-1 w-5 h-5 stroke-gray-400 dark:stroke-gray-600 group-hover:stroke-gray-600 dark:group-hover:stroke-gray-400"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                            />
                                        </svg>
                                        Patrocinar
                                    </a>
                                </div>
                            </div>

                            <div className="ml-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:ml-0">
                                Legado Digital v1.0.0
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
