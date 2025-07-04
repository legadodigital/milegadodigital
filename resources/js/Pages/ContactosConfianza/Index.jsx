import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Index({ auth, contactos }) {
    const { delete: destroy } = useForm();
    const { props } = usePage();
    const { plan, resource_counts } = props.auth.user;

    const canAddContact = plan.features.max_trusted_contacts === '-1' || resource_counts.trusted_contacts < plan.features.max_trusted_contacts;

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este contacto de confianza?')) {
            destroy(route('contactos-confianza.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Contactos de Confianza</h2>}
        >
            <Head title="Contactos de Confianza" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-end mb-4">
                                <Link
                                    href={route('contactos-confianza.create')}
                                    className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
                                        !canAddContact ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                    }`}
                                    disabled={!canAddContact}
                                >
                                    Añadir Nuevo Contacto
                                </Link>
                            </div>

                            {!canAddContact && (
                                <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
                                    Has alcanzado el límite de contactos de confianza para tu plan actual ({plan.name}). Para añadir más, considera
                                    actualizar tu plan.
                                </div>
                            )}

                            {contactos.length === 0 ? (
                                <p>No tienes contactos de confianza añadidos.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b">Nombre</th>
                                                <th className="py-2 px-4 border-b">Email</th>
                                                <th className="py-2 px-4 border-b">Teléfono</th>
                                                <th className="py-2 px-4 border-b">Relación</th>
                                                <th className="py-2 px-4 border-b">Nivel de Acceso</th>
                                                <th className="py-2 px-4 border-b">Verificado</th>
                                                <th className="py-2 px-4 border-b">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contactos.map((contacto) => (
                                                <tr key={contacto.id}>
                                                    <td className="py-2 px-4 border-b">{contacto.nombre}</td>
                                                    <td className="py-2 px-4 border-b">{contacto.email}</td>
                                                    <td className="py-2 px-4 border-b">{contacto.telefono || 'N/A'}</td>
                                                    <td className="py-2 px-4 border-b">{contacto.relacion || 'N/A'}</td>
                                                    <td className="py-2 px-4 border-b">{contacto.nivel_acceso}</td>
                                                    <td className="py-2 px-4 border-b">{contacto.verificado ? 'Sí' : 'No'}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        <Link
                                                            href={route('contactos-confianza.edit', contacto.id)}
                                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(contacto.id)}
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
