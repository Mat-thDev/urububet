"use client"

import { motion } from "framer-motion";

const Footer = () => {

  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-surface w-full p-4 sm:p-6 rounded-t-xl shadow-inner"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm sm:text-base text-tertiary">
        <div />

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Feito com <span className="text-red-500">❣️</span> por{" "}
          <a
            href="https://github.com/Mat-thDev/urububet"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            @misakiix
          </a>
        </motion.span>
      </div>
    </motion.footer>
  );
};

export default Footer;
