'use client'
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import endpoint from '../../../../endpoint';

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
  const jugadoresPorPosicion = groupByPosition(players);
  const loggedUser = useSelector((state: RootState) => state.user);

  const fetchTeamPlayers = async () => {
    try {
      if (loggedUser.user) {
        const teamId = loggedUser.user.team.id;
  
        const response = await fetch(endpoint + "players-by-team-id", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ teamId }),
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
    }
  };

  useEffect(() => {
    fetchTeamPlayers();
  }, []);

  return (
    <div className="h-full flex flex-col items-center w-full justify-center" style={{animation: 'moveTopToBottom 0.3s ease'}}>
      <div className='pl-52 pr-52 p-5 mb-24 bg-slate-800 bg-opacity-50 flex justify-center items-center' style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
        <h2 className='text-2xl'>{loggedUser.user?.team.name}</h2>
      </div>
      <div className="w-4/5 h-3/6">
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(jugadoresPorPosicion).map(([posicion, jugadores]) => (
            <div key={posicion} className='bg-slate-800 bg-opacity-50 min-h-full text-white h-96' style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
              <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>{posicion}</h2>
              {jugadores.map((jugador, index) => (
                <div key={index}>
                  <p className='pl-7 pb-2'>{`${jugador.name} - ${jugador.number}`}</p>
                </div>
              ))}
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
      `}</style>
    </div>
  );
};

export default MyTeam;