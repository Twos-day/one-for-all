import { useEffect, useRef } from "react";
import { AppContext, SESSION_STORAGE_KEY, createAppStore } from "@/stores/app";

interface AppProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function App({ session, children }: AppProps) {
  const store = useRef(
    createAppStore({ session: session ? "user" : "guest", theme: "light", sidebar: true }),
  );

  useEffect(() => {
    // 쿠키와 로컬스토리지의 세션 정보를 동기화
    const syncStore = (e: StorageEvent) => {
      if (e.key === SESSION_STORAGE_KEY) {
        const newV = e.newValue;
        const oldV = e.oldValue;

        if (newV !== oldV) {
          window.location.reload();
        }
      }
    };

    window.addEventListener("storage", syncStore);

    return () => window.removeEventListener("storage", syncStore);
  }, []);

  return <AppContext.Provider value={store.current}>{children}</AppContext.Provider>;
}
