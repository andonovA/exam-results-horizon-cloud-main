import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SeasonManagement from "./pages/SeasonManagement";
import EntriesManagement from "./pages/EntriesManagement";
import MockExamSetup from "./pages/MockExamSetup";
import CourseManagement from "./pages/CourseManagement";
import BasedataUpload from "./pages/BasedataUpload";
import ResultsManagement from "./pages/ResultsManagement";
import EmbargoManagement from "./pages/EmbargoManagement";
import StudentPortal from "./pages/StudentPortal";
import StudentEmbargoNotice from "./pages/StudentEmbargoNotice";
import Analytics from "./pages/Analytics";
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
          <Route path="/season-management" element={<SeasonManagement />} />
          <Route path="/entries-management/:seriesId" element={<EntriesManagement />} />
          <Route path="/mock-exam-setup/:seriesId" element={<MockExamSetup />} />
          <Route path="/course-management" element={<CourseManagement />} />
          <Route path="/basedata-upload" element={<BasedataUpload />} />
          <Route path="/results-management" element={<ResultsManagement />} />
          <Route path="/embargo-management" element={<EmbargoManagement />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/student-embargo-notice" element={<StudentEmbargoNotice />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
