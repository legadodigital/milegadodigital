import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { format } from "date-fns";

export default function Edit({ auth, mensaje }) {
    const { data, setData, post, processing, errors } = useForm({
        titulo: mensaje.titulo,
        contenido: mensaje.contenido || "",
        tipo_mensaje: mensaje.tipo_mensaje,
        destinatario_email: mensaje.destinatario_email,
        destinatario_nombre: mensaje.destinatario_nombre || "",
        fecha_entrega: mensaje.fecha_entrega
            ? (() => {
                  const date = new Date(mensaje.fecha_entrega);

                  // Formato manual sin milisegundos ni zona horaria
                  const year = String(date.getFullYear());
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  const hours = String(date.getHours()).padStart(2, "0");
                  const minutes = String(date.getMinutes()).padStart(2, "0");

                  const formattedValue = `${year}-${month}-${day}T${hours}:${minutes}`;

                  return formattedValue;
              })()
            : "",
        archivo: null,
        _method: "put",
    });

    const submit = (e) => {
        e.preventDefault();

        // Preparar payload
        const payload = { ...data };

        // Convertir fecha_entrega a ISO solo antes de enviar
        if (payload.fecha_entrega) {
            const localDate = new Date(payload.fecha_entrega);
            payload.fecha_entrega = localDate.toISOString();
        }

        post(route("mensajes-postumos.update", mensaje.id), {
            data: payload,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editar Mensaje Póstumo
                </h2>
            }
        >
            <Head title="Editar Mensaje Póstumo" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form
                                onSubmit={submit}
                                className="mt-6 space-y-6"
                                encType="multipart/form-data"
                            >
                                {/* Campos anteriores... (sin cambios) */}

                                {/* Campo Fecha de Entrega MODIFICADO */}
                                <div>
                                    <InputLabel
                                        htmlFor="fecha_entrega"
                                        value="Fecha de Entrega"
                                    />
                                    <TextInput
                                        id="fecha_entrega"
                                        type="datetime-local"
                                        className="mt-1 block w-full"
                                        value={data.fecha_entrega}
                                        onChange={(e) =>
                                            setData(
                                                "fecha_entrega",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.fecha_entrega}
                                    />
                                </div>

                                {/* Otros campos... (sin cambios) */}

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Actualizar
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
