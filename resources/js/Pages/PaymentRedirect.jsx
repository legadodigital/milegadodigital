import React, { useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function PaymentRedirect({ plan_id }) {
    const { post } = useForm({ plan_id: plan_id });

    useEffect(() => {
        if (plan_id) {
            post(route('webpay.initiate'));
        }
    }, [plan_id]);

    return (
        <GuestLayout>
            <Head title="Redirigiendo al Pago" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Redirigiendo al proceso de pago...</h1>
                    <p className="text-gray-600 mb-6">Por favor, espera mientras te conectamos con la pasarela de pago.</p>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            </div>
        </GuestLayout>
    );
}
