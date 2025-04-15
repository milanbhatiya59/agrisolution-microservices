import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-300 dark:bg-gray-700">
        <div className="w-full max-w-md p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow-lg animate-pulse">
          <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-md mb-6"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
        </div>
      </div>
    );
  }

  return isSignedIn ? children : <Navigate to="/" state={{ from: location }} />;
};

export default PrivateRoute;
