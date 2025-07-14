import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ plans }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        plan_id: '',
        billing_cycle: 'monthly', // Default to monthly
    });

    const selectedPlan = plans.find(plan => plan.id == data.plan_id);

    const calculatePrice = (plan) => {
        if (!plan) return '';
        if (plan.price === '0.00') return 'Gratis';

        const monthlyPrice = parseFloat(plan.price);
        if (data.billing_cycle === 'monthly') {
            return `${monthlyPrice.toFixed(2)}/mes`;
        } else {
            const annualPriceBeforeDiscount = monthlyPrice * 12;
            const discountAmount = annualPriceBeforeDiscount * (parseFloat(plan.annual_discount_percentage) / 100);
            const annualPriceAfterDiscount = annualPriceBeforeDiscount - discountAmount;
            return `${annualPriceAfterDiscount.toFixed(2)}/año (Ahorra ${plan.annual_discount_percentage}%)`;
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Correo Electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                    <p className="text-sm text-gray-600 mt-1">
                        La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo.
                    </p>
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Plan Selection */}
                <div className="mt-4">
                    <InputLabel htmlFor="plan_id" value="Seleccionar Plan" />
                    <select
                        id="plan_id"
                        name="plan_id"
                        value={data.plan_id}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={(e) => setData('plan_id', e.target.value)}
                        required
                    >
                        <option value="">-- Selecciona un Plan --</option>
                        {plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                                {plan.name} {plan.price > 0 ? `(${calculatePrice(plan)})` : '(Gratis)'}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.plan_id} className="mt-2" />
                </div>

                {selectedPlan && selectedPlan.price > 0 && selectedPlan.annual_discount_percentage > 0 && (
                    <div className="mt-4">
                        <InputLabel value="Frecuencia de Pago" />
                        <div className="mt-1 flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="billing_cycle"
                                    value="monthly"
                                    checked={data.billing_cycle === 'monthly'}
                                    onChange={(e) => setData('billing_cycle', e.target.value)}
                                    className="form-radio"
                                />
                                <span className="ml-2 text-gray-700">Mensual</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="billing_cycle"
                                    value="annually"
                                    checked={data.billing_cycle === 'annually'}
                                    onChange={(e) => setData('billing_cycle', e.target.value)}
                                    className="form-radio"
                                />
                                <span className="ml-2 text-gray-700">Anual (Ahorra {selectedPlan.annual_discount_percentage}%)</span>
                            </label>
                        </div>
                        <InputError message={errors.billing_cycle} className="mt-2" />
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        ¿Ya estás registrado?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
