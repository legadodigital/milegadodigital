import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo'; // Import the ApplicationLogo component

export default function Welcome({ auth, plans }) {
    const featureTranslations = {
        max_messages: 'Cantidad de Mensajes',
        max_documents: 'Cantidad de Documentos',
        video_recording: 'Grabación de Video',
        video_duration: 'Duración de Video (segundos)',
        max_trusted_contacts: 'Contactos de Confianza',
    };

    return (
        <>
            <Head title="Bienvenido a Mi Legado Virtual" />
            <div
                className="min-h-screen bg-cover bg-center font-sans"

            >
                {/* Header and Navigation */}
                <header className="bg-gray-800 text-white p-4 fixed w-full z-20 shadow-md">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="block h-12 w-12 fill-current text-white mr-2" />
                                <span className="text-xl font-bold">Mi Legado Virtual</span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-6">
                            <a href="#inicio" className="hover:text-calm-green-200 transition duration-300">Inicio</a>
                            <a href="#caracteristicas" className="hover:text-calm-green-200 transition duration-300">Características</a>
                            <a href="#quienes-somos" className="hover:text-calm-green-200 transition duration-300">Quienes Somos</a>
                            <a href="#precios" className="hover:text-calm-green-200 transition duration-300">Precios</a>
                            <a href="#testimonios" className="hover:text-calm-green-200 transition duration-300">Testimonios</a>
                            <a href="#contactenos" className="hover:text-calm-green-200 transition duration-300">Contáctenos</a>
                        </nav>
                        <div className="hidden md:flex space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="font-semibold text-white hover:text-calm-green-200 focus:outline focus:outline-2 focus:rounded-sm focus:outline-earthy-green-500 transition duration-300"
                                >
                                    Mi Legado Virtual
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="ml-4 px-4 py-2 bg-calm-green-600 rounded-md text-white hover:text-calm-green-200 focus:outline focus:outline-2 focus:rounded-sm focus:outline-calm-green-500 transition duration-300"
                                    >
                                        Iniciar Sesión
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        className="ml-4 px-4 py-2 bg-calm-green-600 text-white rounded-md hover:bg-calm-green-700 focus:outline focus:outline-2 focus:rounded-sm focus:outline-calm-green-500 transition duration-300"
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

                <div className="relative pt-20"> {/* Adjusted padding for fixed header */}
                    {/* Hero Section */}
                    <section
                        id="inicio"
                        className="relative flex items-center justify-center min-h-[calc(100vh-80px)] text-white text-center p-6 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/img/hero-section.png')" }}
                    >
                        <div className="absolute inset-0 bg-black/60"></div> {/* Overlay for readability */}
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
                                Tu Legado Virtual, un Puente de Amor Eterno
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
                                En Mi Legado Virtual, te ofrecemos un espacio sagrado y seguro para que puedas dejar mensajes póstumos, videos llenos de amor y documentos importantes a tus seres queridos. Nuestra misión es que tu voz, tus recuerdos y tu voluntad perduren, siendo entregados en el momento preciso para consolar, guiar y proteger a quienes más amas.
                            </p>
                            <Link
                                href={route('register')}
                                className="inline-block px-8 py-3 bg-calm-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-calm-green-700 transition duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
                            >
                                Comienza a Construir tu Legado
                            </Link>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="caracteristicas" className="py-16 bg-calm-green-100 text-gray-800">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-12">¿Qué puedes hacer con Mi Legado Virtual?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {/* Feature 1: Mensajes Póstumos */}
                                <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="text-calm-green-600 mb-4">
                                        {/* Placeholder Icon: Letter */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Mensajes Póstumos</h3>
                                    <p className="text-gray-600">Programa mensajes de despedida o de amor para ser entregados en el futuro.</p>
                                </div>

                                {/* Feature 2: Recuerdos Virtuales */}
                                <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="text-earthy-green-600 mb-4">
                                        {/* Placeholder Icon: Photo Album */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Recuerdos Virtuales</h3>
                                    <p className="text-gray-600">Guarda tus historias, videos y audios más preciados para que perduren.</p>
                                </div>

                                {/* Feature 3: Documentos Importantes */}
                                <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="text-calm-green-600 mb-4">
                                        {/* Placeholder Icon: Document with Lock */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2V9a2 2 0 012-2h5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Documentos Importantes</h3>
                                    <p className="text-gray-600">Almacena de forma segura documentos vitales y decide quién tendrá acceso.</p>
                                </div>

                                {/* Feature 4: Contactos de Confianza */}
                                <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="text-earthy-green-600 mb-4">
                                        {/* Placeholder Icon: Users */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M15 7l-3-3m0 0L9 7m3-3v12m-9 0H3a2 2 0 01-2-2V8a2 2 0 012-2h2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Contactos de Confianza</h3>
                                    <p className="text-gray-600">Designa a las personas que gestionarán tu legado Virtual.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quienes Somos Section */}
                    <section id="quienes-somos" className="py-16 bg-calm-green-50 text-gray-800">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-8">Quienes Somos</h2>
                            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                                Somos un equipo apasionado por la preservación de la memoria y el legado personal. Creemos que cada vida es una historia que merece ser contada y recordada. Nuestra misión es proporcionar una plataforma segura y accesible para que las personas puedan organizar y compartir sus recuerdos más preciados, mensajes y documentos importantes con sus seres queridos, asegurando que su influencia perdure a través del tiempo.
                            </p>
                            <p className="text-lg leading-relaxed mt-4 max-w-3xl mx-auto">
                                En Mi Legado Virtual, combinamos tecnología innovadora con un profundo respeto por la privacidad y la seguridad. Nos esforzamos por crear una experiencia intuitiva y significativa, permitiendo a nuestros usuarios construir un legado Virtual duradero que trascienda generaciones.
                            </p>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section id="como-funciona" className="py-16 bg-calm-green-100 text-gray-800">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-12">¿Cómo funciona Mi Legado Virtual?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="w-20 h-20 bg-calm-green-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-calm-green-600 text-3xl font-bold">1</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Crea tu Cuenta</h3>
                                    <p className="text-gray-600">Regístrate de forma segura y comienza a construir tu legado Virtual.</p>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="w-20 h-20 bg-earthy-green-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-earthy-green-600 text-3xl font-bold">2</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Organiza tu Contenido</h3>
                                    <p className="text-gray-600">Sube mensajes, recuerdos y documentos. Define destinatarios y fechas de entrega.</p>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="w-20 h-20 bg-calm-green-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-calm-green-600 text-3xl font-bold">3</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Tu Legado Perdura</h3>
                                    <p className="text-gray-600">Nos encargamos de que tu legado sea entregado tal como lo planeaste.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section id="testimonios" className="py-16 bg-calm-green-50 text-gray-800">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-12">Lo que dicen nuestros usuarios</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-calm-green-100 p-8 rounded-lg shadow-lg">
                                    <p className="text-lg italic mb-4">"Mi Legado Virtual me dio la tranquilidad de saber que mis palabras llegarán a mis seres queridos cuando yo ya no esté. Es un servicio invaluable."</p>
                                    <p className="font-semibold text-calm-green-600">- María G.</p>
                                </div>
                                <div className="bg-calm-green-100 p-8 rounded-lg shadow-lg">
                                    <p className="text-lg italic mb-4">"La plataforma es muy fácil de usar y me permitió organizar todos mis documentos importantes de una manera que nunca antes había podido. ¡Altamente recomendado!"</p>
                                    <p className="font-semibold text-calm-green-600">- Juan P.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section (existing content, integrated visually) */}
                    <section id="precios" className="py-16 bg-calm-green-100 text-gray-800">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <h2 className="text-4xl font-bold text-center mb-12">Nuestros Planes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {plans.map((plan) => (
                                    <div key={plan.id} className="bg-white p-8 rounded-lg shadow-lg flex flex-col transform transition duration-300 hover:scale-105">
                                        <h3 className="text-2xl font-bold mb-4 text-calm-green-600">{plan.name}</h3>
                                        <p className="text-4xl font-extrabold mb-4">$UF {plan.price}<span className="text-lg font-medium text-gray-600">/mes</span></p>
                                        <p className="text-gray-600 mb-6 flex-grow">{plan.description}</p>
                                        <ul className="mb-6 space-y-3">
                                            {plan.features.map((feature) => {
                                                let displayValue = feature.value;
                                                let featureName = featureTranslations[feature.feature_code] || feature.feature_code;
                                                let isUnavailable = false;

                                                if (feature.value === '-1') {
                                                    displayValue = 'Ilimitado';
                                                } else if (feature.feature_code === 'video_recording') {
                                                    if (feature.value === 'false') {
                                                        displayValue = 'No';
                                                        isUnavailable = true;
                                                    } else {
                                                        displayValue = 'Sí';
                                                    }
                                                } else if (feature.feature_code === 'video_duration') {
                                                    const duration = parseInt(feature.value, 10);
                                                    if (duration === 0) {
                                                        displayValue = 'No disponible';
                                                        isUnavailable = true;
                                                    } else if (duration % 60 === 0) {
                                                        displayValue = `${duration / 60} minutos`;
                                                    } else {
                                                        displayValue = `${duration} segundos`;
                                                    }
                                                } else if (feature.feature_code === 'max_messages') {
                                                    if (parseInt(feature.value, 10) === 0) {
                                                        displayValue = 'No disponible';
                                                        isUnavailable = true;
                                                    } else {
                                                        displayValue = `${feature.value} mensajes`;
                                                    }
                                                } else if (feature.feature_code === 'max_documents') {
                                                    if (parseInt(feature.value, 10) === 0) {
                                                        displayValue = 'No disponible';
                                                        isUnavailable = true;
                                                    } else {
                                                        displayValue = `${feature.value} documentos`;
                                                    }
                                                } else if (feature.feature_code === 'max_trusted_contacts') {
                                                    if (parseInt(feature.value, 10) === 0) {
                                                        displayValue = 'No disponible';
                                                        isUnavailable = true;
                                                    } else {
                                                        displayValue = `${feature.value} contactos`;
                                                    }
                                                }

                                                return (
                                                    <li key={feature.id} className="flex items-center text-gray-700">
                                                        {isUnavailable ? (
                                                            <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-6 h-6 text-calm-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                            </svg>
                                                        )}
                                                        <span className="font-medium">{featureName}:</span> {displayValue}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <Link
                                            href={route('register')} // Or a specific plan registration route
                                            className="mt-auto block w-full text-center bg-calm-green-600 hover:bg-calm-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                        >
                                            Elegir Plan
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contactenos Section */}
                    <section id="contactenos" className="py-16 bg-calm-green-50 text-gray-800">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-8">Contáctenos</h2>
                            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                                ¿Tienes preguntas o necesitas ayuda? No dudes en contactarnos. Estamos aquí para ayudarte a construir tu legado.
                            </p>
                            <div className="mt-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
                                <a href="mailto:info@legadoVirtual.com" className="text-calm-green-600 hover:text-calm-green-800 text-lg font-semibold flex items-center transition duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    info@legadoVirtual.cl
                                </a>
                                <a href="tel:+1234567890" className="text-calm-green-600 hover:text-calm-green-800 text-lg font-semibold flex items-center transition duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.135a11.042 11.042 0 005.516 5.516l1.135-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                                    </svg>
                                    +56 9 1234 5678
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-earthy-green-800 text-white py-8">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm">
                            <div className="text-center sm:text-left mb-4 sm:mb-0">
                                <p>&copy; {new Date().getFullYear()} Mi Legado Virtual. Todos los derechos reservados.</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <a
                                    href="#"
                                    className="group inline-flex items-center hover:text-calm-green-400 transition duration-300"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        className="-mt-px mr-1 w-5 h-5 stroke-white group-hover:stroke-calm-green-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                        />
                                    </svg>
                                    {/* Patrocinar */}
                                </a>
                                <span className="text-gray-500">|</span>
                                <span className="text-gray-400">v1.0.0</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
