import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import useStore from '../for_game/store';
import 'galmuri/dist/galmuri.css';
import "./card.css"

function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const { card_game_end, cur_session, card_game_red, card_game_blue } = useStore();
  const timeoutId = React.useRef(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    borderColor: card_game_red > card_game_blue ? 'red' : 'blue',
    color: card_game_red > card_game_blue ? 'red' : 'blue',
    fontSize: '2rem',
    fontWeight: '700',
    fontFamily: "Galmuri14",
    fontStretch: 'condensed',
    textAlign : 'center',
    boxShadow: 24,
    p: 4,
  };
  
  React.useEffect(() => {
    setOpen(true);
    timeoutId.current = setTimeout(() => {
      const message = {
        Total_score: card_game_end + 1,
      };
      cur_session &&
        cur_session.signal({
          type: "Total_score",
          data: JSON.stringify(message),
        });
    }, 3000);
    return () => clearTimeout(timeoutId.current);
  }, []);

  
  return (
    <div >
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {card_game_red > card_game_blue ? <>Red GET SPECIAL</> 
          : <>Blue GET SPECIAL</>}
        </Box>
      </Modal>
    </div>
  );
}

export default BasicModal;