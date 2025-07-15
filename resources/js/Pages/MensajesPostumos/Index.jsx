import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';

export default function Index({ auth, mensajes }) {
    const { delete: destroy } = useForm();
    const { props } = usePage();
    const { plan, resource_counts } = props.auth.user;

    const canCreateMessage = plan.features.max_messages === '-1' || resource_counts.messages < plan.features.max_messages;

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje póstumo?')) {
            destroy(route('mensajes-postumos.destroy', id));
        }
    };

    const [showHelp, setShowHelp] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mensajes Póstumos</h2>}
        >
            <Head title="Mensajes Póstumos" />

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
                                    <h3 className="font-bold text-lg mb-2">Ayuda: Mensajes Póstumos</h3>
                                    <p className="mb-2">
                                        Aquí puedes gestionar tus mensajes póstumos. Estos mensajes serán entregados a tus seres queridos después de tu fallecimiento.
                                    </p>
                                    <ul className="list-disc list-inside">
                                        <li><strong>Crear Nuevo Mensaje:</strong> Permite redactar un nuevo mensaje, adjuntar archivos (imágenes, videos, audios) y especificar el destinatario y la fecha de entrega.</li>
                                        <li><strong>Editar:</strong> Modifica el contenido, destinatario o archivo de un mensaje existente.</li>
                                        <li><strong>Eliminar:</strong> Borra un mensaje póstumo de forma permanente.</li>
                                        <li><strong>Estado:</strong> Indica si el mensaje está pendiente de envío, ya fue enviado, leído o si hubo un fallo en la entrega.</li>
                                    </ul>
                                </div>
                            )}

                            <div className="flex justify-end mb-4">
                                <Link
                                    href={route('mensajes-postumos.create')}
                                    className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
                                        !canCreateMessage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                    }`}
                                    disabled={!canCreateMessage}
                                >
                                    Crear Nuevo Mensaje
                                </Link>
                            </div>

                            {!canCreateMessage && (
                                <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
                                    Has alcanzado el límite de mensajes póstumos para tu plan actual ({plan.name}). Para crear más, considera
                                    actualizar tu plan.
                                </div>
                            )}

                            {mensajes.length === 0 ? (
                                <p>No tienes mensajes póstumos creados.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b">Título</th>
                                                <th className="py-2 px-4 border-b">Tipo</th>
                                                <th className="py-2 px-4 border-b">Destinatario</th>
                                                <th className="py-2 px-4 border-b">Fecha de Entrega</th>
                                                <th className="py-2 px-4 border-b">Estado</th>
                                                <th className="py-2 px-4 border-b">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mensajes.map((mensaje) => (
                                                <tr key={mensaje.id}>
                                                    <td className="py-2 px-4 border-b">{mensaje.titulo}</td>
                                                    <td className="py-2 px-4 border-b">{mensaje.tipo_mensaje}</td>
                                                    <td className="py-2 px-4 border-b">{mensaje.destinatario_email}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        {mensaje.fecha_entrega ? (() => {
                                                            const dateString = mensaje.fecha_entrega + 'Z';
                                                            console.log('fecha_entrega raw:', mensaje.fecha_entrega);
                                                            console.log('dateString for new Date():', dateString);
                                                            const dateObject = new Date(dateString);
                                                            console.log('dateObject from new Date():', dateObject);
                                                            if (isNaN(dateObject.getTime())) {
                                                                console.error('Invalid Date object created for:', dateString);
                                                                return 'Fecha Inválida';
                                                            }
                                                            return format(dateObject, 'dd/MM/yyyy HH:mm');
                                                        })() : 'N/A'}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">{mensaje.estado}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        <Link
                                                            href={route('mensajes-postumos.edit', mensaje.id)}
                                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(mensaje.id)}
                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
