import React, { Component, useEffect, useState, useRef } from "react";
import Card from './Card_info';
import Cursor from "../multiCursor/cursor";
import './card.css'
import socket from "../socket/socket";
import useStore from "../for_game/store";


let card_number = 35;

function CardGame({ sessionId, participantName }) {

  const { my_index, cur_session, card_game_red, card_game_blue, set_card_game_red, set_card_game_blue } = useStore();
  const [flippedCards, setFlippedCards] = useState([]);

  const click_handler = (cardId) => {
    socket.emit("flipingcard", sessionId, my_index, cardId);
    console.log("지금 누른 카드는 : ", cardId, my_index);

    if ((my_index + 1) % 2 === 0) {
      console.log("blue : ", card_game_blue);
      socket.emit("score", card_game_red, card_game_blue + 1, sessionId, cardId);
      const message = {
        Total_score: card_game_red + card_game_blue + 1,
      };

      cur_session &&
        cur_session.signal({
          type: "Total_score",
          data: JSON.stringify(message),
        });

    } else {
      socket.emit("score", card_game_red + 1, card_game_blue, sessionId, cardId);

      const message = {
        Total_score: card_game_red + card_game_blue + 1,
      };

      cur_session &&
        cur_session.signal({
          type: "Total_score",
          data: JSON.stringify(message),
        });
    }
  }

  useEffect(() => {
    socket.on("score", (card_game_red, card_game_blue) => {
      set_card_game_red(card_game_red);
      set_card_game_blue(card_game_blue);
      console.log("red, blue", card_game_red, card_game_blue)
    });
  }, []);

  useEffect(() => {
    socket.on("CardFliped", (my_index, flipedCardId) => {
      const clicked_card = document.getElementById(flipedCardId);

      if ((my_index + 1) % 2 === 0) {
        console.log("comeonblue!?");
        clicked_card.classList && clicked_card.classList.add("flip", "blueborder");
      } else {
        console.log("comein~red?");
        clicked_card.classList && clicked_card.classList.add("flip", "redborder");
      };

    });
  }, [flippedCards,]);



  return (
    <div>
      <Cursor sessionId={sessionId} participantName={participantName}></Cursor>

      {/* <span id="card"> */}
      <div id="card">
        {Array.from({ length: card_number }, (_, i) => (
          // <span id={i} key={i} className={`Card_align ${flippedCards.includes(i) ? 'flip' : ''}`} onClick={(event) => {click_handler({i}); event.preventDefault()}}>
          <span id={i} key={i} className="Card_align" onClick={(event) => { click_handler({ i }); event.preventDefault() }}>

            <Card />
          </span>
        ))}
      </div>
      <center className="score_class">
        {card_game_red} RED : BLUE {card_game_blue}
      </center>
    </div>
  );
}
export default CardGame;