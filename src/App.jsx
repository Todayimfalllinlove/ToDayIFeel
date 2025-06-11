import { Route, Routes } from 'react-router-dom';
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Auth from './components/Auth';
import Footer from './components/Footer';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { JournalProvider } from './context/JournalContext';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <Theme appearance={isDarkMode ? "dark" : "light"}>
        <div className="min-h-screen flex flex-col">
          <NavBar />

          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Theme>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <JournalProvider>
        <AppContent />
      </JournalProvider>
    </ThemeProvider>
  );
}

export default App
