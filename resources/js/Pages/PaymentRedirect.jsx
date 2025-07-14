import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function PaymentRedirect({ plan_id, billing_cycle, csrf_token }) {
    const { post, processing } = useForm();

    useEffect(() => {
        const form = document.getElementById('payment-form');
        if (form) {
            form.submit();
        }
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Redirigiendo a Transbank...</h2>
            <p>Por favor, espera mientras te redirigimos a la plataforma de pago segura.</p>
            <form id="payment-form" action={route('webpay.initiate')} method="POST" style={{ display: 'none' }}>
                <input type="hidden" name="_token" value={csrf_token} />
                <input type="hidden" name="plan_id" value={plan_id} />
                <input type="hidden" name="billing_cycle" value={billing_cycle} />
            </form>
            {processing && <p>Procesando...</p>}
        </div>
    );
}
