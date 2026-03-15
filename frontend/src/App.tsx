// ===== File: frontend/src/App.tsx =====
import { useState, useEffect, createContext } from "react"
import Layout from "./components/Layout"
import Workspace from "./pages/Workspace"

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

export default function App() {
  const [sources, setSources] = useState([])
  
  // MODIFIED: Initialize theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  })

  const [loadedSession, setLoadedSession] = useState<any>(null) // NEW: State for loading history

  // MODIFIED: This hook now ALSO saves the theme choice to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark'); 
      root.classList.remove('light');
    } else {
      root.classList.add('light'); 
      root.classList.remove('dark');
    }
    // Save the current theme preference
    localStorage.setItem('theme', theme);
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Layout sources={sources} setLoadedSession={setLoadedSession}>
        <Workspace setSources={setSources} loadedSession={loadedSession} setLoadedSession={setLoadedSession} />
      </Layout>
    </ThemeContext.Provider>
  )
}