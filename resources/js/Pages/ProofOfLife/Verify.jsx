import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function Verify({ auth, errors }) {
    const { data, setData, post, processing } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('proof-of-life.verify.code'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verificar Prueba de Vida</h2>}
        >
            <Head title="Verificar Prueba de Vida" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Typography variant="h6" component="h3" gutterBottom>
                                Ingresa tu Código de Prueba de Vida
                            </Typography>

                            {errors.code && <Alert severity="error" sx={{ mb: 2 }}>{errors.code}</Alert>}
                            {errors.limit && <Alert severity="error" sx={{ mb: 2 }}>{errors.limit}</Alert>}

                            <form onSubmit={submit}>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        label="Código"
                                        variant="outlined"
                                        fullWidth
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        required
                                        error={!!errors.code}
                                        helperText={errors.code}
                                    />
                                </Box>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Verificar Código
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
