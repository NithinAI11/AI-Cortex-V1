// ===== File: frontend/src/components/SettingsModal.tsx =====
import { useContext } from 'react';
import { ThemeContext } from '../App';
import CloseIcon from '@mui/icons-material/Close';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl w-96 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preferences</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-white/5">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Appearance</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Toggle light and dark mode</div>
            </div>
            <button 
              onClick={toggleTheme}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}