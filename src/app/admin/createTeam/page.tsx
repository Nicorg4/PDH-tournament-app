
'use client'

import Notification from '@/app/components/notification';
import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

interface Team {
  id: number;
  name: string;
}

const createUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    picture: null as File | null
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

  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;

  const fetchTeams = async () => {
    try{
      const response = await fetch(`${URL_SERVER}teams/get-all`, {
        method: 'GET'
      })
      if (!response.ok){
        throw new Error('Error al obtener los equipos');
      }
      const data = await response.json();
      setTeams(data);
    }catch(error){
      console.log(error)
    } finally{

    }
  }

  useEffect(() => {
    fetchTeams();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.picture || !formData.name) {
      return
    }
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        if (formData.picture) {
            formDataToSend.append('picture', formData.picture);
        }

        const response = await fetch(`${URL_SERVER}teams/create`, {
            method: 'POST',
            body: formDataToSend
        });
        if(!response.ok){
          showNotification('Error al crear el usuario', 'error');
            throw new Error('Error al crear el usuario');
        }
        setFormData({
            name: '',
            picture: null
        })
        fetchTeams();
        showNotification('Equipo creado correctamente', 'success');
    }catch(error){
        console.error('Error al crear el usuario:', error);
    }finally{

    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, picture: e.target.files[0] })
    }
  }

  const handleSubmitAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formAddPlayerData.playername || !formAddPlayerData.number || !formAddPlayerData.position || !formAddPlayerData.team_id || formAddPlayerData.number < 1 || formAddPlayerData.number > 99) {
      return
    }
    try {
        const response = await fetch(`${URL_SERVER}players/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formAddPlayerData)
        });
        if(!response.ok){
          showNotification('Error al crear el jugador', 'error');
          throw new Error('Error al crear el usuario');
        }
        setFormAddPlayerData({
          playername: '',
          number: 0,
          position: '',
          team_id: 0
        })
        fetchTeams();
        showNotification('Jugador creado correctamente', 'success');
    }catch(error){
        console.error('Error al crear el usuario:', error);
    }finally{

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
      <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full" style={{animation: 'moveTopToBottom 0.3s ease'}}>
        <div>
          <button onClick={() => {setCreateTeamFormVisible(!createTeamFormVisible)}} className="flex bg-slate-800 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-10" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}}>
            Agregar jugador
            <FaArrowRight/>
          </button>
        </div>
        <div className='w-4/5 md:w-2/5 bg-slate-800 bg-opacity-70 pb-5 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
        <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Crear equipo</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-3/5">
          <div>
            <label htmlFor="name" className="block mb-2">Nombre del equipo</label>
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
            <label htmlFor="picture" className="block mb-2">Logo</label>
            <input
              type="file"
              id="picture"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border p-2 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
            />
          </div>

          <button
            type="submit"
            className="bg-[#02124a] text-white p-2 mt-4 rounded-[15px] hover:bg-opacity-80 transition-all duration-300" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
          >
            Crear equipo
          </button>
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
          <button onClick={() => {setCreateTeamFormVisible(!createTeamFormVisible)}} className="flex bg-slate-800 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-10" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}}>
            <FaArrowLeft/>
            Crear equipo
          </button>
        </div>
        <div className='w-4/5 md:w-2/5 bg-slate-800 bg-opacity-70 pb-5 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
        <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Agregar jugador</h2>
        <form onSubmit={handleSubmitAddPlayer} className="space-y-4 w-3/5">
          <div>
            <label htmlFor="team" className="block mb-2">Equipo</label>
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
            <label htmlFor="playername" className="block mb-2">Nombre completo</label>
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
            <label htmlFor="number" className="block mb-2">Camiseta</label>
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
            <label htmlFor="position" className="block mb-2">Posición</label>
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
          <button
            type="submit"
            className="bg-[#02124a] text-white p-2 mt-4 rounded-[15px] hover:bg-opacity-80 transition-all duration-300" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
          >
            Agregar jugador
          </button>
        </form>
      </div>
      </>
      )}
    </div>
  );
}

export default createUser