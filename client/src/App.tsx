import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import ErrorBoundary from "./components/ErrorBoundary";
import Splash from "./components/Splash";
import LoadingExperience from "./components/LoadingExperience";
import Onboarding from "./components/Onboarding";

import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { DeliveryProvider } from "./contexts/DeliveryContext";

import Home from "./pages/Home";
import OrderTracking from "./pages/OrderTracking";
import Admin from "./pages/Admin";

import { useAppInitialization } from "./hooks/useAppInitialization";
import { useServiceWorker } from "./hooks/useServiceWorker";

function Router() {
  useAppInitialization();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lacak" component={OrderTracking} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

type StartupState =
  | "splash"
  | "loading"
  | "onboarding"
  | "home";

function App() {
  useServiceWorker();

  const [startup, setStartup] =
    useState<StartupState>("splash");

  useEffect(() => {
    if (startup === "loading") {
      const timer = setTimeout(() => {
        const firstOpen =
          !localStorage.getItem("rujak-onboarding");

        if (firstOpen) {
          setStartup("onboarding");
        } else {
          setStartup("home");
        }
      }, 3800);

      return () => clearTimeout(timer);
    }
  }, [startup]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <DeliveryProvider>
            <TooltipProvider>
              <Toaster />

              <AnimatePresence mode="wait">

                {startup === "splash" && (
                  <Splash
                    onFinish={() =>
                      setStartup("loading")
                    }
                  />
                )}

                {startup === "loading" && (
                  <LoadingExperience />
                )}

                {startup === "onboarding" && (
                  <Onboarding
                    onFinish={() => {
                      localStorage.setItem(
                        "rujak-onboarding",
                        "done"
                      );

                      setStartup("home");
                    }}
                  />
                )}

              </AnimatePresence>

              {startup === "home" && <Router />}
            </TooltipProvider>
          </DeliveryProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;