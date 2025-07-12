'use client'

import { Match } from "@/app/types";
import React, { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

interface GroupMatchesProps {
  fetchedMatches: Match[];
  fetchedcurrentMatchDay: number;
}

const GroupMatches = ({ fetchedMatches, fetchedcurrentMatchDay }: GroupMatchesProps) => {
  const [matches, setMatches] = useState<Match[]>(fetchedMatches);
  const [currentMatchDay, setCurrentMatchDay] = useState(fetchedcurrentMatchDay);
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG

  useEffect(() => {
    setMatches(fetchedMatches);
    setCurrentMatchDay(fetchedcurrentMatchDay);
  }, [fetchedMatches, fetchedcurrentMatchDay]);

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
    <>
      {matches.length === 0 ? (
        <div className="bg-gray-200 bg-opacity-70 border-none items-center rounded-md flex justify-center min-h-[40vh]" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h1 className="text-2xl text-center p-10 text-slate-800">Todavía no hay partidos disponibles.</h1>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center pb-20 sm:pb-0">
          <div className="w-full max-w-4xl bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md p-2 sm:p-6 mx-auto" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 text-center">Fase de grupos</h1>
            <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-8 mb-5 overflow-x-auto">
              {groupedMatches[currentMatchDay] &&
                Object.entries(groupedMatches[currentMatchDay]).map(([group_id, groupMatches]) => (
                  <div key={group_id} className="space-y-2 min-w-[260px] max-w-full">
                    <h3 className="text-base sm:text-lg text-slate-800 font-bold text-center mb-2">Grupo {group_id}</h3>
                    {groupMatches.map((match) => (
                      <div
                        key={match.match_id}
                        className="p-3 border border-slate-800 rounded-lg shadow-sm flex items-center gap-2 flex-col w-full sm:w-72 mx-auto bg-opacity-80"
                      >
                        <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3">
                          <div className="flex items-center">
                            <img
                              src={URL_IMG + match.team_A_logo}
                              alt={match.team_A_name}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <span className="font-semibold text-xs sm:text-base">{match.team_A_name}</span>
                          </div>
                          <span
                            className="w-10 rounded-lg text-center border border-slate-800"
                            style={match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}>
                            {match.team_A_score !== null ? match.team_A_score : "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <img
                              src={URL_IMG + match.team_B_logo}
                              alt={match.team_B_name}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <span className="font-semibold text-xs sm:text-base">{match.team_B_name}</span>
                          </div>
                          <span
                            className="w-10 rounded-lg text-center border border-slate-800"
                            style={match.team_A_score !== null && match.team_B_score !== null && match.team_A_score < match.team_B_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}>
                            {match.team_B_score !== null ? match.team_B_score : "-"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
            <div className="flex sm:flex-row justify-center items-center gap-3 mb-4 sm:gap-5 w-full max-w-md mx-auto">
              <button
                className={`flex p-3 border-none rounded-[15px] gap-2 items-center hover:bg-opacity-70 text-white font-bold ${currentMatchDay === 1 ? "bg-slate-500 hover:bg-slate-500 pointer-events-none" : "bg-slate-800"}`}
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                onClick={handlePrevious}
                disabled={currentMatchDay === 1}>
                <FaArrowLeft />
              </button>
              <h2 className="text-base sm:text-lg font-semibold text-center">Fecha {currentMatchDay}</h2>
              <button className={`flex p-3 border-none rounded-[15px] gap-2 items-center hover:bg-opacity-70 text-white font-bold ${currentMatchDay === matchDays.length
                ? "bg-slate-500 hover:bg-slate-500 pointer-events-none" : "bg-slate-800"}`}
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                onClick={handleNext}
                disabled={currentMatchDay === matchDays.length}>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupMatches;
