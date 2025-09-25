import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Bell, User, Mic } from "lucide-react";
import { VoiceAssistant } from "../voice/VoiceAssistant";

interface NavigationProps {
  isAuthenticated: boolean;
  user: any;
  activeView: string;
  setActiveView: (view: any) => void;
  navigation: any[];
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleAuthAction: (mode: "login" | "signup") => void;
  setIsDoubtSolverOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setIsProfileModalOpen: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isAuthenticated,
  user,
  activeView,
  setActiveView,
  navigation,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleAuthAction,
  setIsDoubtSolverOpen,
  setIsChatOpen,
  setIsProfileModalOpen,
}) => {
  const [fontSize, setFontSize] = useState("text-sm");
  const [padding, setPadding] = useState("px-3 py-2");
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  
  type Notification = {
    id: number;
    message: string;
    read: boolean;
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    const fetched: Notification[] = [
      { id: 1, message: "Your assessment is ready", read: false },
      { id: 2, message: "New course available", read: false },
    ];
    setNotifications(fetched);
    setUnreadCount(fetched.filter((n) => !n.read).length);
  }, []);

  useEffect(() => {
    const tabCount = navigation.length;
    if (tabCount > 6 && tabCount <= 10) {
      setFontSize("text-sm");
      setPadding("px-2.5 py-1.5");
    } else if (tabCount > 10) {
      setFontSize("text-xs");
      setPadding("px-2 py-1");
    } else {
      setFontSize("text-base");
      setPadding("px-3 py-2");
    }
  }, [navigation]);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                YUGA AI
              </span>
            </Link>

            {/* Tabs in single horizontal line */}
            {isAuthenticated && (
              <div className="hidden lg:flex flex-nowrap items-center overflow-hidden gap-1 ml-4">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`shrink-0 flex items-center space-x-1 rounded-lg transition-colors whitespace-nowrap ${padding} ${fontSize} ${
                      activeView === item.id
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    style={{ maxWidth: "100%" }}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Voice Assistant Button */}
                  <button
                    onClick={() => setIsVoiceAssistantOpen(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Voice Assistant"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    {/* Bell Icon with badge */}
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Panel (responsive) */}
                    {showNotifications && (
                      <>
                        {/* Backdrop for small devices */}
                        <div
                          className="fixed inset-0 bg-black bg-opacity-30 z-40 block lg:hidden"
                          onClick={() => setShowNotifications(false)}
                        />

                        {/* Panel for large screens */}
                        <div
                          className="absolute right-0 mt-2 w-72 sm:w-80 max-w-xs bg-white shadow-xl rounded-lg border border-gray-200 z-50 hidden lg:block"
                          style={{ maxHeight: "70vh", overflowY: "auto" }}
                        >
                          <div className="px-4 py-2 border-b text-gray-800 font-semibold">
                            Notifications
                          </div>
                          {notifications.length === 0 ? (
                            <div className="px-4 py-4 text-sm text-gray-500 text-center">
                              No new notifications
                            </div>
                          ) : (
                            <ul className="divide-y divide-gray-200">
                              {notifications.map((n) => (
                                <li
                                  key={n.id}
                                  className="px-4 py-3 text-sm hover:bg-gray-50 transition cursor-pointer text-gray-700"
                                >
                                  {n.message}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Full screen panel for small devices */}
                        <div className="fixed inset-x-4 top-20 z-50 bg-white rounded-lg shadow-xl border border-gray-200 lg:hidden max-h-[70vh] overflow-y-auto">
                          <div className="px-4 py-3 border-b font-semibold text-gray-800 flex justify-between items-center">
                            <span>Notifications</span>
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {notifications.length === 0 ? (
                            <div className="px-4 py-4 text-sm text-gray-500 text-center">
                              No new notifications
                            </div>
                          ) : (
                            <ul className="divide-y divide-gray-200">
                              {notifications.map((n) => (
                                <li
                                  key={n.id}
                                  className="px-4 py-3 text-sm hover:bg-gray-50 transition cursor-pointer text-gray-700"
                                >
                                  {n.message}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthAction("login")}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthAction("signup")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition text-sm"
                  >
                    Get Started
                  </button>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === item.id
                      ? "bg-purple-50 text-purple-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Voice Assistant Component */}
      <VoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />
    </>
  );
};