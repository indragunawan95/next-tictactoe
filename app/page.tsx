'use client'
import { useState } from "react";
import Grid from "@/components/Grid";

export default function Home() {
  const [playerTurn, setPlayerTurn] = useState(0);
  const handleTurn = () => {
    setPlayerTurn((prev) => {
      if (prev === 0) {
        return 1;
      } else {
        return 0
      }
    })
  }

  const handleWin = (player: number) => {
    alert(`Player ${player + 1} win. Please refresh`)
  }

  return (
    <div>
      <div className="flex items-center justify-center mt-8">
        <h1>{`Player ${playerTurn + 1} Turn`}</h1>
      </div>
      <Grid handleTurn={handleTurn} handleWin={handleWin} playerTurn={playerTurn}/>
    </div>
  );
}
