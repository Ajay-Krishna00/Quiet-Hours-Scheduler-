"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import ScheduleCard from "./ScheduleCard";

export default function ScheduleList() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();

    // Subscribe to changes (INSERT, UPDATE, DELETE)
    const channel = supabase
      .channel("quiet_hours_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quiet_hours" },
        (payload) => {
          console.log("Realtime change:", payload);
          fetchSchedules(); // Refresh list on any DB change
        },
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchSchedules() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSchedules([]);
        return;
      }

      const { data, error } = await supabase
        .from("quiet_hours")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });

      if (error) throw error;

      setSchedules(data || []);
    } catch (error: any) {
      console.error("Error fetching schedules:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSchedule(id: string | number) {
    try {
      const { error } = await supabase
        .from("quiet_hours")
        .delete()
        .eq("id", String(id)); // convert to string
      if (error) throw error;
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("Error deleting schedule:", error.message);
    }
  }

  if (loading) return <div>Loading schedules...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">
        Your Quiet Hours ({schedules.length})
      </h3>
      {schedules.length === 0 ? (
        <p className="text-gray-600">
          No quiet hours scheduled yet. Create your first one above!
        </p>
      ) : (
        schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onDelete={deleteSchedule}
            isUpcoming={new Date(schedule.start_time) > new Date()}
          />
        ))
      )}
    </div>
  );
}
