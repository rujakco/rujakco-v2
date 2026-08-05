import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Splash from "./components/Splash";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { DeliveryProvider } from "./contexts/DeliveryContext";
import Home from "./pages/Home";
import OrderTracking from "./pages/OrderTracking";
import Admin from "./pages/Admin";
import { useAppInitialization } from "./hooks/useAppInitialization";
import { useServiceWorker } from "./hooks/useServiceWorker";

function Router() {
  // useAppInitialization needs wouter's routing context (useLocation),
  // so it's called here rather than at the top of App().
  useAppInitialization();

  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lacak" component={OrderTracking} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  useServiceWorker();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <CartProvider>
          <DeliveryProvider>
            <TooltipProvider>
              <Toaster />
              <AnimatePresence>
                {showSplash && <Splash onFinish={() => setShowSplash(false)} />}
              </AnimatePresence>
              <Router />
            </TooltipProvider>
          </DeliveryProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
