import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const PaperAirplaneIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

const DocumentTextIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const PhotoIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export default function Dashboard({ auth, mensajesPendientes, ultimosDocumentos, ultimosRecuerdos, planFeatures: initialPlanFeatures }) {
    const is_admin = auth.user.is_admin;

    const planFeatures = is_admin ? {
        max_messages: 'ilimitado',
        max_documents: 'ilimitado',
        max_memories: 'ilimitado',
        video_recording: 'true',
        video_duration: 999999, // Effectively unlimited
        max_trusted_contacts: 'ilimitado',
    } : initialPlanFeatures;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Mi Legado Digital</h2>}
        >
            <Head title="Mi Legado Digital" />

            <div className="py-12 bg-calm-green-100 dark:bg-calm-green-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Widget: Mensajes Pendientes */}
                        <div className="bg-white dark:bg-earthy-green-800 overflow-hidden shadow-sm sm:rounded-lg p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center">
                                    <PaperAirplaneIcon className="w-8 h-8 text-earthy-green-500" />
                                    <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Mensajes por Enviar</h3>
                                </div>
                                <p className="mt-4 text-5xl font-bold text-gray-900 dark:text-white">{mensajesPendientes}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">mensajes programados para ser entregados.</p>
                            </div>
                            <Link href={route('mensajes-postumos.index')} className="mt-6 text-sm font-semibold text-earthy-green-600 hover:text-earthy-green-800 dark:text-earthy-green-400 dark:hover:text-white">
                                Ver todos los mensajes &rarr;
                            </Link>
                        </div>

                        {/* Widget: Últimos Documentos */}
                        <div className="bg-white dark:bg-earthy-green-800 overflow-hidden shadow-sm sm:rounded-lg p-6 md:col-span-2 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center">
                                    <DocumentTextIcon className="w-8 h-8 text-earthy-green-500" />
                                    <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Últimos Documentos Guardados</h3>
                                </div>
                                <ul className="mt-4 space-y-2">
                                    {ultimosDocumentos.length > 0 ? (
                                        ultimosDocumentos.map(doc => (
                                            <li key={doc.id} className="text-gray-700 dark:text-gray-300 truncate">
                                                {doc.nombre}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No has guardado ningún documento aún.</p>
                                    )}
                                </ul>
                            </div>
                            <Link href={route('documentos-importantes.index')} className="mt-6 text-sm font-semibold text-earthy-green-600 hover:text-earthy-green-800 dark:text-earthy-green-400 dark:hover:text-white">
                                Ver todos los documentos &rarr;
                            </Link>
                        </div>

                        {/* Widget: Últimos Recuerdos */}
                        <div className="bg-white dark:bg-earthy-green-800 overflow-hidden shadow-sm sm:rounded-lg p-6 md:col-span-3 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center">
                                    <PhotoIcon className="w-8 h-8 text-earthy-green-500" />
                                    <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Últimos Recuerdos Creados</h3>
                                </div>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {ultimosRecuerdos.length > 0 ? (
                                        ultimosRecuerdos.map(recuerdo => (
                                            <div key={recuerdo.id} className="bg-gray-50 dark:bg-earthy-green-900 p-4 rounded-lg">
                                                <p className="text-gray-800 dark:text-white font-semibold truncate">{recuerdo.titulo}</p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{recuerdo.descripcion}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No has creado ningún recuerdo aún.</p>
                                    )}
                                </div>
                            </div>
                             <Link href={route('recuerdos.index')} className="mt-6 text-sm font-semibold text-earthy-green-600 hover:text-earthy-green-800 dark:text-earthy-green-400 dark:hover:text-white">
                                Ver todos los recuerdos &rarr;
                            </Link>
                        </div>

                        {/* Widget: Detalles del Plan */}
                        <div className="bg-white dark:bg-earthy-green-800 overflow-hidden shadow-sm sm:rounded-lg p-6 md:col-span-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detalles de tu Plan ({is_admin ? 'Administrador' : auth.user.plan.name})</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
                                <div>
                                    <p className="font-medium">Mensajes Póstumos:</p>
                                    <p>{planFeatures.max_messages === 'ilimitado' ? 'Ilimitado' : planFeatures.max_messages}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Documentos Importantes:</p>
                                    <p>{planFeatures.max_documents === 'ilimitado' ? 'Ilimitado' : planFeatures.max_documents}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Recuerdos:</p>
                                    <p>{planFeatures.max_memories === 'ilimitado' ? 'Ilimitado' : planFeatures.max_memories}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Contactos de Confianza:</p>
                                    <p>{planFeatures.max_trusted_contacts === 'ilimitado' ? 'Ilimitado' : planFeatures.max_trusted_contacts}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Grabación de Video:</p>
                                    <p>{planFeatures.video_recording === 'true' ? 'Sí' : 'No'}</p>
                                </div>
                                {planFeatures.video_recording === 'true' && (
                                    <div>
                                        <p className="font-medium">Duración de Video:</p>
                                        <p>{planFeatures.video_duration / 60} minutos</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
