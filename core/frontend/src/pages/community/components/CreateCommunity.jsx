import { useRef, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { createCommunity } from "../../../api/createCommunityApi";

const CreateCommunity = ({ onClose }) => {
  const dialogRef = useRef();
  const { user } = useUser();
  const clerkUserId = user?.id || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const communityName = e.target.communityName.value.trim();
    if (!communityName) return;

    setLoading(true);
    setError("");

    try {
      await createCommunity(clerkUserId, communityName);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create community. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={dialogRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create Community
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="communityName"
            type="text"
            placeholder="Community Name"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={loading}
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
