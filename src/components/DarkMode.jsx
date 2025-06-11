import { Sun, Moon } from "lucide-react"
import { useTheme } from '../context/ThemeContext'

function DarkMode() {
    const { isDarkMode, toggleTheme } = useTheme()

    return (
        <button className="toggle-btn cursor-pointer" onClick={toggleTheme}>
            {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </button>
    )
}
export default DarkMode