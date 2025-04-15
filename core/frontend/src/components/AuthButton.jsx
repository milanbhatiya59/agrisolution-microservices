import { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const AuthButton = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-[120px] h-[40px] rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      ) : (
        <>
          <SignedOut>
            <SignInButton className="w-[120px] h-[40px] flex items-center justify-center px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300 shadow-md hover:bg-gray-300 dark:hover:bg-gray-700">
              Login
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </>
      )}
    </>
  );
};

export default AuthButton;
