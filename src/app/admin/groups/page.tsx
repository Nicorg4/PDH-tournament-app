'use client'

import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

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

interface GroupsResponse {
    groups: Group[];
}

const Page: React.FC = ({ }) => {
    const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
    const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const loggedUser = useSelector((state: RootState) => state.user);

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

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    if (isLoading) {
        return (<SoccerLoadingAnimation />)
    }

    return (
        <>
            {groups.length === 0 ? (
                <div className="bg-gray-200 bg-opacity-70 border-none items-center rounded-md flex justify-center" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", minHeight: "40vh" }}>
                    <h1 className="text-2xl text-center p-10 text-slate-800">Todavía no hay grupos armados.</h1>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center mt-[80px] sm:mt-0 pb-20 sm:pb-0">
                    <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-4 px-2 md:px-0 max-w-5xl">
                        {groups.map((group, groupIndex) => (
                            <div
                                key={`group-${group.group_id}-${groupIndex}`}
                                className="bg-gray-200 bg-opacity-70 border-none rounded-md mb-4 flex-1 min-w-[260px] max-w-full"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                            >
                                <h2 className="text-lg md:text-xl font-bold p-2 w-full text-center bg-slate-900 bg-opacity-50 rounded-t-md">
                                    Grupo {group.group_id}
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse min-w-[320px]">
                                        <thead>
                                            <tr className="bg-slate-800 bg-opacity-40 rounded-md">
                                                <th className="p-2 text-left pl-3 md:pl-5 text-xs md:text-base">Equipo</th>
                                                <th className="p-2 text-right pr-3 md:pr-5 text-xs md:text-base">Jugador</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.teams
                                                .sort((a, b) =>
                                                    b.stats.points === a.stats.points
                                                        ? b.stats.goal_diff - a.stats.goal_diff
                                                        : b.stats.points - a.stats.points
                                                )
                                                .map((groupTeam, teamIndex) => (
                                                    <tr
                                                        key={`team-${groupTeam.team.id}-${teamIndex}`}
                                                        className="border-b border-slate-500"
                                                    >
                                                        <td className="pb-3 pt-3 pl-3 md:pl-5 gap-2 text-left border-r border-slate-500 w-1/2 hover:bg-slate-800 hover:bg-opacity-50">
                                                            <div className="flex flex-row items-center gap-2">
                                                                <Image
                                                                    className="rounded-full object-cover object-center aspect-square"
                                                                    src={URL_IMG + groupTeam.team.logo}
                                                                    alt={'logo'}
                                                                    width={28}
                                                                    height={28}
                                                                />
                                                                <span className="truncate text-xs md:text-base">{groupTeam.team.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="pb-3 pt-3 pr-3 md:pr-5 gap-2 text-right hover:bg-slate-800 hover:bg-opacity-50">
                                                            <div className="flex flex-row items-center gap-2 justify-end">
                                                                <span className="truncate text-xs md:text-base">{groupTeam.team.user.username}</span>
                                                                <Image
                                                                    className="rounded-full object-cover object-center aspect-square"
                                                                    src={URL_IMG + groupTeam.team.user.picture}
                                                                    alt={'logo'}
                                                                    width={28}
                                                                    height={28}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default Page;
