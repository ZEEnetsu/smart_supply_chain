import React from "react";

const StatCard = ({statName , value , color}) => {
  return (
    <div className= {`flex flex-col gap-1 px-4 py-3 rounded-lg bg-zinc-800 ${color}`}>
      <span className="text-xsfont-medium uppercase tracking-wide">
        {statName}
      </span>
      <span className="text-2xl font-semibold">{value}</span>
    </div>
  );
};

export default StatCard;
