import { Calendar, Clock, Trash2, Bell } from "lucide-react";

type ScheduleCardProps = {
  schedule: {
    id: string | number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    description?: string;
  };
  onDelete: (id: string | number) => void;
  isUpcoming: boolean;
};

export default function ScheduleCard({
  schedule,
  onDelete,
  isUpcoming,
}: ScheduleCardProps) {
  const startDate = new Date(schedule.start_time);
  const endDate = new Date(schedule.end_time);
  const duration = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60),
  );

  interface FormatDateTimeOptions {
    weekday?: "short" | "long" | "narrow";
    month?: "short" | "long" | "narrow" | "numeric" | "2-digit";
    day?: "numeric" | "2-digit";
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
    hour12?: boolean;
  }

  const formatDateTime = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    } as FormatDateTimeOptions);
  };

  interface FormatTimeOptions {
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
    hour12?: boolean;
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    } as FormatTimeOptions);
  };

  return (
    <div
      className={`bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all duration-200 group ${
        isUpcoming
          ? "border-l-green-500"
          : "border-l-gray-300 hover:border-l-gray-400"
      }`}
      style={
        isUpcoming
          ? {
              background:
                "linear-gradient(to right, rgba(34, 197, 94, 0.05), white)",
            }
          : {}
      }
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Title and Status */}
            <div className="flex items-center gap-3 mb-3">
              <h4 className="text-lg font-semibold text-gray-900 truncate">
                {schedule.title}
              </h4>
              {isUpcoming && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full shrink-0">
                  <Bell className="w-3 h-3" />
                  Upcoming
                </span>
              )}
            </div>

            {/* Time Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="truncate">{formatDateTime(startDate)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  {formatTime(startDate)} - {formatTime(endDate)}
                  <span className="text-gray-500 ml-2">({duration} min)</span>
                </span>
              </div>
            </div>

            {/* Description */}
            {schedule.description && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {schedule.description}
                </p>
              </div>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(schedule.id)}
            className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="Delete session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
