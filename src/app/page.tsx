"use client"

import GeneralContainer from "@/components/General/GeneralContainer";
import { Shuffle, Bomb, Rocket } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAtom } from "jotai";
import { hasClaimedFirstBonus } from "@/storage/atom";
import { useUserData } from "@/hooks/useUserData";
import GameCard from "@/components/Game/GameCard";

const bannerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
  tap: { scale: 0.95 },
};

const HomePage = () => {
  const { addCredits } = useUserData();
  const [claimed, setClaimed] = useAtom(hasClaimedFirstBonus);

  const jogos = [
    {
      nome: "Caça-Níquel",
      icon: <Shuffle className="w-10 h-10" />,
      slug: "slotmachine",
      image: "/assets/slotmachine.png",
    },
    {
      nome: "Miner",
      icon: <Bomb className="w-10 h-10" />,
      slug: "minergame",
      image: "/assets/minergame.png",
    },
    {
      nome: "RocketGame",
      icon: <Rocket className="w-10 h-10" />,
      slug: "rocketgame",
      image: "/assets/rocketgame.png",
    },
  ];

  const redeemBonus = () => {
    if (claimed) return;
    addCredits(20);
    setClaimed(true);
  };

  return (
    <GeneralContainer customStyle="w-full h-full p-6 sm:p-8 lg:p-12 bg-primary">
      <motion.div
        className="relative bg-gradient-to-r from-surface to-primary rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        variants={bannerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Seção de bônus de boas-vindas"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
          <motion.img
            src="/assets/mascot.png"
            alt="Mascote do Urubu"
            className="w-24 sm:w-28 lg:w-32 h-auto flex-shrink-0"
            loading="lazy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <div className="text-center sm:text-left flex flex-col gap-4">
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-accent leading-tight tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Bônus de Boas-vindas Exclusivo!
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base lg:text-lg text-tertiary font-medium max-w-md lg:max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              O Urubu tá on fire! 🔥 Aproveite já seu bônus especial e comece a apostar no seu primeiro jogo com tudo!
            </motion.p>
            <motion.a
              href="#resgatar-bonus"
              className={`mt-4 inline-block bg-accent text-center text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${claimed ? "opacity-50 cursor-not-allowed" : "hover:bg-accent-dark"
                }`}
              aria-label="Resgatar bônus de boas-vindas"
              onClick={redeemBonus}
              variants={buttonVariants}
              whileHover={!claimed ? "hover" : ""}
              whileTap={!claimed ? "tap" : ""}
            >
              {claimed ? "Bônus Resgatado" : "Resgatar Agora"}
            </motion.a>
          </div>
        </div>
        <motion.div
          className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full opacity-20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <section className="mt-8 lg:mt-12" aria-label="Jogos mais jogados">
        <motion.h1
          className="text-xl sm:text-2xl font-bold text-center lg:text-left text-accent mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Jogos mais jogados
        </motion.h1>
        <div className="w-full flex items-center justify-center lg:justify-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence>
              {jogos.map((jogo, i) => (
                <motion.div
                  key={jogo.slug}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <GameCard
                    jogo={{
                      nome: jogo.nome,
                      slug: jogo.slug,
                      icon: jogo.icon,
                      imageUrl: jogo.image,
                    }}
                    index={i}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </GeneralContainer>
  );
};

export default HomePage;
