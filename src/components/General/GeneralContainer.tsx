import { clsx } from "clsx";

type GeneralContainerProps = {
  customStyle?: string;
  children: React.ReactNode
}

const GeneralContainer = ({ customStyle, children }: GeneralContainerProps) => {
  return (
    <main className={clsx("", customStyle)}>
      {children}
    </main>
  )
}

export default GeneralContainer;
