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

const GroupStandings: React.FC = ({ }) => {
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
            {groups.length === 0 ?
                <div className="bg-gray-200 bg-opacity-70 border-none items-center rounded-md flex justify-center" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", minHeight: "40vh" }}>
                    <h1 className="text-2xl text-center p-10 text-slate-800">Todavía no hay grupos armados.</h1>
                </div>
                : (
                    <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-4 px-2 md:px-0 max-w-5xl pb-20 sm:pb-0">
                        {groups.map((group) => (
                            <div key={group.group_id} className=' bg-gray-200 bg-opacity-70 border-none items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                                <h2 className=" text-xl font-bold p-2 w-full text-center bg-slate-900 bg-opacity-50">Grupo {group.group_id}</h2>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-800 bg-opacity-40 rounded-md">
                                            <th className="p-2 text-left">-</th>
                                            <th className="p-2 text-left">Equipo</th>
                                            <th className="p-2 text-center">PJ</th>
                                            <th className="p-2 text-center">G</th>
                                            <th className="p-2 text-center">E</th>
                                            <th className="p-2 text-center">P</th>
                                            <th className="p-2 text-center">DF</th>
                                            <th className="p-2 text-center">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.teams.sort((a, b) => b.stats.points === a.stats.points ? b.stats.goal_diff - a.stats.goal_diff : b.stats.points - a.stats.points).map((groupTeam, index) => (
                                            <tr key={`group-${group.group_id}-team-${groupTeam.team.id}-${index}`} className="border-b border-slate-500">
                                                <td className="pb-3 pt-3 pl-3">
                                                    <Image className="rounded-full object-fit:cover object-center aspect-square" src={URL_IMG + groupTeam.team.user.picture} alt={'logo'} width={30} height={30} />
                                                </td>
                                                <td className="pb-3 pt-3 flex items-center gap-2">
                                                    <Image className="rounded-full object-fit:cover object-center aspect-square" src={URL_IMG + groupTeam.team.logo} alt={'logo'} width={30} height={30} />
                                                    {groupTeam.team.name}
                                                </td>
                                                <td className="pb-3 pt-3 text-center">{groupTeam.stats.wins + groupTeam.stats.draws + groupTeam.stats.losses}</td>
                                                <td className="pb-3 pt-3 text-center">{groupTeam.stats.wins}</td>
                                                <td className="pb-3 pt-3 text-center">{groupTeam.stats.draws}</td>
                                                <td className="pb-3 pt-3 text-center">{groupTeam.stats.losses}</td>
                                                <td className="pb-3 pt-3 text-center">{groupTeam.stats.goal_diff}</td>
                                                <td className="pb-3 pt-3 text-center">{groupTeam.stats.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
        </>
    )
}

export default GroupStandings;
