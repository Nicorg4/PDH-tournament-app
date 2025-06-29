'use client'

import SoccerLoadingAnimation from "@/app/components/loadingAnimation";
import Notification from "@/app/components/notification";
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
const GroupMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG
  const [isLoading, setIsLoading] = useState(false);

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
    fetch(`${URL_SERVER}playoffs/get-all`)
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
    <>
      {matches.length === 0 ?
        <div className=' bg-gray-200 bg-opacity-70 border-none items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h1 className="text-2xl text-center p-96 text-slate-800">Todavia no hay partidos disponibles.</h1>
        </div>
        : (
          <div className='w-4/5 bg-gray-200 bg-opacity-70 p-5 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
            <h1 className="text-3xl font-bold mb-10 text-slate-800">Fase final</h1>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
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
                        <p className="text-slate-800 font-bold">{match.team_A_score !== null ? match.team_A_score : ""}</p>
                        <div className="absolute ml-80 transform text-center">
                          {match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score && (
                            <span className="text-slate-800"><IoStar /></span>
                          )}
                        </div>
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
                        <p className="text-slate-800 font-bold">{match.team_B_score !== null ? match.team_B_score : ""}</p>
                        <div className="absolute ml-80 transform text-center">
                          {match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score && (
                            <span className="text-slate-800"><IoStar /></span>
                          )}
                        </div>
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
                            alt={match.team_A_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <img
                            src={URL_IMG + match.team_A_logo}
                            alt={match.team_A_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="font-semibold">{match.team_A_name}</span>
                        </div>
                        <p className="text-slate-800 font-bold">{match.team_A_score !== null ? match.team_A_score : ""}</p>
                        <div className="absolute ml-80 transform text-center">
                          {match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score && (
                            <span className="text-slate-800"><IoStar /></span>
                          )}
                        </div>
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
                        <p className="text-slate-800 font-bold">{match.team_B_score !== null ? match.team_B_score : ""}</p>
                        <div className="absolute ml-80 transform text-center">
                          {match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score && (
                            <span className="text-slate-800"><IoStar /></span>
                          )}
                        </div>
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
                        <p className="text-slate-800 font-bold">{match.team_A_score !== null ? match.team_A_score : ""}</p>

                        <div className="absolute ml-80 transform text-center">
                          {match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score && (
                            <span className="text-slate-800"><IoStar /></span>
                          )}
                        </div>
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
                        <p className="text-slate-800 font-bold">{match.team_B_score !== null ? match.team_B_score : ""}</p>
                        <div className="absolute ml-80 transform text-center">
                          {match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score && (
                            <span className="text-slate-800"><IoStar /></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default GroupMatches;
