'use client'
import { RootState } from '@/redux/store';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Bayern from '../../../../public/bayern.png'
import { useRouter } from 'next/navigation';
import SoccerLoadingAnimation from '@/app/components/loadingAnimation';

interface Jugador {
  id: number,
  name: string;
  number: number;
  position: string;
  team_id: number;
  on_sale: boolean;
}

const groupByPosition = (jugadores: Jugador[]): Record<string, Jugador[]> => {
  const grouped: Record<string, Jugador[]> = {};

  jugadores.forEach((jugador) => {
    if (!grouped[jugador.position]) {
      grouped[jugador.position] = [];
    }
    grouped[jugador.position].push(jugador);
  });

  return grouped;
};

const MyTeam: React.FC = () => {

  const [players, setPlayers] = useState<Jugador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const jugadoresPorPosicion = groupByPosition(players);
  const loggedUser = useSelector((state: RootState) => state.user);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
  const router = useRouter();

  const fetchTeamPlayers = async () => {
    try {
      if (loggedUser.user) {
        const teamId = loggedUser.user.team.id;

        const response = await fetch(`${URL_SERVER}players/get-by/${teamId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPlayers(data);
        } else {
          console.error('Error en la solicitud:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedUser?.user?.team) {
      router.push('/home')
    }
    fetchTeamPlayers();
  }, []);

  if (isLoading) {
    return (
      <SoccerLoadingAnimation />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-full justify-center gap-10" style={{ animation: 'moveTopToBottom 0.3s ease' }}>
      {loggedUser?.user?.team && (
        <Image src={URL_IMG + loggedUser.user.team.logo} alt={`Foto del equipo ${loggedUser.user?.team.name}`} width={120} height={120} className="rounded-full object-fit:cover object-center" style={{ aspectRatio: "1/1" }} />
      )}
      <div className="w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 categories-container">
          {Object.entries(jugadoresPorPosicion).map(([posicion, jugadores]) => (
            <div key={posicion} className='bg-gray-200 bg-opacity-70 rounded-md text-slate-800 font-bold min-h-[16rem] h-auto' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
              <h2 className='mb-3 text-center w-full p-2 sm:p-3 bg-transparent text-sm sm:text-base' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>{posicion}</h2>
              <div className="p-2 sm:p-4">
                {jugadores.map((jugador, index) => (
                  <div key={index} className="mb-2">
                    <p className='text-sm sm:text-base'>{`${jugador.name} - ${jugador.number}`}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes moveTopToBottom {
          from {
            transform: translateY(-5%);
          }
          to {
            transform: translateY(0);
          }
        }
        @media (max-width: 700px) {
          .categories-container {
            overflow-y: scroll;
            scrollbar-width: thin;
            scrollbar-color: white rgba(255, 255, 255, 0.1);
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            grid-template-columns: none;
          }
          .categories-container::-webkit-scrollbar {
            width: 8px;
          }
          .categories-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
          }
          .categories-container::-webkit-scrollbar-thumb {
            background-color: white;
            border-radius: 4px;
          }
          .categories-container > div {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MyTeam;