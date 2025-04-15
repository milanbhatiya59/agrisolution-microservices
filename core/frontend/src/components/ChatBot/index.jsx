import { useEffect, useRef, useState } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessages";
import { useLanguage } from "../../context/LanguageContext";
import { translateText } from "../../utils/translate";

const Chatbot = () => {
  const { language } = useLanguage();
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();
  const [translatedTexts, setTranslatedTexts] = useState({
    chatbotTitle: "ChatBot",
    welcomeMessage: "Hey there! 👋 How can I help you?",
    thinking: "Thinking...",
    errorMessage: "Something went wrong!!",
  });

  useEffect(() => {
    const translateUI = async () => {
      const texts = {
        chatbotTitle: "ChatBot",
        welcomeMessage: "Hey there! 👋 How can I help you?",
        thinking: "Thinking...",
        errorMessage: "Something went wrong!!",
      };

      const updatedTexts = {};
      for (const key in texts) {
        updatedTexts[key] = await translateText(texts[key], language);
      }
      setTranslatedTexts(updatedTexts);
    };
    translateUI();
  }, [language]);

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== translatedTexts.thinking),
        { role: "model", text, isError },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || translatedTexts.errorMessage);

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition"
      >
        {showChatbot ? (
          <ChevronDown className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {showChatbot && (
        <div className="fixed bottom-20 right-5 w-96 bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center p-4 bg-green-600 dark:bg-green-900 text-white">
            <div className="flex items-center gap-3">
              <ChatbotIcon />
              <h2 className="text-lg font-semibold">
                {translatedTexts.chatbotTitle}
              </h2>
            </div>
            <button
              className="p-1 text-white"
              onClick={() => setShowChatbot(false)}
            >
              <ChevronDown className="h-6 w-6" />
            </button>
          </div>

          <div
            ref={chatBodyRef}
            className="max-h-[400px] overflow-y-auto p-4 space-y-3"
          >
            <div className="flex items-start gap-2">
              <ChatbotIcon />
              <p className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg">
                {translatedTexts.welcomeMessage}
              </p>
            </div>

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="p-4 border-t dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
