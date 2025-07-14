import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
        historia: '',
        ubicacion: '',
        fecha_recuerdo: '',
        visibilidad: 'privado',
        archivos: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('recuerdos.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleFileChange = (e) => {
        setData('archivos', Array.from(e.target.files));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Añadir Nuevo Recuerdo</h2>}
        >
            <Head title="Añadir Nuevo Recuerdo" />

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
                                    <InputLabel htmlFor="historia" value="Historia" />
                                    <textarea
                                        id="historia"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.historia}
                                        onChange={(e) => setData('historia', e.target.value)}
                                        required
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.historia} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="ubicacion" value="Ubicación (Opcional)" />
                                    <TextInput
                                        id="ubicacion"
                                        className="mt-1 block w-full"
                                        value={data.ubicacion}
                                        onChange={(e) => setData('ubicacion', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.ubicacion} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="fecha_recuerdo" value="Fecha del Recuerdo (Opcional)" />
                                    <TextInput
                                        id="fecha_recuerdo"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.fecha_recuerdo}
                                        onChange={(e) => setData('fecha_recuerdo', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.fecha_recuerdo} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="visibilidad" value="Visibilidad" />
                                    <select
                                        id="visibilidad"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.visibilidad}
                                        onChange={(e) => setData('visibilidad', e.target.value)}
                                    >
                                        <option value="privado">Privado</option>
                                        <option value="contactos">Solo Contactos</option>
                                        <option value="publico">Público</option>
                                    </select>
                                    <InputError className="mt-2" message={errors.visibilidad} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="archivos" value="Archivos Multimedia (Fotos/Videos/Audios)" />
                                    <input
                                        id="archivos"
                                        type="file"
                                        multiple
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={handleFileChange}
                                    />
                                    <InputError className="mt-2" message={errors.archivos} />
                                    <p className="mt-2 text-sm text-gray-600">Formatos permitidos: Imágenes (JPG, PNG, GIF), Audio (MP3, WAV, AAC). Tamaño máximo: 20MB.</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Guardar Recuerdo</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
