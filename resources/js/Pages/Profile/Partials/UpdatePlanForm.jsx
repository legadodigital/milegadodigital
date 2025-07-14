import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';

export default function UpdatePlanForm({ className = '' }) {
    const { userPlan, availablePlans } = usePage().props;
    const [showingPlansModal, setShowingPlansModal] = useState(false);

    const { data, setData, patch, processing, reset, errors } = useForm({
        plan_id: userPlan.id,
        billing_cycle: 'monthly',
    });

    const selectedPlan = availablePlans.find(p => p.id === data.plan_id);

    useEffect(() => {
        // Reset billing cycle to monthly whenever the plan changes
        setData(prevData => ({ ...prevData, billing_cycle: 'monthly' }));
    }, [data.plan_id]);

    const confirmPlanUpdate = () => {
        reset(); // Reset form state to initial on modal open
        setData({
            plan_id: userPlan.id,
            billing_cycle: 'monthly',
        });
        setShowingPlansModal(true);
    };

    const closeModal = () => {
        setShowingPlansModal(false);
        reset();
    };

    const submitPlanUpdate = (e) => {
        e.preventDefault();
        patch(route('profile.updatePlan'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const calculateAnnualPrice = (plan) => {
        const monthlyPrice = parseFloat(plan.price);
        const discount = parseFloat(plan.annual_discount_percentage);
        const annualPrice = (monthlyPrice * 12 * (1 - discount / 100));
        return annualPrice.toFixed(2);
    };

    const getPlanPrice = (plan) => {
        if (data.billing_cycle === 'annually' && plan.annual_discount_percentage > 0) {
            const annualPrice = calculateAnnualPrice(plan);
            return {
                price: (annualPrice / 12).toFixed(2),
                period: 'mes (pago anual)',
                total: `Total Anual: ${annualPrice}`
            };
        }
        return { price: plan.price, period: 'mes' };
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
                <form onSubmit={submitPlanUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Selecciona un Nuevo Plan
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Compara los planes disponibles y elige el que mejor se adapte a tus necesidades.
                    </p>

                    {selectedPlan && selectedPlan.annual_discount_percentage > 0 && (
                        <div className="my-4 flex items-center justify-center">
                            <span className={`mr-3 text-sm font-medium ${data.billing_cycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                                Pago Mensual
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={data.billing_cycle === 'annually'}
                                    onChange={() => setData('billing_cycle', data.billing_cycle === 'monthly' ? 'annually' : 'monthly')}
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                            <span className={`ml-3 text-sm font-medium ${data.billing_cycle === 'annually' ? 'text-gray-900' : 'text-gray-500'}`}>
                                Pago Anual
                                <span className="text-xs text-green-600 ml-1">
                                    (Ahorra {selectedPlan.annual_discount_percentage}%)
                                </span>
                            </span>
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availablePlans.map((plan) => {
                            const planPrice = getPlanPrice(plan);
                            return (
                                <div
                                    key={plan.id}
                                    className={`border p-4 rounded-lg shadow-sm flex flex-col cursor-pointer ${data.plan_id === plan.id ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}
                                    onClick={() => setData('plan_id', plan.id)}
                                >
                                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                    <p className="text-3xl font-bold mb-1">${planPrice.price}<span className="text-base font-medium">/{planPrice.period}</span></p>
                                    {planPrice.total && <p className="text-xs text-gray-500 mb-4">{planPrice.total}</p>}
                                    <p className="text-sm text-gray-600 mb-4 flex-grow">{plan.description}</p>
                                    <ul className="mb-4 text-sm text-gray-700 list-disc list-inside">
                                        {plan.features.map(feature => (
                                            <li key={feature.id}>{feature.feature_code.replace(/_/g, ' ')}: {feature.value}</li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing || data.plan_id === userPlan.id}>
                            Actualizar Plan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}