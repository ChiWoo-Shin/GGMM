import create from "zustand";
import axios from "axios";

const APPLICATION_SERVER_URL = "https://practiceggmm.shop/";

const useStore = create((set) => ({
  gamers: [],
  setGamers: (gamer) => {
    set((state) => ({
      gamers: [...state.gamers, gamer],
    }));
  },

  deleteGamer: (name) => {
    set((state) => ({
      gamers: state.gamers.filter((a) => a.name !== name),
    }));
  },
  clearGamer: () => {
    set((state) => ({
      gamers: [],
    }));
  },
  sortGamer: () => {
    set((state) => ({
      gamers: state.gamers.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      }),
    }));
  },

  red_gamers: [],
  red_setGamers: (gamer) => {
    set((state) => ({
      red_gamers: [...state.gamers, gamer],
    }));
  },

  red_deleteGamer: (name) => {
    set((state) => ({
      red_gamers: state.gamers.filter((a) => a.name !== name),
    }));
  },
  red_clearGamer: () => {
    set((state) => ({
      red_gamers: [],
    }));
  },

  bluegamers: [],
  bluesetGamers: (gamer) => {
    set((state) => ({
      bluegamers: [...state.gamers, gamer],
    }));
  },

  bluedeleteGamer: (name) => {
    set((state) => ({
      bluegamers: state.gamers.filter((a) => a.name !== name),
    }));
  },
  blueclearGamer: () => {
    set((state) => ({
      bluegamers: [],
    }));
  },

  setPublishAudio: (name, newValue) => {
    set((state) => {
      const gamer = state.gamers.find((x) => x.name === name);
      gamer.streamManager.publishAudio = newValue;
      return { gamers: state.gamers };
    });
  },

  myUserID: "none",
  set_myUserID: (input) => set({ myUserID: input }),
  
  cur_time: 1000000,
  set_Curtime: (input) => set({ cur_time: input }),

  time_state: "no_change",
  set_time_change: (input) => set({ time_state: input }),

  cnt_answer: 0,
  set_CntAns: (input) => set(() => ({ cnt_answer: input })),

  curRed_cnt: 0,
  set_CurRed_cnt: (input) => set(() => ({ curRed_cnt: input })),
  curBlue_cnt: 0,
  set_CurBlue_cnt: (input) => set(() => ({ curBlue_cnt: input })),
  curRed_total: 0,
  set_CurRed_total: (input) => set(() => ({ curRed_total: input })),
  curBlue_total: 0,
  set_CurBlue_total: (input) => set(() => ({ curBlue_total: input })),

  cur_session: undefined,
  set_session_change: (input) => set({ cur_session: input }),

  cur_turn_states: "room",
  set_turn_state_change: (input) => set({ cur_turn_states: input }),

  cur_who_turn: "none",
  set_who_turn: (input) => set({ cur_who_turn: input }),

  cur_round: -1,
  set_cur_round: (input) => set({ cur_round: input }),

  cur_teller: -1,
  set_cur_teller: (input) => set({ cur_teller: input }),

  is_my_turn: false,
  set_my_turn: (input) => set({ is_my_turn: input }),

  is_my_team_turn: false,
  set_myteam_turn: (input) => set({ is_my_team_turn: input }),

  my_index: 10000,
  set_my_index: (input) => set({ my_index: input }),

  player_count: 0,
  set_player_count: (input) => set({ player_count: input }),

  gamerWords: [],
  fetchGamerWords: async () => {
    const response = await axios.get(
      APPLICATION_SERVER_URL + "api/sessions/game",
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    response &&
      set((state) => ({ gamerWords: (state.gamerWords = response.data) }));
  },

  AItem1: false,
  set_AItem1: (input) => set({ AItem1: input }),
  AsignalSent1: false,
  setASignalSent1: () => set({ AsignalSent1: true }),

  AItem2: false,
  set_AItem2: (input) => set({ AItem2: input }),
  AsignalSent2: false,
  setASignalSent2: () => set({ AsignalSent2: true }),

  AItem3: false,
  set_AItem3: (input) => set({ AItem3: input }),
  AsignalSent3: false,
  setASignalSent3: () => set({ AsignalSent3: true }),

  AItem4: false,
  set_AItem4: (input) => set({ AItem4: input }),
  AsignalSent4: false,
  setASignalSent4: () => set({ AsignalSent4: true }),

  BItem1: false,
  set_BItem1: (input) => set({ BItem1: input }),
  BsignalSent1: false,
  setBSignalSent1: () => set({ BsignalSent1: true }),

  BItem2: false,
  set_BItem2: (input) => set({ BItem2: input }),
  BsignalSent2: false,
  setBSignalSent2: () => set({ BsignalSent2: true }),

  BItem3: false,
  set_BItem3: (input) => set({ BItem3: input }),
  BsignalSent3: false,
  setBSignalSent3: () => set({ BsignalSent3: true }),

  BItem4: false,
  set_BItem4: (input) => set({ BItem4: input }),
  BsignalSent4: false,
  setBSignalSent4: () => set({ BsignalSent4: true }),

  pass_cnt: 0,
  set_pass_cnt: (input) => set({ pass_cnt: input }),

  my_team_win: "none",
  set_my_team_win: (input) => set({ my_team_win: input }),

  card_game_end: 0,
  set_card_game_end: (input) => set({ card_game_end: input }),

  card_game_red: 0,
  set_card_game_red: (input) => set({ card_game_red: input }),

  card_game_blue: 0,
  set_card_game_blue: (input) => set({ card_game_blue: input }),

  MiniCardIndex: [],
  fetchCardIndex: async () => {
    const response = await axios.get(
      APPLICATION_SERVER_URL + "api/sessions/cardindex",
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    response &&
      set((state) => (
        { MiniCardIndex: (state.MiniCardIndex = response.data) }
        ));
  },

}));

export default useStore;
