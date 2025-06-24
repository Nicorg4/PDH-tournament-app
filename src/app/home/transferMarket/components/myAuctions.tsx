import MainButton from '@/app/components/mainButton';
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
  handleShowPopupNotification: (player: Player) => void;
  isLoading: boolean;
}

const myAuctions: React.FC<MyAuctionsProps> = ({ players, handleShowPopupNotification, isLoading}) => {
  const handlePlayerRemove = (player: Player) => {
    if (player) {
      handleShowPopupNotification(player);
    }
  };

  return (
    <div className='w-3/5 h-4/5 bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h2 className='mb-5 text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Mis jugadores en venta</h2>
          {players.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-center text-xl text-slate-800">No hay jugadores en venta.</p>
          </div> ) : (
            <table className="w-11/12">
            <thead>
              <tr className='text-xl'>
                <th className="p-3 text-center text-slate-800">Nombre</th>
                <th className="p-3 text-center text-slate-800">Precio</th>
                <th className="p-3 text-center text-slate-800">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-[white] hover:bg-opacity-10">
                  <td className="border-b border-white border-opacity-30 p-3 text-center text-slate-800">{player.name}</td>
                  <td className="border-b border-white border-opacity-30 p-3 text-center text-slate-800">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(player.price)}</td>
                  <td className="border-b border-white border-opacity-30 p-3 text-center">
                  <MainButton onClick={() => handlePlayerRemove(player)} text={'Eliminar'} isLoading={isLoading}/>
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