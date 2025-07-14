import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';

export default function Index({ auth, recuerdos }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este recuerdo?')) {
            destroy(route('recuerdos.destroy', id));
        }
    };

    const [showHelp, setShowHelp] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Libro de Recuerdos</h2>}
        >
            <Head title="Libro de Recuerdos" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <button
                                onClick={() => setShowHelp(!showHelp)}
                                className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                            >
                                {showHelp ? 'Ocultar Ayuda' : 'Mostrar Ayuda'}
                            </button>

                            {showHelp && (
                                <div className="mb-4 p-4 bg-blue-100 border border-blue-200 text-blue-800 rounded-lg">
                                    <h3 className="font-bold text-lg mb-2">Ayuda: Libro de Recuerdos</h3>
                                    <p className="mb-2">
                                        Aquí puedes guardar y organizar tus recuerdos más preciados, incluyendo fotos y audios.
                                    </p>
                                    <ul className="list-disc list-inside">
                                        <li><strong>Añadir Nuevo Recuerdo:</strong> Crea una entrada para un recuerdo, con su historia, ubicación, fecha y archivos multimedia.</li>
                                        <li><strong>Editar:</strong> Modifica los detalles o los archivos de un recuerdo existente.</li>
                                        <li><strong>Eliminar:</strong> Borra un recuerdo de forma permanente.</li>
                                        <li><strong>Visibilidad:</strong> Controla quién puede ver tus recuerdos (privado, solo contactos, o público).</li>
                                    </ul>
                                </div>
                            )}

                            <div className="flex justify-end mb-4">
                                <Link
                                    href={route('recuerdos.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Añadir Nuevo Recuerdo
                                </Link>
                            </div>

                            {recuerdos.length === 0 ? (
                                <p>No tienes recuerdos añadidos.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recuerdos.map((recuerdo) => (
                                        <div key={recuerdo.id} className="border rounded-lg p-4 shadow-md">
                                            <h3 className="text-lg font-semibold mb-2">{recuerdo.titulo}</h3>
                                            <p className="text-gray-700 text-sm mb-2">{recuerdo.historia.substring(0, 100)}...</p>
                                            {recuerdo.media.length > 0 && (
                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                    {recuerdo.media.map((mediaItem) => (
                                                        <div key={mediaItem.id}>
                                                            {mediaItem.tipo_media === 'imagen' && (
                                                                <img src={`/storage/${mediaItem.ruta_archivo}`} alt="Recuerdo" className="w-full h-32 object-cover rounded-md" />
                                                            )}
                                                            {mediaItem.tipo_media === 'video' && (
                                                                <video src={`/storage/${mediaItem.ruta_archivo}`} controls className="w-full h-32 object-cover rounded-md"></video>
                                                            )}
                                                            {mediaItem.tipo_media === 'audio' && (
                                                                <audio src={`/storage/${mediaItem.ruta_archivo}`} controls className="w-full"></audio>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-gray-600 text-xs">Ubicación: {recuerdo.ubicacion || 'N/A'}</p>
                                            <p className="text-gray-600 text-xs">Fecha: {recuerdo.fecha_recuerdo ? format(new Date(recuerdo.fecha_recuerdo), 'dd/MM/yyyy') : 'N/A'}</p>
                                            <p className="text-gray-600 text-xs">Visibilidad: {recuerdo.visibilidad}</p>
                                            <div className="mt-4 flex justify-end">
                                                <Link
                                                    href={route('recuerdos.edit', recuerdo.id)}
                                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(recuerdo.id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
