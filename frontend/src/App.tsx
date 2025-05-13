import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import ReportFormPage from "./pages/ReportFormPage";
import AppBar from "./components/Navigations/AppBar";
import ChatbotPage from "./pages/ChatbotPage";

// Komponen wrapper untuk AppBar conditional
function LayoutWithConditionalAppBar({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Daftar path yang tidak akan menampilkan AppBar
  const hideAppBarRoutes = ["/lapor", "/chatbot"];

  const shouldHideAppBar = hideAppBarRoutes.includes(location.pathname);

  return (
    <>
      <main className="mb-18">{children}</main>
      {!shouldHideAppBar && <AppBar />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWithConditionalAppBar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/laporan" element={<ReportPage />} />
          <Route path="/komunitas" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/lapor" element={<ReportFormPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
      </LayoutWithConditionalAppBar>
    </BrowserRouter>
  );
}

export default App;
