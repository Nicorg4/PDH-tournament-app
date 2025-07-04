'use client'

import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

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

const Page: React.FC = ({}) => {
    const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
    const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGroups = async () => {
        try{
            const response = await fetch(`${URL_SERVER}groups/get-all`, {
                method: 'GET',
            });
            const data: GroupsResponse = await response.json();
            setGroups(data.groups);
        }catch(error){

        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    if (isLoading) {
        return (<SoccerLoadingAnimation/>)
    }

    return (
        <>
        {groups.length === 0 ? 
        <div className=' bg-gray-200 bg-opacity-70 border-none items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h1 className="text-2xl text-center p-96 text-slate-800">Todavia no hay grupos armados.</h1>
        </div>
          : (
        <div className='p-10 grid grid-cols-2 gap-4 w-4/5 md:w-3/5'>
            {groups.map((group, groupIndex) => (
                <div key={`group-${group.group_id}-${groupIndex}`} className=' bg-gray-200 bg-opacity-70 border-none items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                    <h2 className=" text-xl font-bold p-5 w-full text-center bg-slate-900 bg-opacity-50">Grupo {group.group_id}</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-800 bg-opacity-40 rounded-md">
                                <th className="p-2 text-left pl-5">Equipo</th>
                                <th className="p-2 text-right pr-5">Jugador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.teams.sort((a, b) => b.stats.points === a.stats.points ? b.stats.goal_diff - a.stats.goal_diff : b.stats.points - a.stats.points).map((groupTeam, teamIndex) => (
                                <tr key={`team-${groupTeam.team.id}-${teamIndex}`} className="border-b border-slate-500">
                                    <td className="pb-3 pt-3 pl-5 gap-2 text-left border-r border-slate-500 w-1/2 hover:bg-slate-800 hover:bg-opacity-50">
                                        <div className="flex flex-row items-center gap-2">
                                            <Image className="rounded-full object-fit:cover object-center aspect-square" src={URL_IMG + groupTeam.team.logo} alt={'Team logo'} width={30} height={30}/>
                                            {groupTeam.team.name}
                                        </div>
                                    </td>
                                    <td className="pb-3 pt-3 pr-5 gap-2 text-right hover:bg-slate-800 hover:bg-opacity-50">
                                        <div className="flex flex-row items-center gap-2 justify-end">
                                            {groupTeam.team.user.username}
                                            <Image className="rounded-full object-fit:cover object-center aspect-square" src={URL_IMG + groupTeam.team.user.picture} alt={'Team logo'} width={30} height={30}/>
                                        </div>
                                    </td>
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

export default Page;
