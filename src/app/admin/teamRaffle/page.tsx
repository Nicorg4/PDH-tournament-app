'use client'

import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import MainButton from '@/app/components/mainButton';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { CgArrowsExchange } from "react-icons/cg";
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
}

interface Pair {
    user: User;
    team: Team;
}

const TeamRafflePage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedPairs, setSelectedPairs] = useState<Pair[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentPair, setCurrentPair] = useState<Pair | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
    const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
    const loggedUser = useSelector((state: RootState) => state.user);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${URL_SERVER}users/get-all-without-team`,
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
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await fetch(`${URL_SERVER}teams/get-all-without-owner`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loggedUser.token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );
            const data = await response.json();
            setTeams(data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
        }
    };

    const fetchPairs = async () => {
        try {
            const response = await fetch(`${URL_SERVER}users/get-all-pairs`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loggedUser.token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );
            const data = await response.json();
            setSelectedPairs(data);
        } catch (error) {
            console.error('Error fetching pairs:', error);
        } finally {
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUsers();
            await fetchTeams();
            await fetchPairs();
            setIsLoading(false);
        };
        fetchData();
    }, [URL_SERVER]);

    const handleRaffle = async () => {
        try {
            const randomUserIndex = Math.floor(Math.random() * users.length);
            const randomTeamIndex = Math.floor(Math.random() * teams.length);

            const selectedUser = users[randomUserIndex];
            const selectedTeam = teams[randomTeamIndex];
            const response = await fetch(`${URL_SERVER}teams/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedUser.token}`
                },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    teamId: selectedTeam.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to assign team');
            }

            const newPair = { user: selectedUser, team: selectedTeam };
            setCurrentPair(newPair);
            setShowPopup(true);
            setUsers(users.filter((_, index) => index !== randomUserIndex));
            setTeams(teams.filter((_, index) => index !== randomTeamIndex));

        } catch (error) {
            console.error('Error assigning team:', error);
        }
    };

    const handleContinue = () => {
        if (currentPair) {
            setSelectedPairs([...selectedPairs, currentPair]);
            setShowPopup(false);
            setCurrentPair(null);
        }
    };

    const handleReset = async () => {
        try {
            const response = await fetch(`${URL_SERVER}teams/reset-team-ownership`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedUser.token}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to reset teams');
            }
        } catch (error) {
            console.error('Error resetting teams:', error);
        } finally {
            fetchUsers();
            fetchTeams();
            setSelectedPairs([]);
        }
    };

    const handleGroupsRaffle = async () => {
        const groupCount = selectedPairs.length / 4;
        const groups = [];
        for (let i = 0; i < groupCount; i++) {
            const group = selectedPairs.slice(i * 4, (i + 1) * 4);
            groups.push(group);
        }
        try {
            const response = await fetch(`${URL_SERVER}groups/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedUser.token}`
                },
                body: JSON.stringify({
                    groups,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            router.push('/admin/groups');
        } catch (error) {

        } finally {
        }
    }

    if (isLoading) {
        return <SoccerLoadingAnimation />
    }

    return (
        <div className="flex w-full justify-between h-[90vh] gap-5">
            <div className='w-1/6 bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                <h2 className='text-center w-full p-3 bg-transparent mb-10 text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Usuarios</h2>
                <ul>
                    {users.map((user, index) => (
                        <div className='flex gap-3 items-center mb-2 text-slate-800' key={index}>
                            <Image src={URL_IMG + user.picture} alt={"logo"} width={35} height={35} className="rounded-full object-cover aspect-square" />
                            <h3>{user.username}</h3>
                        </div>
                    ))}
                </ul>
            </div>
            <div className='w-2/3 bg-gray-200 bg-opacity-70 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                <h2 className='mb-5 text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Sorteo</h2>
                <div className='flex items-center gap-5'>
                    {(selectedPairs.length === 16) ? (
                        <MainButton text={'Armar grupos'} isLoading={isLoading} onClick={handleGroupsRaffle} />
                    ) : (
                        <MainButton text={'Sortear'} isLoading={isLoading} onClick={handleRaffle} />
                    )}
                    <MainButton text={'Reiniciar'} isLoading={isLoading} onClick={handleReset} isCancel={true} />
                </div>
                <div className='h-[70%] flex justify-center'>
                    <div className='mt-10 grid grid-cols-2 gap-2'>
                        {selectedPairs.map((pair, index) => (
                            <div className='flex gap-3 items-center h-2 p-7 rounded-lg bg-white/40 shadow-lg' key={index}>
                                <div className="flex items-center gap-2 min-w-[160px] justify-end">
                                    <p className='text-slate-800'>{pair.user.username}</p>
                                    <Image src={URL_IMG + pair.user.picture} alt={"logo"} width={35} height={35} className="rounded-full object-cover aspect-square" />
                                </div>
                                <div className="flex justify-center items-center w-12">
                                    <CgArrowsExchange className='text-2xl mx-auto text-slate-800' />
                                </div>
                                <div className="flex items-center gap-2 min-w-[160px]">
                                    <Image src={URL_IMG + pair.team.logo} alt={pair.team.name} width={35} height={35} />
                                    <p className='text-slate-800'>{pair.team.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='w-1/6 bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                <h2 className='text-center w-full p-3 bg-transparent mb-10 text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Equipos</h2>
                <ul>
                    {teams.map((team, index) => (
                        <li className='flex gap-3 items-center mb-2' key={index} style={{ color: 'white', fontSize: '1.1rem' }}>
                            <Image src={URL_IMG + team.logo} alt={team.name} width={35} height={35} />
                            <h3 className='text-slate-800'>{team.name}</h3>
                        </li>
                    ))}
                </ul>
            </div>
            {showPopup && currentPair && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-slate-800 p-20 pl-32 pr-32 rounded-md flex flex-col items-center gap-10" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                        <h3 className="text-3xl mb-4">Equipo sorteado:</h3>
                        <div className="flex items-center gap-12">
                            <div className="flex flex-col items-center">
                                <div style={{ width: 150, height: 150, position: 'relative' }}>
                                    <Image
                                        src={URL_IMG + currentPair.team.logo}
                                        alt={currentPair.team.name}
                                        fill
                                        style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                                        sizes="150px"
                                    />
                                </div>
                                <span className="mt-2">{currentPair.team.name}</span>
                            </div>
                            <CgArrowsExchange className='text-8xl' />
                            <div className="flex flex-col items-center">
                                <Image src={URL_IMG + currentPair.user.picture} alt={"logo"} width={150} height={150} className="rounded-full object-cover aspect-square" />
                                <span className="mt-2">{currentPair.user.username}</span>
                            </div>
                        </div>
                        <MainButton text={'Continuar'} isLoading={isLoading} onClick={handleContinue} isCancel={true} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamRafflePage;