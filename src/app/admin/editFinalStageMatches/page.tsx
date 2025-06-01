'use client'

import SoccerLoadingAnimation from "@/app/components/loadingAnimation";
import MainButton from "@/app/components/mainButton";
import React, { useState, useEffect } from "react";
import { IoStar } from "react-icons/io5";

interface Match {
  match_id: number;
  team_A_id: number;
  team_B_id: number;
  winner_team_id: number | null;
  team_A_score: number | null;
  team_B_score: number | null;
  team_A_penalty_score: number | null;
  team_B_penalty_score: number | null;
  phase: number;
  team_A_name: string;
  team_A_logo: string;
  team_B_name: string;
  team_B_logo: string;
  user_A_id: number;
  user_A_name: string;
  user_A_picture: string;
  user_B_id: number;
  user_B_name: string;
  user_B_picture: string;
}

interface GroupMatchesProps {
  showNotification: (message: string, type: 'success' | 'error') => void;
}

const GroupMatches = ({showNotification} : GroupMatchesProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG
  const [isLoading, setIsLoading] = useState(false);

  const getPhaseTitle = (phase: number) => {
    switch(phase) {
      case 8: return "Octavos de Final";
      case 4: return "Cuartos de Final";
      case 2: return "Semifinales";
      case 1: return "Final";
      default: return `Fase ${phase}`;
    }
  };

  useEffect(() => {
    fetch(`${URL_SERVER}playoffs/get-all`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data.matches);
      })
      .catch((err) => console.error("Error fetching matches:", err));
  }, []);  

  const handleScoreChange = (
    matchId: number,
    field: "team_A_score" | "team_B_score" | "team_A_penalty_score" | "team_B_penalty_score",
    value: string
  ) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.match_id === matchId
            ? { ...match, [field]: numValue }
            : match
        )
      );
    } else if (value === "") {
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.match_id === matchId
            ? { ...match, [field]: null }
            : match
        )
      );
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await fetch(`${URL_SERVER}playoffs/update-matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matches }),
      });
      showNotification("Partidos actualizados correctamente.", "success");
    } catch (error) {
      showNotification("Error al actualizar los partidos.", "error");
      console.error("Error updating matches", error);
    }finally{
      setIsLoading(false);
    }
  };

  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.phase]) {
      acc[match.phase] = [];
    }
    acc[match.phase].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  return (
    <>
        {matches.length === 0 ? 
        <div className=' bg-slate-800 bg-opacity-70 border-none items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h1 className="text-2xl text-center p-96">Todavia no hay partidos disponibles.</h1>
        </div>
          : (
    <div className='w-4/5 md:w-3/4 bg-slate-800 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md p-6 max-w-6xl mx-auto' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      <h1 className="text-3xl font-bold mb-10">Editar Partidos</h1>
      {Object.entries(groupedMatches)
        .sort(([phaseA], [phaseB]) => Number(phaseB) - Number(phaseA))
        .map(([phase, phaseMatches]) => (
        <div key={phase} className="w-full mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center border-b border-gray-400 pb-2">{getPhaseTitle(Number(phase))}</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {phaseMatches.map((match) => (
              <div
                key={match.match_id}
                className="p-4 border-2 border-gray-400 rounded-lg shadow-lg flex items-center gap-3 flex-col w-80 bg-slate-700 hover:border-yellow-500 transition-all duration-300"
              >
                <div className="flex items-center justify-between w-full border-b border-gray-400 pb-4">
                  <div className="flex flex-col items-center">
                    <img
                      src={URL_IMG + match.user_A_picture}
                      alt={match.user_A_name}
                      className="w-10 h-10 rounded-full mb-1"
                    />
                    <span className="text-sm">{match.user_A_name}</span>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={URL_IMG + match.team_A_logo}
                      alt={match.team_A_name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="font-semibold">{match.team_A_name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      min="0"
                      className="w-12 h-8 text-center rounded bg-gray-400 text-slate-800 font-bold"
                      value={match.team_A_score !== null ? match.team_A_score : ""}
                      onChange={(e) =>
                          handleScoreChange(match.match_id, "team_A_score", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      className="w-12 h-8 text-center rounded bg-gray-400 text-slate-800 font-bold"
                      value={match.team_A_penalty_score !== null ? match.team_A_penalty_score : ""}
                      onChange={(e) =>
                          handleScoreChange(match.match_id, "team_A_penalty_score", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between w-full pt-2">
                  <div className="flex flex-col items-center">
                    <img
                      src={URL_IMG + match.user_B_picture}
                      alt={match.user_B_name}
                      className="w-10 h-10 rounded-full mb-1"
                    />
                    <span className="text-sm">{match.user_B_name}</span>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={URL_IMG + match.team_B_logo}
                      alt={match.team_B_name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="font-semibold">{match.team_B_name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      min="0"
                      className="w-12 h-8 text-center rounded bg-gray-400 text-slate-800 font-bold"
                      value={match.team_B_score !== null ? match.team_B_score : ""}
                      onChange={(e) =>
                          handleScoreChange(match.match_id, "team_B_score", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      className="w-12 h-8 text-center rounded bg-gray-400 text-slate-800 font-bold"
                      value={match.team_B_penalty_score !== null ? match.team_B_penalty_score : ""}
                      onChange={(e) =>
                          handleScoreChange(match.match_id, "team_B_penalty_score", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <MainButton
        onClick={handleSaveChanges}
        text={'Guardar Cambios'}
        isLoading={isLoading}
      />
    </div>
      )}
    </>
  );
};

export default GroupMatches;
