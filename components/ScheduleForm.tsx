"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Plus, X, Calendar, Clock, FileText } from "lucide-react";

export default function ScheduleForm() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    if (!title || !startTime || !endTime) return;

    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("quiet_hours").insert([
        {
          user_id: user.id,
          title,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          description,
        },
      ]);

      if (error) throw error;

      setMessage("Quiet hour scheduled successfully!");
      setTitle("");
      setStartTime("");
      setEndTime("");
      setDescription("");
      setShowForm(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  // Collapsed state - show add button
  if (!showForm) {
    return (
      <div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full group bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-8 transition-all duration-200"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-full flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Schedule New Quiet Hours
              </h3>
              <p className="text-sm text-gray-500">
                Create a focused study session
              </p>
            </div>
          </div>
        </button>
      </div>
    );
  }

  // Expanded form state
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Form Header */}
      <div
        className="p-6 border-b border-gray-100"
        style={{ background: "linear-gradient(to right, #f0f9ff, #faf5ff)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                New Quiet Hours
              </h3>
              <p className="text-sm text-gray-500">
                Schedule your focused time
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Success/Error Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.includes("successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Title Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            Session Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Math study, Reading time, Deep work..."
          />
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
            rows={3}
            placeholder="What will you be working on during this quiet time?"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !title || !startTime || !endTime}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Scheduling...
              </div>
            ) : (
              "Schedule Session"
            )}
          </button>

          <button
            onClick={() => setShowForm(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
