import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { XR } from "@react-three/xr";
import { useXRStore } from "./lib/xr-store";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Game from "@/pages/Game";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game/:songId" component={Game} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const store = useXRStore();

  return (
    <QueryClientProvider client={queryClient}>
      <XR store={store}>
        <Router />
        <Toaster />
      </XR>
    </QueryClientProvider>
  );
}

export default App;