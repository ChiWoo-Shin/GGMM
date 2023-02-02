import React, { useEffect, useState } from "react";
import useStore from "../for_game/store";
import useSound from "use-sound";
import good_sound from "../audio/good.mp3";
import bad_sound from "../audio/bad.mp3";
import "./S_word.css";
import "./theme.css";

function S_words_Up() {
  let [show, setShow] = useState([]);

  //ZUSTAND
  const { cnt_answer, cur_session, cur_turn_states, cur_round } =
    useStore();
  const { is_my_turn, cur_who_turn, my_index, cur_teller } = useStore();
  const { gamerWords, fetchGamerWords } = useStore();

  //USE Sound
  const [good] = useSound(good_sound);
  const [bad] = useSound(bad_sound);

  let [show_name, setShow_name] = useState("--------");
  let [show_theme, setShow_theme] = useState("");
  let [number, setNumber] = useState(cnt_answer);
  const [showIndex, setShowIndex] = useState(0);
  const { is_my_team_turn, set_myteam_turn } = useStore();
  const { pass_cnt } = useStore();

  useEffect(async () => {
    if (cur_round !== 0) {
      setShow([]);
      await fetchGamerWords();
    }
    return ()=>{}
  }, []);

  useEffect(() => {
    gamerWords && setShow(gamerWords);
  }, [gamerWords]);

  useEffect(() => {
    if (gamerWords.length > 0 && cur_round > 0) {
      const arr = gamerWords[cur_round - 1];
      setShow_name(arr[showIndex].name);
      setShow_theme(arr[showIndex].theme);
    }
  }, [show, cur_round, showIndex]);

  useEffect(() => {
    setNumber(cnt_answer);
  }, [cnt_answer]);
  useEffect(() => {
    if (number !== 0) {
      if (showIndex < 20) {
        nextShow();
        good();
      }
    }
  }, [number]);

  useEffect(() => {
    if (
      (my_index % 2 === 0 && cur_who_turn === "red") ||
      (my_index % 2 === 1 && cur_who_turn === "blue")
    ) {
      set_myteam_turn(true);
    } else {
      set_myteam_turn(false);
    }
    nextShow();
  }, [cur_who_turn]);

  useEffect(() => {}, [is_my_team_turn]);
  useEffect(()=>{
    if(cur_round >0){
      setShowIndex(0);
    }
  },[cur_round])
  useEffect(() => {
    if (pass_cnt > 0) {
      nextShow();
    }
  }, [pass_cnt]);

  const nextShow = () => {
    setShowIndex(showIndex + 1);
  };

  const pass_question = () => {
    const message = {
      pass_cnt: pass_cnt + 1,
    };
    cur_session.signal({
      type: "pass",
      data: JSON.stringify(message),
    });
  };

  
  return (
    <>
      {cur_turn_states !== "game" && (
        // 게임 중이 아닐 때
        <></>
      )}
      {(is_my_turn || !is_my_team_turn) && cur_turn_states === "game" && (
        //내턴 또는 우리 팀 턴이 아닐 때
        <>
          <span className="font-theme">[{show_theme}]</span>
          <span className="font-name">{show_name}</span>

          {is_my_team_turn && cur_turn_states === "game" && (
            <button
              class="w-btn w-btn-gra1_1"
              type="button"
              onClick={pass_question}
            >
              PASS
            </button>
          )}
        </>
      )}
      {cur_teller !== my_index &&
        is_my_team_turn &&
        cur_turn_states === "game" && (
          //내팀이고 게임 상태일 때(술래는 미포함)
          <span className="font-theme">[{show_theme}]</span>
        )}
    </>
  );
}

export default S_words_Up;
