"use client"

import LoginModal from "@/components/Modals/LoginModal";
import { openLoginModal } from "@/storage/atom";
import { useAtom } from "jotai";


const Providers = ({ children }: { children: React.ReactNode }) => {

  const [modalOpen, setModalOpen] = useAtom(openLoginModal);

  return (
    <div>
       <LoginModal isOpen={modalOpen} onClose={() => { setModalOpen(false) }}  />
      {children}
    </div>
  )
}

export default Providers;
