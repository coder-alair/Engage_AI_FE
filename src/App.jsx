import { useEffect, useState, useRef, createContext, lazy } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import "./tailwind.css";
import { cleanLocalStorage } from "./helpers/helper";
import { Api } from "./api";
const Verification = lazy(() => import("./pages/Verification"));
const LogIn = lazy(() => import("./components/LogIn"));
const Chatbot = lazy(() => import("./components/chatbot/Chatbot"));
const Privacy = lazy(() => import("./components/privacy-policy/Privacy"));
const Profile = lazy(() => import("./components/profile/Profile"));
const TermsConditions = lazy(() =>
  import("./components/Terms-conditions/TermsCondition")
);
const ProfileEdit = lazy(() => import("./components/profile/ProfileEdit"));
const OrganizationPage = lazy(() => import("./components/OrganizationPage"));
const OrganizationSubscription1 = lazy(() =>
  import("./components/OrganizationSubscription1")
);
const OrganizationSubscription = lazy(() =>
  import("./components/OrganizationSubscription")
);
const ResetLink = lazy(() => import("./components/resetpassword/ResetLink"));
const ResetRequest = lazy(() =>
  import("./components/resetpassword/ResetRequest")
);
const ResetPassword = lazy(() =>
  import("./components/resetpassword/ResetPassword")
);
const ErrorPage = lazy(() =>
  import("./components/resetpassword/error/ErrorPage")
);
const ConfirmPopup = lazy(() => import("./helpers/common/modals/ConfirmPopup"));
const AccountVerified = lazy(() => import("./pages/accountVerified"));
const NotVerify = lazy(() => import("./pages/NotVerify"));

// import Verification from './pages/Verification';
// import LogIn from './components/LogIn';
// import Chatbot from './components/chatbot/Chatbot';
// import Privacy from './components/privacy-policy/Privacy';
// import Profile from './components/profile/Profile';
// import TermsConditions from './components/Terms-conditions/TermsCondition';
// import ProfileEdit from './components/profile/ProfileEdit';
// import OrganizationPage from './components/OrganizationPage';
// import OrganizationSubscription1 from './components/OrganizationSubscription1';
// import OrganizationSubscription from './components/OrganizationSubscription';
// import ResetLink from './components/resetpassword/ResetLink';
// import ResetRequest from './components/resetpassword/ResetRequest';
// import ResetPassword from './components/resetpassword/ResetPassword';
// import ErrorPage from './components/resetpassword/error/ErrorPage'
// import { cleanLocalStorage } from './helpers/helper';
// import ConfirmPopup from './helpers/common/modals/ConfirmPopup';
// import AccountVerified from './pages/accountVerified';
// import NotVerify from './pages/NotVerify';

export const MyContext = createContext("");

function App() {
  const [login, setLogin] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const timeoutId = useRef(null);
  const navigate = useNavigate();

  const resetTimer = () => {
    if (showPrompt) {
      return;
    }
    setIsActive(true);
    setShowPrompt(false);
    clearTimeout(timeoutId.current);
    if (login) {
      timeoutId.current = setTimeout(() => {
        setIsActive(false);
        setShowPrompt(true);
      }, 13 * 60 * 1000); // 1 minute = 60000 milliseconds
    }
  };

  // Function to handle user activity
  const handleActivity = () => {
    if (!isActive) {
      resetTimer();
    }
  };

  const logout = () => {
    setShowPrompt(false);
    cleanLocalStorage();
    // const currentLocation = window.location.origin;
    // const url = `${currentLocation}/login`
    // window.open(url, "_self");
    navigate("/login");
    setLogin("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLogin(token);
    } else if (!login) {
      if (
        window.location.pathname.includes("account-verified") ||
        window.location.pathname.includes("/account-unverified") ||
        window.location.pathname.includes("/resetlink") ||
        window.location.pathname.includes("/reset_password") ||
        window.location.pathname.includes("/invitation") ||
        window.location.pathname.includes("/signup")
      ) {
      } else {
        navigate("/login");
      }
    }
  }, [login]);

  useEffect(() => {
    let timer;
    clearTimeout(timer);
    if (showPrompt) {
      timer = setTimeout(() => {
        logout();
      }, 2 * 60 * 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showPrompt]);

  useEffect(() => {
    if (login) {
      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("keydown", handleActivity);
      window.addEventListener("click", handleActivity);

      // Start the timer on mount
      resetTimer();

      // Clean up event listeners on unmount
      return () => {
        window.removeEventListener("mousemove", handleActivity);
        window.removeEventListener("keydown", handleActivity);
        window.removeEventListener("click", handleActivity);
        clearTimeout(timeoutId.current);
      };
    }
    setIsActive(false);
  }, [login]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.type === "storage") {
        const token = localStorage.getItem("token");

        if (!token) {
          cleanLocalStorage();
          setLogin("");
          navigate("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  //confirm login
  const initAuth = async () => {
    if (
      !window.location.pathname.includes("login") &&
      !window.location.pathname.includes("account-verified") &&
      !window.location.pathname.includes("/account-unverified") &&
      !window.location.pathname.includes("/resetlink") &&
      !window.location.pathname.includes("/reset_password") &&
      !window.location.pathname.includes("/invitation") &&
      !window.location.pathname.includes("/signup") &&
      !window.location.pathname.includes("/verification")
    ) {
      const response = await Api.confirmLogin();
      if (!response) {
        logout();
      }
    }
  };

  //confirm login
  const pathname = window.location.pathname;
  useEffect(() => {
    initAuth();
  }, [pathname]);

  

  return (
    <MyContext.Provider value={{ login, setLogin }}>
     
      <div>
        <ConfirmPopup
          open={showPrompt}
          setOpen={setShowPrompt}
          setAccepted={resetTimer}
          message={
            "You will be logged out soon due to inactivity. Click 'Continue' to stay logged in."
          }
          handleNo={logout}
          yesBtn={"Continue"}
          hideNoBtn={true}
        />
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/recruit-ai" element={<Chatbot />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/company-details" element={<OrganizationPage />} />
        <Route
          path="/company-subscription"
          element={<OrganizationSubscription1 />}
        />
        {/* <Route path="/company-subscription" element={<OrganizationSubscription />} /> */}
        <Route path="/verification" element={<Verification />} />
        <Route path="/account-verified" element={<AccountVerified />} />
        <Route path="/account-unverified" element={<NotVerify />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/resetrequest" element={<ResetRequest />} />
        <Route path="/resetlink" element={<ResetLink />} />
        <Route path="/reset_password/:token" element={<ResetPassword />} />
        <Route path="/reset_password" element={<ErrorPage />} />
      </Routes>
    </MyContext.Provider>
  );
}

export default App;
