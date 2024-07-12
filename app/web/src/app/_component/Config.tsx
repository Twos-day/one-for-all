import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { HotkeysProvider } from "react-hotkeys-hook";
import { Toaster } from "sonner";
// import ModalContainer from "./modal/ModalContainer";
import ReactQuery from "./ReactQuery";

interface ConfigProps {
  children: React.ReactNode;
}

export default function Config({ children }: ConfigProps) {
  return (
    <HelmetProvider>
      <HotkeysProvider>
        <ReactQuery>
          {children}
          <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
          {/* <ModalContainer /> */}
          <Toaster />
        </ReactQuery>
      </HotkeysProvider>
    </HelmetProvider>
  );
}
