import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", label: "English (अंग्रेज़ी)" },
    { code: "hi", label: "Hindi (हिंदी)" },
    { code: "bn", label: "Bengali (বাংলা)" },
    { code: "ta", label: "Tamil (தமிழ்)" },
    { code: "te", label: "Telugu (తెలుగు)" },
    { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
    { code: "mr", label: "Marathi (मराठी)" },
    { code: "gu", label: "Gujarati (ગુજરાતી)" },
    { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "ml", label: "Malayalam (മലയാളം)" },
    { code: "ur", label: "Urdu (اردو)" },
  ];

  return (
    <div className="relative inline-block">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300 shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer appearance-none pr-10"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1.25rem",
        }}
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
