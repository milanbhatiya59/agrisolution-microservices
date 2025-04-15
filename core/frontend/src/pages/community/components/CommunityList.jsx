import { useEffect, useState } from "react";
import { getCommunities } from "../../../api/getCommunitiesApi";

const farmIcons = ["🌾", "🚜", "🐄", "🌱", "🧑‍🌾", "🍅", "🐓", "🌽", "🍀", "🥕"];
const getFarmIcon = (name) => {
  const index = name.length % farmIcons.length;
  return farmIcons[index];
};

const CommunityList = ({ onSelectCommunity, selectedCommunityId }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const fillerCount = 20;

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getCommunities();
        setCommunities(data);
      } catch (err) {
        console.error("Failed to load communities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-full min-h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-4">🚜 Farm Communities</h2>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loading ? (
          [...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            ></div>
          ))
        ) : communities.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No communities found.
          </p>
        ) : (
          <>
            {communities.map((community) => (
              <div
                key={community._id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition group ${
                  selectedCommunityId === community._id
                    ? "bg-green-200 dark:bg-green-600"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-600"
                }`}
                onClick={() => onSelectCommunity(community)}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full text-lg font-medium group-hover:scale-105 transition">
                  {getFarmIcon(community.name)}
                </div>
                <div className="flex-1">
                  <p className="font-medium truncate">{community.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {community.description || "Farming group"}
                  </p>
                </div>
              </div>
            ))}
            {[...Array(Math.max(0, fillerCount - communities.length))].map(
              (_, i) => (
                <div key={`filler-${i}`} className="h-12 bg-transparent" />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityList;
