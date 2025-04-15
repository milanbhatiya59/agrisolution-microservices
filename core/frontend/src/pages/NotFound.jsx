import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../utils/translate";

const NotFound = () => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState({
    title: "404",
    message: "Oops! The page you're looking for doesn't exist.",
    button: "Go Home",
  });

  useEffect(() => {
    const translateContent = async () => {
      const title = await translateText("404", language);
      const message = await translateText(
        "Oops! The page you're looking for doesn't exist.",
        language
      );
      const button = await translateText("Go Home", language);
      setTranslatedText({ title, message, button });
    };

    translateContent();
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen transition-colors duration-300 bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white">
      <h1 className="text-6xl font-bold mb-4 animate-bounce">
        {translatedText.title}
      </h1>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
        {translatedText.message}
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-md transition-colors duration-300 shadow-md bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900"
      >
        {translatedText.button}
      </Link>
    </div>
  );
};

export default NotFound;
