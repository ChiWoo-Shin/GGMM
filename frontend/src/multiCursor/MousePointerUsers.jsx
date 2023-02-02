import React from "react";
import MousePointer from "./MousePointer";
import "./MousePointerUsers.css";

const MousePointerUsers = ({ positions}) => {
  return (
    <>
      {Object.keys(positions).map((positionId) => {
        const position = positions[positionId];

        let left = 0;
        let top = 0;
        if (position.mousePointer && position.mousePointer.left != null) {
          const container = document.querySelector("#editor-container");

          if (container) {
            const containerRect = container.getBoundingClientRect();
            top = position.mousePointer.top + "px";
            left = position.mousePointer.left + "px";

          }

        }

        return (
          <div key={positionId}>
            {position.mousePointer && position.mousePointer.left != null && (
              <div
                id="cursor"
                className="cursor-block"
                style={{ left, top, zIndex: 999 }}
              >
                <MousePointer color={position.mousecolor}/>
                <div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default MousePointerUsers;