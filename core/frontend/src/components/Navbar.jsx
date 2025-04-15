import ThemeToggleButton from "./ThemeToggleButton";
import LanguageSelector from "./LanguageSelector";
import AuthButton from "./AuthButton";
import CommunityChatButton from "./CommunityChatButton";
import DownloadSampleSoilCardButton from "./DownloadSampleSoilCardButton";

const Navbar = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-green-700 via-green-800 to-emerald-700 shadow-md dark:backdrop-blur-md  transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        <div className="text-white text-2xl font-bold tracking-wider drop-shadow-sm">
          🌾 Agri Solution
        </div>

        <div className="flex items-center space-x-4">
          <AuthButton />
          <ThemeToggleButton />
          <LanguageSelector />
          <CommunityChatButton />
          <DownloadSampleSoilCardButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
