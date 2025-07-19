import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, totalUsers, usersByPlan, totalMensajesPostumos, totalDocumentosImportantes, totalContactosConfianza, totalPayments }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard de Administrador</h2>}
        >
            <Head title="Dashboard de Administrador" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900">Resumen General</h3>
                            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Usuarios</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalUsers}</dd>
                                </div>
                                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Mensajes Póstumos</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalMensajesPostumos}</dd>
                                </div>
                                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Documentos Importantes</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalDocumentosImportantes}</dd>
                                </div>
                                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Contactos de Confianza</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalContactosConfianza}</dd>
                                </div>
                                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pagos Registrados</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalPayments}</dd>
                                </div>
                            </div>

                            <h3 className="text-lg font-medium text-gray-900 mt-8">Usuarios por Plan</h3>
                            <div className="mt-4">
                                <div className="-mx-4 mt-8 flow-root sm:mx-0">
                                    <table className="min-w-full">
                                        <colgroup>
                                            <col className="w-full sm:w-1/2" />
                                            <col className="sm:w-1/2" />
                                        </colgroup>
                                        <thead className="border-b border-gray-300 text-gray-900">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Plan</th>
                                                <th scope="col" className="hidden py-3.5 px-3 text-right text-sm font-semibold text-gray-900 sm:table-cell">Usuarios</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersByPlan.map((plan) => (
                                                <tr key={plan.name} className="border-b border-gray-200">
                                                    <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                        <div className="font-medium text-gray-900">{plan.name}</div>
                                                    </td>
                                                    <td className="hidden py-5 px-3 text-right text-sm text-gray-500 sm:table-cell">{plan.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}