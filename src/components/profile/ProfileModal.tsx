import React, { useState, useEffect } from "react";
import { X, User, Mail, Settings, Camera, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile, logout } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    learningStyle: "visual",
    difficulty: "beginner",
    weeklyGoal: 5,
    notifications: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        learningStyle: user.preferences?.learningStyle || "visual",
        difficulty: user.preferences?.difficulty || "beginner",
        weeklyGoal: user.progress?.weeklyGoal || 5,
        notifications: user.preferences?.notifications ?? true,
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        preferences: {
          ...(user.preferences || {}),
          learningStyle: formData.learningStyle as
            | "visual"
            | "auditory"
            | "kinesthetic",
          difficulty: formData.difficulty as
            | "beginner"
            | "intermediate"
            | "advanced",
          notifications: formData.notifications,
        },
        progress: {
          ...(user.progress || {}),
          weeklyGoal: formData.weeklyGoal,
        },
      });

      onClose();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 p-4 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-white text-purple-600 p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-gray-50">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{user.fullName}</h2>
              <p className="text-purple-100 text-sm sm:text-base">
                {user.email}
              </p>
              <p className="text-xs sm:text-sm text-purple-200">
                Member since{" "}
                {new Date(user.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-600" />
              Learning Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Style
                </label>
                <select
                  value={formData.learningStyle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      learningStyle: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="visual">Visual</option>
                  <option value="auditory">Auditory</option>
                  <option value="kinesthetic">Kinesthetic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Weekly Goal and Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Goals & Notifications
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Goal (hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={formData.weeklyGoal}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      weeklyGoal: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="notifications"
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notifications: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="notifications"
                  className="ml-2 text-sm text-gray-700"
                >
                  Enable push notifications
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={logout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Sign Out
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
