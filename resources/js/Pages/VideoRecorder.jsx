
import React, { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function VideoRecorder({ auth }) {
    const { props } = usePage();
    const { plan } = props.auth.user;
    const canRecordVideo = plan.features.video_recording === 'true';
    const videoDurationLimit = parseInt(plan.features.video_duration, 10);

    const [isRecording, setIsRecording] = useState(false);
    const [videoURL, setVideoURL] = useState(null);
    const [tempVideoPath, setTempVideoPath] = useState(null); // New state for temporary video path
    const [remainingTime, setRemainingTime] = useState(videoDurationLimit);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        handleStopRecording();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRecording]);

    const handleStartRecording = async () => {
        if (!canRecordVideo) {
            alert('Tu plan actual no permite la grabación de video.');
            return;
        }

        setRemainingTime(videoDurationLimit);
        setVideoURL(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();

            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(recordedChunksRef.current, {
                    type: 'video/mp4'
                });
                const url = URL.createObjectURL(blob);
                setVideoURL(url);
                videoRef.current.srcObject = null;
                videoRef.current.src = url;
                videoRef.current.controls = true;
                recordedChunksRef.current = [];

                // Stop all tracks to turn off camera/mic lights
                stream.getTracks().forEach(track => track.stop());

                // Upload video to temporary storage
                const formData = new FormData();
                formData.append('video', blob, 'recorded-video.mp4');

                try {
                    const csrfToken = window.Laravel.csrfToken;
                    if (!csrfToken) {
                        console.error('CSRF token not found.');
                        alert('Error de seguridad: CSRF token no encontrado. Por favor, recarga la página.');
                        return;
                    }

                    const response = await fetch(route('mensajes-postumos.uploadVideoTemp'), {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-CSRF-TOKEN': csrfToken,
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setTempVideoPath(data.temp_video_path); // Store the temporary path
                    } else {
                        console.error('Error uploading video:', response.statusText);
                        alert('Error al subir el video. Por favor, inténtalo de nuevo.');
                    }
                } catch (error) {
                    console.error('Network error during video upload:', error);
                    alert('Error de red al subir el video. Por favor, inténtalo de nuevo.');
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('No se pudo acceder a la cámara o al micrófono. Asegúrate de haber dado permisos.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        clearInterval(timerRef.current);
    };

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = videoURL;
        a.download = 'legado-digital-video.mp4';
        a.click();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Grabar Video</h2>}
        >
            <Head title="Grabar Video" />

            <div className="py-12 bg-calm-green-100 dark:bg-calm-green-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-earthy-green-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col items-center">
                            {!canRecordVideo && (
                                <p className="text-red-500 mb-4">Tu plan actual no permite la grabación de video. Por favor, actualiza tu plan para acceder a esta función.</p>
                            )}
                            {canRecordVideo && videoDurationLimit > 0 && (
                                <p className="text-gray-600 dark:text-gray-300 mb-4">Tu plan permite grabar videos de hasta {videoDurationLimit / 60} minutos.</p>
                            )}
                            <video ref={videoRef} className="w-full max-w-3xl h-auto bg-black rounded-lg" playsInline muted={!videoURL}></video>
                            <div className="mt-4 flex space-x-4">
                                {!isRecording ? (
                                    <button onClick={handleStartRecording} className="px-4 py-2 bg-earthy-green-600 text-white rounded-md hover:bg-earthy-green-700" disabled={!canRecordVideo}>
                                        Comenzar a Grabar
                                    </button>
                                ) : (
                                    <button onClick={handleStopRecording} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                        Detener Grabación ({remainingTime}s)
                                    </button>
                                )}
                                {videoURL && (
                                    <button onClick={handleDownload} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Descargar Video
                                    </button>
                                )}
                                {tempVideoPath && (
                                    <a href={route('mensajes-postumos.create', { temp_video_path: tempVideoPath })} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                        Crear Mensaje Póstumo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
