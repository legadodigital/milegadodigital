import { Link, Head } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // Import the ApplicationLogo component
import { useState, useEffect } from "react";

const AccordionItem = ({ title, content, isOpen, onClick }) => {
    return (
        <div className="border border-gray-200 rounded-lg shadow-sm">
            <button
                className="flex justify-between items-center w-full p-5 text-lg font-semibold text-left text-gray-800 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={onClick}
            >
                {title}
                <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </button>
            {isOpen && (
                <div className="p-5 pt-0 text-gray-600 bg-white">
                    <p dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }} />
                </div>
            )}
        </div>
    );
};
function parseLinks(text) {
    return text.replace(
        /(https?:\/\/[^\s]+)/g,
        (url) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${url}</a>`
    );
}
export default function Welcome({ auth, plans }) {
    const featureTranslations = {
        max_messages: "Cantidad de Mensajes",
        max_documents: "Cantidad de Documentos",
        video_recording: "Grabación de Video",
        video_duration: "Duración de Video (segundos)",
        max_trusted_contacts: "Contactos de Confianza",
        max_memories: "Recuerdos",
    };

    const [billingCycle, setBillingCycle] = useState("monthly");
    const [openAccordion, setOpenAccordion] = useState(null);
    const [faqData, setFaqData] = useState([]);

    useEffect(() => {
        const faqContent = `
1.- ¿Qué es Mi Legado Virtual?
Mi Legado Virtual
Es una plataforma que permite planificar y gestionar el destino de mensajes que quieras enviar a tus seres queridos, documentos digitales, activos virtuales y mensajes personales después de tu fallecimiento.
Con esta herramienta, puedes asegurarte de que tus seres queridos tengan acceso a lo que tú decidas, de forma segura y respetuosa.
2.- ¿Qué tipo de información puedo guardar?
Puedes registrar:
- Mensajes personales para tus familiares o amigos, para ser entregados en la fecha que programes.
- Documentos digitales relevantes: Seguros, información de propiedades o de otros bienes, datos relevantes que merecen ser resguardados
- Contactos de confianza: Define quién o quiénes tendrán el acceso a tu información privada, en caso de ser necesario.
- Recuerdos de momentos importantes en tu vida
- Lista de Deseos: Agrega todas esas cosas, deseos y objetivos que te gustaría lograr, y registra la fecha de cuando los cumplas.
3.- ¿Cómo empiezo a crear mi legado?
1. Regístrate en https://www.milegadovirtual.cl
2. Completa tu perfil y agrega los datos que quieres dejar como legado
3. Designa a las personas que recibirán tu legado
4. Guarda y actualiza cuando sea necesario
4.- ¿Cómo funciona el proceso de entrega del legado?
Cuando tú lo autorices (por ejemplo, al fallecer), el sistema notifica a los contactos designados.
Estos deberán verificar su identidad y, una vez confirmados, recibirán el acceso a los datos que tú hayas dejado preparados.
5.- ¿Puedo actualizar mi legado después de crearlo?
Sí, puedes **editar y actualizar tu legado en cualquier momento**. Simplemente inicia sesión en tu cuenta y realiza los cambios necesarios.
Es recomendable actualizar tu legado cada cierto tiempo, especialmente después de cambios importantes en tu vida.
6.- ¿Qué pasa si no tengo un legado virtual planificado?
Sin un legado virtual planificado, tus seres queridos pueden tener dificultades para acceder a tus cuentas o gestionar tus activos virtuales.
Esto puede generar frustraciones, pérdidas de información importante o conflictos familiares. Mi Legado Virtual ayuda a evitar esto.
7.- ¿Cuánto cuesta usar Mi Legado Virtual?
Ofrecemos planes gratuitos (prueba por 30 días) y pagados, de diferentes valores dependiendo de tus necesidades de más almacenamiento, más contactos designados y funciones avanzadas.
8.- ¿Puedo confiar en que mi información no será compartida?
Totalmente. Tu información es **confidencial y solo será compartida con las personas que tú autorices**. No compartimos tus datos con terceros sin tu consentimiento.
9.- ¿Puedo cancelar mi plan?
Claro, si quisieras cancelar tu cuenta de Mi Legado Virtual solo debes avisarnos, descargar tu información y luego procederemos a eliminar todos tus datos de nuestro sitio.
10.- ¿Cómo empiezo a crear mi legado?
1. Regístrate en https://www.milegadovirtual.cl
2. Completa tu perfil y agrega los datos que quieres dejar como legado
3. Designa a las personas que recibirán tu legado
4. Guarda y actualiza cuando sea necesario
11.- ¿Qué es la prueba de vida?
La prueba de vida es un mecanismo para poder confirmar que aún estas entre nosotros, podrás configurar cada cuanto tiempo requieres que solicitemos esta prueba de vida, si dentro de los 15 días posteriores no tenemos respuesta un Correo será enviado a tus contactos de confianza`;


        const parseFaq = (text) => {
    const lines = text.split('\n').map(line => line.trim());
    const faqs = [];
    let currentQuestion = null;
    let currentAnswerLines = [];

    for (let line of lines) {
        // Detectar preguntas con formato: "1.- ¿Pregunta?"
        const questionMatch = line.match(/^(\d+|-)\.-\s*(.+)/);

        if (questionMatch) {
            // Si ya había una pregunta, la guardamos
            if (currentQuestion && currentAnswerLines.length > 0) {
                faqs.push({
                    question: currentQuestion,
                    answer: currentAnswerLines.join('\n').trim().replace(/\*\*/g, '')
                });
                currentAnswerLines = [];
            }
            currentQuestion = questionMatch[2]; // Extraemos solo la pregunta
        } else if (line !== '') {
            // Si hay contenido y no es vacío, lo agregamos a la respuesta
            currentAnswerLines.push(line);
        }
    }

    // Guardamos la última pregunta si queda pendiente
    if (currentQuestion && currentAnswerLines.length > 0) {
        faqs.push({
            question: currentQuestion,
            answer: currentAnswerLines.join('\n').trim().replace(/\*\*/g, '')
        });
    }

    return faqs;
};

        setFaqData(parseFaq(faqContent));
    }, []);

    const calculateAnnualPrice = (plan) => {
        const monthlyPrice = parseFloat(plan.price);
        const discount = parseFloat(plan.annual_discount_percentage);
        const annualPrice = monthlyPrice * 12 * (1 - discount / 100);
        return annualPrice.toFixed(2);
    };

    const getPlanPrice = (plan) => {
        if (
            billingCycle === "annually" &&
            plan.annual_discount_percentage > 0
        ) {
            const annualPrice = calculateAnnualPrice(plan);
            return {
                price: (annualPrice / 12).toFixed(2),
                period: "mes (pago anual)",
                total: `Total Anual: ${Math.round(annualPrice).toLocaleString(
                    "es-CL"
                )} CLP`,
            };
        }
        return { price: plan.price, period: "mes" };
    };

    return (
        <>
            <div className="min-h-screen bg-cover bg-center font-sans">
                {/* Header and Navigation */}
                <header className="bg-gray-800 text-white p-4 fixed w-full z-20 shadow-md">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="block h-12 w-12 fill-current text-white mr-2" />
                                <span className="text-xl font-bold">
                                    Mi Legado Virtual
                                </span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-6">
                            <a
                                href="#inicio"
                                className="hover:text-calm-green-200 transition duration-300"
                            >
                                Inicio
                            </a>
                            <a
                                href="#caracteristicas"
                                className="hover:text-calm-green-200 transition duration-300"
                            >
                                Características
                            </a>
                            <a
                                href="#quienes-somos"
                                className="hover:text-calm-green-200 transition duration-300"
                            >
                                Quienes Somos
                            </a>
                            <a
                                href="#precios"
                                className="hover:text-calm-green-200 transition duration-300"
                            >
                                Precios
                            </a>
                            <a
                                href="#testimonios"
                                className="hover:text-calm-green-200 transition duration-300"
                            >
                                Testimonios
                            </a>
                            <a
                                href="#preguntas-frecuentes"
                                className="hover:text-calm-green-200 transition duration-300"
                            >
                                Preguntas Frecuentes
                            </a>
                            <a
                                href="#contactenos"
                                className="hover:text-calm-green-200 transition duration-300"
                            >
                                Contáctenos
                            </a>
                        </nav>
                        <div className="flex flex-col space-y-2 md:flex-row md:space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="font-semibold text-white hover:text-calm-green-200 focus:outline focus:outline-2 focus:rounded-sm focus:outline-earthy-green-500 transition duration-300 whitespace-nowrap"
                                >
                                    Mi Legado Virtual
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="ml-4 px-4 py-2 bg-calm-green-600 rounded-md text-white hover:text-calm-green-200 focus:outline focus:outline-2 focus:rounded-sm focus:outline-calm-green-500 transition duration-300"
                                    >
                                        Iniciar Sesión
                                    </Link>

                                    <Link
                                        href={route("register")}
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

                <div className="relative pt-20">
                    {" "}
                    {/* Adjusted padding for fixed header */}
                    {/* Hero Section */}
                    <section
                        id="inicio"
                        className="relative flex items-center justify-center min-h-[calc(100vh-80px)] text-white text-center p-6 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('/img/hero-section.png')",
                        }}
                    >
                        <div className="absolute inset-0 bg-black/60"></div>{" "}
                        {/* Overlay for readability */}
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
                                Tu Legado Virtual, un Puente de Amor Eterno
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
                                En Mi Legado Virtual, te ofrecemos un espacio
                                privado y seguro para que puedas dejar mensajes
                                póstumos, videos llenos de amor y documentos
                                importantes a tus seres queridos. Nuestra misión
                                es que tu voz, tus recuerdos y tu voluntad
                                perduren, siendo entregados en el momento
                                preciso para consolar, guiar y proteger a
                                quienes más amas.
                            </p>
                            <Link
                                href={route("register")}
                                className="inline-block px-8 py-3 bg-calm-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-calm-green-700 transition duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
                            >
                                Comienza a Construir tu Legado
                            </Link>
                        </div>
                    </section>
                    {/* Features Section */}
                    <section
                        id="caracteristicas"
                        className="py-16 bg-calm-green-100 text-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-12">
                                ¿Qué puedes hacer con Mi Legado Virtual?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">


                                {/* Feature 2: Recuerdos Virtuales */}
                                <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="text-earthy-green-600 mb-4">
                                        {/* Placeholder Icon: Photo Album */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Recuerdos Virtuales
                                    </h3>
                                    <p className="text-gray-600">
                                        Guarda tus historias, videos y audios
                                        más preciados para que perduren.
                                    </p>
                                </div>

                                {/* Feature 3: Documentos Importantes */}
                                <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="text-calm-green-600 mb-4">
                                        {/* Placeholder Icon: Document with Lock */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2V9a2 2 0 012-2h5z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Documentos Importantes
                                    </h3>
                                    <p className="text-gray-600">
                                        Almacena de forma segura documentos
                                        vitales y decide quién tendrá acceso.
                                    </p>
                                </div>
                                 {/* Feature 1: Mensajes Póstumos */}
                                <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="text-calm-green-600 mb-4">
                                        {/* Placeholder Icon: Letter */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Mensajes para el futuro o cuando ya no estés
                                    </h3>
                                    <p className="text-gray-600">
                                        Programa mensajes de amor y consejos
                                        para ser entregados en el futuro a aquellos que más amas.
                                    </p>
                                </div>
                                {/* Feature 4: Contactos de Confianza */}
                                <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="text-earthy-green-600 mb-4">
                                        {/* Placeholder Icon: Users */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M15 7l-3-3m0 0L9 7m3-3v12m-9 0H3a2 2 0 01-2-2V8a2 2 0 012-2h2"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Contactos de Confianza
                                    </h3>
                                    <p className="text-gray-600">
                                        Designa a las personas que gestionarán
                                        tu Legado Virtual.
                                    </p>
                                    <p className="text-gray-600">
                                        Tus Contactos .
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Lista de Deseos Section */}
                    <section
                        id="lista-deseos"
                        className="py-16 bg-calm-green-50 text-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-8">
                                ¿Qué Sueños Quieres Dejar Cumplidos?
                            </h2>
                            <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                                La vida es un lienzo en blanco, y cada día una
                                oportunidad para pintar nuestros sueños más
                                profundos. En Mi Legado Virtual, no solo te
                                ayudamos a preservar tu memoria, sino también a
                                dar vida a tus aspiraciones. Crea tu "Lista de
                                Deseos": esos anhelos, metas y experiencias que
                                siempre quisiste vivir. Desde aprender un nuevo
                                idioma hasta visitar un lugar soñado, cada deseo
                                es un paso hacia una vida plena.
                            </p>
                            <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                                Imagina la satisfacción de tachar cada deseo,
                                sabiendo que estás construyendo un legado no
                                solo de recuerdos, sino de una vida vivida al
                                máximo. Y si el tiempo te sorprende, tus seres
                                queridos encontrarán en esta lista un mapa de
                                tus pasiones, una inspiración para continuar tu
                                viaje, y la certeza de que cada día fue una
                                búsqueda de la felicidad
                            </p>
                            <Link
                                href={route("register")}
                                className="inline-block px-8 py-3 bg-calm-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-calm-green-700 transition duration-300 transform hover:scale-105"
                            >
                                Empieza a Soñar en Grande
                            </Link>
                        </div>
                    </section>
                    {/* Quienes Somos Section */}
                    <section
                        id="quienes-somos"
                        className="py-16 bg-calm-green-50 text-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl font-bold mb-8">
                                    Quienes Somos
                                </h2>
                                <p className="text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
                                    Somos un equipo apasionado por la
                                    preservación de la memoria y el legado
                                    personal. Creemos que cada vida es una
                                    historia que merece ser contada y recordada.
                                    Nuestra misión es proporcionar una
                                    plataforma segura y accesible para que las
                                    personas puedan organizar y compartir sus
                                    recuerdos más preciados, mensajes y
                                    documentos importantes con sus seres
                                    queridos, asegurando que su influencia
                                    perdure a través del tiempo.
                                </p>
                                <p className="text-lg leading-relaxed mt-4 max-w-3xl mx-auto md:mx-0">
                                    En Mi Legado Virtual, combinamos tecnología
                                    innovadora con un profundo respeto por la
                                    privacidad y la seguridad. Nos esforzamos
                                    por crear una experiencia intuitiva y
                                    significativa, permitiendo a nuestros
                                    usuarios construir un legado Virtual
                                    duradero que trascienda generaciones.
                                </p>
                            </div>
                            <div className="flex justify-center md:justify-end">
                                <img
                                    src="/img/logonaombre.png"
                                    alt="Mi Legado Virtual Logo"
                                    className="max-w-full h-auto opacity-70"
                                    style={{ maxWidth: "500px" }}
                                />
                            </div>
                        </div>
                    </section>
                    {/* How It Works Section */}
                    <section
                        id="como-funciona"
                        className="py-16 bg-calm-green-100 text-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-12">
                                ¿Cómo funciona Mi Legado Virtual?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="w-20 h-20 bg-calm-green-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-calm-green-600 text-3xl font-bold">
                                            1
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Crea tu Cuenta
                                    </h3>
                                    <p className="text-gray-600">
                                        Regístrate de forma segura y comienza a
                                        construir tu legado Virtual.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="w-20 h-20 bg-earthy-green-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-earthy-green-600 text-3xl font-bold">
                                            2
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Organiza tu Contenido
                                    </h3>
                                    <p className="text-gray-600">
                                        Sube mensajes, recuerdos y documentos.
                                        Define destinatarios y fechas de
                                        entrega.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                                    <div className="w-20 h-20 bg-calm-green-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-calm-green-600 text-3xl font-bold">
                                            3
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Tu Legado Perdura
                                    </h3>
                                    <p className="text-gray-600">
                                        Nos encargamos de que tu legado sea
                                        entregado tal como lo planeaste.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Testimonials Section */}
                    <section
                        id="testimonios"
                        className="py-16 bg-calm-green-50 text-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-12">
                                Lo que dicen nuestros usuarios
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-calm-green-100 p-8 rounded-lg shadow-lg">
                                    <p className="text-lg italic mb-4">
                                        "Mi Legado Virtual me dio la
                                        tranquilidad de saber que mis palabras
                                        llegarán a mis seres queridos cuando yo
                                        ya no esté. Es un servicio invaluable."
                                    </p>
                                    <p className="font-semibold text-calm-green-600">
                                        - María G.
                                    </p>
                                </div>
                                <div className="bg-calm-green-100 p-8 rounded-lg shadow-lg">
                                    <p className="text-lg italic mb-4">
                                        "La plataforma es muy fácil de usar y me
                                        permitió organizar todos mis documentos
                                        importantes de una manera que nunca
                                        antes había podido. ¡Altamente
                                        recomendado!"
                                    </p>
                                    <p className="font-semibold text-calm-green-600">
                                        - Juan P.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Pricing Section (existing content, integrated visually) */}
                    <section
                        id="precios"
                        className="py-16 bg-calm-green-100 text-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <h2 className="text-4xl font-bold text-center mb-12">
                                Nuestros Planes
                            </h2>
                            <p className="text-lg text-center text-gray-700 mb-8">
                                Las características de cada plan se recargan mensualmente con cada pago.
                            </p>
                            <div className="flex justify-center mb-8">
                                <img
                                    src="/img/webpay-logo-plus.jpg"
                                    alt="Webpay Plus Logo"
                                    className="h-16 object-contain"
                                />
                            </div>

                            <div className="my-8 flex items-center justify-center">
                                <span
                                    className={`mr-3 text-sm font-medium ${
                                        billingCycle === "monthly"
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Pago Mensual
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={billingCycle === "annually"}
                                        onChange={() =>
                                            setBillingCycle(
                                                billingCycle === "monthly"
                                                    ? "annually"
                                                    : "monthly"
                                            )
                                        }
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                                <span
                                    className={`ml-3 text-sm font-medium ${
                                        billingCycle === "annually"
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Pago Anual
                                    <span className="text-xs text-green-600 ml-1">
                                        (Ahorra hasta 15%)
                                    </span>
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {plans.map((plan) => {
                                    const planPrice = getPlanPrice(plan);
                                    return (
                                        <div
                                            key={plan.id}
                                            className="bg-white p-8 rounded-lg shadow-lg flex flex-col transform transition duration-300 hover:scale-105"
                                        >
                                            <h3 className="text-2xl font-bold mb-4 text-calm-green-600">
                                                {plan.name}
                                            </h3>
                                            <p className="text-4xl font-extrabold mb-4">
                                                ${" "}
                                                {Math.round(
                                                    planPrice.price
                                                ).toLocaleString("es-CL")}{" "}
                                                CLP
                                                <span className="text-lg font-medium text-gray-600">
                                                    /{planPrice.period}
                                                </span>
                                            </p>
                                            {planPrice.total && (
                                                <p className="text-xs text-gray-500 mb-4">
                                                    {planPrice.total}
                                                </p>
                                            )}
                                            <p className="text-gray-600 mb-6 flex-grow">
                                                {plan.description}
                                            </p>
                                            <ul className="mb-6 space-y-3">
                                                {plan.features.map(
                                                    (feature) => {
                                                        let displayValue =
                                                            feature.value;
                                                        let featureName =
                                                            featureTranslations[
                                                                feature
                                                                    .feature_code
                                                            ] ||
                                                            feature.feature_code;
                                                        let isUnavailable = false;

                                                        if (
                                                            feature.value ===
                                                            "-1"
                                                        ) {
                                                            displayValue =
                                                                "Ilimitado";
                                                        } else if (
                                                            feature.feature_code ===
                                                            "video_recording"
                                                        ) {
                                                            if (
                                                                feature.value ===
                                                                "false"
                                                            ) {
                                                                displayValue =
                                                                    "No";
                                                                isUnavailable = true;
                                                            } else {
                                                                displayValue =
                                                                    "Sí";
                                                            }
                                                        } else if (
                                                            feature.feature_code ===
                                                            "video_duration"
                                                        ) {
                                                            const duration =
                                                                parseInt(
                                                                    feature.value,
                                                                    10
                                                                );
                                                            if (
                                                                duration === 0
                                                            ) {
                                                                displayValue =
                                                                    "No disponible";
                                                                isUnavailable = true;
                                                            } else if (
                                                                duration %
                                                                    60 ===
                                                                0
                                                            ) {
                                                                displayValue = `${
                                                                    duration /
                                                                    60
                                                                } minutos`;
                                                            } else {
                                                                displayValue = `${duration} segundos`;
                                                            }
                                                        } else if (
                                                            feature.feature_code ===
                                                            "max_messages"
                                                        ) {
                                                            if (
                                                                parseInt(
                                                                    feature.value,
                                                                    10
                                                                ) === 0
                                                            ) {
                                                                displayValue =
                                                                    "No disponible";
                                                                isUnavailable = true;
                                                            } else {
                                                                displayValue = `${feature.value} mensajes`;
                                                            }
                                                        } else if (
                                                            feature.feature_code ===
                                                            "max_documents"
                                                        ) {
                                                            if (
                                                                parseInt(
                                                                    feature.value,
                                                                    10
                                                                ) === 0
                                                            ) {
                                                                displayValue =
                                                                    "No disponible";
                                                                isUnavailable = true;
                                                            } else {
                                                                displayValue = `${feature.value} documentos`;
                                                            }
                                                        } else if (
                                                            feature.feature_code ===
                                                            "max_trusted_contacts"
                                                        ) {
                                                            if (
                                                                parseInt(
                                                                    feature.value,
                                                                    10
                                                                ) === 0
                                                            ) {
                                                                displayValue =
                                                                    "No disponible";
                                                                isUnavailable = true;
                                                            } else {
                                                                displayValue = `${feature.value} contactos`;
                                                            }
                                                        } else if (
                                                            feature.feature_code ===
                                                            "max_memories"
                                                        ) {
                                                            if (
                                                                parseInt(
                                                                    feature.value,
                                                                    10
                                                                ) === 0
                                                            ) {
                                                                displayValue =
                                                                    "No disponible";
                                                                isUnavailable = true;
                                                            } else {
                                                                displayValue = `${feature.value} `;
                                                            }
                                                        }

                                                        return (
                                                            <li
                                                                key={feature.id}
                                                                className="flex items-center text-gray-700"
                                                            >
                                                                {isUnavailable ? (
                                                                    <svg
                                                                        className="w-6 h-6 text-red-500 mr-3"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                                            clipRule="evenodd"
                                                                        ></path>
                                                                    </svg>
                                                                ) : (
                                                                    <svg
                                                                        className="w-6 h-6 text-calm-green-500 mr-3"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                            clipRule="evenodd"
                                                                        ></path>
                                                                    </svg>
                                                                )}
                                                                <span className="font-medium">
                                                                    {
                                                                        featureName
                                                                    }
                                                                    :
                                                                </span>{" "}
                                                                {displayValue}
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                            <Link
                                                href={route("register")} // Or a specific plan registration route
                                                className="mt-auto block w-full text-center bg-calm-green-600 hover:bg-calm-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                            >
                                                Elegir Plan
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                    {/* Preguntas Frecuentes Section */}
                    <section
                        id="preguntas-frecuentes"
                        className="py-16 bg-calm-green-100 text-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <h2 className="text-4xl font-bold text-center mb-12">
                                Preguntas Frecuentes
                            </h2>
                            <div className="space-y-4">
                                {faqData.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        title={faq.question}
                                        content={faq.answer}
                                        isOpen={openAccordion === index}
                                        onClick={() =>
                                            setOpenAccordion(
                                                openAccordion === index
                                                    ? null
                                                    : index
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                    {/* Contacto */}
                    <section
                        id="contactenos"
                        className="py-16 bg-calm-green-50 text-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl font-bold mb-8">
                                Contáctenos
                            </h2>
                            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                                ¿Tienes preguntas o necesitas ayuda? No dudes en
                                contactarnos. Estamos aquí para ayudarte a
                                construir tu legado.
                            </p>
                            <div className="mt-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
                                <a
                                    href="mailto:soporte@milegadovirtual.cl"
                                    className="text-calm-green-600 hover:text-calm-green-800 text-lg font-semibold flex items-center transition duration-300"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    soporte@milegadovirtual.cl
                                </a>
                                {/* <a href="tel:+1234567890" className="text-calm-green-600 hover:text-calm-green-800 text-lg font-semibold flex items-center transition duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.135a11.042 11.042 0 005.516 5.516l1.135-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                                    </svg>
                                    +56 9 1234 5678
                                </a> */}
                            </div>
                        </div>
                    </section>
                    {/* Footer */}
                    <footer className="bg-earthy-green-800 text-white py-8">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm">
                            <div className="text-center sm:text-left mb-4 sm:mb-0">
                                <p>
                                    &copy; {new Date().getFullYear()} Mi Legado
                                    Virtual. Todos los derechos reservados.
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Social Media Links */}
                                <div className="flex space-x-4">
                                    <a
                                        href="https://www.instagram.com/milegado.virtual/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-calm-green-400 transition duration-300"
                                    >
                                        {/* Instagram SVG Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-instagram"
                                        >
                                            <rect
                                                x="2"
                                                y="2"
                                                width="20"
                                                height="20"
                                                rx="5"
                                                ry="5"
                                            ></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line
                                                x1="17.5"
                                                y1="6.5"
                                                x2="17.51"
                                                y2="6.5"
                                            ></line>
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.tiktok.com/@milegadovirtual"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-calm-green-400 transition duration-300"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M 6 3 C 4.3550302 3 3 4.3550302 3 6 L 3 18 C 3 19.64497 4.3550302 21 6 21 L 18 21 C 19.64497 21 21 19.64497 21 18 L 21 6 C 21 4.3550302 19.64497 3 18 3 L 6 3 z M 6 5 L 18 5 C 18.56503 5 19 5.4349698 19 6 L 19 18 C 19 18.56503 18.56503 19 18 19 L 6 19 C 5.4349698 19 5 18.56503 5 18 L 5 6 C 5 5.4349698 5.4349698 5 6 5 z M 12 7 L 12 14 C 12 14.56503 11.56503 15 11 15 C 10.43497 15 10 14.56503 10 14 C 10 13.43497 10.43497 13 11 13 L 11 11 C 9.3550302 11 8 12.35503 8 14 C 8 15.64497 9.3550302 17 11 17 C 12.64497 17 14 15.64497 14 14 L 14 10.232422 C 14.616148 10.671342 15.259118 11 16 11 L 16 9 C 15.952667 9 15.262674 8.7809373 14.78125 8.3613281 C 14.299826 7.941719 14 7.4149911 14 7 L 12 7 z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61578218856558"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-calm-green-400 transition duration-300"
                                    >
                                        {/* Facebook SVG Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-facebook"
                                        >
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a
                                        href="https://x.com/milegadovirtual"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-calm-green-400 transition duration-300"
                                    >
                                        {/* X (Twitter) SVG Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M18.901 1.199h3.581l-8.61 9.916 9.438 11.885h-7.063l-6.64-8.893-7.48 8.893h-3.58l8.93-10.316-9.76-11.568h7.23l5.84 7.785 6.12-7.785zm-1.16 18.422h2.12l-6.21-7.997-5.04 7.997h-2.12l6.21-7.997 5.04 7.997z" />
                                        </svg>
                                    </a>
                                </div>
                                <a
                                    href="/docs/Condiciones-y-Terminos-de-uso-MLV.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-calm-green-400 transition duration-300 text-sm"
                                >
                                    Términos de Uso
                                </a>
                                <span className="text-gray-500">|</span>
                                <a
                                    href="/docs/Politica-de-Privacidad-MLV.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-calm-green-400 transition duration-300 text-sm"
                                >
                                    Política de Privacidad
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
