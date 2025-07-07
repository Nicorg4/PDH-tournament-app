
'use client'

import MainButton from '@/app/components/mainButton';
import Notification from '@/app/components/notification';
import PopUpNotification from '@/app/components/popUpNotification';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    role: 'user',
    password: '',
    picture: null as File | null,
    previewUrl: '' as string
  })

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const loggedUser = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateUserPopup, setShowCreateUserPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowCreateUserPopup(true);

  }

  const createUser = async () => {
    setIsLoading(true);
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
        headers: {
          'Authorization': `Bearer ${loggedUser.token}`
        },
        body: formDataToSend
      });
      if (!response.ok) {
        showNotification('Error al crear el usuario.', 'error');
        throw new Error('Error al crear el usuario');
      }
      setFormData({
        username: '',
        role: 'user',
        password: '',
        picture: null,
        previewUrl: ''
      })
      showNotification('Usuario creado correctamente.', 'success');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    } finally {
      setIsLoading(false);
      setShowCreateUserPopup(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, picture: e.target.files[0], previewUrl: URL.createObjectURL(file) })
    }
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  return (
    <div className='w-4/5 md:w-2/5 bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      {showCreateUserPopup && (
        <PopUpNotification closeNotification={() => setShowCreateUserPopup(false)}>
          <div className='flex flex-col justify-center align-middle items-center gap-5 w-4/5 h-full'>
            <p className='text-slate-800 text-2xl text-center'>
              Estás seguro que querés crear a <span className="text-slate-900 font-bold">{formData?.username}</span>?
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
              <MainButton text={'Crear'} isLoading={false} onClick={createUser} />
              <MainButton text={'Cancelar'} isLoading={false} isCancel={true} onClick={() => setShowCreateUserPopup(false)} />
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
      <h2 className='mb-5 text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Crear usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-3/5">
        <div>
          <label htmlFor="username" className="block mb-2 text-slate-800">Nombre de usuario</label>
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
          <label htmlFor="password" className="block mb-2 text-slate-800">Contraseña</label>
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
          <label htmlFor="picture" className="block mb-2 text-slate-800">Foto de perfil</label>
          <input
            type="file"
            id="picture"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border rounded text-slate-800"
          />
        </div>
        <div className='flex flex-col'>
          <MainButton text={'Crear usuario'} isLoading={isLoading} type="submit" />
        </div>
      </form>
    </div>
  )
}

export default CreateUser