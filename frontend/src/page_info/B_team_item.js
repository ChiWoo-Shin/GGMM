import React, { useEffect } from "react";
import useStore from "../for_game/store";

function BteamItem() {
  const {
    cur_session,
    BsignalSent1,
    BsignalSent2,
    BsignalSent3,
    BsignalSent4,
    my_index,
    is_my_team_turn,
  } = useStore();

  const sendItem1B = () => {
    if (!BsignalSent1) {
      const message = {
        BItem1: true,
      };
      cur_session &&
        cur_session.signal({
          type: "BItem1",
          data: JSON.stringify(message),
        });
      setTimeout(() => {
        const message = {
          BItem1: false,
        };
        cur_session &&
          cur_session.signal({
            type: "BItem1",
            data: JSON.stringify(message),
          });
      }, 7000);
    }
  };

  const sendItem2B = () => {
    if (!BsignalSent2) {
      const message = {
        BItem2: true,
      };
      cur_session &&
        cur_session.signal({
          type: "BItem2",
          data: JSON.stringify(message),
        });
      setTimeout(() => {
        const message = {
          BItem2: false,
        };
        cur_session &&
          cur_session.signal({
            type: "BItem2",
            data: JSON.stringify(message),
          });
      }, 7000);
    }
  };

  const sendItem3B = () => {
    if (!BsignalSent3) {
      const message = {
        BItem3: true,
      };
      cur_session &&
        cur_session.signal({
          type: "BItem3",
          data: JSON.stringify(message),
        });
      setTimeout(() => {
        const message = {
          BItem3: false,
        };
        cur_session &&
          cur_session.signal({
            type: "BItem3",
            data: JSON.stringify(message),
          });
        }, 7000);
    }
  };

  const sendItem4B = () => {
    if (!BsignalSent4) {
      const message = {
        BItem4: true,
      };

      cur_session &&
        cur_session.signal({
          type: "BItem4",
          data: JSON.stringify(message),
        });

      setTimeout(() => {
        const message = {
          BItem3: false,
        };

        cur_session &&
          cur_session.signal({
            type: "BItem4",
            data: JSON.stringify(message),
          });
      }, 10000);
    }
  };

  useEffect(() => {}, is_my_team_turn);
  return (
    <>
      {my_index % 2 === 1 && is_my_team_turn === false ? (
        <>
          <button
            className="image-button_shutter bounce-button"
            onClick={() => {
              sendItem4B();
            }}
          ></button>
          <button
            className="image-button_blur"
            onClick={() => {
              sendItem1B();
            }}
          ></button>
          <button
            className="image-button_mirr"
            onClick={() => {
              sendItem2B();
            }}
          ></button>
          <button
            className="image-button_4div"
            onClick={() => {
              sendItem3B();
            }}
          ></button>
        </>
      ) : null}
    </>
  );
}

export default BteamItem;
