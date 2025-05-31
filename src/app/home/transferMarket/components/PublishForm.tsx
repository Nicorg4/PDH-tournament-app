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
    <div
      className="relative bg-slate-800 bg-opacity-70 pb-10 border-none w-80 h-4/5 rounded-md"
      style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
    >
      <div>
        <h2
          className="mb-5 text-center w-full p-3 bg-transparent"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
        >
          Publicar Jugador
        </h2>
        <div className="mb-4 pl-10 pr-10">
          <label className="block mb-2">Seleccionar Jugador:</label>
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
          <label className="block mb-2">Precio:</label>
          <input
            type="number"
            className="border p-2 w-full text-black rounded-[10px]"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="absolute bottom-5 left-0 w-full flex justify-center">
        <MainButton text="Publicar" onClick={handlePlayerPublish} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default PublishForm;