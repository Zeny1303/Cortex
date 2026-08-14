import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
function Timer({ timeLeft, totalTime }) {
    const percentage = (timeLeft/totalTime)*100
  return (
    <div className='w-20 h-20'>
        <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "26px",
          pathColor: timeLeft < 10 ? "#ef4444" : "#ffdf20",
          textColor: "#ffffff",
          trailColor: "#333333",
        })}
        />
      
    </div>
  )
}

export default Timer
