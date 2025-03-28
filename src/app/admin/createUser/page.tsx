
'use client'

import Notification from '@/app/components/notification';
import React, { useState } from 'react'

const createUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    role: 'user',
    password: '',
    picture: null as File | null
  })

  const [notification, setNotification] = useState({
      show: false,
      message: '',
      type: 'success' as 'success' | 'error',
  });

  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.picture || !formData.username || !formData.password) {
      return
    }
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('role', formData.role);
        formDataToSend.append('password', formData.password);
        if (formData.picture) {
            formDataToSend.append('picture', formData.picture);
        }

        const response = await fetch(`${URL_SERVER}users/create`, {
            method: 'POST',
            body: formDataToSend
        });
        if(!response.ok){
          showNotification('Error al crear el usuario.', 'error');
          throw new Error('Error al crear el usuario');
        }
        setFormData({
            username: '',
            role: 'user',
            password: '',
            picture: null
        })
        showNotification('Usuario creado correctamente.', 'success');
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

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  return (
    <div className='w-4/5 md:w-2/5 bg-slate-800 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          timer={5000}
          closeNotification={() => setNotification({ ...notification, show: false })}
        />
      )}
      <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Crear usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-3/5">
        <div>
          <label htmlFor="username" className="block mb-2">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            placeholder='Nombre de usuario'
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full border p-3 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder='Contraseña'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border p-3 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-30 border-none"
            required
          />
        </div>

        <div>
          <label htmlFor="picture" className="block mb-2">Foto de perfil</label>
          <input
            type="file"
            id="picture"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-[#02124a] text-white p-2 mt-4 rounded-[15px] hover:bg-opacity-80 transition-all duration-300" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
        >
          Crear usuario
        </button>
      </form>
    </div>
  )
}

export default createUser