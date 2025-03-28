import React from 'react';
import { TbPigMoney } from "react-icons/tb";
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import { setMoney } from '@/redux/Features/user/userSlice';


interface Auction {
  id: number;
  player_id: number;
  name: string;
  player_name: string;
  team_id: number;
  team_name: string;
  team_logo: string;
  price: number;
}

interface MyAuctionsProps {
  players: Auction[];
  fetchAuctions: () => Promise<void>;
  showNotification: (message: string, type: 'success' | 'error') => void;
}

const MyAuctions: React.FC<MyAuctionsProps> = ({ players, fetchAuctions, showNotification }) => {
  const loggedUser = useSelector((state: RootState) => state.user);
  const money = useSelector((state: RootState) => state.user.user?.money) || 0; 
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
  const dispatch = useDispatch();

  const handlePlayerPurchase = async () => {
    const player = players[0];
    try{
      const response = await fetch(`${URL_SERVER}auctions/purchase-player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auctionId: player.id,
          fromTeamId: player.team_id,
          toTeamId: loggedUser.user?.team.id,
        }),
      });
      if(!response.ok){
        showNotification('Error al realizar la compra.', 'error');
        throw new Error('Error al realizar la compra');
      }
      const newMoney = money - player.price;
      dispatch(setMoney(newMoney));
      showNotification('Compra realizada con éxito.', 'success');
    }catch(error){
        console.error('Error al realizar la compra:', error);
    }finally{
        fetchAuctions();
    }

  }

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
      {players.length === 0 ? (
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
          {players.map((player) => (
            <tr key={player.player_id} className="hover:bg-[white] hover:bg-opacity-10">
              <td className="border-b border-white border-opacity-30 p-3 text-center">{player.player_name}</td>
              <td className="border-b border-white border-opacity-30 p-3 text-center">
              <div className="flex items-center w-full justify-center">
                  <Image src={URL_IMG + player.team_logo} alt={player.team_name} className="w-6 h-6 rounded-full" width={50} height={50}/>
              </div>
              </td>
              <td className="border-b border-white border-opacity-30 p-3 text-center">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(player.price)}</td>
              <td className="border-b border-white border-opacity-30 p-3 text-center">
                {player.team_id !== loggedUser?.user?.team.id ? (
                  <button onClick={handlePlayerPurchase} className="bg-[#72c284] text-white p-2 rounded-md bg-opacity-80 hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease" }}>
                    <TbPigMoney />
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
      )}
    </div>
    </>
  );
};
export default MyAuctions;
