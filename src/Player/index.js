// Core
import React, { useState, useRef, useEffect } from 'react';

// Instruments
import './styles.css';

import video from './video.mp4';

export const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ isProgressCapturing, setIsProgressCapturing ] = useState(false);

    const videoRef = useRef(null);

    const togglePlay = () => {
        const method = videoRef.current.paused ? 'play' : 'pause';
        //console.log(videoRef);
        videoRef.current[method]();
        setIsPlaying(method ==='play');
    };

    const skip = event => {
        const seconds = event.target.dataset.skip;

        videoRef.current.currentTime += Number.parseFloat(seconds);
    };

    const handleProgress = () =>{
        const percent = videoRef.current.currentTime / videoRef.current.duration * 100;
        //console.log(percent);
        setProgress(percent);
    };
    const scrub = event =>{
        const scrubTime = event.nativeEvent.offsetX / event.currentTarget.offsetWidth * videoRef.current.duration;

        videoRef.current.currentTime = scrubTime;
    };

    useEffect(()=>{
        const handler = event => {
            if (event.code === "Space") {
                togglePlay();
            }
        }
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler)
    }, [])

    const playControl = isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>;

    return (
        <div className = 'player'>
            <video 
                ref = {videoRef}
                src = { video } 
                onClick = {togglePlay}
                onTimeUpdate = {handleProgress}
            />
            <div className = 'controls'>
                <div 
                    className = 'progress'
                    onClick = {scrub}
                    onMouseDown = {()=>{setIsProgressCapturing(true)}}
                    onMouseMove = {(event)=>{isProgressCapturing && scrub(event)}}
                    onMouseUp = {()=>{setIsProgressCapturing(false)}}
                >
                    <div 
                        className = 'filled'
                        style = {{
                            '--filledProgressBar': `${progress}%`,
                        }} 
                    />
                </div>
                <button 
                    title = 'Toggle Play'
                    onClick = {togglePlay}
                >
                    {playControl}
                </button>
                <input
                    className = 'slider'
                    max = '1'
                    min = '0'
                    name = 'volume'
                    step = '0.05'
                    type = 'range'
                />
                <button 
                    data-skip = '-10'
                    onClick = {skip}
                >
                    « 10s
                </button>
                <button 
                    data-skip = '25'
                    onClick = {skip}
                >
                    25s »
                </button>
                <button>&#10021;</button>
            </div>
        </div>
    );
};
