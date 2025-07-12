'use client'

import SoccerLoadingAnimation from "@/app/components/loadingAnimation";
import MainButton from "@/app/components/mainButton";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { Match } from "@/app/types";

interface GroupMatchesProps {
  showNotification: (message: string, type: 'success' | 'error') => void;
  fetchedMatches: Match[];
  fetchedcurrentMatchDay: number;
  updateGroups: () => void;
}

const GroupMatches = ({ showNotification, fetchedMatches, fetchedcurrentMatchDay, updateGroups }: GroupMatchesProps) => {
  const [matches, setMatches] = useState<Match[]>(fetchedMatches);
  const [allMatchesPlayed, setAllMatchesPlayed] = useState(false);
  const [currentMatchDay, setCurrentMatchDay] = useState(fetchedcurrentMatchDay);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const loggedUser = useSelector((state: RootState) => state.user);

  const checkIfAllMatchesPlayed = async () => {
    try {
      const response = await fetch(`${URL_SERVER}groups/check-all-matches-played`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${loggedUser.token}`
          },
        }
      );
      const data = await response.json();
      setAllMatchesPlayed(data.allMatchesPlayed);
    } catch (err) {
      console.error("Error checking if all matches played:", err);
    }
  };
  useEffect(() => {
    checkIfAllMatchesPlayed();
    setMatches(fetchedMatches);
    setCurrentMatchDay(fetchedcurrentMatchDay);
  }, [fetchedMatches, fetchedcurrentMatchDay]);

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
          'Authorization': `Bearer ${loggedUser.token}`
        },
        body: JSON.stringify({ matches }),
      });
      showNotification("Partidos actualizados correctamente.", "success");
      updateGroups();
    } catch (error) {
      showNotification("Error al actualizar los partidos.", "error");
      console.error("Error updating matches", error);
    } finally {
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

  const handleCreatePlayoff = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL_SERVER}playoffs/create-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        },
      });
      if (!response.ok) {
        throw new Error('Error al crear los partidos de playoff');
      }
      navigate.push('/admin/editFinalStageMatches');
    } catch (error) {
      console.error("Error al crear los partidos de playoff:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (<SoccerLoadingAnimation />)
  }

  return (
    <>
      {matches.length === 0 ? (
        <div className="bg-gray-200 bg-opacity-70 border-none items-center rounded-md flex justify-center min-h-[40vh]" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h1 className="text-2xl text-center p-10 text-slate-800">Todavía no hay partidos disponibles.</h1>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center pb-20 sm:pb-0">
          <div className="w-full max-w-4xl bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md p-2 sm:p-6 mx-auto" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 text-center">Editar Partidos</h1>
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
                          <input
                            type="number"
                            min="0"
                            className="w-10 text-center rounded bg-slate-300 text-slate-800"
                            value={match.team_A_score !== null ? match.team_A_score : ""}
                            onChange={(e) =>
                              handleScoreChange(match.match_id, "team_A_score", e.target.value)
                            }
                            style={match.team_A_score !== null && match.team_B_score !== null && match.team_A_score > match.team_B_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                          />
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
                          <input
                            type="number"
                            min="0"
                            className="w-10 text-center rounded bg-slate-300 text-slate-800"
                            value={match.team_B_score !== null ? match.team_B_score : ""}
                            onChange={(e) =>
                              handleScoreChange(match.match_id, "team_B_score", e.target.value)
                            }
                            style={match.team_A_score !== null && match.team_B_score !== null && match.team_A_score < match.team_B_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                          />
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-[70%] mx-auto sm:w-full sm:justify-center">
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
                  isCancel={false}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupMatches;
