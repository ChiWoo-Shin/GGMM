import React, { useEffect, useState, useCallback } from "react";
import socket from "../socket/socket";
import useStore from "../for_game/store";
import cloneDeep from "lodash/cloneDeep";
import MousePointerUsers from "./MousePointerUsers";


function Cursor({sessionId, participantName}){
    const [position, setPosition] = useState({});
    const {player_count, gamers} = useStore();
    let mouse_color;
    if (player_count>0){
    let idx = gamers.findIndex((a)=>{
      if(a.name === participantName){
        return a;
      };
    });
    if ((idx + 1 ) % 2 == 0){
      mouse_color = "blue";
    } else {
      mouse_color = "red";
    }
  };
  
    let cursor;
    const mouseFunc = (e) => {
      let x = e.clientX;
      let y = e.clientY;
      const userInfo = {};
      userInfo[participantName] = {
        mousePointer: { top: y, left: x },
        mousecolor : mouse_color
      };
      socket.emit("mouse_move", [sessionId, userInfo]);
    };

    useEffect(() => {
      socket.emit("session_join", sessionId);

      cursor = document.querySelector("#cursor_item");
      window.addEventListener('mousemove', mouseFunc);
      return() => {
        socket.emit("session_leave", [sessionId, participantName])
        window.removeEventListener("mousemove", mouseFunc);
      }}, [gamers]);
    
    useEffect(() => {
      socket.on("deleteCursor", (participantName) => {
        setPosition((prev) => {
          const newState = cloneDeep(prev);
          delete newState[participantName];

          return newState;
        });
      });
      return() => {
        socket.removeAllListeners("deleteCursor");
        socket.emit("exitShareEditing", [sessionId, participantName]);
        setPosition({});
        window.removeEventListener("mousemove", mouseFunc);
      };
    }, []);

  const cursorUpdateEvent = useCallback(() => {
    socket.on("cursor", (userInfo) => {

      setPosition((prevPosition) => {
        const newPostion = { ...prevPosition, ...userInfo };
        return newPostion;
      })
    });
  }, [gamers]);

  useEffect(() => {
    cursorUpdateEvent();
    return () => {
      socket.removeAllListeners("cursor");
    };
  }, [gamers]);

      
    return (
      <>
        <div id="editor-container"></div>
        <div id="cursor_item"></div>
        {<MousePointerUsers positions={position}/>}
      </>
    );
  }
  
  export default React.memo(Cursor);