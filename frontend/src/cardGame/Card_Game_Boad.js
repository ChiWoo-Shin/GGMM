import React, { useState, useEffect, useRef } from 'react';
import CardGame from './CardGame';
import CountDown from './CountDown';
import useStore from '../for_game/store';
import './Card_Game_Boad.css';

// Homepage sound
import useSound from "use-sound";
import homeSound from "../audio/home.mp3"

export default function Card_Game_Boad({ sessionId, participantName }) {
  const [CountDownShow, setCountDownShow] = useState(true);
  const [homeMusic, { stop }] = useSound(homeSound);
  const { card_game_end } = useStore();
  const timeOutgame = useRef(null);

  const elements = document.getElementsByClassName("remove-Click")

  useEffect(() => {
    homeMusic();
  }, [homeMusic]);

  useEffect(() => {
    if (card_game_end === 9){
      stop();    
    }
  }, [card_game_end]);

  useEffect(()=>{
    timeOutgame.current = setTimeout(() => {
      elements[0].classList.remove("remove-Click")
      setCountDownShow(false)
    }, 3200)
    
    return ()=> clearTimeout(timeOutgame.current);
  },[])


  return (
    <div className='remove-Click Game_Board'>
      {CountDownShow === true ? <CountDown /> : null}
      <CardGame sessionId={sessionId} participantName={participantName} />
    </div>
  )
}