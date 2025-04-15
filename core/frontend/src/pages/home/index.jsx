import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import FarmCard from "./components/FarmCard";
import { getUserFarmsApi } from "../../api/getUserFarmsApi";
import { deleteFarmApi } from "../../api/deleteFarmApi";
import { translateText } from "../../utils/translate";
import { useLanguage } from "../../context/LanguageContext";
import bannerImage from "../../assets/icon.png";

const HomePage = () => {
  const { user } = useUser();
  const { language } = useLanguage();
  const [userData, setUserData] = useState(null);
  const [farmsData, setFarmsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await getUserFarmsApi(user.id);
        setUserData(response.user);
        const translatedFarms = await Promise.all(
          response.farms.map(async (farm) => ({
            ...farm,
            currentCrop: await translateText(
              farm.currentCrop || "Not Set",
              language
            ),
          }))
        );
        setFarmsData(translatedFarms);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, language]);

  useEffect(() => {
    const translateContent = async () => {
      const translations = {
        profile: await translateText("Profile", language),
        createFarm: await translateText("+ Create New Farm", language),
        userInfo: await translateText("User Information", language),
        email: await translateText("Email", language),
        farms: await translateText("Your Farms", language),
        loading: await translateText("Loading...", language),
        noData: await translateText("No data available.", language),
        noFarms: await translateText("No farms found. Create a new one!", language),
      };
      setTranslatedText(translations);
    };

    translateContent();
  }, [language]);

  const handleDeleteFarm = async (farmId) => {
    const confirmed = window.confirm("Are you sure you want to delete this farm?");
    if (!confirmed) return;

    try {
      await deleteFarmApi(farmId);
      setFarmsData((prev) => prev.filter((farm) => farm._id !== farmId));
    } catch (err) {
      console.error("Failed to delete farm:", err);
      alert("Error deleting farm. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition hover:shadow-xl">
          <div className="text-xl font-bold tracking-wide">
            👤 {user?.firstName} {user?.lastName} - {translatedText.profile}
          </div>
          <button
            onClick={() => navigate("/create")}
            className="mt-4 sm:mt-0 px-5 py-2 bg-lime-600 text-white font-semibold rounded-lg shadow-md hover:bg-lime-700 hover:scale-105 transition-all"
          >
            {translatedText.createFarm}
          </button>
        </div>

        {/* Banner */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
          <img
            src={bannerImage}
            alt="Welcome Banner"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          {loading ? (
            <div className="animate-pulse text-gray-500">
              {translatedText.loading}
            </div>
          ) : error ? (
            <div className="text-red-500 font-semibold">{error}</div>
          ) : userData ? (
            <>
              <h2 className="text-2xl font-bold mb-2">{translatedText.userInfo}</h2>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>{translatedText.email}:</strong> {userData.email}
              </p>
            </>
          ) : (
            <div>{translatedText.noData}</div>
          )}
        </div>

        {/* Farms Grid */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">{translatedText.farms}</h2>
          {loading ? (
            <div>{translatedText.loading}</div>
          ) : farmsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmsData.map((farm) => (
                <FarmCard key={farm._id} farm={farm} onDelete={handleDeleteFarm} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic">{translatedText.noFarms}</div>
          )}
        </div>
      </div>

      {/* FAB for mobile */}
      <button
        onClick={() => navigate("/create")}
        className="sm:hidden fixed bottom-6 right-6 z-50 bg-lime-600 hover:bg-lime-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Create Farm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default HomePage;
