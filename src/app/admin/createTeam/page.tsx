'use client'

import MainButton from '@/app/components/mainButton';
import Notification from '@/app/components/notification';
import PopUpNotification from '@/app/components/popUpNotification';
import { Team } from '@/app/types';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    picture: null as File | null,
    previewUrl: '' as string
  })

  const [formAddPlayerData, setFormAddPlayerData] = useState({
    playername: '',
    number: 0,
    position: '',
    team_id: 0
  })

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [createTeamFormVisible, setCreateTeamFormVisible] = useState(true);
  const [showCreateTeamPopup, setShowCreateTeamPopup] = useState(false);
  const [showAddPlayerPopup, setShowAddPlayerPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loggedUser = useSelector((state: RootState) => state.user);

  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${URL_SERVER}teams/get-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })
      if (!response.ok) {
        throw new Error('Error al obtener los equipos');
      }
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.log(error)
    } finally {

    }
  }

  useEffect(() => {
    fetchTeams();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowCreateTeamPopup(true);
  }

  const createNewTeam = async () => {
    if (!formData.picture || !formData.name) {
      return
    }
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.picture) {
        formDataToSend.append('picture', formData.picture);
      }

      const response = await fetch(`${URL_SERVER}teams/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loggedUser.token}`
        },
        body: formDataToSend
      });
      if (!response.ok) {
        showNotification('Error al crear el usuario', 'error');
        throw new Error('Error al crear el usuario');
      }
      setFormData({
        name: '',
        picture: null,
        previewUrl: ''
      })
      fetchTeams();
      showNotification('Equipo creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    } finally {
      setIsLoading(false);
      setShowCreateTeamPopup(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        picture: file,
        previewUrl: URL.createObjectURL(file)
      })
    }
  }

  const handleSubmitAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddPlayerPopup(true);

  }

  const addNewPlayer = async () => {
    if (!formAddPlayerData.playername || !formAddPlayerData.number || !formAddPlayerData.position || !formAddPlayerData.team_id || formAddPlayerData.number < 1 || formAddPlayerData.number > 99) {
      return
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${URL_SERVER}players/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        },
        body: JSON.stringify(formAddPlayerData)
      });
      if (!response.ok) {
        showNotification('Error al crear el jugador.', 'error');
        throw new Error('Error al crear el usuario');
      }
      setFormAddPlayerData({
        playername: '',
        number: 0,
        position: '',
        team_id: 0
      })
      fetchTeams();
      showNotification('Jugador creado correctamente.', 'success');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    } finally {
      setIsLoading(false);
      setShowAddPlayerPopup(false);
    }
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  return (
    <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full">
      <>
        {showCreateTeamPopup && (
          <PopUpNotification closeNotification={() => setShowCreateTeamPopup(false)}>
            <div className='flex flex-col justify-center align-middle items-center gap-5 w-4/5 h-full'>
              <p className='text-slate-800 text-2xl text-center'>
                Estás seguro que querés crear el equipo <span className="text-slate-900 font-bold">{formData?.name}</span>?
              </p>
              {formData.previewUrl && (
                <Image
                  src={formData.previewUrl}
                  alt="Preview"
                  className="rounded-full object-fit:cover object-center aspect-square"
                  width={128}
                  height={128}
                />
              )}
              <div className='flex flex-row justify-center align-middle items-center gap-5'>
                <MainButton text={'Crear'} isLoading={false} onClick={createNewTeam} />
                <MainButton text={'Cancelar'} isLoading={false} isCancel={true} onClick={() => setShowCreateTeamPopup(false)} />
              </div>
            </div>
          </PopUpNotification>
        )}
        {showAddPlayerPopup && (
          <PopUpNotification closeNotification={() => setShowAddPlayerPopup(false)}>
            <div className='flex flex-col justify-center align-middle items-center gap-5 w-4/5 h-full'>
              <p className='text-slate-800 text-2xl text-center'>
                Estás seguro que querés agregar a <span className="text-slate-900 font-bold">{formAddPlayerData?.playername}</span>?
              </p>
              {formData.previewUrl && (
                <Image
                  src={formData.previewUrl}
                  alt="Preview"
                  className="rounded-full object-fit:cover object-center aspect-square"
                  width={128}
                  height={128}
                />
              )}
              <div className='flex flex-row justify-center align-middle items-center gap-5'>
                <MainButton text={'Agregar'} isLoading={false} onClick={addNewPlayer} />
                <MainButton text={'Cancelar'} isLoading={false} isCancel={true} onClick={() => setShowAddPlayerPopup(false)} />
              </div>
            </div>
          </PopUpNotification>
        )}
        {notification.show && (
          <Notification
            type={notification.type}
            message={notification.message}
            timer={5000}
            closeNotification={() => setNotification({ ...notification, show: false })}
          />
        )}
      </>
      {createTeamFormVisible ? (
        <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full" style={{ animation: 'moveTopToBottom 0.3s ease' }}>
          <div>
            <button onClick={() => { setCreateTeamFormVisible(!createTeamFormVisible) }} className="flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease" }}>
              Agregar jugador
              <FaArrowRight />
            </button>
          </div>
          <div className='w-4/5 md:w-2/5 bg-gray-200 bg-opacity-70 pb-5 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
            <h2 className='mb-5 text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Crear equipo</h2>
            <form onSubmit={handleSubmit} className="space-y-4 w-3/5">
              <div>
                <label htmlFor="name" className="block mb-2 text-slate-800">Nombre del equipo</label>
                <input
                  type="text"
                  id="name"
                  placeholder='Nombre de usuario'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border p-2 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="picture" className="block mb-2 text-slate-800">Logo</label>
                <input
                  type="file"
                  id="picture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full border p-2 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
                />
              </div>
              <div className='flex flex-col'>
                <MainButton text={'Crear equipo'} isLoading={isLoading} type='submit' />
              </div>
            </form>
          </div>

          <style jsx>{`
          @keyframes moveTopToBottom {
            from {
              transform: translateY(-5%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
        </div>
      ) : (
        <>
          <div>
            <button onClick={() => { setCreateTeamFormVisible(!createTeamFormVisible) }} className="flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease" }}>
              <FaArrowLeft />
              Crear equipo
            </button>
          </div>
          <div className='w-4/5 md:w-2/5 bg-gray-200 bg-opacity-70 pb-5 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
            <h2 className='mb-5 text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Agregar jugador</h2>
            <form onSubmit={handleSubmitAddPlayer} className="space-y-4 w-3/5">
              <div>
                <label htmlFor="team" className="block mb-2 text-slate-800">Equipo</label>
                <select
                  id="team"
                  value={formAddPlayerData.team_id}
                  onChange={(e) => setFormAddPlayerData({ ...formAddPlayerData, team_id: Number(e.target.value) })}
                  className="w-full border p-2 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
                  required
                >
                  <option value="">Seleccione un equipo</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="playername" className="block mb-2 text-slate-800">Nombre completo</label>
                <input
                  type="text"
                  id="playername"
                  placeholder='Nombre del jugador'
                  value={formAddPlayerData.playername}
                  onChange={(e) => setFormAddPlayerData({ ...formAddPlayerData, playername: e.target.value })}
                  className="w-full border p-2 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="number" className="block mb-2 text-slate-800">Camiseta</label>
                <input
                  type="number"
                  id="number"
                  min="1"
                  max="99"
                  placeholder='Número del jugador'
                  value={formAddPlayerData.number}
                  onChange={(e) => setFormAddPlayerData({ ...formAddPlayerData, number: Number(e.target.value) })}
                  className="w-full border p-2 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="position" className="block mb-2 text-slate-800">Posición</label>
                <select
                  id="position"
                  value={formAddPlayerData.position}
                  onChange={(e) => setFormAddPlayerData({ ...formAddPlayerData, position: e.target.value })}
                  className="w-full border p-2 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
                  required
                >
                  <option value="">Seleccione una posición</option>
                  <option value="Arquero">Arquero</option>
                  <option value="Defensor">Defensor</option>
                  <option value="Mediocampista">Mediocampista</option>
                  <option value="Delantero">Delantero</option>
                </select>
              </div>
              <div className='flex flex-col'>
                <MainButton text={'Agregar jugador'} isLoading={isLoading} type='submit' />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateUser