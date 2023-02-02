import React, { useEffect } from "react";
import Card from './Card_info';
import Cursor from "../multiCursor/cursor";
import './card.css'
import socket from "../socket/socket";
import useStore from "../for_game/store";
import CardGameResult from "./Card_Game_Result";


let card_number = 35;

function CardGame({ sessionId, participantName }) {

  const { my_index, cur_session, card_game_red, card_game_blue, set_card_game_red, set_card_game_blue, card_game_end } = useStore();
  const { MiniCardIndex } = useStore();

  const click_handler = (cardId) => {
    socket.emit("flipingcard", sessionId, my_index, cardId, MiniCardIndex);

    if (MiniCardIndex.includes(cardId.i)) {
      if ((my_index + 1) % 2 === 0) {
        console.log("blue : ", card_game_blue);
        socket.emit("score", sessionId, cardId, my_index);
        
      } else {
        console.log("red : ", card_game_blue);
        socket.emit("score", sessionId, cardId, my_index);
      }
    }
  }

  useEffect(() => {
    socket.on("score", (red_score, blue_score) => {
      set_card_game_red(red_score);
      set_card_game_blue(blue_score);

      const message = {
        Total_score: red_score + blue_score,
      };

      cur_session &&
        cur_session.signal({
          type: "Total_score",
          data: JSON.stringify(message),
        });

    });
  }, []);

  useEffect(() => {
    socket.on("CardFliped", (my_index, flipedCardId, ItemIndex) => {
      const clicked_card = document.getElementById(flipedCardId);

      if (ItemIndex.includes(flipedCardId)) {
        if ((my_index + 1) % 2 === 0) {
          clicked_card.classList && clicked_card.classList.add("flip", "blueborder");
        } else {
          clicked_card.classList && clicked_card.classList.add("flip", "redborder");
        };
      } else {
        clicked_card.classList && clicked_card.classList.add("bomb");
      }
    });
  }, []);

  useEffect(() => {
    console.log("card_game_end : ", card_game_end)
  }, [card_game_end,])

  return (
    <>
      <div>
        <Cursor sessionId={sessionId} participantName={participantName}></Cursor>

        <div id="card">
          {Array.from({ length: card_number }, (_, i) => (
            <span id={i} key={i} className="Card_align" onClick={(event) => { click_handler({ i }); event.preventDefault() }}>

              <Card />
            </span>
          ))}
        </div>
        <center className="score_class">
           <span className="colorRed">레드</span><span className="colorBlue">블루</span> 
           <p><span className="col col-display">{card_game_red}</span> <span className="col col-display">{card_game_blue}</span></p>
        </center>
      </div>
      {card_game_end === 9 ? <CardGameResult /> : null}
    </>
  );
}
export default CardGame;