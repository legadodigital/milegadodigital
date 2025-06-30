import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';

export default function Index({ auth, mensajes }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje póstumo?')) {
            destroy(route('mensajes-postumos.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mensajes Póstumos</h2>}
        >
            <Head title="Mensajes Póstumos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-end mb-4">
                                <Link
                                    href={route('mensajes-postumos.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Crear Nuevo Mensaje
                                </Link>
                            </div>

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
                                                        {format(new Date(mensaje.fecha_entrega), 'dd/MM/yyyy HH:mm')}
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
