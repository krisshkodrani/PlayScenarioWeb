import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ScenarioModeration from "./pages/admin/ScenarioModeration";
import CharacterModeration from "./pages/admin/CharacterModeration";
import AuditTrail from "./pages/admin/AuditTrail";
import ContentAnalytics from "./pages/admin/ContentAnalytics";
import UserAnalytics from "./pages/admin/UserAnalytics";
import ModerationAnalytics from "./pages/admin/ModerationAnalytics";
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
import MyGames from "./pages/MyGames";
import CreditsPurchase from "./pages/CreditsPurchase";
import NotFound from "./pages/NotFound";
import Results from "./pages/Results";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";
import CommunityGuidelines from "./pages/legal/CommunityGuidelines";
import RefundPolicy from "./pages/legal/RefundPolicy";

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
            <Route path="/my-games" element={
              <ProtectedRoute>
                <MyGames />
              </ProtectedRoute>
            } />
            <Route path="/credits/purchase" element={
              <ProtectedRoute>
                <CreditsPurchase />
              </ProtectedRoute>
            } />
            <Route path="/results/:instance_id" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/admin/scenarios" element={
              <AdminRoute>
                <ScenarioModeration />
              </AdminRoute>
            } />
            <Route path="/admin/characters" element={
              <AdminRoute>
                <CharacterModeration />
              </AdminRoute>
            } />
            <Route path="/admin/audit" element={
              <AdminRoute>
                <AuditTrail />
              </AdminRoute>
            } />
            <Route path="/admin/analytics/content" element={
              <AdminRoute>
                <ContentAnalytics />
              </AdminRoute>
            } />
            <Route path="/admin/analytics/users" element={
              <AdminRoute>
                <UserAnalytics />
              </AdminRoute>
            } />
            <Route path="/admin/analytics/moderation" element={
              <AdminRoute>
                <ModerationAnalytics />
              </AdminRoute>
            } />
            
            {/* Legal Pages */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
