import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateSecuritySettingsForm({ configuracionSeguridad, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        session_timeout: configuracionSeguridad.session_timeout,
        biometria_habilitada: configuracionSeguridad.biometria_habilitada,
        nivel_encriptacion: configuracionSeguridad.nivel_encriptacion,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.updateSecurity'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Configuración de Seguridad</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Actualiza las preferencias de seguridad de tu cuenta.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="session_timeout" value="Tiempo de Inactividad de Sesión (segundos)" />

                    <TextInput
                        id="session_timeout"
                        type="number"
                        className="mt-1 block w-full"
                        value={data.session_timeout}
                        onChange={(e) => setData('session_timeout', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.session_timeout} />
                </div>

                <div>
                    <InputLabel htmlFor="biometria_habilitada" value="Habilitar Biometría" />

                    <input
                        id="biometria_habilitada"
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        checked={data.biometria_habilitada}
                        onChange={(e) => setData('biometria_habilitada', e.target.checked)}
                    />

                    <InputError className="mt-2" message={errors.biometria_habilitada} />
                </div>

                <div>
                    <InputLabel htmlFor="nivel_encriptacion" value="Nivel de Encriptación" />

                    <select
                        id="nivel_encriptacion"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.nivel_encriptacion}
                        onChange={(e) => setData('nivel_encriptacion', e.target.value)}
                        required
                    >
                        <option value="AES-128">AES-128</option>
                        <option value="AES-256">AES-256</option>
                    </select>

                    <InputError className="mt-2" message={errors.nivel_encriptacion} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
