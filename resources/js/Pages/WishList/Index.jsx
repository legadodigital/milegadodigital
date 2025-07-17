import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head, useForm } from '@inertiajs/react';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';

export default function WishListIndex({ auth, wishListItems }) {
    const { data, setData, post, patch, delete: destroy, errors, reset } = useForm({
        description: '',
        completed: false,
        completion_date: '',
    });

    const { patch: patchCompletion } = useForm();

    const [editingItem, setEditingItem] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (editingItem) {
            patch(route('wishlist.update', editingItem.id), {
                onSuccess: () => {
                    setEditingItem(null);
                    reset();
                },
            });
        } else {
            post(route('wishlist.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        const formattedCompletionDate = item.completion_date ? format(parseISO(item.completion_date), 'yyyy-MM-dd') : '';
        setData({ description: item.description, completed: item.completed, completion_date: formattedCompletionDate });
    };

    const handleToggleComplete = (item) => {
        const newCompletedStatus = !item.completed;
        const newCompletionDate = newCompletedStatus ? new Date().toISOString().slice(0, 10) : null;
        patchCompletion(route('wishlist.update', item.id), {
            completed: newCompletedStatus,
            completion_date: newCompletionDate,
        });
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este deseo?')) {
            destroy(route('wishlist.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de Deseos</h2>}
        >
            <Head title="Lista de Deseos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingItem ? 'Editar Deseo' : 'Agregar Nuevo Deseo'}
                            </h3>
                            <form onSubmit={submit} className="flex flex-col space-y-4 mb-8">
                                <div>
                                    <TextInput
                                        id="description"
                                        className="w-full"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Descripción del Deseo"
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {editingItem && (
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="checkbox"
                                            id="completed"
                                            checked={data.completed}
                                            onChange={(e) => {
                                                setData('completed', e.target.checked);
                                                if (!e.target.checked) {
                                                    setData('completion_date', '');
                                                }
                                            }}
                                            className="rounded text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <label htmlFor="completed" className="text-gray-700">Completado</label>

                                        {data.completed && (
                                            <TextInput
                                                id="completion_date"
                                                type="date"
                                                className="flex-grow"
                                                value={data.completion_date || ''}
                                                onChange={(e) => setData('completion_date', e.target.value)}
                                            />
                                        )}
                                        <InputError message={errors.completion_date} className="mt-2" />
                                    </div>
                                )}

                                <div className="flex items-center space-x-4">
                                    <PrimaryButton type="submit">
                                        {editingItem ? 'Actualizar' : 'Agregar'}
                                    </PrimaryButton>
                                    {editingItem && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingItem(null);
                                                reset();
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>

                            <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Deseos</h3>
                            {wishListItems.length === 0 ? (
                                <p>No tienes Deseos en tu lista de deseos.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {wishListItems.map((item) => (
                                        <li key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.completed}
                                                    onChange={() => handleToggleComplete(item)}
                                                    className="mr-3 rounded text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <span className={`text-gray-800 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                                                    {item.description}
                                                </span>
                                                {item.completed && item.completion_date && (
                                                    <span className="ml-2 text-sm text-gray-500">({format(parseISO(item.completion_date), 'dd-MM-yyyy')})</span>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
