import MainButton from '@/app/components/mainButton';
import React, { useState } from 'react';

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Player {
  id: number;
  name: string;
  team?: Team;
  price: number;
}

interface PublishFormProps {
  players: Player[];
  handleShowPopupNotification: (player: Player, price: number) => void;
  isLoading: boolean;
}

const PublishForm: React.FC<PublishFormProps> = ({
  players,
  handleShowPopupNotification,
  isLoading
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [price, setPrice] = useState<number>(0);

  const handlePlayerPublish = () => {
    if (selectedPlayer) {
      handleShowPopupNotification(selectedPlayer, price);
    }
  };

  return (
    <div className='md:w-auto w-full max-w-[95%] bg-gray-200 bg-opacity-70 border-none flex flex-col items-center rounded-md h-[500px]' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
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
            {players.map((player) => (
              <option key={player.id} value={player.name}>
                {player.name}
              </option>
            ))}
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