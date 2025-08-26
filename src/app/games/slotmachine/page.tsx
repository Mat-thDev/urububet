"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserData } from "@/hooks/useUserData";
import GeneralContainer from "@/components/General/GeneralContainer";
import GameHeader from "@/components/Game/GameHeader";
import { Minus, Plus } from "lucide-react";

const symbolsData = [
  { icon: "🍒", multiply: 2 },
  { icon: "🍋", multiply: 3 },
  { icon: "🍏", multiply: 4 },
  { icon: "🧊", multiply: 5 },
  { icon: "⭐", multiply: 10 },
  { icon: "💲", multiply: 50 },
];

const getRandomSymbol = () =>
  symbolsData[Math.floor(Math.random() * symbolsData.length)].icon;

const generateSpinResults = (isWin: boolean) => {
  const forcedSymbol = isWin ? getRandomSymbol() : null;
  return Array(3)
    .fill(null)
    .map(() => forcedSymbol ?? getRandomSymbol());
};

const calculateWin = (symbols: string[], cost: number): number => {
  if (symbols.every((s) => s === symbols[0])) {
    const symbolData = symbolsData.find((s) => s.icon === symbols[0]);
    return symbolData ? cost * symbolData.multiply : 0;
  }
  return 0;
};

const shuffleArray = (array: number[]): number[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SlotMachine = () => {
  const { user, addCredits, removeCredits, updateWinGameStats, updateLossGameStats } = useUserData();

  const [gameStarted, setGameStarted] = useState(false);
  const [cost, setCost] = useState(10);
  const [reels, setReels] = useState<string[]>(["❔", "❔", "❔"]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setCost(user.creditsAvaliable > 100 ? (user.creditsAvaliable / 100 * 10) : 0);
    }
  }, [user]);

  const multiplier = useMemo(() => Math.max(1, cost / 100), [cost]);

  const changeCost = useCallback(
    (value: number) => {
      if (!user) return;
      const newValue = Math.min(
        user.creditsAvaliable,
        Math.max(0.25, Number.isNaN(value) ? 0.25 : value)
      );
      setCost(Math.round(newValue * 100) / 100);
    },
    [user]
  );

  const spin = useCallback(() => {
    if (!user) return;
    if (user.creditsAvaliable < cost || cost === 0) {
      setMessage("💸 Saldo insuficiente! Deposite mais para jogar.");
      return;
    }

    setGameStarted(true);
    setMessage("");
    removeCredits(cost);
    updateLossGameStats("SlotMachine", cost);
    setSpinning([true, true, true]);

    const isWin = Math.random() < 0.13;
    const results = generateSpinResults(isWin);
    const reelOrder = shuffleArray([0, 1, 2]);
    const spinTimes = reelOrder.map(() => Math.random() * 2000 + 1000);

    reelOrder.forEach((reelIndex, i) => {
      setTimeout(() => {
        setReels((prev) => {
          const updated = [...prev];
          updated[reelIndex] = results[reelIndex];
          return updated;
        });

        setSpinning((prev) => {
          const updated = [...prev];
          updated[reelIndex] = false;
          return updated;
        });

        if (i === reelOrder.length - 1) {
          setTimeout(() => {
            const winAmount = calculateWin(results, cost);
            if (winAmount > 0) {
              addCredits(winAmount);
              setMessage(`🎉 Parabéns! Você ganhou R$ ${winAmount.toFixed(2)}!`);
              updateWinGameStats("SlotMachine", winAmount);
            }
            setGameStarted(false);
          }, 350);
        }
      }, spinTimes[i]);
    });
  }, [cost, user, addCredits, removeCredits, updateWinGameStats, updateLossGameStats]);

  if (!user) {
    return (
      <GeneralContainer customStyle="w-full h-full flex items-center justify-center">
        <div className="text-lg font-bold text-red-500">
          ⚠️ Você precisa estar logado para jogar.
        </div>
      </GeneralContainer>
    );
  }

  const ReelColumn = ({ symbol, isSpinning }: { symbol: string; isSpinning: boolean }) => {
    const reelSymbols = [
      ...symbolsData.map((s) => s.icon),
      ...symbolsData.map((s) => s.icon),
    ];
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 overflow-hidden bg-gradient-to-br from-accent to-primary rounded-lg border-4 border-accent shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
        <motion.div
          animate={isSpinning ? { y: ["0%", "-100%"] } : { y: 0 }}
          transition={
            isSpinning
              ? { repeat: Infinity, duration: 0.3, ease: "linear" }
              : { duration: 0.5, ease: "easeOut" }
          }
          className="flex flex-col"
        >
          {isSpinning
            ? reelSymbols.map((s, i) => (
                <div
                  key={i}
                  className="h-24 sm:h-28 md:h-32 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl"
                >
                  {s}
                </div>
              ))
            : (
              <div className="h-24 sm:h-28 md:h-32 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl">
                {symbol}
              </div>
            )}
        </motion.div>
      </div>
    );
  };

  return (
    <GeneralContainer customStyle="w-full h-full flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl sm:max-w-4xl p-6 sm:p-8 bg-surface rounded-2xl shadow-xl border-2 border-primary flex flex-col gap-6">
        <GameHeader credits={user.creditsAvaliable} gameName="🎰 Caça-Níquel" />

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-accent/20 to-primary/20 p-4 rounded-lg text-lg font-semibold text-gray-100 text-center"
          >
            {message}
          </motion.div>
        )}

        <div className="flex justify-center gap-4 sm:gap-6 bg-black/20 p-6 rounded-xl shadow-inner">
          {reels.map((symbol, i) => (
            <ReelColumn key={i} symbol={symbol} isSpinning={spinning[i]} />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => changeCost(cost - 0.5)}
              disabled={gameStarted || cost <= 0.25}
              className="p-2 sm:p-3 bg-accent rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Diminuir aposta"
            >
              <Minus className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-2">
              <span className="font-bold text-lg sm:text-xl">R$</span>
              <input
                type="number"
                value={cost.toFixed(2)}
                onChange={(e) => changeCost(parseFloat(e.target.value))}
                disabled={gameStarted}
                min={0.25}
                max={user.creditsAvaliable}
                step={0.25}
                className="w-24 sm:w-28 bg-transparent text-lg sm:text-xl font-bold text-white focus:outline-none disabled:opacity-50"
                aria-label="Valor da aposta"
              />
            </div>
            <button
              onClick={() => changeCost(cost + 0.5)}
              disabled={gameStarted || cost >= user.creditsAvaliable}
              className="p-2 sm:p-3 bg-accent rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Aumentar aposta"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={spin}
            disabled={spinning.some((s) => s) || user.creditsAvaliable < cost}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-accent to-primary rounded-full hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg sm:text-xl shadow-lg"
            aria-label={spinning.some((s) => s) ? "Girando" : "Girar"}
          >
            {spinning.some((s) => s) ? "🎲 Girando..." : `🎯 Girar (R$ ${cost.toFixed(2)})`}
          </button>
        </div>
      </div>
    </GeneralContainer>
  );
};

export default SlotMachine;
