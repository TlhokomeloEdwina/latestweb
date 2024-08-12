/**
 * component for checkin
 */
import React from "react";

const Checkin = ({ score, onClick }) => {

    // const [text,setText] =useState("")
    const setColour = (score) => {
        if (score < 5) {
            return "bg-red-400";
        } else if (score >= 5 && score < 8) {
            return "bg-orange-400";
        } else {
            return "bg-green-400";
        }
    }
    const setMood = ((score) => {
        if (score < 5) {
            return 'UNHEALTHY';
        } else if (score >= 5 && score < 8) {
            return 'MODERATLY HEALTHY';
        } else {
            return 'HEALTHY';
        }
    })
    return (
        <div className={`w-30 h-24 flex justify-center items-center text-center text-white text-l ${setColour(score)}`}
            onClick={onClick}
        >
            <p className="font-serif">{setMood(score)}</p>
        </div>
    )
}
export default Checkin;