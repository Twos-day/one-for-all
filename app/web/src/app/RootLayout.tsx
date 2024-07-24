import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { HotkeysProvider } from "react-hotkeys-hook";
import ModalContainer from "./_component/modal/ModalContainer";
import ReactQuery from "./_component/config/ReactQuery";
import ToastBox from "./_component/config/ToastBox";
import { Outlet } from "react-router-dom";

interface RootLayoutProps {}

export default function RootLayout({}: RootLayoutProps) {
  return (
    <HelmetProvider>
      <HotkeysProvider>
        <ReactQuery>
          <Outlet />
          <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
          <ModalContainer />
          <ToastBox />
        </ReactQuery>
      </HotkeysProvider>
    </HelmetProvider>
  );
}
