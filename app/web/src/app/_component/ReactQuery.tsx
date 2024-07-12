import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryCache, QueryClientProvider } from "@tanstack/react-query";
// import ErrorModal from "./modal/ErrorModal";
import { useSetModalStore } from "../_lib/modalStore";

export default function ReactQuery({ children }: PropsWithChildren) {
  const modalStore = useSetModalStore();

  const [querClient] = useState(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        async onError(error, query) {
          const querykey = query.queryKey;
          if (querykey.includes("ignore")) return;

          if (error instanceof Error) {
            window.location.href = "/sessionout";
            return;
          }

          // await modalStore.push(ErrorModal, { props: { error } });
        },
      }),
      defaultOptions: {
        queries: {
          gcTime: 30 * 1000, // 30초
          staleTime: 10 * 1000, // 10초
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => {
            // failureCount 0부터 시작
            if (error instanceof Error) {
              // 세션에러일 경우 재시도 하지 않음
              return false;
            }
            // 그 외의 경우 재시도 횟수를 3으로 설정
            return failureCount < 2;
          },
          retryDelay: 1000 * 2,
        },
        mutations: {
          gcTime: 0,
          retry: false,
          onError: async (error) => {
            if (error instanceof Error) {
              // await signOut({ redirect: false, callbackUrl: "/sessionout" });
              window.location.href = "/sessionout";
              return;
            }

            // await modalStore.push(ErrorModal, { props: { error } });
          },
        },
      },
    });
  });

  return <QueryClientProvider client={querClient}>{children}</QueryClientProvider>;
}
