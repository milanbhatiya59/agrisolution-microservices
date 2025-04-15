import axios from "axios";

export const translateText = async (text, targetLang) => {
  const cacheKey = `${text}-${targetLang}`;
  const cachedTranslation = localStorage.getItem(cacheKey);

  if (cachedTranslation) return cachedTranslation;

  const API_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;

  try {
    const response = await axios.get(API_URL);
    const translatedText = response.data[0].map((item) => item[0]).join("");
    localStorage.setItem(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
};
