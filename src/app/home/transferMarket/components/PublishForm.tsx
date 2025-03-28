import MainButton from '@/app/components/mainButton';
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
  team?: Team;
  price: number;
}

interface PublishFormProps {
  players: Player[];
  fetchMyPlayers: (teamId: number) => Promise<void>;
  fetchPlayersOnAuction: (teamId: number) => Promise<void>;
  fetchAuctions: () => Promise<void>;
  showNotification: (message: string, type: 'success' | 'error') => void;
}

const PublishForm: React.FC<PublishFormProps> = ({
  players,
  fetchMyPlayers,
  fetchPlayersOnAuction,
  fetchAuctions,
  showNotification,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const loggedUser = useSelector((state: RootState) => state.user);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const teamId = loggedUser.user?.team.id;

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      if (!selectedPlayer || price <= 0 || !teamId) {
        showNotification('Por favor, selecciona un jugador y un precio válido.', 'error');
        return;
      }

      const response = await fetch(`${URL_SERVER}auctions/publish-player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          teamId: teamId,
          price: price,
        }),
      });

      if (!response.ok) {
        showNotification('Error al publicar el jugador.', 'error');
        throw new Error('Error al publicar el jugador.');
      }

      await fetchMyPlayers(teamId);
      await fetchPlayersOnAuction(teamId);
      await fetchAuctions();

      setSelectedPlayer(null);
      setPrice(0);

      showNotification('Jugador publicado correctamente.', 'success');
    } catch (error) {
      console.error('Error al publicar el jugador:', error);
    } finally {
      setIsLoading(false);
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
        <MainButton text="Publicar" onClick={handlePublish} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default PublishForm;