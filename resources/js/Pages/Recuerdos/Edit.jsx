import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Edit({ auth, recuerdo }) {
    const { data, setData, post, processing, errors } = useForm({
        titulo: recuerdo.titulo,
        historia: recuerdo.historia,
        ubicacion: recuerdo.ubicacion || '',
        fecha_recuerdo: recuerdo.fecha_recuerdo || '',
        visibilidad: recuerdo.visibilidad,
        archivos: [],
        archivos_existentes_ids: recuerdo.media.map(media => media.id),
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('recuerdos.update', recuerdo.id), {
            _method: 'put',
        });
    };

    const handleFileChange = (e) => {
        setData('archivos', Array.from(e.target.files));
    };

    const handleRemoveExistingFile = (idToRemove) => {
        setData('archivos_existentes_ids', data.archivos_existentes_ids.filter(id => id !== idToRemove));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Recuerdo</h2>}
        >
            <Head title="Editar Recuerdo" />

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
                                    <InputLabel value="Archivos Multimedia Existentes" />
                                    {recuerdo.media.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {recuerdo.media.map((mediaItem) => (
                                                <div key={mediaItem.id} className="relative border rounded-md p-2">
                                                    {mediaItem.tipo_media === 'imagen' && (
                                                        <img src={`/storage/${mediaItem.ruta_archivo}`} alt="Recuerdo" className="w-full h-24 object-cover rounded-md" />
                                                    )}
                                                    {mediaItem.tipo_media === 'video' && (
                                                        <video src={`/storage/${mediaItem.ruta_archivo}`} controls className="w-full h-24 object-cover rounded-md"></video>
                                                    )}
                                                    {mediaItem.tipo_media === 'audio' && (
                                                        <audio src={`/storage/${mediaItem.ruta_archivo}`} controls className="w-full"></audio>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingFile(mediaItem.id)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">No hay archivos multimedia existentes.</p>
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="archivos" value="Añadir Nuevos Archivos Multimedia" />
                                    <input
                                        id="archivos"
                                        type="file"
                                        multiple
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={handleFileChange}
                                    />
                                    <InputError className="mt-2" message={errors.archivos} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Actualizar Recuerdo</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
