
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseScenarios from "./pages/BrowseScenarios";
import CharacterCreation from "./pages/CharacterCreation";
import ScenarioCreation from "./pages/ScenarioCreation";
import ScenarioPreview from "./pages/ScenarioPreview";
import CoreChatPage from "./pages/CoreChatPage";
import MyScenarios from "./pages/MyScenarios";
import MyCharacters from "./pages/MyCharacters";
import NotFound from "./pages/NotFound";
import Results from "./pages/Results";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/browse" element={<BrowseScenarios />} />
            <Route path="/create-character" element={
              <ProtectedRoute>
                <CharacterCreation />
              </ProtectedRoute>
            } />
            <Route path="/create-scenario" element={
              <ProtectedRoute>
                <ScenarioCreation />
              </ProtectedRoute>
            } />
            <Route path="/scenario/:id" element={<ScenarioPreview />} />
            <Route path="/core-chat" element={
              <ProtectedRoute>
                <CoreChatPage />
              </ProtectedRoute>
            } />
            <Route path="/my-scenarios" element={
              <ProtectedRoute>
                <MyScenarios />
              </ProtectedRoute>
            } />
            <Route path="/my-characters" element={
              <ProtectedRoute>
                <MyCharacters />
              </ProtectedRoute>
            } />
            <Route path="/results/:instance_id" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
