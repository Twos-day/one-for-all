import { create } from "zustand";

export enum SIGNUP_EMAIL_PAGE_VALUES {
  EMAIL = "EMAIL_PAGE",
  EMAIL_CONFIRM = "EMAIL_CONFIRM_PAGE",
  VERIFICATION = "VERIFICATION_PAGE",
  REGISTER = "REGISTER_PAGE",
}

type State = {
  page: SIGNUP_EMAIL_PAGE_VALUES;
  email: string;
  id: number | null;
  verificationCode: string;
};

type Actoin = {
  setState: (newState: Partial<State>) => void;
};

export const useSignupEmailStore = create<State & Actoin>((set) => ({
  page: SIGNUP_EMAIL_PAGE_VALUES.EMAIL,
  email: "",
  id: null,
  verificationCode: "",
  setState: (newState) => set(newState),
}));

export const useSetSignupEmail = () => useSignupEmailStore((store) => store.setState);
