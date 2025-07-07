'use client'

import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { useSelector } from 'react-redux';


interface Transfer {
    id: string;
    player: Player;
    from: Team;
    to: Team;
    price: number;
}

interface Player {
    id: number;
    name: string;
    position: string;
}

interface Team {
    id: number;
    name: string;
    logo: string;
}

const TransferHistory = () => {
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const TOTAL_PAGES = Math.ceil(transfers.length / 4);
    const SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
    const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
    const loggedUser = useSelector((state: RootState) => state.user);


    const fetchTransfers = async () => {
        try {
            const response = await fetch(`${SERVER}auctions/get-finished`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loggedUser.token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener los equipos');
            }

            const data = await response.json();
            setTransfers(data);
        } catch {
            console.log('Error al obtener los equipos');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchTransfers();
    }, [])

    if (isLoading) {
        return (
            <SoccerLoadingAnimation />
        );
    }

    const handleNextPage = () => {
        if (currentPage < TOTAL_PAGES) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const slicedTransfers = transfers.slice((currentPage - 1) * 4, currentPage * 4);

    return (
        <div className='w-4/5 h-4/5 bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center gap-2 rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
            {slicedTransfers.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-center text-xl">No se realizaron transacciones.</p>
                </div>
            ) : (
                <>
                    {slicedTransfers.map((transfer) => (
                        <div key={transfer.id} className='w-full h-20 bg-gray-300 bg-opacity-70 flex flex-row items-center justify-center p-20 hover:bg-gray-100 hover:bg-opacity-70'>
                            <div className='w-1/3 h-full flex flex-row items-center justify-center'>
                                <Image src={URL_IMG + transfer.from.logo} alt={transfer.from.name} className="rounded-full" width={100} height={100} />
                            </div>
                            <div><FaLongArrowAltRight className='size-10 text-slate-800' /></div>
                            <div className='w-1/3 h-full flex flex-col items-center justify-center'>
                                <p className='text-center text-2xl text-slate-800'>{transfer.player.name}</p>
                                <p className='text-center text-green-500 font-bold'>
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(transfer.price)}
                                </p>
                            </div>
                            <div><FaLongArrowAltRight className='size-10 text-slate-800' /></div>
                            <div className='w-1/3 h-full flex flex-row items-center justify-center'>
                                <Image src={URL_IMG + transfer.to.logo} alt={transfer.to.name} className="rounded-full" width={100} height={100} />
                            </div>
                        </div>
                    ))}
                </>
            )}
            {TOTAL_PAGES > 1 && (
                <div className='absolute bottom-10 flex flex-row gap-5 items-center'>
                    <button className="bg-[#02124a] text-white p-2 rounded-md w-20 bg-opacity-80 hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease" }} onClick={handlePrevPage}>
                        Anterior
                    </button>
                    <p className='text-white'>Página {currentPage} de {TOTAL_PAGES}</p>
                    <button className="bg-[#02124a] text-white p-2 rounded-md w-20 bg-opacity-80 hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease" }} onClick={handleNextPage}>
                        Próxima
                    </button>

                </div>
            )}
        </div>

    )
}

export default TransferHistory