import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { HotkeysProvider } from "react-hotkeys-hook";
import ModalContainer from "@/components/modal/ModalContainer";
import ReactQuery from "@/components/config/ReactQuery";
import ToastBox from "@/components/config/ToastBox";
import { Outlet } from "react-router-dom";
import App from "@/components/App";

interface RootLayoutProps {}

export default function RootLayout({}: RootLayoutProps) {
  return (
    <HelmetProvider>
      <App session={null}>
        <HotkeysProvider>
          <ReactQuery>
            <Outlet />
            <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
            <ModalContainer />
            <ToastBox />
          </ReactQuery>
        </HotkeysProvider>
      </App>
    </HelmetProvider>
  );
}
