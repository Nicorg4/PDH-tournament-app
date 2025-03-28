'use client'
import React, { useEffect, useState } from 'react';
import MyAuctions from './components/myAuctions';
import Market from './components/Market';
import PublishForm from './components/PublishForm';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import Notification from '@/app/components/notification';

const TransferMarket: React.FC = () => {
  const [players, setPlayers] = useState([]);
  const [playersOnAuction, setPlayersOnAuction] = useState([]);
  const [publishFormVisible, setPublishFormVisible] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const loggedUser = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const fetchMyPlayers = async (teamId: number) => {
    try {
      const response = await fetch(`${URL_SERVER}players/not-on-sale-by/${teamId}`);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayersOnAuction = async (teamId: number) => {
    try {
      const response = await fetch(`${URL_SERVER}players/on-sale-by/${teamId}`);
      const data = await response.json();
      setPlayersOnAuction(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuctions = async () => {
    try {
      const response = await fetch(`${URL_SERVER}auctions/get-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAuctions(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedUser?.user) {
      setTimeout(() => {
        router.push('/');
      }, 100);
    } else if (!loggedUser?.user?.team) {
      router.push('/home');
    } else {
      fetchMyPlayers(loggedUser.user.team.id);
      fetchPlayersOnAuction(loggedUser.user.team.id);
      fetchAuctions();
    }
  }, [loggedUser, router]);

  if (isLoading) {
    return <SoccerLoadingAnimation />;
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  return (
    <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full">
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          timer={5000}
          closeNotification={() => setNotification({ ...notification, show: false })}
        />
      )}
      {publishFormVisible ? (
        <div
          className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full"
          style={{ animation: 'moveTopToBottom 0.3s ease' }}
        >
          <div>
            <button
              onClick={() => setPublishFormVisible(!publishFormVisible)}
              className="flex bg-slate-800 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-10"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
            >
              Comprar
              <FaArrowRight />
            </button>
          </div>
          {loggedUser?.user?.team && (
            <div className="flex flex-col md:flex-row gap-5 w-full justify-center align-middle items-center h-4/5">
              <PublishForm
                players={players}
                fetchPlayersOnAuction={fetchPlayersOnAuction}
                fetchMyPlayers={fetchMyPlayers}
                fetchAuctions={fetchAuctions}
                showNotification={showNotification}
              />
              <MyAuctions
                players={playersOnAuction}
                fetchPlayersOnAuction={fetchPlayersOnAuction}
                fetchMyPlayers={fetchMyPlayers}
                fetchAuctions={fetchAuctions}
                showNotification={showNotification}
              />
            </div>
          )}
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
        <div
          className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full"
          style={{ animation: 'moveTopToBottom 0.3s ease' }}
        >
          <div>
            <button
              onClick={() => setPublishFormVisible(!publishFormVisible)}
              className="flex bg-slate-800 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-10"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
            >
              <FaArrowLeft />
              Vender
            </button>
          </div>
          <Market players={auctions} fetchAuctions={fetchAuctions} showNotification={showNotification}/>
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
      )}
    </div>
  );
};

export default TransferMarket;