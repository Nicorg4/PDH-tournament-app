import React, { useState } from 'react';
import { TbPigMoney } from "react-icons/tb";
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import MainButton from '@/app/components/mainButton';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

interface Auction {
  id: number;
  player: Player;
  team: Team;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Player {
  id: number;
  name: string;
  team: Team;
  price: number;
}

interface MyAuctionsProps {
  auctions: Auction[];
  handleShowPopupNotification: (auction: Auction) => void;
  isLoading: boolean;
}

const MyAuctions: React.FC<MyAuctionsProps> = ({ auctions, handleShowPopupNotification, isLoading }) => {
  const loggedUser = useSelector((state: RootState) => state.user);
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination values
  const totalPages = Math.ceil(auctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAuctions = auctions.slice(startIndex, endIndex);

  // Pagination handlers
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

  // Reset to first page when auctions change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [auctions.length]);

  // Pagination component
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
      <div
        className="absolute left-1/2 -translate-x-1/2 flex gap-1 justify-center items-center bottom-24 rounded-md"
        style={{ transform: 'translateX(-30%)' }}
      >
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md transition-colors ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-600'
          }`}
        >
          <FaArrowLeft />
        </button>
        
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
            className={`px-3 py-2 rounded-md transition-colors ${
              currentPage === pageNumber
                ? 'bg-slate-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-600'
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    );
  };

  if (!loggedUser.user){
    return(
      <SoccerLoadingAnimation/>
    )
  }

  return (
    <>
      <div className=' bg-green-500 bg-opacity-50 border-none flex flex-col items-center rounded-md p-3' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
        <p className="text-center">Presupuesto disponible: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(loggedUser.user.money)}</p>
      </div>
      <div className='w-4/5 bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md min-h-[650px]' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
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
                  <th className="p-3 text-center text-slate-800">Nombre</th>
                  <th className="p-3 text-center text-slate-800">Equipo</th>
                  <th className="p-3 text-center text-slate-800">Precio</th>
                  <th className="p-3 text-center text-slate-800">Acciones</th>
                </tr>
              </thead>
              
              <tbody>
                {currentAuctions.map((auction) => (
                  <tr key={auction.player.id} className="hover:bg-[white] hover:bg-opacity-10">
                    <td className="border-b border-white border-opacity-30 p-3 text-center text-slate-800">{auction.player.name}</td>
                    <td className="border-b border-white border-opacity-30 p-3 text-center">
                      <div className="flex items-center w-full justify-center">
                        <Image src={URL_IMG + auction.team.logo} alt={auction.team.name} className="w-6 h-6 rounded-full" width={50} height={50}/>
                      </div>
                    </td>
                    <td className="border-b border-white border-opacity-30 p-3 text-center text-slate-800">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(auction.player.price)}</td>
                    <td className="border-b border-white border-opacity-30 p-3 text-center">
                      {auction.team.id !== loggedUser?.user?.team.id ? (
                        <MainButton onClick={() => handleShowPopupNotification(auction)} text={'Comprar'} isLoading={isLoading}/>
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
