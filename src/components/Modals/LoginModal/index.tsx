"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { UserData, UserStats } from "@/types";
import { useUserData } from "@/hooks/useUserData";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {

  const { login } = useUserData();

  const [name, setName] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const stats = {
      wins: 0,
      losses: 0,
      mostPlayedGame: null,
      creditsEarned: 0,
      creditsLost: 0,
      gameStats: {},
    } as UserStats;

    const user: UserData = {
      name,
      profilePicture: "https://i.pinimg.com/736x/52/40/ff/5240ff1e8f7be882259b40782086ae65.jpg",
      creditsAvaliable: 0,
      stats: stats
    };

    login(user);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-primary/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-surface text-white rounded-2xl shadow-lg w-full max-w-md p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Botão fechar */}
            {/* <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button> */}

            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-primary border border-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-accent hover:bg-accent/70 rounded-lg font-semibold transition"
              >
                Entrar
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
