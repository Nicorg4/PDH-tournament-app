'use client'

import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import GroupMatches from './components/GroupMatches';
import GroupStandings from './components/GroupStandings';
import Notification from '@/app/components/notification';
import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

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

interface GroupsResponse {
    groups: Group[];
}

interface User {
    id: number;
    username: string;
    picture: string;
}

interface Team {
    id: number;
    name: string;
    logo: string;
    user: User;
}

interface TeamStats {
    points: number;
    wins: number;
    draws: number;
    losses: number;
    goal_diff: number;
}

interface GroupTeam {
    team: Team;
    stats: TeamStats;
}

interface Group {
    group_id: number;
    teams: GroupTeam[];
}

const GroupStage = () => {
    const [isGroupStageVisible, setIsGroupStageVisible] = useState(false);
    const [pageIsLoading, setPageIsLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [currentMatchDay, setCurrentMatchDay] = useState(1);
    const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
    const loggedUser = useSelector((state: RootState) => state.user);

    const toggleComponentVisibility = () => {
        setIsGroupStageVisible(!isGroupStageVisible);
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

    const fetchMatches = async () => {
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
    }

    const fetchGroups = async () => {
        try {
            const response = await fetch(`${URL_SERVER}groups/get-all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedUser.token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            const data: GroupsResponse = await response.json();
            setGroups(data.groups);
        } catch (error) {

        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchMatches();
            await fetchGroups();
            setPageIsLoading(false);
        };
        fetchData();
    }, []);

    if (pageIsLoading) {
        return <SoccerLoadingAnimation />
    }

    return (
        <div className="flex flex-col justify-center align-middle items-center gap-5 w-full mt-[80px] sm:mt-0">
            {notification.show && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    timer={5000}
                    closeNotification={() => setNotification({ ...notification, show: false })}
                />
            )}
            {!isGroupStageVisible ?
                <button
                    onClick={toggleComponentVisibility}
                    className="flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
                >
                    Partidos
                    <FaArrowRight />
                </button> :
                <button
                    onClick={toggleComponentVisibility}
                    className="flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
                >
                    <FaArrowLeft />
                    Grupos
                </button>}

            {isGroupStageVisible
                ?
                <GroupMatches fetchedMatches={matches} fetchedcurrentMatchDay={currentMatchDay} showNotification={showNotification} updateGroups={fetchGroups} />
                :
                <GroupStandings fetchedGroups={groups} />}
        </div>
    )
}

export default GroupStage