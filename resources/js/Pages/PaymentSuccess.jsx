import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function PaymentSuccess({ message, response }) {
    return (
        <GuestLayout>
            <Head title="Pago Exitoso" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    <svg
                        className="mx-auto mb-4 h-16 w-16 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Pago Exitoso!</h1>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="text-left text-sm text-gray-700 mb-6">
                        <p><strong>Código de Autorización:</strong> {response.authorizationCode}</p>
                        <p><strong>Monto:</strong> ${response.amount}</p>
                        <p><strong>Estado:</strong> {response.responseCode === 0 ? 'Aprobado' : 'Rechazado'}</p>
                        <p><strong>Tipo de Pago:</strong> {response.paymentTypeCode}</p>
                        <p><strong>Fecha:</strong> {response.transactionDate}</p>
                    </div>
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Ir al Dashboard
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
