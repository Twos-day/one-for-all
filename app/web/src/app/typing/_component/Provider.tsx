import { useRef } from "react";
import { createTypingStore, TypingCtx } from "../_lib/store";

type ProviderProps = {
  children: React.ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  const store = useRef(createTypingStore());
  return <TypingCtx.Provider value={store.current}>{children}</TypingCtx.Provider>;
}
