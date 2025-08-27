"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GeneralContainer from "@/components/General/GeneralContainer";
import Card from "@/components/General/Card";
import CardContent from "@/components/General/CardContent";
import { CreditCard, Landmark, QrCode } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

const methodStyles: Record<string, string> = {
  pix: "text-black border-green-400 bg-green-400",
  boleto: "text-black border-yellow-400 bg-yellow-400",
  card: "text-black border-blue-400 bg-blue-400",
};

const DepositPage = () => {
  const { addCredits } = useUserData();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"pix" | "boleto" | "card" | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const quickValues = [10, 25, 50, 100, 200, 500];

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue > 2000.0) return;
    if (value === "" || (numValue >= 0.25 && !isNaN(numValue))) {
      setAmount(value);
    }
  };

  const paymentComproved = (value: number) => {
    addCredits(value);
    setAmount("");
    setMethod(null);
    setSuccessMessage(`Pagamento concluído! R$ ${value.toFixed(2)} depositados.`);

    // Remove a mensagem após 3 segundos
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <GeneralContainer customStyle="w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl mx-auto space-y-8"
      >
        <div className="text-center">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Depósito
          </motion.h1>
          <p className="mt-2 text-[var(--color-secondary)] text-base sm:text-lg opacity-80">
            Adicione saldo à sua conta de forma rápida e segura
          </p>
        </div>

        <Card className="bg-surface/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-accent/10">
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-200">Valor do depósito</label>
              <motion.input
                type="number"
                placeholder="Digite o valor (mín. R$ 0,25)"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                min={0.25}
                max={1000}
                step={0.25}
                className="mt-2 w-full p-3 rounded-lg bg-black/40 border border-accent/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                aria-label="Valor do depósito"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <div className="flex flex-wrap gap-3 mt-4">
                {quickValues.map((value) => (
                  <motion.button
                    key={value}
                    onClick={() => setAmount(value.toString())}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${amount === value.toString()
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-accent/20 hover:bg-white/10"
                      }`}
                    aria-label={`Selecionar R$ ${value}`}
                  >
                    R$ {value}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-200">Método de pagamento</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                {[
                  { method: "pix", icon: <QrCode className="w-6 h-6 mb-2" />, label: "Pix" },
                  { method: "boleto", icon: <Landmark className="w-6 h-6 mb-2" />, label: "Boleto" },
                  { method: "card", icon: <CreditCard className="w-6 h-6 mb-2" />, label: "Cartão" },
                ].map(({ method: m, icon, label }) => (
                  <motion.button
                    key={m}
                    onClick={() => setMethod(m as "pix" | "boleto" | "card")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center p-4 rounded-xl border transition-all ${method === m ? methodStyles[m] : "border-accent/20 hover:bg-accent"
                      }`}
                    aria-label={`Selecionar método ${label}`}
                  >
                    {icon}
                    <span className="text-sm font-medium">{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Resumo */}
            <AnimatePresence>
              {amount && method && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl bg-black/30 border border-accent/10"
                >
                  <p className="text-gray-400 text-sm font-medium">Resumo do Depósito</p>
                  <p className="text-lg font-semibold mt-1">
                    Valor: <span className="text-accent">R$ {parseFloat(amount).toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    Método: <span className="capitalize">{method}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!amount || !method}
              onClick={() => paymentComproved(parseFloat(amount))}
              className="w-full py-4 text-lg font-bold bg-gradient-to-r from-accent to-primary rounded-full hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              aria-label="Confirmar depósito"
            >
              Depositar Agora
            </motion.button>

            {/* Mensagem de sucesso */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-4 bg-accent text-secundary rounded-lg text-center font-bold"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </GeneralContainer>
  );
};

export default DepositPage;
