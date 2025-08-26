"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useUserData } from "@/hooks/useUserData";
import GeneralContainer from "@/components/General/GeneralContainer";
import GameHeader from "@/components/Game/GameHeader";
import { Minus, Plus } from "lucide-react";

const RocketGame = () => {
  const { user, addCredits, removeCredits, updateWinGameStats, updateLossGameStats } = useUserData();

  const [bet, setBet] = useState(10); // default
  const [multiplier, setMultiplier] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [message, setMessage] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const explosionPoint = useRef<number>(1);

  useEffect(() => {
    if (user) {
      setBet(user.creditsAvaliable > 100 ? (user.creditsAvaliable / 100 * 10) : 0);
    }
  }, [user]);

  const changeBet = useCallback(
    (value: number) => {
      if (!user) return;
      const newValue = Math.min(
        user.creditsAvaliable,
        Math.max(0.25, Number.isNaN(value) ? 0.25 : value)
      );
      setBet(Math.round(newValue * 100) / 100);
    },
    [user]
  );

  const startGame = () => {
    if (!user) return;
    if (user.creditsAvaliable < bet || bet === 0) {
      setMessage("💸 Saldo insuficiente!");
      return;
    }

    removeCredits(bet);
    updateLossGameStats("RocketGame", bet);
    setMessage("");
    setGameStarted(true);
    setMultiplier(0.3);
    setExploded(false);
    setCashedOut(false);

    const n = (Math.random() * (Math.random() * 10) + 1).toFixed(2) as unknown as number;
    explosionPoint.current = n;

    intervalRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const next = parseFloat((prev + 0.05).toFixed(2));
        if (next >= explosionPoint.current) {
          clearInterval(intervalRef.current!);
          setExploded(true);
          setGameStarted(false);
          setMessage("💥 O foguete explodiu! Você perdeu a aposta.");
        }
        return next;
      });
    }, 200);
  };

  const cashOut = () => {
    if (!user || !gameStarted || cashedOut || exploded) return;

    clearInterval(intervalRef.current!);
    const winAmount = bet * multiplier;
    addCredits(winAmount);
    setCashedOut(true);
    setGameStarted(false);
    setMessage(
      `🚀 Você sacou em ${multiplier.toFixed(2)}x e ganhou R$ ${winAmount.toFixed(
        2
      )}! Você poderia ter ganho R$ ${(bet * explosionPoint.current).toFixed(2)}`
    );
    updateWinGameStats("RocketGame", winAmount);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!user) {
    return (
      <GeneralContainer customStyle="w-full h-full flex items-center justify-center">
        <div className="text-center text-lg font-bold text-red-500">
          ⚠️ Você precisa estar logado para jogar.
        </div>
      </GeneralContainer>
    );
  }

  return (
    <GeneralContainer customStyle="w-full h-full flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl p-6 sm:p-8 bg-surface rounded-2xl shadow-xl border-2 border-primary flex flex-col gap-6">
        <GameHeader credits={user.creditsAvaliable} gameName="🚀 Rocket Game" />

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-accent/20 to-primary/20 p-4 rounded-lg text-lg font-semibold text-gray-100 text-center"
          >
            {message}
          </motion.div>
        )}

        <div className="flex flex-col items-center justify-center gap-4 bg-black/20 p-6 rounded-xl shadow-inner h-64 relative overflow-hidden">
          {!exploded ? (
            <motion.div
              key={multiplier}
              animate={{ y: [0, -200] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              🚀
            </motion.div>
          ) : (
            <div className="text-6xl">💥</div>
          )}
          <div className="text-3xl font-bold text-white">
            {multiplier.toFixed(2)}x
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => changeBet(bet - 0.5)}
              disabled={gameStarted || bet <= 0.25}
              className="p-2 sm:p-3 bg-accent rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-2">
              <span className="font-bold text-lg sm:text-xl">R$</span>
              <input
                type="number"
                value={bet.toFixed(2)}
                onChange={(e) => changeBet(parseFloat(e.target.value))}
                disabled={gameStarted}
                min={0.25}
                max={user.creditsAvaliable}
                step={0.25}
                className="w-24 sm:w-28 bg-transparent text-lg sm:text-xl font-bold text-white focus:outline-none disabled:opacity-50"
              />
            </div>
            <button
              onClick={() => changeBet(bet + 0.5)}
              disabled={gameStarted || bet >= user.creditsAvaliable}
              className="p-2 sm:p-3 bg-accent rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {!gameStarted ? (
            <button
              disabled={gameStarted || bet >= user.creditsAvaliable || bet === 0}
              onClick={startGame}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-accent to-primary rounded-full font-bold text-lg sm:text-xl shadow-lg hover:brightness-110 transition-all"
            >
              🎯 Apostar (R$ {bet.toFixed(2)})
            </button>
          ) : (
            <button
              onClick={cashOut}
              className="w-full py-3 sm:py-4 bg-green-500 rounded-full font-bold text-lg sm:text-xl shadow-lg hover:brightness-110 transition-all"
            >
              💰 Sacar ({multiplier.toFixed(2)}x)
            </button>
          )}
        </div>
      </div>
    </GeneralContainer>
  );
};

export default RocketGame;
