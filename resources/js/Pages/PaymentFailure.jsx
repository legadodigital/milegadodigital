import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function PaymentFailure({ message, response }) {
    return (
        <GuestLayout>
            <Head title="Pago Fallido" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    <svg
                        className="mx-auto mb-4 h-16 w-16 text-red-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Pago Fallido!</h1>
                    <p className="text-gray-600 mb-6">{message}</p>
                    {response && (
                        <div className="text-left text-sm text-gray-700 mb-6">
                            <p><strong>Código de Respuesta:</strong> {response.responseCode}</p>
                            <p><strong>Mensaje de Respuesta:</strong> {response.responseCode === -1 ? 'Rechazo de transacción' : response.responseCode === -2 ? 'Transacción debe reintentarse' : response.responseCode === -3 ? 'Error de Transacción' : response.responseCode === -4 ? 'Rechazo de Transacción' : response.responseCode === -5 ? 'Rechazo por error de tasa' : response.responseCode === -6 ? 'Excede cupo máximo mensual' : response.responseCode === -7 ? 'Excede límite diario por transacción' : response.responseCode === -8 ? 'Rubro no autorizado' : 'Desconocido'}</p>
                            <p><strong>Monto:</strong> ${response.amount}</p>
                            <p><strong>Fecha:</strong> {response.transactionDate}</p>
                        </div>
                    )}
                    <Link
                        href={route('register')}
                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Intentar de Nuevo
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
