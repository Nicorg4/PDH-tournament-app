import { RootState } from '@/redux/store';
import React from 'react'
import { FaRegTrashCan } from "react-icons/fa6";
import { useSelector } from 'react-redux';

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
  players: Player[];
  fetchMyPlayers: (teamId: number) => Promise<void>;
  fetchPlayersOnAuction: (teamId: number) => Promise<void>;
  fetchAuctions: () => Promise<void>;
  showNotification: (message: string, type: 'success' | 'error') => void;
}

const myAuctions: React.FC<MyAuctionsProps> = ({ players, fetchMyPlayers, fetchPlayersOnAuction, fetchAuctions, showNotification }) => {
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const loggedUser = useSelector((state: RootState) => state.user);
  const teamId = loggedUser.user?.team.id;

  const handleRemovePlayerFromAuction = async (playerId: number) => {
    if (!teamId) {
      return;
    }
    try{
      const response = await fetch(`${URL_SERVER}auctions/unpublish-player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: playerId,
        }),
      });

      if(!response.ok){
        showNotification('Error al eliminar el jugador de la venta.', 'error');
        throw new Error('Error al eliminar el jugador de la venta');
      }

      fetchMyPlayers(teamId);
      fetchPlayersOnAuction(teamId);
      fetchAuctions();
      showNotification('El jugador ya no está a la venta.', 'success');
    }catch(error){
      console.error('Error al eliminar el jugador de la venta:', error);
    } finally{

    }
  };

  return (
    <div className='w-3/5 h-4/5 bg-slate-800 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Mis jugadores en venta</h2>
          {players.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-center text-xl">No hay jugadores en venta.</p>
          </div> ) : (
            <table className="w-11/12">
            <thead>
              <tr className='text-xl'>
                <th className="p-3 text-center">Nombre</th>
                <th className="p-3 text-center">Precio</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-[white] hover:bg-opacity-10">
                  <td className="border-b border-white border-opacity-30 p-3 text-center">{player.name}</td>
                  <td className="border-b border-white border-opacity-30 p-3 text-center">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(player.price)}</td>
                  <td className="border-b border-white border-opacity-30 p-3 text-center">
                    <button className="bg-[#ed6f6f] text-white p-2 rounded-md bg-opacity-80 hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#ed6f6f]" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}} onClick={() => handleRemovePlayerFromAuction(player.id)}><FaRegTrashCan/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          
        </div>
  )
}

export default myAuctions