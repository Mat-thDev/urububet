"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserData } from "@/hooks/useUserData";
import GeneralContainer from "@/components/General/GeneralContainer";
import GameHeader from "@/components/Game/GameHeader";

const GRID_ROWS = 4;
const GRID_COLS = 5;

const difficulties = {
  easy: { bombs: 5, diamonds: 15, diamondMultiplier: 1 },
  medium: { bombs: 8, diamonds: 12, diamondMultiplier: 1.55 },
  hard: { bombs: 12, diamonds: 8, diamondMultiplier: 2.25 },
};

type Cell = {
  id: number;
  type: "diamond" | "bomb";
  revealed: boolean;
};

const MinerGame = () => {
  const { user, addCredits, removeCredits, updateWinGameStats, updateLossGameStats } = useUserData();

  const [grid, setGrid] = useState<Cell[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [cost, setCost] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  useEffect(() => {
    if (user) {
      setCost(user.creditsAvaliable > 100 ? (user.creditsAvaliable / 100 * 10) : 0);
    }
  }, [user]);

  const generateGrid = useCallback((): Cell[] => {
    const { bombs, diamonds } = difficulties[difficulty];
    const totalCells = GRID_ROWS * GRID_COLS;

    const cellTypes = [
      ...Array(bombs).fill("bomb"),
      ...Array(diamonds).fill("diamond"),
    ];

    while (cellTypes.length < totalCells) {
      cellTypes.push("diamond");
    }

    cellTypes.sort(() => Math.random() - 0.5);

    return cellTypes.map((t, i) => ({
      id: i,
      type: t as "diamond" | "bomb",
      revealed: false,
    }));
  }, [difficulty]);

  if (!user) {
    return (
      <GeneralContainer customStyle="w-full h-full flex items-center justify-center">
        <div className="text-center text-lg font-bold text-red-500">
          ⚠️ Você precisa estar logado para jogar.
        </div>
      </GeneralContainer>
    );
  }


  const startGame = () => {
    if (user.creditsAvaliable < cost || cost === 0) {
      setMessage("💸 Saldo insuficiente!");
      return;
    }

    removeCredits(cost);
    updateLossGameStats("MinerGame", cost);
    setGrid(generateGrid());
    setGameStarted(true);
    setMultiplier(1);
    setMessage("Boa sorte!");
  };

  const revealCell = (id: number) => {
    if (!gameStarted) return;

    setGrid((prev) =>
      prev.map((cell) =>
        cell.id === id ? { ...cell, revealed: true } : cell
      )
    );

    const cell = grid.find((c) => c.id === id);
    if (!cell) return;

    if (cell.type === "bomb") {
      setMessage("💥 Bomba! Você perdeu tudo.");
      setGameStarted(false);
    } else {
      setMultiplier((prev) => prev * difficulties[difficulty].diamondMultiplier);
      setMessage(`💎 Multiplicador: ${(multiplier * difficulties[difficulty].diamondMultiplier).toFixed(2)}x`);
    }
  };

  const cashOut = () => {
    if (!gameStarted) return;
    const winAmount = cost * multiplier;
    updateWinGameStats("MinerGame", winAmount);
    addCredits(winAmount);
    setMessage(`🏆 Você sacou R$ ${winAmount.toFixed(2)}!`);
    setGameStarted(false);
  };

  return (
    <GeneralContainer customStyle="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl p-6 bg-surface rounded-2xl shadow-2xl border-2 border-primary flex flex-col gap-6">
        <GameHeader credits={user.creditsAvaliable} gameName="💎 Miner" />

        <AnimatePresence>
          {message && (
            <motion.div
              key={message}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-gradient-to-r from-accent/30 to-primary/30 p-3 rounded-lg text-center font-bold text-lg"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {gameStarted && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center text-2xl font-extrabold text-emerald-400"
          >
            🔥 Multiplicador Atual: {multiplier.toFixed(2)}x
          </motion.div>
        )}

        <div className="grid grid-cols-5 gap-2 items-center justify-center">
          {grid.map((cell) => (
            <motion.button
              key={cell.id}
              disabled={cell.revealed || !gameStarted}
              onClick={() => revealCell(cell.id)}
              whileTap={{ scale: 0.9 }}
              className={`
                aspect-square rounded-xl flex items-center justify-center text-3xl font-bold
                transition-all duration-300
                ${cell.revealed
                  ? cell.type === "diamond"
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg"
                    : "bg-gradient-to-br from-rose-600 to-rose-800 text-white shadow-lg"
                  : "bg-primary hover:bg-accent"}
              `}
            >
              {cell.revealed && (cell.type === "diamond" ? "💎" : "💣")}
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-4 justify-center flex-wrap">
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "easy" | "medium" | "hard")
              }
              disabled={gameStarted}
              className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 font-semibold"
            >
              <option value="easy">🟢 Fácil</option>
              <option value="medium">🟡 Médio</option>
              <option value="hard">🔴 Difícil</option>
            </select>
            <input
              type="number"
              value={cost.toFixed(2)}
              onChange={(e) => setCost(parseFloat(e.target.value))}
              disabled={gameStarted}
              min={1}
              step={1}
              className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 w-28 text-center font-bold"
            />
          </div>

          {!gameStarted ? (
            <button
              disabled={gameStarted || cost >= user.creditsAvaliable || cost === 0}
              onClick={startGame}
              className="w-full py-3 bg-gradient-to-r from-accent to-primary rounded-full font-bold text-lg hover:brightness-110"
            >
              🎮 Iniciar (R$ {cost.toFixed(2)})
            </button>
          ) : (
            <button
              onClick={cashOut}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-lg hover:brightness-110"
            >
              💰 Encerrar (x{multiplier.toFixed(2)})
            </button>
          )}
        </div>
      </div>
    </GeneralContainer>
  );
};

export default MinerGame;
