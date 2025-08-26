// hooks/useUserData.ts
"use client";

import { useAtom } from "jotai";
import { Game, UserStats, UserData } from "@/types";
import { userData } from "@/storage/atom";

export function useUserData() {
  const [user, setUser] = useAtom(userData);

  const defaultUserStats = (): UserStats => ({
    wins: 0,
    losses: 0,
    mostPlayedGame: null,
    creditsEarned: 0,
    creditsLost: 0,
    gameStats: {},
  });

  const login = (data: UserData) => {
    setUser(data);
  };

  const logout = () => {
    setUser(null);
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    setUser({
      ...user,
      creditsAvaliable: user.creditsAvaliable + amount,
    });
  };

  const removeCredits = (amount: number) => {
    if (!user) return;
    setUser({
      ...user,
      creditsAvaliable: Math.max(0, user.creditsAvaliable - amount),
    });
  };

  const updateWinGameStats = (game: Game, amount: number) => {
    if (!user) return;

    if (!user.stats) {
      user.stats = defaultUserStats();
    }

    if (!user.stats.gameStats) {
      user.stats.gameStats = {};
    }

    if (!user.stats.gameStats[game]) {
      user.stats.gameStats[game] = { wins: 0, losses: 0 };
    }

    user.stats.wins++;
    user.stats.creditsEarned += amount;
    user.stats.gameStats[game].wins++;
    updateMostPlayedGame();
  };

    const updateLossGameStats = (game: Game, amount: number) => {
    if (!user) return;

    if (!user.stats) {
      user.stats = defaultUserStats();
    }

    if (!user.stats.gameStats) {
      user.stats.gameStats = {};
    }

    if (!user.stats.gameStats[game]) {
      user.stats.gameStats[game] = { wins: 0, losses: 0 };
    }

    user.stats.losses++;
    user.stats.creditsLost += amount;
    user.stats.gameStats[game].losses++;
    updateMostPlayedGame();
  };


  const updateMostPlayedGame = () => {
    if (!user || !user.stats?.gameStats) return;

    let maxPlayed = 0;
    let maxPlayedGame: Game | null = null;

    for (const game in user.stats.gameStats) {
      const stats = user.stats.gameStats[game as Game];
      if(!stats) return;
      const totalPlayed = stats.wins + stats.losses;

      if (totalPlayed > maxPlayed) {
        maxPlayed = totalPlayed;
        maxPlayedGame = game as Game;
      }
    }

    user.stats.mostPlayedGame = maxPlayedGame;
  };

  const isLoggedIn = !!user;

  return {
    user,
    login,
    logout,
    addCredits,
    removeCredits,
    updateWinGameStats,
    updateLossGameStats,
    isLoggedIn,
  };
}
