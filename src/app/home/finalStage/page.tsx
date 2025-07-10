'use client'

import SoccerLoadingAnimation from "@/app/components/loadingAnimation";
import { RootState } from "@/redux/store";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

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
const GroupMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG
  const [isLoading, setIsLoading] = useState(false);
  const loggedUser = useSelector((state: RootState) => state.user);

  const getPhaseTitle = (phase: number) => {
    switch (phase) {
      case 8: return "Octavos de Final";
      case 4: return "Cuartos de Final";
      case 2: return "Semifinales";
      case 1: return "Final";
      default: return `Fase ${phase}`;
    }
  };

  const fetchPlayoffMatches = async () => {
    setIsLoading(true);
    fetch(`${URL_SERVER}playoffs/get-all`,
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
        setIsLoading(false);
      })
      .catch((err) => console.error("Error fetching matches:", err));
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPlayoffMatches();
  }, []);

  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.phase]) {
      acc[match.phase] = [];
    }
    acc[match.phase].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  if (isLoading) {
    return (
      <SoccerLoadingAnimation />
    );
  }

  return (
    <div className="flex justify-center w-full pb-20 sm:pb-0 mt-[80px] sm:mt-0">
      {matches.length === 0 ?
        <div className="bg-gray-200 bg-opacity-70 border-none items-center rounded-md flex justify-center min-h-[40vh]" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h1 className="text-2xl text-center p-10 text-slate-800">Todavía no hay partidos disponibles.</h1>
        </div>
        : (
          <div className='w-full bg-gray-200 bg-opacity-70 p-5 border-none flex flex-col items-center rounded-md sm:w-5/6 pb-10' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
            <h1 className="text-3xl font-bold mb-10 text-slate-800">Editar Partidos</h1>
            <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Cuartos de Final */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center border-b border-slate-800 pb-2 text-slate-800 ">
                  {getPhaseTitle(4)}
                </h2>
                <div className="flex flex-col gap-8">
                  {(groupedMatches[4] || []).map((match) => (
                    <div
                      key={match.match_id}
                      className="p-4 border border-slate-800 rounded-lg flex items-center gap-3 flex-col w-80 transition-all duration-300 mx-auto"
                    >
                      <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3">
                        <div className="flex items-center">
                          <img
                            src={URL_IMG + match.user_A_picture}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <img
                            src={URL_IMG + match.team_A_logo}
                            alt={match.team_A_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="font-semibold">{match.team_A_name}</span>
                        </div>
                        <span
                          className="w-10 rounded-lg text-center border border-slate-800"
                          style={match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        >
                          {match.team_A_score !== null ? match.team_A_score : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <img
                            src={URL_IMG + match.user_B_picture}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <img
                            src={URL_IMG + match.team_B_logo}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="font-semibold">{match.team_B_name}</span>
                        </div>
                        <span
                          className="w-10 rounded-lg text-center border border-slate-800"
                          style={match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        >
                          {match.team_B_score !== null ? match.team_B_score : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Semifinales */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center border-b border-slate-800 pb-2 text-slate-800">
                  {getPhaseTitle(2)}
                </h2>
                <div className="flex flex-col gap-8 h-[90%] justify-center">
                  {(groupedMatches[2] || []).map((match) => (
                    <div
                      key={match.match_id}
                      className="p-4 border border-slate-800 rounded-lg flex items-center gap-3 flex-col w-80 transition-all duration-300 mx-auto"
                    >
                      <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3">
                        <div className="flex items-center">
                          <img
                            src={URL_IMG + match.user_A_picture}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <img
                            src={URL_IMG + match.team_A_logo}
                            alt={match.team_A_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="font-semibold">{match.team_A_name}</span>
                        </div>
                        <span
                          className="w-10 rounded-lg text-center border border-slate-800"
                          style={match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        >
                          {match.team_A_score !== null ? match.team_A_score : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <img
                            src={URL_IMG + match.user_B_picture}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <img
                            src={URL_IMG + match.team_B_logo}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="font-semibold">{match.team_B_name}</span>
                        </div>
                        <span
                          className="w-10 rounded-lg text-center border border-slate-800"
                          style={match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        >
                          {match.team_B_score !== null ? match.team_B_score : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Final */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center border-b border-slate-800 pb-2 text-slate-800">
                  {getPhaseTitle(1)}
                </h2>
                <div className="flex flex-col gap-8 h-[90%] justify-center">
                  {(groupedMatches[1] || []).map((match) => (
                    <div
                      key={match.match_id}
                      className="p-4 border border-slate-800 rounded-lg flex items-center gap-3 flex-col w-80 transition-all duration-300 mx-auto"
                    >
                      <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3">
                        <div className="flex items-center">
                          <img
                            src={URL_IMG + match.user_A_picture}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <img
                            src={URL_IMG + match.team_A_logo}
                            alt={match.team_A_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="font-semibold">{match.team_A_name}</span>
                        </div>
                        <span
                          className="w-10 rounded-lg text-center border border-slate-800"
                          style={match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        >
                          {match.team_A_score !== null ? match.team_A_score : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <img
                            src={URL_IMG + match.user_B_picture}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <img
                            src={URL_IMG + match.team_B_logo}
                            alt={match.team_B_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="font-semibold">{match.team_B_name}</span>
                        </div>
                        <span
                          className="w-10 rounded-lg text-center border border-slate-800"
                          style={match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        >
                          {match.team_B_score !== null ? match.team_B_score : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default GroupMatches;
