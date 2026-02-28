import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./components/DashboardLayout";
import MainDashboardPage from "./pages/dashboard/MainDashboardPage";
import UploadPage from "./pages/dashboard/UploadPage";
import AnalysisPage from "./pages/dashboard/AnalysisPage";
import HistoryPage from "./pages/dashboard/HistoryPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import QuestionPaperPage from "./pages/dashboard/QuestionPaperPage";
import AskQurioAI from "./pages/dashboard/AskQurioAI";
import MultiExamExpansionPage from "./pages/dashboard/MultiExamExpansionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<MainDashboardPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="question-paper" element={<QuestionPaperPage />} />
            <Route path="ask-qurio-ai" element={<AskQurioAI />} />
            <Route path="multi-exam-expansion" element={<MultiExamExpansionPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
