'use client'

import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import MainButton from '@/app/components/mainButton';
import Notification from '@/app/components/notification';
import PopUpNotification from '@/app/components/popUpNotification';
import { Player } from '@/app/types';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PublishForm = () => {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [price, setPrice] = useState<number>(0);
    const [players, setPlayers] = useState<Player[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [pageIsLoading, setPageIsLoading] = useState(true);
    const loggedUser = useSelector((state: RootState) => state.user);
    const [showPublishPopUpNotification, setShowPublishPopUpNotification] = useState(false);
    const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
    const teamId = loggedUser.user?.team?.id;

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ ...notification, show: false });
        }, 5000);
    };

    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error',
    });

    const fetchPlayers = async () => {
        if (!teamId) {
            showNotification('No se encontró el equipo.', 'error');
            return;
        }
        try {
            const response = await fetch(`${URL_SERVER}players/not-on-sale-by/${teamId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedUser.token}`,
                    'ngrok-skip-browser-warning': 'true',
                }
            })
            if (!response.ok) {
                throw new Error('Error al obtener los jugadores.');
            }
            const data = await response.json();
            setPlayers(data);
        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setPageIsLoading(false);
        }
    }

    useEffect(() => {
        if (teamId) {
            fetchPlayers();
        }
    }, [teamId])

    const handlePlayerPublish = async () => {
        setShowPublishPopUpNotification(true);
    }

    const handlePublish = async () => {
        setIsLoading(true);
        try {
            if (!selectedPlayer || price <= 0 || !teamId) {
                showNotification('Por favor, selecciona un jugador y un precio válido.', 'error');
                return;
            }

            const response = await fetch(`${URL_SERVER}auctions/publish-player`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedUser.token}`
                },
                body: JSON.stringify({
                    playerId: selectedPlayer.id,
                    teamId: teamId,
                    price: price,
                }),
            });

            if (!response.ok) {
                showNotification('Error al publicar el jugador.', 'error');
                throw new Error('Error al publicar el jugador.');
            }

            setSelectedPlayer(null);
            setPrice(0);
            fetchPlayers();
            showNotification('Jugador publicado correctamente.', 'success');
        } catch (error) {
            console.error('Error al publicar el jugador:', error);
        } finally {
            setIsLoading(false);
            setShowPublishPopUpNotification(false);
        }
    };

    if (pageIsLoading) {
        return <SoccerLoadingAnimation/>
    }

    return (
        <div className='md:w-auto w-full max-w-[95%] bg-gray-200 bg-opacity-70 border-none flex flex-col items-center rounded-md h-[500px]' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
            {showPublishPopUpNotification && (
                <PopUpNotification closeNotification={() => setShowPublishPopUpNotification(false)}>
                    <div className='flex flex-col justify-center align-middle items-center gap-5 w-full h-full'>
                        <p className='text-slate-800 text-2xl text-center'>
                            Estás seguro que querés publicar a <span className="text-slate-900 font-bold">{selectedPlayer?.name}</span> por <span className="text-green-600 font-bold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price || 0)}</span>?
                        </p>
                        <div className='flex flex-row justify-center align-middle items-center gap-5'>
                            <MainButton text={'Publicar'} isLoading={false} onClick={handlePublish} />
                            <MainButton text={'Cancelar'} isLoading={false} isCancel={true} onClick={() => setShowPublishPopUpNotification(false)} />
                        </div>
                    </div>
                </PopUpNotification>
            )}
            {notification.show && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    timer={5000}
                    closeNotification={() => setNotification({ ...notification, show: false })}
                />
            )}
            <div className="w-full">
                <h2 className='mb-5 text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                    Publicar Jugador
                </h2>
                <div className="mb-4 pl-10 pr-10">
                    <label className="block mb-2 text-slate-800">Seleccionar Jugador:</label>
                    <select
                        className="border p-2 w-full text-black rounded-[10px]"
                        value={selectedPlayer?.name || ''}
                        onChange={(e) => {
                            const player = players.find((j) => j.name === e.target.value);
                            setSelectedPlayer(player || null);
                        }}
                    >
                        <option value="">Seleccionar...</option>
                        {players?.map((player, index) =>
                            player && player.id && player.name ? (
                                <option key={player.id} value={player.name}>
                                    {player.name}
                                </option>
                            ) : null
                        )}
                    </select>
                </div>
                <div className="mb-4 pl-10 pr-10">
                    <label className="block mb-2 text-slate-800">Precio:</label>
                    <input
                        type="number"
                        className="border p-2 w-full text-black rounded-[10px]"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                </div>
                <div className="w-full flex justify-center">
                    <MainButton text="Publicar" onClick={handlePlayerPublish} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default PublishForm;