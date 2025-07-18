import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function Settings({ auth, proofOfLifeFrequencyDays, flash }) {
    const { data, setData, patch, processing, errors } = useForm({
        proof_of_life_frequency_days: proofOfLifeFrequencyDays || 90,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('proof-of-life.settings.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configuración de Prueba de Vida</h2>}
        >
            <Head title="Configuración de Prueba de Vida" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Typography variant="h6" component="h3" gutterBottom>
                                Frecuencia de Prueba de Vida
                            </Typography>

                            {flash.success && <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>}

                            <form onSubmit={submit}>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        label="Frecuencia (días)"
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        value={data.proof_of_life_frequency_days}
                                        onChange={(e) => setData('proof_of_life_frequency_days', e.target.value)}
                                        required
                                        error={!!errors.proof_of_life_frequency_days}
                                        helperText={errors.proof_of_life_frequency_days}
                                    />
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Cada cuántos días el sistema solicitará una prueba de vida. Ingresa 0 para deshabilitar.
                                    </Typography>
                                </Box>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Guardar Configuración
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
