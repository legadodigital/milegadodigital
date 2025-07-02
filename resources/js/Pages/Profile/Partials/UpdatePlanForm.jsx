import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';

export default function UpdatePlanForm({ className = '' }) {
    const { auth, userPlan, availablePlans } = usePage().props;
    const [showingPlansModal, setShowingPlansModal] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        plan_id: userPlan.id,
    });

    const confirmPlanUpdate = () => {
        setShowingPlansModal(true);
    };

    const closeModal = () => {
        setShowingPlansModal(false);
        reset();
    };

    const updatePlan = (planId) => {
        setData('plan_id', planId);
        patch(route('profile.updatePlan'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => reset(),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Información del Plan</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Gestiona tu plan de suscripción.
                </p>
            </header>

            <div className="mt-6 space-y-6">
                <div>
                    <InputLabel value="Plan Actual" />
                    <p className="mt-1 text-sm text-gray-900">
                        <span className="font-semibold">{userPlan.name}</span> - ${userPlan.price} / mes
                    </p>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                        {userPlan.features.map(feature => (
                            <li key={feature.id}>{feature.feature_code.replace(/_/g, ' ')}: {feature.value}</li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton onClick={confirmPlanUpdate}>Actualizar Plan</PrimaryButton>
                </div>
            </div>

            <Modal show={showingPlansModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Selecciona un Nuevo Plan
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Compara los planes disponibles y elige el que mejor se adapte a tus necesidades.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availablePlans.map((plan) => (
                            <div key={plan.id} className="border p-4 rounded-lg shadow-sm flex flex-col">
                                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                <p className="text-3xl font-bold mb-4">${plan.price}<span className="text-base font-medium">/mes</span></p>
                                <p className="text-sm text-gray-600 mb-4 flex-grow">{plan.description}</p>
                                <ul className="mb-4 text-sm text-gray-700 list-disc list-inside">
                                    {plan.features.map(feature => (
                                        <li key={feature.id}>{feature.feature_code.replace(/_/g, ' ')}: {feature.value}</li>
                                    ))}
                                </ul>
                                {userPlan.id === plan.id ? (
                                    <SecondaryButton disabled className="w-full">Plan Actual</SecondaryButton>
                                ) : (
                                    <PrimaryButton onClick={() => updatePlan(plan.id)} className="w-full" disabled={processing}>
                                        Seleccionar Plan
                                    </PrimaryButton>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
}