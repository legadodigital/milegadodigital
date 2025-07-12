import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function UpgradePlan({ auth, availablePlans, currentPlanId, oneclickInscriptions }) {
    const [paymentMethod, setPaymentMethod] = useState('webpay'); // 'webpay' or 'oneclick'

    const { data, setData, post, patch, processing, errors } = useForm({
        plan_id: currentPlanId,
        tbk_user: '',
    });

    const featureTranslations = {
        max_messages: 'Cantidad de Mensajes',
        max_documents: 'Cantidad de Documentos',
        video_recording: 'Grabación de Video',
        video_duration: 'Duración de Video (segundos)',
        max_trusted_contacts: 'Contactos de Confianza',
    };

    const submit = (e) => {
        e.preventDefault();
        const selectedPlan = availablePlans.find(plan => plan.id === data.plan_id);

        if (selectedPlan && selectedPlan.price > 0) {
            if (paymentMethod === 'webpay') {
                patch(route('profile.updatePlan')); // This will redirect to PaymentRedirect -> webpay.initiate
            } else if (paymentMethod === 'oneclick') {
                post(route('oneclick.payment'));
            }
        } else {
            // Free plan, update directly
            patch(route('profile.updatePlan'));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Actualizar Plan</h2>}
        >
            <Head title="Actualizar Plan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tu Plan Actual: {auth.user.plan.name}</h3>

                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label htmlFor="plan_id" className="block text-sm font-medium text-gray-700">Selecciona un nuevo plan:</label>
                                <select
                                    id="plan_id"
                                    name="plan_id"
                                    value={data.plan_id}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={(e) => setData('plan_id', e.target.value)}
                                >
                                    {availablePlans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name} {plan.price > 0 ? `(${plan.price}/mes)` : '(Gratis)'}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.plan_id} className="mt-2" />
                            </div>

                            {availablePlans.find(plan => plan.id === data.plan_id && plan.price > 0) && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago:</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio"
                                                name="payment_method"
                                                value="webpay"
                                                checked={paymentMethod === 'webpay'}
                                                onChange={() => setPaymentMethod('webpay')}
                                            />
                                            <span className="ml-2 text-gray-700">Webpay Plus</span>
                                        </label>
                                        {oneclickInscriptions.length > 0 && (
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio"
                                                    name="payment_method"
                                                    value="oneclick"
                                                    checked={paymentMethod === 'oneclick'}
                                                    onChange={() => setPaymentMethod('oneclick')}
                                                />
                                                <span className="ml-2 text-gray-700">Oneclick</span>
                                            </label>
                                        )}
                                    </div>

                                    {paymentMethod === 'oneclick' && oneclickInscriptions.length > 0 && (
                                        <div className="mt-4">
                                            <label htmlFor="tbk_user" className="block text-sm font-medium text-gray-700">Selecciona una tarjeta:</label>
                                            <select
                                                id="tbk_user"
                                                name="tbk_user"
                                                value={data.tbk_user}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={(e) => setData('tbk_user', e.target.value)}
                                                required={paymentMethod === 'oneclick'}
                                            >
                                                <option value="">-- Selecciona una tarjeta --</option>
                                                {oneclickInscriptions.map((inscription) => (
                                                    <option key={inscription.id} value={inscription.tbk_user}>
                                                        {inscription.card_type} - **** {inscription.card_number}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.tbk_user} className="mt-2" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <PrimaryButton disabled={processing}>
                                Actualizar Plan
                            </PrimaryButton>
                        </form>

                        <div className="mt-8">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Comparación de Planes</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availablePlans.map((plan) => (
                                    <div key={plan.id} className="border rounded-lg p-4 shadow-sm">
                                        <h5 className="text-xl font-bold mb-2">{plan.name}</h5>
                                        <p className="text-gray-600 mb-4">{plan.description}</p>
                                        <ul className="space-y-2">
                                            {plan.features.map((feature) => {
                                                let displayValue = feature.value;
                                                let featureName = featureTranslations[feature.feature_code] || feature.feature_code;
                                                let isUnavailable = false;

                                                if (feature.value === '-1') {
                                                    displayValue = 'Ilimitado';
                                                } else if (feature.feature_code === 'video_recording') {
                                                    if (feature.value === 'false') {
                                                        displayValue = 'No';
                                                        isUnavailable = true;
                                                    } else {
                                                        displayValue = 'Sí';
                                                    }
                                                } else if (feature.feature_code === 'video_duration') {
                                                    const duration = parseInt(feature.value, 10);
                                                    if (duration === 0) {
                                                        displayValue = 'No disponible';
                                                        isUnavailable = true;
                                                    } else if (duration % 60 === 0) {
                                                        displayValue = `${duration / 60} minutos`;
                                                    } else {
                                                        displayValue = `${duration} segundos`;
                                                    }
                                                } else if (feature.feature_code === 'max_messages') {
                                                    if (parseInt(feature.value, 10) === 0) {
                                                        displayValue = 'No disponible';
                                                        isUnavailable = true;
                                                    } else {
                                                        displayValue = `${feature.value} mensajes`;
                                                    }
                                                } else if (feature.feature_code === 'max_documents') {
                                                    if (parseInt(feature.value, 10) === 0) {
                                                        displayValue = 'No disponible';
                                                        isUnavailable = true;
                                                    } else {
                                                        displayValue = `${feature.value} documentos`;
                                                    }
                                                } else if (feature.feature_code === 'max_trusted_contacts') {
                                                    if (parseInt(feature.value, 10) === 0) {
                                                        displayValue = 'No disponible';
                                                        isUnavailable = true;
                                                    } else {
                                                        displayValue = `${feature.value} contactos`;
                                                    }
                                                }

                                                return (
                                                    <li key={feature.id} className="flex items-center text-gray-700">
                                                        {isUnavailable ? (
                                                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                            </svg>
                                                        )}
                                                        <span className="font-medium">{featureName}:</span> {displayValue}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

