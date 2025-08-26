import { useCurrency } from "@/hooks/useCurrency"

type  GameHeaderProps = {
  credits: number
  gameName: string
}

const GameHeader = ({ credits, gameName }: GameHeaderProps) => {

  const { formatCurrency } = useCurrency();

  return (
    <div className="flex items-center justify-between bg-black/40 px-6 py-3 rounded-xl shadow-inner">
      <p className="text-lg font-bold">{gameName}</p>
      <p className="text-lg font-bold text-[var(--color-accent)]">
        {formatCurrency(credits)}
      </p>
    </div>
  )
}

export default GameHeader;
