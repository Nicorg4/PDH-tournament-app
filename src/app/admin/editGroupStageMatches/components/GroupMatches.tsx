'use client'

import SoccerLoadingAnimation from "@/app/components/loadingAnimation";
import MainButton from "@/app/components/mainButton";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoStar } from "react-icons/io5";

interface Match {
  match_id: number;
  team_A_id: number;
  team_B_id: number;
  team_A_name: string;
  team_A_logo: string;
  team_B_name: string;
  team_B_logo: string;
  team_A_score: number | null;
  team_B_score: number | null;
  isDraw: boolean;
  match_day: number;
  group_id: number;
}

interface GroupMatchesProps {
  showNotification: (message: string, type: 'success' | 'error') => void;
}

const GroupMatches = ({showNotification} : GroupMatchesProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [allMatchesPlayed, setAllMatchesPlayed] = useState(false);
  const [currentMatchDay, setCurrentMatchDay] = useState(1);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    fetch(`${URL_SERVER}groups/get-all-matches`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data.matches);
        if (data.matches.length > 0) {
          const minMatchDay = Math.min(...data.matches.map((m: Match) => m.match_day));
          setCurrentMatchDay(minMatchDay);
        }
      })
      .catch((err) => console.error("Error fetching matches:", err));
  }, []);  

  const checkIfAllMatchesPlayed = async () => {
    try {
      const response = await fetch(`${URL_SERVER}groups/check-all-matches-played`);
      const data = await response.json();
      console.log("Respuesta desde el servidor:", data);
      setAllMatchesPlayed(data.allMatchesPlayed);
    } catch (err) {
      console.error("Error checking if all matches played:", err);
    }
  };
  useEffect(() => {
    checkIfAllMatchesPlayed();
  }, []);  

  const handleScoreChange = (
    matchId: number,
    field: "team_A_score" | "team_B_score",
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
      await fetch(`${URL_SERVER}groups/update-matches`, {
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
      checkIfAllMatchesPlayed();
    }
  };

  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.match_day]) {
      acc[match.match_day] = {};
    }
    if (!acc[match.match_day][match.group_id]) {
      acc[match.match_day][match.group_id] = [];
    }
    acc[match.match_day][match.group_id].push(match);
    return acc;
  }, {} as Record<number, Record<number, Match[]>>);

  const matchDays = Object.keys(groupedMatches).map(Number).sort((a, b) => a - b);

  const handlePrevious = () => {
    setCurrentMatchDay((prev) => Math.max(prev - 1, matchDays[0]));
  };

  const handleNext = () => {
    setCurrentMatchDay((prev) => Math.min(prev + 1, matchDays[matchDays.length - 1]));
  };

  const handleCreatePlayoff = async () =>{
    setIsLoading(true);
    try{
      const response = await fetch(`${URL_SERVER}playoffs/create-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(!response.ok){
        throw new Error('Error al crear los partidos de playoff');
      }
      /* navigate.push('/admin/playoffs'); */
    }catch(error){
        console.error("Error al crear los partidos de playoff:", error);
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <>
        {matches.length === 0 ? 
        <div className=' bg-slate-800 bg-opacity-70 border-none items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h1 className="text-2xl text-center p-96">Todavia no hay partidos disponibles.</h1>
        </div>
          : (
    <div className='w-4/5 md:w-2/5 bg-slate-800 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md p-6 max-w-4xl mx-auto' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      <h1 className="text-2xl font-bold mb-6">Editar Partidos</h1>
      <div className="flex justify-between items-center mb-4 gap-5">
        <MainButton
          onClick={handlePrevious}
          text={'Anterior'}
          isLoading={false}
          isCancel={true}
        />
        <h2 className="text-lg font-semibold">Fecha {currentMatchDay}</h2>
        <MainButton
          onClick={handleNext}
          text={'Siguiente'}
          isLoading={false}
        />
      </div>
      <div className="space-y-8 mb-5">
        {groupedMatches[currentMatchDay] && Object.entries(groupedMatches[currentMatchDay]).map(([group_id, groupMatches]) => (
          <div key={group_id} className="space-y-2">
            <h3 className="text-lg font-medium">Grupo {group_id}</h3>
            {groupMatches.map((match) => (
              <div
                key={match.match_id}
                className="p-3 border border-gray-400 rounded-lg shadow-sm flex items-center gap-2 flex-col w-72"
              >
                <div className="flex items-center justify-between w-full border-b border-gray-400 pb-3">
                  <div className="flex items-center">
                    <img
                      src={URL_IMG + match.team_A_logo}
                      alt={match.team_A_name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="font-semibold">{match.team_A_name}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="w-10 text-center rounded bg-gray-400 text-slate-800"
                    value={match.team_A_score !== null ? match.team_A_score : ""}
                    onChange={(e) =>
                        handleScoreChange(match.match_id, "team_A_score", e.target.value)
                    }
                  />
                  <div className="absolute ml-72 transform text-center">
                    {match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score && (
                        <span className="text-gray-400"><IoStar/></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <img
                      src={URL_IMG + match.team_B_logo}
                      alt={match.team_B_name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="font-semibold">{match.team_B_name}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="w-10 text-center rounded bg-gray-400 text-slate-800"
                    value={match.team_B_score !== null ? match.team_B_score : ""}
                    onChange={(e) =>
                        handleScoreChange(match.match_id, "team_B_score", e.target.value)
                    }
                   />
                   <div className="absolute ml-72 transform text-center">
                    {match.team_A_score !== null && match.team_B_score !== null && match.team_A_score < match.team_B_score && (
                        <span className="text-gray-400"><IoStar/></span>
                    )}
                  </div>
                </div>
              </div>
            ))}          
            </div>
        ))}
      </div>
      <div className="flex gap-5">
      <MainButton
          onClick={handleSaveChanges}
          text={'Guardar Cambios'}
          isLoading={isLoading}
        />
        {allMatchesPlayed && (
          <MainButton
            onClick={handleCreatePlayoff}
            text={'Crear fase eliminatoria'}
            isLoading={isLoading}
            isCancel={true}
          />
        )}
        </div>      
      
    </div>
      )}
    </>
  );
};

export default GroupMatches;
