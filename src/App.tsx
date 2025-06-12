
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GameplayDemo from "./pages/GameplayDemo";
import Gameplay from "./pages/Gameplay";
import BrowseScenarios from "./pages/BrowseScenarios";
import CharacterCreation from "./pages/CharacterCreation";
import ScenarioCreation from "./pages/ScenarioCreation";
import CoreChatPage from "./pages/CoreChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<GameplayDemo />} />
          <Route path="/gameplay" element={<Gameplay />} />
          <Route path="/browse" element={<BrowseScenarios />} />
          <Route path="/create-character" element={<CharacterCreation />} />
          <Route path="/create-scenario" element={<ScenarioCreation />} />
          <Route path="/core-chat" element={<CoreChatPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
