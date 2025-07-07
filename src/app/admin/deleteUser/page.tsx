'use client'

import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import MainButton from '@/app/components/mainButton';
import Notification from '@/app/components/notification';
import PopUpNotification from '@/app/components/popUpNotification';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

interface User {
  id: number;
  username: string;
}

const DeleteUser = () => {

  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [showDeleteUserPopup, setShowUserDeletePopup] = useState(false);
  const loggedUser = useSelector((state: RootState) => state.user);

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${URL_SERVER}users/get-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setUsers(data.filter((user: User) => user.username !== 'Admin'));
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`${URL_SERVER}users/delete/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        showNotification('Error al eliminar usuario.', 'error');
        throw new Error(data.message);
      }
      fetchAllUsers();
      showNotification('Usuario eliminado correctamente.', 'success');
    } catch (error) {
      console.log(error);
    } finally {
      setShowUserDeletePopup(false);
      setSelectedUser(undefined);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, [])

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  }

  const handleUserDelete = () => {
    if (!selectedUser) {
      return
    }
    setShowUserDeletePopup(true);
  }

  if (isLoading) {
    return <SoccerLoadingAnimation />
  }
  return (
    <div className='w-4/5 md:w-2/5 bg-gray-200 bg-opacity-70 pb-10 border-none flex flex-col items-center rounded-md' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      {showDeleteUserPopup && (
        <PopUpNotification closeNotification={() => setShowUserDeletePopup(false)}>
          <div className='flex flex-col justify-center align-middle items-center gap-5 w-4/5 h-full'>
            <p className='text-slate-800 text-2xl text-center'>
              Estás seguro que querés eliminar a <span className="text-slate-900 font-bold">{selectedUser?.username}</span>?
            </p>
            <div className='flex flex-row justify-center align-middle items-center gap-5'>
              <MainButton text={'Eliminar'} isLoading={false} onClick={handleDelete} />
              <MainButton text={'Cancelar'} isLoading={false} isCancel={true} onClick={() => setShowUserDeletePopup(false)} />
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
      <h2 className='mb-5 text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Borrar usuario</h2>
      <select
        className="w-3/5 p-2 mb-4 bg-gray-200 rounded-md text-slate-800"
        value={selectedUser?.id}
        onChange={(e) => setSelectedUser(users.find(user => user.id === Number(e.target.value)))}
      >
        <option value={0}>Seleccionar usuario</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <div className='flex flex-col w-3/5'>
        <MainButton text={'Eliminar'} isLoading={false} onClick={handleUserDelete} />
      </div>
    </div>
  )
}

export default DeleteUser