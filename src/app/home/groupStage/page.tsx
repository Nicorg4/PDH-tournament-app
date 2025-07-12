'use client'

import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import GroupMatches from './components/groupMatches';
import GroupStandings from './components/groupStandings';
import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Group, GroupsResponse, Match } from '@/app/types';


const GroupStage = () => {
    const [isGroupStageVisible, setIsGroupStageVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER
    const loggedUser = useSelector((state: RootState) => state.user);
    const [matches, setMatches] = useState([]);
    const [currentMatchDay, setCurrentMatchDay] = useState(1);
    const [groups, setGroups] = useState<Group[]>([]);

    const toggleComponentVisibility = () => {
        setIsGroupStageVisible(!isGroupStageVisible);
    };

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
            console.error('Error fetching groups:', error);
        }
    }

    const fetchMatches = () => {
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
            .catch((err) => {
                console.error("Error fetching matches:", err)
            });
    }

    useEffect(() => {
        fetchMatches();
        fetchGroups();
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <SoccerLoadingAnimation />
    }

    return (
        <div className="flex flex-col justify-center align-middle items-center gap-5 w-full mt-[80px] sm:mt-0">
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
                <GroupMatches fetchedMatches={matches} fetchedcurrentMatchDay={currentMatchDay} />
                :
                <GroupStandings fetchedGroups={groups} />}
        </div>
    )
}

export default GroupStage