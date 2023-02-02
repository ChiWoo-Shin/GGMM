import React, { useEffect } from "react";
import OpenViduVideoComponent from "./OvVideo";
import "./UserVideo.css";

import ItemOneBlur from "./item_info/Item_1_blur";
import ItemTwoDecal from "./item_info/Item_2_decalco";
import ItemThreeCut from "./item_info/Item_3_4cut";
import ItemFour from "./item_info/Item_4_One_and_Two";
import ItemFive from "./item_info/Item_5_One_and_Three";
import ItemSix from "./item_info/Item_6_Two_and_Three";
import ItemSevenAll from "./item_info/Item_7_All";

import OpenViduVideoComponent_sulae from "./item_info/OvVideo_sulea";

import useStore from "./for_game/store";

const UserVideoComponent = ({ streamManager, video_index }) => {
  const { cur_turn_states } = useStore();
  const { AItem1, AItem2, AItem3, BItem1, BItem2, BItem3 } = useStore();
  const { cur_teller } = useStore();

  useEffect(() => {}, [
    AItem1,
    BItem1,
    AItem2,
    BItem2,
    AItem3,
    BItem3,
    cur_teller,
    video_index,
  ]);

  if (cur_turn_states === "room") {
    return (
      <div>
        <OpenViduVideoComponent streamManager={streamManager} />
      </div>
    );
  } else {
    return (
      <div>
        {streamManager !== undefined ? (
          <div>
            {!(cur_teller === video_index) ? (
              <OpenViduVideoComponent streamManager={streamManager} />
            ) 
            : (AItem1 == true && AItem2 == true && AItem3 == true) ||
              (BItem1 == true && BItem2 == true && BItem3 == true) ? (
              <ItemSevenAll streamManager={streamManager} />
            ) : (AItem1 == true && AItem2 == true) ||
              (BItem1 == true && BItem2 == true) ? (
              <ItemFour streamManager={streamManager} />
            ) : (AItem1 == true && AItem3 == true) ||
              (BItem1 == true && BItem3 == true) ? (
              <ItemFive streamManager={streamManager} />
            ) : (AItem2 == true && AItem3 == true) ||
              (BItem2 == true && BItem3 == true) ? (
              <ItemSix streamManager={streamManager} />
            ) : AItem3 == true || BItem3 == true ? (
              <ItemThreeCut streamManager={streamManager} />
            ) : AItem2 == true || BItem2 == true ? (
              <ItemTwoDecal streamManager={streamManager} />
            ) : AItem1 == true || BItem1 == true ? (
              <ItemOneBlur streamManager={streamManager} />
            ) : (
              <OpenViduVideoComponent_sulae streamManager={streamManager} />
            )}
          </div>
        ) : null}
      </div>
    );
  }
};

export default UserVideoComponent;
