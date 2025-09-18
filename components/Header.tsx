import { BookOpen, User, LogOut } from "lucide-react";

type HeaderProps = {
  user?: { email?: string };
  onSignOut: () => void;
};

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header
      className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quiet Hours</h1>
              <p className="text-sm text-gray-500">Focus time scheduler</p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user?.email}</span>
            </div>
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
