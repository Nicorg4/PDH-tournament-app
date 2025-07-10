'use client'

import SoccerLoadingAnimation from "@/app/components/loadingAnimation";
import MainButton from "@/app/components/mainButton";
import Notification from "@/app/components/notification";
import { RootState } from "@/redux/store";
import React, { useState, useEffect } from "react";
import { IoStar } from "react-icons/io5";
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
  const [allQuartersPlayed, setAllQuartersPlayed] = useState(false);
  const [allSemifinalsPlayed, setAllSemifinalsPlayed] = useState(false);
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

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  const checkIfAllQuartersPlayed = async () => {
    try {
      const response = await fetch(`${URL_SERVER}playoffs/check-all-quarters-played`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`,
            'ngrok-skip-browser-warning': 'true'
          },
        }
      );
      const data = await response.json();
      setAllQuartersPlayed(data.allMatchesPlayed);
      console.log("Respuesta desde el servidor:", data);
    } catch (err) {
      console.error("Error checking if all matches played:", err);
    }
  };
  const checkIfAllSemifinalsPlayed = async () => {
    try {
      const response = await fetch(`${URL_SERVER}playoffs/check-all-semifinals-played`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`,
            'ngrok-skip-browser-warning': 'true'
          },
        }
      );
      const data = await response.json();
      setAllSemifinalsPlayed(data.allMatchesPlayed);
      console.log("Respuesta desde el servidor:", data);
    } catch (err) {
      console.error("Error checking if all matches played:", err);
    }
  };
  useEffect(() => {
    checkIfAllQuartersPlayed();
    checkIfAllSemifinalsPlayed();
  }, []);

  const fetchPlayoffMatches = async () => {
    try {
      const response = await fetch(`${URL_SERVER}playoffs/get-all`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`,
            'ngrok-skip-browser-warning': 'true'
          },
        }
      );
      const data = await response.json();
      setMatches(data.matches);
      console.log("Respuesta desde el servidor:", data);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  }

  useEffect(() => {
    fetchPlayoffMatches();
  }, []);

  const handleScoreChange = (
    matchId: number,
    field: "team_A_score" | "team_B_score" | "team_A_penalty_score" | "team_B_penalty_score",
    value: string
  ) => {
    const numValue = parseInt(value);
    setMatches((prevMatches) =>
      prevMatches.map((match) => {
        if (match.match_id !== matchId) return match;

        const updatedMatch = { ...match, [field]: value === "" ? null : (!isNaN(numValue) && numValue >= 0 ? numValue : match[field]) };

        let winner_team_id: number | null = null;
        if (
          updatedMatch.team_A_score !== null &&
          updatedMatch.team_B_score !== null
        ) {
          if (updatedMatch.team_A_score > updatedMatch.team_B_score) {
            winner_team_id = updatedMatch.team_A_id;
          } else if (updatedMatch.team_B_score > updatedMatch.team_A_score) {
            winner_team_id = updatedMatch.team_B_id;
          } else {
            winner_team_id = null;
          }
        }

        return { ...updatedMatch, winner_team_id };
      })
    );
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await fetch(`${URL_SERVER}playoffs/update-matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loggedUser.token}`,
        },
        body: JSON.stringify({ matches }),
      });
      checkIfAllQuartersPlayed();
      checkIfAllSemifinalsPlayed();
      showNotification("Partidos actualizados correctamente.", "success");
    } catch (error) {
      showNotification("Error al actualizar los partidos.", "error");
      console.error("Error updating matches", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSemifinals = async () => {
    try {
      const response = await fetch(`${URL_SERVER}playoffs/create-semifinals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loggedUser.token}`,
        }
      });
      fetchPlayoffMatches();
      checkIfAllQuartersPlayed();
      showNotification("Partidos actualizados correctamente.", "success");
    }

    catch (error) {
      showNotification("Error al actualizar los partidos.", "error");
      console.error("Error updating matches", error);
    }

  }

  const createFinal = async () => {
    try {
      const response = await fetch(`${URL_SERVER}playoffs/create-final`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loggedUser.token}`,
        }
      });

      if (!response.ok) {
        throw new Error("Error al crear los partidos.");
      }
      fetchPlayoffMatches();
      checkIfAllSemifinalsPlayed();
      showNotification("Partidos actualizados correctamente.", "success");
    }

    catch (error) {
      showNotification("Error al actualizar los partidos.", "error");
      console.error("Error updating matches", error);
    }

  }

  const allPhaseMatchesHaveResult = (phase: number) => {
    const phaseMatches = matches.filter(m => m.phase === phase);
    return (
      phaseMatches.length > 0 &&
      phaseMatches.every(m => m.team_A_score !== null && m.team_B_score !== null)
    );
  };

  const phaseExists = (phase: number) => matches.some(m => m.phase === phase);

  const safeMatches = Array.isArray(matches) ? matches : [];

  const groupedMatches = safeMatches.reduce((acc, match) => {
    if (!acc[match.phase]) {
      acc[match.phase] = [];
    }
    acc[match.phase].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  return (
    <div className="flex justify-center w-full mt-[80px] sm:mt-0 pb-20 sm:pb-0">
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          timer={5000}
          closeNotification={() => setNotification({ ...notification, show: false })}
        />
      )}
      {matches.length === 0 ?
        <div className="bg-gray-200 bg-opacity-70 border-none items-center rounded-md flex justify-center min-h-[40vh]" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h1 className="text-2xl text-center p-10 text-slate-800">Todavía no hay partidos disponibles.</h1>
        </div>
        : (
          <div className='w-full bg-gray-200 bg-opacity-70 p-5 border-none flex flex-col items-center rounded-md sm:w-5/6' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
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
                        <input
                          type="number"
                          min="0"
                          className="w-10 text-center rounded bg-slate-300 text-slate-800"
                          value={match.team_B_score !== null ? match.team_B_score : ""}
                          onChange={(e) =>
                            handleScoreChange(match.match_id, "team_B_score", e.target.value)
                          }
                          style={match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        />
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
                        <input
                          type="number"
                          min="0"
                          className="w-10 text-center rounded bg-slate-300 text-slate-800"
                          value={match.team_B_score !== null ? match.team_B_score : ""}
                          onChange={(e) =>
                            handleScoreChange(match.match_id, "team_B_score", e.target.value)
                          }
                          style={match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        />
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
                        <input
                          type="number"
                          min="0"
                          className="w-10 text-center rounded bg-slate-300 text-slate-800"
                          value={match.team_B_score !== null ? match.team_B_score : ""}
                          onChange={(e) =>
                            handleScoreChange(match.match_id, "team_B_score", e.target.value)
                          }
                          style={match.team_B_score !== null && match.team_A_score !== null && match.team_B_score > match.team_A_score ? { backgroundColor: '#6cac6c', color: 'white' } : {}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex mt-10 gap-5">
              <MainButton
                onClick={handleSaveChanges}
                text={'Guardar Cambios'}
                isLoading={isLoading}
              />
              {/* Mostrar botón de semifinales solo si todos los cuartos tienen resultado y NO existen semifinales */}
              {allPhaseMatchesHaveResult(4) && !phaseExists(2) && (
                <MainButton
                  onClick={createSemifinals}
                  text={'Armar semifinales'}
                  isLoading={false}
                />
              )}
              {/* Mostrar botón de final solo si todos los semifinales tienen resultado y NO existe la final */}
              {allPhaseMatchesHaveResult(2) && !phaseExists(1) && (
                <MainButton
                  onClick={createFinal}
                  text={'Armar Final'}
                  isLoading={false}
                />
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default GroupMatches;
