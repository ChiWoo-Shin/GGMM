import React, { Component } from "react";
import "./App.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import S_words_UP from "./page_info/S_word_UP";
import S_words_Down from "./page_info/S_word_Down";
import CreateInvitation from "./page_info/CreateInvitation";
import Main_Screen from "./page_info/Main_Screen";

//miniGame
import Card_Game_Boad from "./cardGame/Card_Game_Boad";

// Timer
import Main_timer from "./for_game/main_timer";

//Item by each team
import AteamItem from "./page_info/A_team_item";
import BteamItem from "./page_info/B_team_item";

// webRTC
import { OpenVidu } from "openvidu-browser";
import UserVideoComponent from "./UserVideoComponent";
import Score_board from "./page_info/score_board";
// Zustand
import useStore from "./for_game/store";


var timer = 500;

const APPLICATION_SERVER_URL = "https://practiceggmm.shop/";

class webCam extends Component {
  constructor(props) {
    super(props);

    let currentTime = new Date().getTime();

    this.state = {
      mySessionId: "Session" + Math.floor(Math.random() * 100),
      myUserName: "Participant" + currentTime,
      session: undefined,
      publisher: undefined,
      subscribers: [],
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.oneMoregame = this.oneMoregame.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("sessionId");
    if (sessionId) {
      this.setState({
        myUserName: "Participant" + new Date().getTime(),
        mySessionId: sessionId,
      });
      this.joinSession();
    }
  }

  componentDidUpdate() {
    if (this.state.session !== undefined) {
      this.state.session.on("signal:timer", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_Curtime(message.timer);
        useStore.getState().set_cur_round(0); 
        useStore.getState().fetchCardIndex(); 
        this.forceUpdate();
      });

      this.state.session.on("signal:game_start", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_Curtime(message.timer);
        useStore.getState().set_time_change("change");
      });

      this.state.session.on("signal:AItem1", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_AItem1(message.AItem1);
      });
      this.state.session.on("signal:AItem2", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_AItem2(message.AItem2);
      });
      this.state.session.on("signal:AItem3", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_AItem3(message.AItem3);
      });

      this.state.session.on("signal:AItem4", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_AItem4(message.AItem4);
      });

      this.state.session.on("signal:BItem1", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_BItem1(message.BItem1);
      });
      this.state.session.on("signal:BItem2", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_BItem2(message.BItem2);
      });
      this.state.session.on("signal:BItem3", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_BItem3(message.BItem3);
      });

      this.state.session.on("signal:BItem4", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_BItem4(message.BItem4);
      });
      
      this.state.session.on("signal:cur_teller", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_cur_teller(message.cur_teller);
      });

      this.state.session.on("signal:pass", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_pass_cnt(message.pass_cnt);
      });

      this.state.session.on("signal:game_end", () => {
        this.forceUpdate();
      });

      this.state.session.on("signal:Total_score", (event) => {
        let message = JSON.parse(event.data);
        useStore.getState().set_card_game_end(message.Total_score);

        if (useStore.getState().card_game_end >= 10) {
          useStore.getState().set_cur_round(1);
          useStore.getState().set_turn_state_change("result_minigame");
          this.forceUpdate();
        }
      });
    }
  }
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  joinSession() {
    this.OV = new OpenVidu();
    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;
        useStore.getState().set_session_change(this.state.session);
        mySession.on("streamCreated", (event) => {
          var subscriber = mySession.subscribe(event.stream, undefined); 
          var subscribers = this.state.subscribers; 

          const addSubscriber = (subscriber, subscribers) => {
            subscribers.push(subscriber); 
            useStore.getState().setGamers({
              name: JSON.parse(event.stream.connection.data).clientData,
              streamManager: subscriber,
            });
            return subscribers;
          };

          this.setState({
            subscribers: addSubscriber(subscriber, subscribers),
          });
        });

        mySession.on("streamDestroyed", (event) => {
          var subscribers = this.state.subscribers;
          const deleteSubscriber = (streamManager, subscribers) => {
            let index = subscribers.indexOf(streamManager, 0);
            useStore
              .getState()
              .deleteGamer(JSON.parse(event.stream.connection.data).clientData);
            useStore
              .getState()
              .set_player_count(useStore.getState().gamers.length);
            if (index > -1) {
              subscribers.splice(index, 1);
              return subscribers;
            }
          };

          this.setState({
            subscribers: deleteSubscriber(
              event.stream.streamManager,
              this.state.subscribers
            ),
          });
        });

        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        this.getToken().then((token) => {
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(async () => {

              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined, 
                videoSource: undefined,
                publishAudio: true, 
                publishVideo: true, 
                resolution: "640x480", 
                frameRate: 30,
                insertMode: "APPEND", 
                mirror: false,
              });
              mySession.publish(publisher);

              useStore.getState().setGamers({
                name: this.state.myUserName,
                streamManager: publisher,
              });

              useStore.getState().set_myUserID(this.state.myUserName);
              this.setState({
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  oneMoregame() {
    useStore.getState().set_Curtime(1000000);
    useStore.getState().set_cur_round(-1);
    useStore.getState().set_cur_teller(-1);
    useStore.getState().set_turn_state_change("room");
    useStore.getState().set_my_index(10000);
    useStore.getState().set_my_team_win("none");
    useStore.getState().set_player_count(useStore.getState().gamers.length);
    useStore.getState().set_pass_cnt(0);
    this.forceUpdate();
  }

  leaveSession() {
    const mySession = this.state.session;
    if (mySession) {
      mySession.disconnect();
    }
    useStore.getState().clearGamer();

    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "Session" + Math.floor(Math.random() * 100),
      myUserName: "Participant",
      publisher: undefined,
    });
    location.replace("http://localhost:3000/");
  }

  sendTimer() {
    const message = {
      timer: timer,
    };

    this.state.session.signal({
      type: "timer",
      data: JSON.stringify(message),
    });
  }

  render() {
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;
    return (
      <>
        {this.state.session === undefined ? (
          <div className="container_before_game">
            <div id="join">
              <form className="form-group" onSubmit={this.joinSession}>
                <p>
                  <input
                    className="form-control"
                    class="participant"
                    type="text"
                    id="userName"
                    value={myUserName}
                    onChange={this.handleChangeUserName}
                    required
                  />
                </p>
                <p>
                  <input
                    className="form-control"
                    class="roomname"
                    type="text"
                    id="sessionId"
                    value={mySessionId}
                    onChange={this.handleChangeSessionId}
                    required
                  />
                </p>
                <p className="text-center">
                  <input
                    class="enter_button"
                    name="commit"
                    type="submit"
                    value=""
                  />
                </p>
              </form>
            </div>
          </div>
        ) : (
          <>
            {useStore.getState().cur_round === -1 ? (
              <div className="main_wait_room">
                <div className="container_main_wait_room">
                  <div className="btn_div">
                    <Button
                      className="exit_button"
                      onClick={this.leaveSession}
                      value="Exit"
                    >
                      Exit
                    </Button>
                    <Button
                      type="submit"
                      className="gameStart_button"
                      onClick={() => this.sendTimer()}
                    >
                      Start
                    </Button>
                    <CreateInvitation mySessionId={mySessionId} />
                  </div>
                  <Main_Screen />
                </div>
              </div>
            ) : useStore.getState().cur_round === 0 ? (
              <div className="Game_Board">
                <Card_Game_Boad
                  sessionId={this.state.mySessionId}
                  participantName={this.state.myUserName}
                />
              </div>
            ) : (
              <div className="main_wait_room">
                <div className="container">
                  <div id="session"></div>
                  <div className="wide-frame">
                    {/* A팀 프레임 */}
                    <div className="a-screen">
                      <div className="score_box">
                        <div className="box">
                          <div className="A_cur" id="A_currentScore">
                            점수 : <Score_board score={"cur_red"} />
                          </div>
                        </div>
                        <div className="box">
                          <div className="A_total" id="A_totalScore">
                            승리 : <Score_board score={"total_red"} />
                          </div>
                        </div>
                        {/* <AteamItem /> */}
                      </div>
                      <div className="video_box">
                        <div id={0} className="video_frame">
                          {useStore.getState().gamers[0] && (
                            <div className="video_frame">
                              <UserVideoComponent
                                streamManager={
                                  useStore.getState().gamers[0].streamManager
                                }
                                my_name={useStore.getState().gamers[0].name}
                                video_index={0}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="video_box">
                        <div id={1} className="video_frame">
                          {useStore.getState().gamers[2] && (
                            <div className="video_frame">
                              {" "}
                              <UserVideoComponent
                                streamManager={
                                  useStore.getState().gamers[2].streamManager
                                }
                                my_name={useStore.getState().gamers[2].name}
                                video_index={2}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="video_box">
                        <div id={2} className="video_frame">
                          {useStore.getState().gamers[4] && (
                            <div className="video_frame">
                              {" "}
                              <UserVideoComponent
                                streamManager={
                                  useStore.getState().gamers[4].streamManager
                                }
                                my_name={useStore.getState().gamers[4].name}
                                video_index={4}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="item_box">
                        <AteamItem />
                      </div>
                    </div>

                    {/* 중앙 freame */}
                    <div className="mid-screen">
                        <div className="team_box">
                          <div className="team_turn2">
                            <S_words_UP />
                          </div>
                        </div>
                      {(useStore.getState().gamers[0] ||
                        useStore.getState().gamers[1] ||
                        useStore.getState().gamers[2] ||
                        useStore.getState().gamers[3] ||
                        useStore.getState().gamers[4] ||
                        useStore.getState().gamers[5]) && <Main_timer />}
                        <div className="team_box3">
                          <div className="team_turn4">
                            <S_words_Down />
                          </div>
                        </div>
                    </div>
                    {/* B팀 프레임 */}
                    <div className="b-screen">
                      <div className="box">
                        <div className="B_total" id="B_totalScore">
                          승리 :
                          <Score_board score={"total_blue"} />
                        </div>
                      </div>
                      <div className="box">
                        <div className="B_cur" id="B_currentScore">
                          점수 :
                          <Score_board score={"cur_blue"} />
                        </div>
                      </div>
                      <div className="video_box">
                        <div id={3} className="video_frame">
                          {useStore.getState().gamers[1] && (
                            <div className="video_frame">
                              <UserVideoComponent
                                streamManager={
                                  useStore.getState().gamers[1].streamManager
                                }
                                my_name={useStore.getState().gamers[1].name}
                                video_index={1}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="video_box">
                        <div id={4} className="video_frame">
                          {useStore.getState().gamers[3] && (
                            <div className="video_frame">
                              <UserVideoComponent
                                streamManager={
                                  useStore.getState().gamers[3].streamManager
                                }
                                my_name={useStore.getState().gamers[3].name}
                                video_index={3}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="video_box">
                        <div id={5} className="video_frame">
                          {useStore.getState().gamers[5] && (
                            <div className="video_frame">
                              <UserVideoComponent
                                streamManager={
                                  useStore.getState().gamers[5].streamManager
                                }
                                my_name={useStore.getState().gamers[5].name}
                                video_index={5}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="item_box">
                        <BteamItem />
                      </div>
                    </div>
                  </div>
                </div>
                {useStore.getState().cur_turn_states === "end" ? (
                  <>
                    {useStore.getState().my_team_win === "none" ? null : (
                      <>
                        {useStore.getState().my_team_win === "win" ? (
                          <div className={"container2"}>
                            <div className="win_board"></div>
                            <div className="win_img"></div>
                            <div className="btn_box">
                              <input
                                type="button"
                                className="restart_room"
                                onClick={this.oneMoregame}
                              />
                            </div>
                            <div className="btn_box2">
                              <input
                                className="leave_room"
                                onClick={this.leaveSession}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className={"container2"}>
                            <div className="lose_board"></div>
                            <div className="lose_img"></div>
                            <div className="btn_box3">
                              <input
                                type="button"
                                id="buttonRestart"
                                className="restart_room"
                                onClick={this.oneMoregame}
                              />
                            </div>
                            <div className="btn_box4">
                              <input
                                type="button"
                                className="leave_room"
                                onClick={this.leaveSession}
                              />
                            </div>
                          </div>
                        )}
                        ;
                      </>
                    )}
                    ;
                  </>
                ) : null}
                ;
              </div>
            )}
          </>
        )}
      </>
    );
  }

  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  }
  async createSession(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }
  async createToken(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }
}

export default webCam;
