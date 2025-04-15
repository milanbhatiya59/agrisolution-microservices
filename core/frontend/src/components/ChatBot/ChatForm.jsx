import { useRef, useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { translateText } from "../../utils/translate";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();
  const { language } = useLanguage();
  const [translatedPlaceholder, setTranslatedPlaceholder] = useState(
    "Type your message..."
  );

  useEffect(() => {
    const translatePlaceholder = async () => {
      const translated = await translateText("Type your message...", language);
      setTranslatedPlaceholder(translated);
    };
    translatePlaceholder();
  }, [language]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    const translatedUserMessage = await translateText(userMessage, "en");

    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    generateBotResponse([
      ...chatHistory,
      { role: "user", text: translatedUserMessage },
    ]);
  };

  return (
    <form
      className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm px-4 py-2 w-full"
      onSubmit={handleFormSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={translatedPlaceholder}
        className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none px-2 py-1"
        required
      />
      <button
        type="submit"
        className="dark:text-white text-black bg-primary hover:bg-primary-dark p-2 rounded-full transition duration-200"
        aria-label="Send message"
      >
        <FaArrowUp className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatForm;
