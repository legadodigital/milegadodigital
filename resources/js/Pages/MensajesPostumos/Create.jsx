import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useEffect } from "react";
import { format, parseISO, parse } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: "",
        contenido: "",
        tipo_mensaje: "texto",
        destinatario_email: "",
        destinatario_nombre: "",
        fecha_entrega: "",
        archivo: null,
        temp_video_path: null,
    });

    useEffect(() => {
        if (data.temp_video_path) {
            setData("tipo_mensaje", "video");
        }
    }, [data.temp_video_path]);

    const submit = (e) => {
        e.preventDefault();

        post(route("mensajes-postumos.store"), {
            onSuccess: () => reset(),
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Crear Mensaje Póstumo
                </h2>
            }
        >
            <Head title="Crear Mensaje Póstumo" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form
                                onSubmit={submit}
                                className="mt-6 space-y-6"
                                encType="multipart/form-data"
                            >
                                <div>
                                    <InputLabel htmlFor="titulo" value="Título" />
                                    <TextInput
                                        id="titulo"
                                        className="mt-1 block w-full"
                                        value={data.titulo}
                                        onChange={(e) =>
                                            setData("titulo", e.target.value)
                                        }
                                        required
                                        isFocused
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.titulo}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="contenido"
                                        value="Contenido (Texto)"
                                    />
                                    <textarea
                                        id="contenido"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.contenido}
                                        onChange={(e) =>
                                            setData("contenido", e.target.value)
                                        }
                                    ></textarea>
                                    <InputError
                                        className="mt-2"
                                        message={errors.contenido}
                                    />
                                </div>

                                {data.tipo_mensaje === "video" &&
                                    data.temp_video_path && (
                                        <div className="mt-4">
                                            <InputLabel value="Previsualización del Video" />
                                            <video
                                                controls
                                                src={`/storage/${data.temp_video_path}`}
                                                className="mt-1 block w-full max-w-md rounded-md"
                                            />
                                        </div>
                                    )}

                                {data.tipo_mensaje !== "texto" && (
                                    <div>
                                        <InputLabel
                                            htmlFor="archivo"
                                            value="Archivo (Audio/Video)"
                                        />
                                        <input
                                            id="archivo"
                                            type="file"
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={(e) =>
                                                setData(
                                                    "archivo",
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.archivo}
                                        />
                                        <p className="mt-2 text-sm text-gray-600">
                                            Formatos permitidos: Imágenes (JPG,
                                            PNG, GIF, BMP, SVG, WEBP), Video
                                            (MP4, MOV, OGG, QT), Audio (MP3,
                                            WAV, AAC). Tamaño máximo: 20MB.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <InputLabel
                                        htmlFor="tipo_mensaje"
                                        value="Tipo de Mensaje"
                                    />
                                    <select
                                        id="tipo_mensaje"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.tipo_mensaje}
                                        onChange={(e) =>
                                            setData(
                                                "tipo_mensaje",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="texto">Texto</option>
                                        <option value="video">Video</option>
                                        <option value="audio">Audio</option>
                                    </select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.tipo_mensaje}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="destinatario_email"
                                        value="Email del Destinatario"
                                    />
                                    <TextInput
                                        id="destinatario_email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.destinatario_email}
                                        onChange={(e) =>
                                            setData(
                                                "destinatario_email",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.destinatario_email}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="destinatario_nombre"
                                        value="Nombre del Destinatario (Opcional)"
                                    />
                                    <TextInput
                                        id="destinatario_nombre"
                                        className="mt-1 block w-full"
                                        value={data.destinatario_nombre}
                                        onChange={(e) =>
                                            setData(
                                                "destinatario_nombre",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.destinatario_nombre}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="fecha_entrega"
                                        value="Fecha de Entrega"
                                    />
                                    <TextInput
                                        id="fecha_entrega"
                                        type="datetime-local"
                                        className="mt-1 block w-full"
                                        value={data.fecha_entrega ? format(new Date(data.fecha_entrega),  'yyyy-MM-dd\'T\'HH:mm') : ''}
                                        onChange={(e) => setData("fecha_entrega", e.target.value)}
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.fecha_entrega}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Guardar
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
