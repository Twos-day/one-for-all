import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

export type TypingState = {
  startTimestamp: number;
  typedRows: number;
  inputValue: string;
};

export type TypingAction = {
  reset: () => void;
};

export type TypingStore = TypingState & TypingAction;

export type TypingStoreApi = ReturnType<typeof createTypingStore>;

export const createTypingStore = () => {
  const defaultState: TypingState = {
    startTimestamp: Date.now(),
    typedRows: 0,
    inputValue: "",
  };

  return createStore<TypingStore>((set, get) => ({
    ...defaultState,
    reset: () => set({ ...defaultState, startTimestamp: Date.now() }),
  }));
};

export const TypingCtx = createContext<TypingStoreApi | null>(null);

export const useTypingStore = <T>(selector: (store: TypingStore) => T) => {
  const ctx = useContext(TypingCtx);
  if (!ctx) {
    throw new Error("TypingCtx is not provided");
  }
  return useStore(ctx, selector);
};
