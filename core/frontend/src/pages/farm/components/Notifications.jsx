import { useState, useEffect } from "react";
import { getNotification } from "../../../api/getNotification";
import { format } from "date-fns";
import { useLanguage } from "../../../context/LanguageContext";
import { translateText } from "../../../utils/translate";

const Notifications = ({ id }) => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [translatedNotifications, setTranslatedNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [translatedTexts, setTranslatedTexts] = useState({
    title: "📢 Notifications",
    selectDate: "Select Date:",
    noNotifications: "📭 No notifications available for the selected date.",
    pending: "Pending",
    completed: "Completed",
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(id);
        setNotifications(response?.tasks || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [id]);

  useEffect(() => {
    const translateUI = async () => {
      const texts = {
        title: "📢 Notifications",
        selectDate: "Select Date:",
        noNotifications: "📭 No notifications available for the selected date.",
        pending: "Pending",
        completed: "Completed",
      };

      const updatedTexts = {};
      for (const key in texts) {
        updatedTexts[key] = await translateText(texts[key], language);
      }
      setTranslatedTexts(updatedTexts);
    };

    translateUI();
  }, [language]);

  useEffect(() => {
    const translateNotifications = async () => {
      const translatedTasks = await Promise.all(
        notifications.map(async (notif) => ({
          ...notif,
          taskType: await translateText(notif.taskType, language),
          description: await translateText(notif.description, language),
          status:
            notif.status === "Pending"
              ? translatedTexts.pending
              : translatedTexts.completed,
        }))
      );

      setTranslatedNotifications(translatedTasks);
    };

    if (notifications.length > 0) {
      translateNotifications();
    }
  }, [
    notifications,
    language,
    translatedTexts.pending,
    translatedTexts.completed,
  ]);

  const filteredNotifications = translatedNotifications.filter(
    (notif) => format(new Date(notif.date), "yyyy-MM-dd") === selectedDate
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6">{translatedTexts.title}</h2>

      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium">
          {translatedTexts.selectDate}
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
        />
      </div>

      {filteredNotifications.length > 0 ? (
        <ul className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {filteredNotifications.map((notif, index) => (
            <li
              key={index}
              className="p-4 border-b dark:border-gray-700 flex flex-col md:flex-row md:justify-between"
            >
              <div>
                <p className="text-lg font-semibold">{notif.taskType}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {notif.description}
                </p>
                {notif.quantity && notif.unit && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Quantity:</span>{" "}
                    {notif.quantity} {notif.unit}
                  </p>
                )}
              </div>
              <span
                className={`mt-2 md:mt-0 inline-block px-3 py-1 rounded-full text-xs font-bold self-start md:self-center ${
                  notif.status === translatedTexts.pending
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {notif.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 dark:text-gray-400 text-lg mt-4">
          {translatedTexts.noNotifications}
        </p>
      )}
    </div>
  );
};

export default Notifications;
