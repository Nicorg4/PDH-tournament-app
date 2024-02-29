import { RootState } from '@/redux/store';
import React, { useState } from 'react';
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

interface PublishFormProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

const PublishForm: React.FC<PublishFormProps> = ({ players, setPlayers }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [price, setPrice] = useState<number>(0);
  const loggedUser = useSelector((state: RootState) => state.user);

  const handlePublish = () => {
    if (loggedUser.user && selectedPlayer && price > 0) {
      const team = loggedUser.user.team;

      if (team !== undefined) {
        const newPlayer: Player = {
          id: players.length + 1,
          name: selectedPlayer.name,
          team: team,
          price: price,
        };

        setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
        setSelectedPlayer(null);
        setPrice(0);
      }
    }
  };

  return (
    <div className="relative bg-slate-800 bg-opacity-50 pb-10 border-none w-80 h-4/5" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
      <div>
        <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Publicar Jugador</h2>
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
        <button className="bg-[#02124a] text-white p-2 rounded-md w-2/3 bg-opacity-80 hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}} onClick={handlePublish}>
          Publicar
        </button>
      </div>
    </div>
  );
};

export default PublishForm;
