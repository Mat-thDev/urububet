// components/ui/CardContent.tsx
import { ReactNode } from "react";

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent = ({ children, className = "" }: CardContentProps) => {
  return (
    <div className={`p-6 flex flex-col gap-4 ${className}`}>
      {children}
    </div>
  );
};

export default CardContent;
