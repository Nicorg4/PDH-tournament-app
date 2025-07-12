import React, { useEffect, useState } from 'react';
import { TbPigMoney } from "react-icons/tb";
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { Auction } from '@/app/types';

interface MyAuctionsProps {
  auctions: Auction[];
  handleShowPopupNotification: (auction: Auction) => void;
  getUserMoney: () => number;
}

const MyAuctions: React.FC<MyAuctionsProps> = ({ auctions, handleShowPopupNotification, getUserMoney }) => {
  const loggedUser = useSelector((state: RootState) => state.user);
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
  const [userMoney, setUserMoney] = useState(getUserMoney());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(auctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAuctions = auctions.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [auctions.length]);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex w-[100%] justify-center rounded-md mt-5 gap-4">
        <button
          className={`flex p-3 border-none rounded-[15px] gap-2 items-center hover:bg-opacity-70 text-white font-bold ${currentPage === 1
            ? "bg-slate-500 hover:bg-slate-500 pointer-events-none" : "bg-slate-800"}`}
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} onClick={handlePrevPage} disabled={currentPage === 1}><FaArrowLeft />
        </button>
        <div className='flex gap-2 items-center justify-center'>
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageClick(1)}
                className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`px-3 py-2 rounded-md transition-colors border border-slate-600/50 ${currentPage === pageNumber
                ? 'bg-slate-800/50 text-white'
                : 'transparent text-gray-700 hover:bg-gray-300'
                }`}
            >
              {pageNumber}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => handlePageClick(totalPages)}
                className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        <button className={`flex p-3 border-none rounded-[15px] gap-2 items-center hover:bg-opacity-70 text-white font-bold ${currentPage === totalPages
          ? "bg-slate-500 hover:bg-slate-500 pointer-events-none" : "bg-slate-800"}`}
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} onClick={handleNextPage} disabled={currentPage === totalPages}><FaArrowRight />
        </button>
      </div>
    );
  };

  const formatPrice = (price: number): string => {
    const formattedPrice = price > 1000000 ? `${(price / 1000000).toFixed(1)}M` : price > 1000 ? `${(price / 1000).toFixed(1)}K` : price.toString();
    return formattedPrice
  }

  useEffect(() => {
    getUserMoney()
  }, []);

  return (
    <>
      <div className=' bg-green-500 bg-opacity-50 border-none flex flex-col items-center rounded-md p-3' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
        <p className="text-center">Presupuesto disponible: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(getUserMoney())}</p>
      </div>
      <div className='md:w-auto w-full lg:min-w-[600px] max-w-[95%] bg-gray-200 bg-opacity-70 border-none flex flex-col items-center rounded-md min-h-[650px]' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
        <h2 className='mb-5 text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Ventas en curso</h2>

        {auctions.length === 0 ? (
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <p className="text-center text-xl text-gray-200">No hay jugadores en venta.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center w-11/12 mb-4">
              <p className="text-slate-800 text-sm">
                Mostrando {startIndex + 1}-{Math.min(endIndex, auctions.length)} de {auctions.length} jugadores
              </p>
              <p className="text-slate-800 text-sm">
                Página {currentPage} de {totalPages}
              </p>
            </div>
            <table className="w-11/12">
              <thead>
                <tr className='text-xl'>
                  <th className="p-3 text-center text-slate-800 text-[16px]">Nombre</th>
                  <th className="p-3 text-center text-slate-800 text-[16px]">Equipo</th>
                  <th className="p-3 text-center text-slate-800 text-[16px]">Precio</th>
                  <th className="p-3 text-center text-slate-800 text-[16px]">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {currentAuctions.map((auction) => (
                  <tr key={auction.player.id} className={`hover:bg-[white] hover:bg-opacity-10 ${auction.team.name === 'Leyendas' ? 'bg-[#cca935]/40 bg-opacity-50' : ''}`}>
                    <td className="border-b border-white border-opacity-30 p-3 text-center text-slate-800 text-[15px]">{auction.player.name}</td>
                    <td className="border-b border-white border-opacity-30 p-3 text-center">
                      <div className="flex items-center w-full justify-center">
                        <Image src={URL_IMG + auction.team.logo} alt={auction.team.name} className="w-6 h-6 rounded-full" width={50} height={50} />
                      </div>
                    </td>
                    <td className="border-b border-white border-opacity-30 p-3 text-center text-slate-800 text-[15px]">€{formatPrice(auction.player.price)}</td>
                    <td className="border-b border-white border-opacity-30 p-3 text-center">
                      {auction.team.id !== loggedUser?.user?.team?.id ? (
                        <button onClick={() => handleShowPopupNotification(auction)} className='bg-[#6cac6c] text-white p-2 rounded-md hover:bg-opacity-70 transition-all duration-300 shadow-md'>
                          <TbPigMoney className="text-xl" />
                        </button>
                      ) : (
                        <button disabled className="bg-[#2a2b2a] text-white p-2 rounded-md bg-opacity-80 ">
                          En venta
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls />
          </>
        )}
      </div>
    </>
  );
};

export default MyAuctions;
