import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getCommunityChats } from "../../../api/getCommunityChatsApi";
import { createMessageApi } from "../../../api/createMessageApi";
import { getUser } from "../../../api/getUserApi";
import { FaUserAlt } from "react-icons/fa";

const CommunityChat = ({ selectedCommunity }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [userMongoId, setUserMongoId] = useState(null);

  const { user } = useUser();
  const userClerkId = user?.id;
  const userImage = user?.imageUrl;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, sending]);

  useEffect(() => {
    const fetchUserMongoId = async () => {
      if (!userClerkId) return;
      const data = await getUser(userClerkId);
      if (data && data._id) {
        setUserMongoId(data._id);
      }
    };
    fetchUserMongoId();
  }, [userClerkId]);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const data = await getCommunityChats(selectedCommunity._id);
        const sorted = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sorted);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCommunity?._id) {
      fetchChats();
    }
  }, [selectedCommunity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await createMessageApi({
        communityId: selectedCommunity._id,
        senderClerkId: userClerkId,
        content: newMessage,
      });

      setMessages((prev) => [...prev, response]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (!selectedCommunity) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[80vh] flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select a community to start chatting.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full min-h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          💬 {selectedCommunity.name} Chat
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Admin: <span className="font-semibold">{user?.firstName} {user?.lastName}</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scroll">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2/3 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isCurrentUser = msg.sender === userMongoId;
            const avatar = userImage;

            return (
              <div key={idx} className={`flex items-end gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                {!isCurrentUser && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow">
                    <FaUserAlt />
                  </div>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs sm:max-w-sm shadow-md transition-all duration-300 ${
                    isCurrentUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className="text-xs mt-1 text-right text-gray-300 dark:text-gray-400">
                    {isCurrentUser ? "You" : msg.senderName || "User"} ·{" "}
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {isCurrentUser && (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover shadow-md"
                  />
                )}
              </div>
            );
          })
        )}

        {sending && (
          <div className="flex justify-end">
            <div className="px-4 py-2 rounded-2xl bg-blue-100 dark:bg-blue-600 text-sm opacity-50 max-w-xs">
              Sending...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
        <button
          type="submit"
          disabled={sending}
          className={`px-5 py-2 rounded-full text-white font-medium transition-all ${
            sending
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {sending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default CommunityChat;
