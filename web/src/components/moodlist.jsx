import React from "react";

const Moodlist = ({ checkinmoods }) => {

    const setColour = (score) => {
        if (score < 4) {
            return "bg-red-400"
        } else if (score > 4 && score < 7) {
            return "bg-orange-400"
        } else if (score > 7) {
            return "bg-green-400"
        }
    };
    const setText = (score) => {

        if (score < 4) {
            return 'UNHEALTHY';
        } else if (score >= 4 && score < 7) {
            return 'MODERATE'
        } else if (score > 7) {
            return 'HEALTHY';
        }
    }

    return (
        <div className="p-4">
            {checkinmoods.map(({ id, mood_type, totalscore }) => (
                <div
                    key={id}
                    className={`flex justify-between items-center p-4 mb-2 text-sky-100 rounded ${setColour(totalscore)}`}
                >
                    <div>{mood_type}</div>
                    <div>
                        <p className="font-serif">{setText(totalscore)}</p></div>
                </div>
            ))}
        </div>
    )
}

export default Moodlist;