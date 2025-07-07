'use client'

import MainButton from "@/app/components/mainButton";
import { RootState } from "@/redux/store";
import React, { useState, useEffect } from "react";
import { IoStar } from "react-icons/io5";
import { useSelector } from "react-redux";

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

const GroupMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchDay, setCurrentMatchDay] = useState(1);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG
  const [isLoading, setIsLoading] = useState(false);
  const loggedUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetch(`${URL_SERVER}groups/get-all-matches`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${loggedUser.token}`
        },
      }
    )
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

  return (
    <div className='w-4/5 md:w-2/5 bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md p-6 max-w-4xl mx-auto' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Fase de grupos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5 w-full">
        {groupedMatches[currentMatchDay] && Object.entries(groupedMatches[currentMatchDay]).map(([group_id, groupMatches]) => (
          <div key={group_id} className="space-y-4">
            <h3 className="text-lg text-slate-800 font-bold">Grupo {group_id}</h3>
            {groupMatches.map((match) => (
              <div
                key={match.match_id}
                className="p-3 border border-slate-800 rounded-lg shadow-sm flex items-center gap-2 flex-col w-72"
              >
                <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3">
                  <div className="flex items-center">
                    <img
                      src={URL_IMG + match.team_A_logo}
                      alt={match.team_A_name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="font-semibold">{match.team_A_name}</span>
                  </div>
                  <p className="w-10 text-center rounded bg-slate-400 text-slate-800">{match.team_A_score}</p>
                  <div className="absolute ml-72 transform text-center">
                    {match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score && (
                        <span className="text-slate-800"><IoStar/></span>
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
                  <p className="w-10 text-center rounded bg-slate-400 text-slate-800">{match.team_B_score}</p>
                   <div className="absolute ml-72 transform text-center">
                    {match.team_A_score !== null && match.team_B_score !== null && match.team_A_score < match.team_B_score && (
                        <span className="text-slate-800"><IoStar/></span>
                    )}
                  </div>
                </div>
              </div>
            ))}          
            </div>
        ))}
      </div>  
      <div className="flex justify-between items-center mb-4 gap-5">
        <MainButton
          onClick={handlePrevious}
          text={'Anterior'}
          isLoading={false}
          isCancel={false}
        />
        <h2 className="text-xl font-semibold">Fecha {currentMatchDay}</h2>
        <MainButton
          onClick={handleNext}
          text={'Siguiente'}
          isLoading={false}
        />
      </div>    
    </div>
  );
};

export default GroupMatches;
