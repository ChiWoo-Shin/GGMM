import React, { useEffect, useState } from "react";
import useStore from "../for_game/store";
import useSound from "use-sound";
import good_sound from "../audio/good.mp3";
import bad_sound from "../audio/bad.mp3";
import Correct from "./correctwrong/Correct";
import Wrong from "./correctwrong/Wrong";
import "./S_word.css";

function S_words_Down() {
  let [show, setShow] = useState([]);

  const { cnt_answer, set_CntAns, cur_session, cur_round } =
    useStore();
  const { is_my_turn, cur_who_turn, my_index, cur_teller } = useStore();
  const { gamerWords, fetchGamerWords } = useStore();

  const [good] = useSound(good_sound);
  const [bad] = useSound(bad_sound);

  let [show_name, setShow_name] = useState("--------");
  let [show_theme, setShow_theme] = useState("");
  const [answer, setAnswer] = useState("");
  let [number, setNumber] = useState(cnt_answer);
  const [showIndex, setShowIndex] = useState(0);
  const { is_my_team_turn, set_myteam_turn } = useStore();
  const { pass_cnt, set_CurBlue_cnt, set_CurRed_cnt, curRed_cnt, curBlue_cnt } = useStore();
  const [CorrectAnswer, setCorrectAnswer] = useState(false);
  const [WrongAnswer, setWrongAnswer] = useState(false);


  useEffect(async () => {
    if (cur_round !== 0) {
      setShow([]);
      await fetchGamerWords();
    }
  }, [cur_teller]);

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

  useEffect(() => { }, [show_name, show_theme]);

  useEffect(() => {
    setNumber(cnt_answer);
    if (cur_who_turn === "red") {
      set_CurRed_cnt(cnt_answer);
    }
    if (cur_who_turn === "blue") {
      set_CurBlue_cnt(cnt_answer);
    }
  }, [cnt_answer]);
  useEffect(() => {
    if (number !== 0) {
      sendScore();
      // if (showIndex < show.length - 1) {
      //   nextShow();
      //   good();
      // }
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

  useEffect(() => { }, [is_my_team_turn]);

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

  const sendScore = () => {
    const message = {
      score: number,
    };
    cur_session.signal({
      type: "score",
      data: JSON.stringify(message),
    });
  };


  var timer;
  const check_Score = (e) => {
    if (!timer) {
      timer = setTimeout(function () {
        timer = null;
        if (show_name === answer) {
          set_CntAns(cnt_answer + 1);
          setCorrectAnswer(true);
          setTimeout(() => {
            setCorrectAnswer(false);
          }, 500);
        } else {
          bad();
          setWrongAnswer(true);
          setTimeout(() => {
            setWrongAnswer(false);
          }, 500);
        }
        setAnswer("");
      }, 100);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      check_Score(e);
    }
  };
  useEffect(() => {
    cur_session.on("signal:score", (event) => {
      let message = JSON.parse(event.data);
      set_CntAns(message.score);
      if (cur_who_turn === "red") {
        set_CurRed_cnt(message.score);
      }
      if (cur_who_turn === "blue") {
        set_CurBlue_cnt(message.score);
      }
    });
  }, [cur_session.on]);

  useEffect(() => {
    if (cur_round > 0) {
      setShowIndex(0);
    }
  }, [cur_round])

  useEffect(() => {
    console.log("시그널");
  }, [curRed_cnt, curBlue_cnt]);
  return (
    <>
      {!is_my_turn && is_my_team_turn && (
        <>
          <input
            id="Answer_input"
            value={answer}
            placeholder={"Press Enter"}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            onKeyDown={(e) => {
              handleKeyPress(e);
            }}
          />
          <button
            class="w-btn w-btn-gra2"
            type="button"
            onClick={(e) => check_Score(e)}
          >
            제출
          </button>
        </>
      )}

      {CorrectAnswer === true ? <Correct answer={answer} /> : null}
      {WrongAnswer === true ? <Wrong answer={answer} /> : null}
    </>
  );
}

export default S_words_Down;
