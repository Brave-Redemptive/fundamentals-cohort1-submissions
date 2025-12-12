import { Send } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
      <div className="flex items-center gap-4">
        <Send className="w-12 h-12" />
        <div>
          <h1 className="text-4xl font-bold">WaveCom Notification Dashboard</h1>
          <p className="text-xl opacity-90">
            Real-time Transactional Notification System
          </p>
        </div>
      </div>
    </div>
  );
}
