import React, { useEffect } from "react";
import useStore from "../for_game/store";



const Item_8_shutter = ({ streamManager }) => {
  const { cur_round, cur_teller, my_index, } = useStore();
  const videoRef = React.createRef();

  useEffect(() => {
    streamManager.addVideoElement(videoRef.current);
  }, [streamManager, videoRef, cur_round, cur_teller, my_index]);

  const element = document.getElementById("Item8")

  setTimeout(() => {
    element.classList.add('main_ani_box')
    setTimeout(() => {
      element.classList.remove();
    }, 10000)

  }, 1000)



  return (
    <div id="Item8">
      <video autoPlay ref={videoRef} muted />
    </div>
  );
};

export default Item_8_shutter;