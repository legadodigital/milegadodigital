import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Edit({ auth, contacto }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: contacto.nombre,
        email: contacto.email,
        telefono: contacto.telefono || '',
        relacion: contacto.relacion || '',
        nivel_acceso: contacto.nivel_acceso,
        notas: contacto.notas || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('contactos-confianza.update', contacto.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Contacto de Confianza</h2>}
        >
            <Head title="Editar Contacto de Confianza" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="nombre" value="Nombre" />
                                    <TextInput
                                        id="nombre"
                                        className="mt-1 block w-full"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError className="mt-2" message={errors.nombre} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="telefono" value="Teléfono (Opcional)" />
                                    <TextInput
                                        id="telefono"
                                        className="mt-1 block w-full"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.telefono} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="relacion" value="Relación (Opcional)" />
                                    <TextInput
                                        id="relacion"
                                        className="mt-1 block w-full"
                                        value={data.relacion}
                                        onChange={(e) => setData('relacion', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.relacion} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="nivel_acceso" value="Nivel de Acceso" />
                                    <select
                                        id="nivel_acceso"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.nivel_acceso}
                                        onChange={(e) => setData('nivel_acceso', e.target.value)}
                                    >
                                        <option value="limitado">Limitado</option>
                                        <option value="total">Total</option>
                                        <option value="emergencia">Emergencia</option>
                                    </select>
                                    <InputError className="mt-2" message={errors.nivel_acceso} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="notas" value="Notas (Opcional)" />
                                    <textarea
                                        id="notas"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.notas}
                                        onChange={(e) => setData('notas', e.target.value)}
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.notas} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Actualizar Contacto</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
