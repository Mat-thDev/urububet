"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GameCardProps {
  jogo: {
    nome: string;
    slug: string;
    icon: React.ReactNode;
    imageUrl: string;
  };
  index: number;
}

const GameCard = ({ jogo, index }: GameCardProps) => {
  return (
    <motion.div
      key={jogo.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="relative group w-[220px] h-[340px] sm:w-[250px] sm:h-[380px] rounded-2xl overflow-hidden shadow-lg bg-black"
    >
      <Link href={`/games/${jogo.slug}`} className="block w-full h-full relative">
        {/* Imagem do jogo */}
        <img
          src={jogo.imageUrl}
          alt={`Imagem do jogo ${jogo.nome}`}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        {/* Conteúdo */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl drop-shadow-lg">{jogo.icon}</span>
            <span className="text-white text-lg sm:text-xl font-bold tracking-wide drop-shadow-lg">
              {jogo.nome}
            </span>
          </div>
        </div>

        {/* Borda glow no hover */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent transition-all duration-300" />
      </Link>
    </motion.div>
  );
};

export default GameCard;
