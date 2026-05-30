import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingComponent } from "./component/LoadingComponent";
import { useAuth } from "./context/AuthContext";
import AboutPage from "./pages/AboutPage";
import AllUsersPage from "./pages/AllUsersPage";
import AppSetupPage from "./pages/AppSetupPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import MessageHistoryPage from "./pages/MessageHistoryPage";
import Navbar from "./pages/Navbar";
import PassChangePage from "./pages/PassChangePage";
import SendMessage from "./pages/SendMessage";
import { useEffect } from "react";
import { SmsSpiApiService } from "./service/SmsApiService";

function App() {
  const { user, loading, appSetting } = useAuth();
  useEffect(() => {
    const res = SmsSpiApiService.getCurrentSmsCredit();
    console.log(res);
  });
  if (loading)
    return <LoadingComponent text="Please Wait, Application is loading" />;
  if (user && user.change_password == 1) {
    return <PassChangePage />;
  }
  if (user && !appSetting && user.change_password == 0) {
    return <AppSetupPage />;
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={user ? <MainPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/send-msg"
          element={user ? <SendMessage /> : <Navigate to="/login" />}
        />
        <Route
          path="/msg-history"
          element={user ? <MessageHistoryPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/all-users"
          element={
            user && user.role == "ADMIN" ? (
              <AllUsersPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/app-setting"
          element={
            user && user.role === "ADMIN" ? (
              <AppSetupPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/about"
          element={user ? <AboutPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
