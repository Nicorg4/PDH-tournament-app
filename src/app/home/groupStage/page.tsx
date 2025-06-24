'use client'

import React, { useState } from 'react'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import GroupMatches from './components/groupMatches';
import GroupStandings from './components/groupStandings';

const GroupStage = () => {
    const [isGroupStageVisible, setIsGroupStageVisible] = useState(false);

    const toggleComponentVisibility = () => {
        setIsGroupStageVisible(!isGroupStageVisible);
    };

    return (
        <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full">
            {!isGroupStageVisible ? 
            <button
                onClick={toggleComponentVisibility}
                className="flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
            >
                Partidos
                <FaArrowRight />
            </button> : 
            <button
                onClick={toggleComponentVisibility}
                className="flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
            >
                <FaArrowLeft />
                Grupos
            </button>}
            
            {isGroupStageVisible ? <GroupMatches/> : <GroupStandings/>}
        </div>
    )
}

export default GroupStage