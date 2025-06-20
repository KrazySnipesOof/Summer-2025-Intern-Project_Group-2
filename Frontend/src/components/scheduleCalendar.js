import React from "react";
import { ScheduleMeeting } from "react-schedule-meeting";

export default function ScheduleCalendar({
  availableTimeslots,
  onStartTimeSelect,
  onDaySelect,
  filterTime,
  eventDurationInMinutes = 30,
  selectedStartTime,
  primaryColor = "#1C5141",
}) {
  return (
    <div className="selectdate-field">
      <ScheduleMeeting
        borderRadius={18}
        primaryColor={primaryColor}
        eventDurationInMinutes={eventDurationInMinutes}
        availableTimeslots={availableTimeslots}
        onStartTimeSelect={onStartTimeSelect}
        onSelectedDayChange={onDaySelect}
        startTimeListStyle="grid"
        filterTime={filterTime}
        lang_noFutureTimesText="No future times available"
        selectedStartTime={selectedStartTime}
      />
    </div>
  );
}
