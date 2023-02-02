import React, { useEffect } from "react";
import UserVideoComponent from "../UserVideoComponent";
import useStore from "../for_game/store";
import "./Main_Screen.css";

function Main_Screen() {
  const {
    gamers,
    set_player_count,
    player_count,
    myUserID,
    set_my_index,
    my_index,
    cur_session,
    cur_teller,
    sortGamer,
  } = useStore();

  useEffect(() => {
    if (cur_session !== undefined) {
      set_player_count(gamers.length);
    }
    sortGamer();
    
  }, [gamers]);

  useEffect(() => {
    if (cur_session !== undefined) {
      for (var i = 0; i < player_count; i++) {
        if (gamers[i]) {
          if (myUserID === { gamers }.gamers[i].name) {
            set_my_index(i);
          }
        }
      }
    }
  }, [player_count]);

  useEffect(() => {
    console.log("index");
  }, [my_index]);

  useEffect(() => {
    console.log("teller");
  }, [cur_teller]);

  return (
    <>
      <div className="video_box1">
        <div id={0} className="video_frame1">
          {gamers[0] && (
            <div className="video_frame2">
              <UserVideoComponent
                streamManager={{ gamers }.gamers[0].streamManager}
                my_name={{ gamers }.gamers[0].name}
              />
            </div>
          )}
        </div>
      </div>
      <div className="video_box1">
        <div id={1} className="video_frame1">
          {gamers[1] && (
            <div className="video_frame2">
              <UserVideoComponent
                streamManager={{ gamers }.gamers[1].streamManager}
                my_name={{ gamers }.gamers[1].name}
              />
            </div>
          )}
        </div>
      </div>
      <div className="video_box1">
        <div id={2} className="video_frame1">
          {gamers[2] && (
            <div className="video_frame2">
              <UserVideoComponent
                streamManager={{ gamers }.gamers[2].streamManager}
                my_name={{ gamers }.gamers[2].name}
              />
            </div>
          )}
        </div>
      </div>
      <div className="video_box1">
        <div id={3} className="video_frame1">
          {gamers[3] && (
            <div className="video_frame2">
              <UserVideoComponent
                streamManager={{ gamers }.gamers[3].streamManager}
                my_name={{ gamers }.gamers[3].name}
              />
            </div>
          )}
        </div>
      </div>
      <div className="video_box1">
        <div id={4} className="video_frame1">
          {gamers[4] && (
            <div className="video_frame2">
              <UserVideoComponent
                streamManager={{ gamers }.gamers[4].streamManager}
                my_name={{ gamers }.gamers[4].name}
              />
            </div>
          )}
        </div>
      </div>
      <div className="video_box1">
        <div id={5} className="video_frame1">
          {gamers[5] && (
            <div className="video_frame2">
              <UserVideoComponent
                streamManager={{ gamers }.gamers[5].streamManager}
                my_name={{ gamers }.gamers[5].name}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Main_Screen;
