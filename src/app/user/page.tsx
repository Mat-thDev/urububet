"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import { Trophy, Gamepad2, TrendingUp, DollarSign, Coins } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import Card from "@/components/General/Card";
import CardContent from "@/components/General/CardContent";

export default function UserStatsPage() {
  const { user } = useUserData();

  const chartData = useMemo(() => {
    if (!user?.stats?.gameStats) return [];
    return Object.entries(user.stats.gameStats).map(([game, stats]) => ({
      name: game,
      wins: stats.wins,
      losses: stats.losses,
      total: stats.wins + stats.losses,
    }));
  }, [user]);

  if (!user || !user.stats) {
    return <div className="p-8 text-center">Carregando dados do usuário...</div>;
  }

  return (
    <div className="p-4 lg:p-8 grid grid-cols-1 gap-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-secondary">Vitórias</span>
            <span className="text-2xl font-bold text-green-500">{user.stats.wins}</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-secondary">Derrotas</span>
            <span className="text-2xl font-bold text-red-500">{user.stats.losses}</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col border-0">
            <span className="text-sm text-secondary">Lucro</span>
            <span className="text-2xl font-bold text-emerald-400">R$ {(user.stats.creditsEarned - user.stats.creditsLost).toFixed(2)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col border-0">
            <span className="text-sm text-secondary">Dinheiro ganho</span>
            <span className="text-2xl font-bold text-emerald-400">R$ {user.stats.creditsEarned.toFixed(2)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-secondary">Dinheiro apostado</span>
            <span className="text-2xl font-bold text-rose-400">R$ {user.stats.creditsLost.toFixed(2)}</span>
          </CardContent>
        </Card>
      </div>

      {/* Jogo mais jogado */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Jogo mais jogado</h2>
              <p className="text-2xl mt-2 font-semibold">
                {user.stats.mostPlayedGame ?? "Nenhum ainda"}
              </p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-500" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráficos em grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vitórias vs Derrotas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4">Vitórias vs Derrotas</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Vitórias", value: chartData.reduce((acc, g) => acc + g.wins, 0) },
                      { name: "Derrotas", value: chartData.reduce((acc, g) => acc + g.losses, 0) },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    <Cell fill="#4ade80" />
                    <Cell fill="#f87171" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        {/* Partidas por Jogo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Partidas por Jogo
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="wins" stackId="a" fill="#4ade80" name="Vitórias" />
                  <Bar dataKey="losses" stackId="a" fill="#f87171" name="Derrotas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
