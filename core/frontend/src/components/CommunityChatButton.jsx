import { useNavigate } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../utils/translate";


const CommunityChatButton = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [translatedText, setTranslatedText] = useState({
    community: "Community",
  });

  useEffect(() => {
    const translateContent = async () => {
      const community = await translateText("Community", language);
      setTranslatedText({ community });
    };

    translateContent();
  }, [language]);


  return (
    <button
      onClick={() => navigate("/community")}
      className="px-4 py-2 flex rounded-md gap-x-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300 shadow-md hover:bg-gray-300 dark:hover:bg-gray-700"
    >
      <div className="flex items-center justify-center">
        <FiMessageCircle />
      </div>
      <p>{translatedText.community}</p>
    </button>
  );
};

export default CommunityChatButton;
