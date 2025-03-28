  'use client'

  import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import Notification from '@/app/components/notification';
  import React, { useEffect, useState } from 'react'

  interface User {
    id: number;
    username: string;
  }

  const deleteUser = () => {

    const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<number>(0);

    const [notification, setNotification] = useState({
      show: false,
      message: '',
      type: 'success' as 'success' | 'error',
    });

    const fetchAllUsers = async () => {
      try{
        const response = await fetch(`${URL_SERVER}users/get-all`, {
          method: 'GET',
        });
        const data = await response.json();
        if(!response.ok){
          throw new Error(data.message);
        }
        setUsers(data.filter((user: User) => user.username !== 'Admin'));
      }catch(error){
        console.log(error)
      }finally{
          setIsLoading(false);
      }
    }

    const handleDelete = async () => {
      if (!selectedUser) return;
      try {
        const response = await fetch(`${URL_SERVER}users/delete/${selectedUser}`, {
          method: 'DELETE',
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

    if (isLoading) {
      return <SoccerLoadingAnimation/>
    }
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
        <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Borrar usuario</h2>
        <select 
          className="w-4/5 p-2 mb-4 bg-slate-700 rounded-md"
          value={selectedUser}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
        >
          <option value={0}>Seleccionar usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <button 
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          disabled={!selectedUser}
        >
          Eliminar
        </button>
      </div>
    )
  }

  export default deleteUser