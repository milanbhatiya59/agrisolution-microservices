import React, { useEffect, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import { useLanguage } from "../../context/LanguageContext";
import { translateText } from "../../utils/translate";

const ChatMessage = ({ chat }) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(chat.text);

  useEffect(() => {
    const translateMessage = async () => {
      if (chat.text) {
        const translated = await translateText(chat.text, language);
        setTranslatedText(translated);
      }
    };
    translateMessage();
  }, [chat.text, language]);

  return (
    <div
      className={`flex items-start gap-2 ${
        chat.role === "model" ? "self-start" : "self-end flex-row-reverse"
      }`}
    >
      {chat.role === "model" && <ChatbotIcon />}
      <p
        className={`px-4 py-2 max-w-[75%] break-words text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg ${
          chat.isError ? "bg-red-500 text-black dark:text-white" : ""
        }`}
      >
        {translatedText}
      </p>
    </div>
  );
};

export default ChatMessage;
