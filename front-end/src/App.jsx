import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Vehicles from "./pages/Vehicles";
import Customers from "./pages/Customers";
import Promotions from "./pages/Promotions";
import Report from "./pages/Report";

async function getSession() {
  const response = await fetch("/api/auth/session", { credentials: "include" });
  if (response.status === 401) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Unable to reach the Node.js API. Check that the backend is running.");
  }
  if (!data) throw new Error("The API returned an invalid session response.");
  return data.user || null;
}

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [route, setRoute] = useState(window.location.pathname);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    const handlePop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    getSession()
      .then((currentUser) => {
        setUser(currentUser);
        if (currentUser && window.location.pathname !== "/dashboard") {
          window.history.replaceState({}, "", "/dashboard");
          setRoute("/dashboard");
        }
      })
      .catch((error) => setSessionError(error.message))
      .finally(() => setCheckingSession(false));
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (path, replace = false) => {
    if (replace) window.history.replaceState({}, "", path);
    else window.history.pushState({}, "", path);
    setRoute(path);
  };

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
    setPage("dashboard");
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Unable to sign out.");
    }
    setUser(null);
    navigate("/");
  };

  if (checkingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50">
        <p className="text-sm font-medium text-slate-500">Loading your workspace…</p>
      </main>
    );
  }

  if (!user) {
    if (route === "/register") {
      return <Register onRegistered={() => navigate("/", true)} sessionError={sessionError} />;
    }
    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => navigate("/register")}
        sessionError={sessionError}
      />
    );
  }

  const isAdmin = user.Role === "admin";
  const renderPage = () => {
    switch (page) {
      case "vehicles":
        return <Vehicles user={user} />;
      case "customers":
        return isAdmin ? <Customers user={user} /> : <Dashboard user={user} onNavigate={setPage} />;
      case "promotions":
        return <Promotions user={user} />;
      case "reports":
        return <Report />;
      default:
        return <Dashboard user={user} onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f5] text-slate-900 lg:flex">
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main className="min-w-0 flex-1 px-5 pb-10 pt-7 sm:px-8 lg:px-10 lg:pt-9">
        <div className="mx-auto max-w-345">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;
