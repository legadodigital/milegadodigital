import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function OneclickManagement({ auth, inscriptions }) {
    const { post, processing, delete: destroy } = useForm();

    const handleInitiateInscription = () => {
        post(route('oneclick.initiateInscription'));
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarjeta inscrita?')) {
            destroy(route('oneclick.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Oneclick</h2>}
        >
            <Head title="Gestión de Oneclick" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Inscribir Nueva Tarjeta</h3>
                        <p className="text-gray-600 mb-4">Inscribe una nueva tarjeta para realizar pagos con un solo clic.</p>
                        <PrimaryButton onClick={handleInitiateInscription} disabled={processing}>
                            Inscribir Tarjeta
                        </PrimaryButton>

                        <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Tus Tarjetas Inscritas</h3>
                        {inscriptions.length === 0 ? (
                            <p className="text-gray-600">No tienes tarjetas inscritas con Oneclick.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b">Tipo de Tarjeta</th>
                                            <th className="py-2 px-4 border-b">Número de Tarjeta</th>
                                            <th className="py-2 px-4 border-b">Estado</th>
                                            <th className="py-2 px-4 border-b">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inscriptions.map((inscription) => (
                                            <tr key={inscription.id}>
                                                <td className="py-2 px-4 border-b">{inscription.card_type}</td>
                                                <td className="py-2 px-4 border-b">{inscription.card_number}</td>
                                                <td className="py-2 px-4 border-b">{inscription.is_active ? 'Activa' : 'Inactiva'}</td>
                                                <td className="py-2 px-4 border-b">
                                                    <button
                                                        onClick={() => handleDelete(inscription.id)}
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
        </AuthenticatedLayout>
    );
}
