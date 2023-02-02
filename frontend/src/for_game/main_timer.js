import React, { useEffect, useState, useRef } from "react";
import useStore from "./store";
import UserVideoComponent from "../UserVideoComponent";
import "./main_timer.css";

function Main_timer() {
  const { set_CntAns } = useStore();
  const { cur_time, time_state, set_time_change } = useStore();
  const { cur_turn_states, set_turn_state_change, cur_who_turn, set_who_turn } =
    useStore();
  const { cur_round, set_cur_round } = useStore();
  const { curRed_cnt, curBlue_cnt, set_CurRed_cnt, set_CurBlue_cnt } =
    useStore();
  const { curRed_total, set_CurRed_total, curBlue_total, set_CurBlue_total } =
    useStore();
  const { set_my_turn } = useStore();
  const { is_my_team_turn} = useStore();
  const { cur_teller } = useStore();
  const { my_team_win, set_my_team_win } = useStore();
  const {
    myUserID,
    gamers,
    my_index,
    player_count,
    cur_session,
  } = useStore();

  const [sec, setSec] = useState(0);
  const [msec, setMsec] = useState(0);
  const time = useRef(0);
  const timer = useRef(null);
  const videoBoxes = useRef(null);
  const currentIndex = useRef(10000);

  useEffect(() => {
    timer.current = setInterval(() => {
      setSec(parseInt(time.current / 100));
      if ((time.current % 60).toString().length === 1) {
        setMsec("0" + (time.current % 60).toString());
      } else {
        setMsec(time.current % 60);
      }
      time.current -= 1;
    }, 10);

    if (time.current < 0) {
      clearInterval(timer.current);
      game_loop();

      timer.current = setInterval(() => {
        setSec(parseInt(time.current / 100));
        if ((time.current % 60).toString().length === 1) {
          setMsec("0" + (time.current % 60).toString());
        } else {
          setMsec(time.current % 60);
        }
        time.current -= 1;
      }, 10);
    }
    return () => clearInterval(timer.current);
  }, [msec]);

  useEffect(() => {
    videoBoxes.current = document.getElementsByClassName("video_box");
  }, []);

  useEffect(() => {
    if (time_state === "change") {
      time.current = cur_time;
      setSec(cur_time);
      setMsec(0);
      set_turn_state_change("game");
      set_time_change("no_change");
    }
  }, [time_state]);

  useEffect(() => {
    if (cur_round > 1) {
      if (curBlue_cnt > curRed_cnt) {
        set_CurBlue_total(curBlue_total + 1);
      } else if (curBlue_cnt < curRed_cnt) {
        set_CurRed_total(curRed_total + 1);
      } else {
        set_CurBlue_total(curBlue_total + 1);
        set_CurRed_total(curRed_total + 1);
      }
      set_CurBlue_cnt(0);
      set_CurRed_cnt(0);
    }
  }, [cur_round]);
  useEffect(() => {
    if (cur_round > 3) {
      if (
        (my_index % 2 === 0 && curRed_total >= curBlue_total) ||
        (my_index % 2 === 1 && curBlue_total >= curRed_total)
      ) {
        set_my_team_win("win");
      } else {
        set_my_team_win("lose");
      }
    }
  }, [curBlue_total, curRed_total]);

  useEffect(() => {
    if (cur_round > 1) {
      set_turn_state_change("end");
      if (my_index === 0) {
        const message = {
          strings: "game_end",
        };
        cur_session.signal({
          type: "game_end",
          data: JSON.stringify(message),
        });
        clearInterval(timer.current);
      }
    }
  }, [my_team_win]);

  useEffect(() => {
    if (currentIndex.current < 10) {
      if (myUserID === { gamers }.gamers[currentIndex.current].name) {
        set_my_turn(true);
      } else {
        set_my_turn(false);
      }
    }

    if (currentIndex.current !== cur_teller) {
      const message = {
        cur_teller: currentIndex.current,
      };
      cur_session &&
        cur_session.signal({
          type: "cur_teller",
          data: JSON.stringify(message),
        });
    }
  }, [currentIndex.current]);

  useEffect(() => {
  }, [is_my_team_turn]);

  const game_loop = () => {
    if (cur_turn_states === "ready") {
      if (my_index === 0) {
        const message = {
          timer: 2500,
        };
        cur_session &&
          cur_session.signal({
            type: "game_start",
            data: JSON.stringify(message),
          });
      }
    } else if (cur_turn_states === "game") {
      time.current = 700;
      setSec(7);
      setMsec(0);
      if (cur_who_turn === "blue") {
        set_cur_round(cur_round + 1);
      }
      set_turn_state_change("ready");

      if (currentIndex.current === player_count - 1) {
        if (currentIndex.current % 2 === 0) {
          set_who_turn("blue");
        } else {
          set_who_turn("red");
        }
        currentIndex.current = 0;
      } else if (currentIndex.current % 2 === 0) {
        currentIndex.current += 1;
        set_who_turn("blue");
      } else if (currentIndex.current % 2 === 1) {
        currentIndex.current += 1;
        set_who_turn("red");
      }

      set_CntAns(0);
    } else if (cur_turn_states === "first_ready") {
      time.current = 500;
      currentIndex.current = 0;
      set_who_turn("red");
      setSec(5);
      setMsec(0);
      set_turn_state_change("ready");
    } else if (cur_turn_states === "result_minigame") {
      time.current = 100;
      setSec(1);
      setMsec(0);
      set_turn_state_change("first_ready");
    }
  };

  return (
    <>
      <div className="main_video_box">
        <div id="main_screen" className="main_video_frame">

          {cur_turn_states !== 'game' && (
            <></>
          )}
          {cur_round > 0 && { gamers }.gamers[currentIndex.current] && (
            <UserVideoComponent
              streamManager={
                { gamers }.gamers[currentIndex.current].streamManager
              }
              video_index={currentIndex.current}
            />
          )}
        </div>
      </div>
      <div className="team_box2">
        <div className="team_turn3">
          {cur_turn_states === "first_ready" && (
            <p className="turn_box2 timer-font">잠시 후 게임이 시작됩니다.</p>
          )}
          {cur_turn_states === "ready" && (
            <p className="turn_box2 timer-font">
              {cur_who_turn.toUpperCase()}팀은 게임을 준비해주세요
            </p>
          )}
          {cur_turn_states === "game" && (
            <p className="turn_box2 timer-font">
              {cur_who_turn.toUpperCase()} 팀 Turn : {sec}
            </p>
          )}
        </div>
      </div>

    </>
  );
}

export default Main_timer;
