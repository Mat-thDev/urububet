"use client";

import { useCurrency } from "@/hooks/useCurrency";
import { useUserData } from "@/hooks/useUserData";
import { openLoginModal } from "@/storage/atom";
import {  useSetAtom } from "jotai";
import {
  UserCircle,
  Menu,
  X,
  Banknote,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const { formatCurrency } = useCurrency();
  const  setOpenLogin = useSetAtom(openLoginModal);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUserData();

  const creditsRemaining = user?.creditsAvaliable ?? 0;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const NavLink = ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      onClick={onClick}
      className="text-base font-semibold text-foreground hover:text-accent transition-colors duration-200"
    >
      {children}
    </Link>
  );

  return (
    <nav className="flex items-center justify-between px-4 py-6 md:px-12 relative">
      <Link
        href="/"
        className="flex flex-col text-2xl font-bold tracking-tight"
      >
        <span>
          Urubu<span className="text-green-400">B</span><span className="text-yellow-400">E</span><span className="text-blue-400">T</span>
        </span>
        <span className="text-xs md:text-sm text-tertiary font-medium">
          Sua bet mais honesta
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-6 bg-surface px-6 py-3 rounded-full shadow-sm">
          <NavLink href="/depositar">Depositar</NavLink>
          <NavLink href="/user">Estatísticas</NavLink>
        </div>

        <div className="flex items-center gap-4 bg-surface px-12 py-2 rounded-full shadow-sm">
          {user?.name ? (
            <div className="flex items-center gap-2">
              <div>
                <span className="font-semibold text-accent">Olá, {user.name}</span>
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  {formatCurrency(creditsRemaining)}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setOpenLogin(true)}
              className="p-2 rounded-full hover:bg-accent/20 active:scale-95 transition-all duration-200"
              aria-label="Fazer login"
            >
              <UserCircle className="h-5 w-5 text-foreground hover:text-accent" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Button */}
      <button
        className="md:hidden p-2 rounded-full hover:bg-accent/20 transition-colors duration-200"
        onClick={toggleMenu}
        aria-label="Abrir menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-surface shadow-lg md:hidden z-40">
          <div className="flex flex-col items-center gap-4 py-4">
            <NavLink href="/user" onClick={toggleMenu}>
            <div className="flex items-center gap-2">
             <TrendingUp className="h-5 w-5" />
              Estatísticas
            </div>
            </NavLink>
            <NavLink href="/depositar" onClick={toggleMenu}>
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Depositar
              </div>
            </NavLink>
            {user ? (
              <div className="flex flex-col items-center gap-2">
                <span className="font-semibold text-accent">{user.name}</span>
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Banknote className="h-5 w-5 text-accent" />
                  {formatCurrency(creditsRemaining)}
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setOpenLogin(true);
                  toggleMenu();
                }}
                className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-accent transition-colors duration-200"
              >
                <UserCircle className="h-5 w-5" />
                Entrar
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
