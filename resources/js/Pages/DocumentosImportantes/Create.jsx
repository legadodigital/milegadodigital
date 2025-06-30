import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
        descripcion: '',
        categoria: '',
        nivel_acceso: 'privado',
        archivo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('documentos-importantes.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subir Documento Importante</h2>}
        >
            <Head title="Subir Documento Importante" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                                <div>
                                    <InputLabel htmlFor="titulo" value="Título" />
                                    <TextInput
                                        id="titulo"
                                        className="mt-1 block w-full"
                                        value={data.titulo}
                                        onChange={(e) => setData('titulo', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError className="mt-2" message={errors.titulo} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="descripcion" value="Descripción (Opcional)" />
                                    <textarea
                                        id="descripcion"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.descripcion} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="categoria" value="Categoría" />
                                    <TextInput
                                        id="categoria"
                                        className="mt-1 block w-full"
                                        value={data.categoria}
                                        onChange={(e) => setData('categoria', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.categoria} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="nivel_acceso" value="Nivel de Acceso" />
                                    <select
                                        id="nivel_acceso"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.nivel_acceso}
                                        onChange={(e) => setData('nivel_acceso', e.target.value)}
                                    >
                                        <option value="privado">Privado</option>
                                        <option value="confianza">Confianza</option>
                                        <option value="publico">Público</option>
                                    </select>
                                    <InputError className="mt-2" message={errors.nivel_acceso} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="archivo" value="Archivo" />
                                    <input
                                        id="archivo"
                                        type="file"
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setData('archivo', e.target.files[0])}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.archivo} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Subir Documento</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
