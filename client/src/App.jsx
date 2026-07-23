import { AppProvider, useApp } from "./context/AppContext";
import MobileShell from "./components/MobileShell";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditProfilePage from "./pages/EditProfilePage";
import PeoplePage from "./pages/PeoplePage";
import NotificationsPage from "./pages/NotificationsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function AppContent() {
  const { activePage, showNotifications, currentUser, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex-1 w-full h-screen bg-[#121212] flex items-center justify-center select-none">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  const renderActivePage = () => {
    if (!currentUser) {
      return activePage === "register" ? <RegisterPage /> : <LoginPage />;
    }

    switch (activePage) {
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "feed":
        return <FeedPage />;
      case "profile":
        return <ProfilePage />;
      case "comments":
        return <PostDetailPage />;
      case "create":
        return <CreatePostPage />;
      case "settings":
        return <EditProfilePage />;
      case "people":
        return <PeoplePage />;
      default:
        return <FeedPage />;
    }
  };

  return (
    <MobileShell>
      {renderActivePage()}
      {showNotifications && <NotificationsPage />}
    </MobileShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
