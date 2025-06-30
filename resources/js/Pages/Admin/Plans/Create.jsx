import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function PlanCreate({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        price: '',
        description: '',
        features: [],
    });

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...data.features];
        newFeatures[index][field] = value;
        setData('features', newFeatures);
    };

    const addFeature = () => {
        setData('features', [...data.features, { feature_code: '', value: '' }]);
    };

    const removeFeature = (index) => {
        const newFeatures = [...data.features];
        newFeatures.splice(index, 1);
        setData('features', newFeatures);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.plans.store'));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nuevo Plan</h2>}
        >
            <Head title="Crear Plan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Plan</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                                <input
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Características del Plan</h3>
                                {data.features.map((feature, index) => (
                                    <div key={index} className="flex space-x-4 mt-2">
                                        <input
                                            type="text"
                                            placeholder="Código de Característica (ej. max_messages)"
                                            value={feature.feature_code}
                                            onChange={(e) => handleFeatureChange(index, 'feature_code', e.target.value)}
                                            className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Valor (ej. 5 o ilimitado)"
                                            value={feature.value}
                                            onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                                            className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        <button type="button" onClick={() => removeFeature(index)} className="px-3 py-1 bg-red-500 text-white rounded-md">
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addFeature} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">
                                    Añadir Característica
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                disabled={processing}
                            >
                                Crear Plan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
