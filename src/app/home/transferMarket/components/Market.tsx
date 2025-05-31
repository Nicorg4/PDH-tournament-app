import React from 'react';
import { TbPigMoney } from "react-icons/tb";
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import MainButton from '@/app/components/mainButton';


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
    <div className='w-4/5 h-4/5 bg-slate-800 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Ventas en curso</h2>
      {auctions.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-center text-xl">No hay jugadores en venta.</p>
        </div>
      ) : (
      <table className="w-11/12">
        <thead>
          <tr className='text-xl'>
            <th className="p-3 text-center">Nombre</th>
            <th className="p-3 text-center">Equipo</th>
            <th className="p-3 text-center">Precio</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        
        <tbody>
          {auctions.map((auction) => (
            <tr key={auction.player.id} className="hover:bg-[white] hover:bg-opacity-10">
              <td className="border-b border-white border-opacity-30 p-3 text-center">{auction.player.name}</td>
              <td className="border-b border-white border-opacity-30 p-3 text-center">
              <div className="flex items-center w-full justify-center">
                  <Image src={URL_IMG + auction.team.logo} alt={auction.team.name} className="w-6 h-6 rounded-full" width={50} height={50}/>
              </div>
              </td>
              <td className="border-b border-white border-opacity-30 p-3 text-center">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(auction.player.price)}</td>
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
      )}
    </div>
    </>
  );
};
export default MyAuctions;
