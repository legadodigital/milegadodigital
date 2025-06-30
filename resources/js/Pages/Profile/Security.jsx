import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdateSecuritySettingsForm from './Partials/UpdateSecuritySettingsForm';

export default function Security({ auth, configuracionSeguridad, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Configuración de Seguridad
                </h2>
            }
        >
            <Head title="Configuración de Seguridad" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateSecuritySettingsForm
                            configuracionSeguridad={configuracionSeguridad}
                            className="max-w-xl"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
