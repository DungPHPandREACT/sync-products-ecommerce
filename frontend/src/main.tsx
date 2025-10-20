import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 5 * 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-right"
          closeButton
          duration={3000}
          toastOptions={{
            classNames: {
              closeButton: "!right-0 !left-auto !top-[-3px]",
            },
          }}
        />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
