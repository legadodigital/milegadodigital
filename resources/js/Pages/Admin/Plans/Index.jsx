import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PlanIndex({ auth, plans: initialPlans }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este plan?')) {
            destroy(route('admin.plans.destroy', id), {
                onSuccess: () => {
                    // No need to fetch plans, Inertia will reload the page with updated data
                    // Or you can use Inertia.reload() or Inertia.visit(route('admin.plans.index'))
                    // For simplicity, we assume Inertia will handle the refresh on successful delete
                },
                onError: (errors) => console.error('Error deleting plan:', errors),
            });
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestionar Planes</h2>}
        >
            <Head title="Gestionar Planes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-end mb-4">
                            <Link href={route('admin.plans.create')} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                Crear Nuevo Plan
                            </Link>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {initialPlans.map((plan) => (
                                    <tr key={plan.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{plan.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{plan.slug}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${plan.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={route('admin.plans.edit', plan.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                Editar
                                            </Link>
                                            <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:text-red-900">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}