'use client'

import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import React, { useEffect, useState } from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Transfer } from '@/app/types';

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
                        'Authorization': `Bearer ${loggedUser.token}`,
                        'ngrok-skip-browser-warning': 'true'
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

    const formatPrice = (price: number): string => {
        const formattedPrice = price > 1000000 ? `${(price / 1000000).toFixed(1)}M` : price > 1000 ? `${(price / 1000).toFixed(1)}K` : price.toString();
        return formattedPrice
    }

    const slicedTransfers = transfers.slice((currentPage - 1) * 4, currentPage * 4);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-4xl bg-opacity-70 pb-10 border-none flex flex-col items-center gap-2 rounded-md relative px-2 sm:px-8">
                {slicedTransfers.length === 0 ? (
                    <div className="flex justify-center items-center h-full min-h-[200px]">
                        <p className="text-center text-xl">No se realizaron transacciones.</p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-4 py-4 mb-5">
                        {slicedTransfers.map((transfer) => (
                            <div
                                key={transfer.id}
                                className="w-full flex items-center justify-center bg-gray-200 bg-opacity-70 shadow-lg rounded-lg p-10 sm:gap-0 hover:bg-gray-100 hover:bg-opacity-70 transition-all"
                            >
                                <div className="flex flex-row items-center justify-center w-full sm:w-1/3 gap-2 sm:gap-0">
                                    <Image src={URL_IMG + transfer.from.logo} alt={transfer.from.name} className="rounded-full" width={60} height={60} />
                                </div>
                                <div className="flex flex-row items-center justify-center w-full sm:w-auto">
                                    <FaLongArrowAltRight className="size-5 sm:size-10 text-slate-800 mx-2 sm-size-8" />
                                </div>
                                <div className="flex flex-col items-center justify-center w-full sm:w-1/3">
                                    <p className="text-center text-lg sm:text-2xl text-slate-800">{transfer.player.name}</p>
                                    <p className="text-center text-white-500 font-bold text-base sm:text-lg bg-slate-800 rounded-md px-2">
                                        {formatPrice(transfer.price)}
                                    </p>
                                </div>
                                <div className="flex flex-row items-center justify-center w-full sm:w-auto">
                                    <FaLongArrowAltRight className="size-5 sm:size-10 text-slate-800 mx-2 sm-size-8" />
                                </div>
                                <div className="flex flex-row items-center justify-center w-full sm:w-1/3 gap-2 sm:gap-0">
                                    <Image src={URL_IMG + transfer.to.logo} alt={transfer.to.name} className="rounded-full" width={60} height={60} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {TOTAL_PAGES > 1 && (
                    <div className="absolute left-0 right-0 bottom-4 flex flex-row gap-5 items-center justify-center">
                        <button className={`flex p-3 border-none rounded-[15px] gap-2 items-center hover:bg-opacity-70 text-white font-bold ${currentPage === 1
                            ? "bg-slate-500 hover:bg-slate-500 pointer-events-none" : "bg-slate-800"}`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} onClick={handlePrevPage} disabled={currentPage === 1}><FaArrowLeft /></button>
                        <p className="text-white text-sm sm:text-base">Página {currentPage} de {TOTAL_PAGES}</p>
                        <button className={`flex p-3 border-none rounded-[15px] gap-2 items-center hover:bg-opacity-70 text-white font-bold ${currentPage === TOTAL_PAGES
                            ? "bg-slate-500 hover:bg-slate-500 pointer-events-none" : "bg-slate-800"}`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} onClick={handleNextPage} disabled={currentPage === TOTAL_PAGES}><FaArrowRight /></button>
                    </div>
                )}
            </div>
        </div>

    )
}

export default TransferHistory