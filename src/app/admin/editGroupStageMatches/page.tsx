'use client'

import React, { useState } from 'react'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import GroupMatches from './components/GroupMatches';
import GroupStandings from './components/GroupStandings';
import Notification from '@/app/components/notification';

const GroupStage = () => {
    const [isGroupStageVisible, setIsGroupStageVisible] = useState(false);

    const toggleComponentVisibility = () => {
        setIsGroupStageVisible(!isGroupStageVisible);
    };

    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error',
      });

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
            {!isGroupStageVisible ? 
            <button
                onClick={toggleComponentVisibility}
                className="flex bg-slate-800 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-10"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
            >
                Partidos
                <FaArrowRight />
            </button> : 
            <button
                onClick={toggleComponentVisibility}
                className="flex bg-slate-800 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-10"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
            >
                <FaArrowLeft />
                Grupos
            </button>}
            
            {isGroupStageVisible ? <GroupMatches showNotification={showNotification}/> : <GroupStandings/>}
        </div>
    )
}

export default GroupStage