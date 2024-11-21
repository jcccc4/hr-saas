// calendar.tsx
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CalendarProps = {
  className?: string;
}

type CalendarState = {
  startDate: Date | null;
  endDate: Date | null;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function page({ className }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<CalendarState>({ startDate: null, endDate: null });
  const today = new Date();

  const previousMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));


  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));




  const isToday = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    console.log(selectedDate)
    if (!selectedDate.startDate) {
      setSelectedDate({ startDate: newDate, endDate: null });
    }
    else if (selectedDate.startDate) {

      console.log(selectedDate.startDate)
      console.log(selectedDate.startDate.getMilliseconds() + " === " + newDate.getMilliseconds())

      if (newDate > selectedDate.startDate) {

        setSelectedDate({ ...selectedDate, endDate: newDate })
      }
      else if (newDate <= selectedDate.startDate) {
        console.log("test2")
        setSelectedDate({ startDate: null, endDate: null })
      }
    }

  };
  const isDateBetweenSelected = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return (selectedDate.startDate && date > selectedDate.startDate) && (selectedDate.endDate && date < selectedDate.endDate);
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return (selectedDate.startDate && date.getDate() === selectedDate.startDate.getDate()) || (selectedDate.endDate && date.getDate() === selectedDate.endDate.getDate());
  };

  return (
    <div className="h-[600px] w-full p-4 flex flex-col">
      <div className="flex items-center h-10 justify-between mb-4 ">
        <h2 className="text-2xl font-bold">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex w-full justify-between">{days.map((day) => (
        <div key={day} className="text-center h-10  w-full p-2 font-semibold bg-muted">
          {day}
        </div>
      ))}</div>

      <div className="grid grid-cols-7 flex-grow">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} className="p-2" />)}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;

          return (
            <div className="relative" key={day} >
              <div className={`absolute inset-0 rounded-none 
                   ${selectedDate?.startDate && selectedDate?.endDate?.getDate() === day ? 'rounded-r-lg' : ''}
                   ${selectedDate?.endDate && selectedDate?.startDate?.getDate() === day ? 'rounded-l-lg' : ''}

                   z-0`}>
              </div>
              <Button
                variant={isDateSelected(day) ? "default" : isDateBetweenSelected(day) ? "secondary" : "ghost"}
                className={`relative z-20 flex items-start justify-end p-2 
                h-full w-full rounded-md 
                ${day < today.getDate() ? "pointer-events-none" : ""}
                ${isDateBetweenSelected(day) ? "rounded-none" : ""}
                ${isToday(day) ? "border border-primary rounded-md" : day < today.getDate() ? "text-black/20" : ""}
               `}
                onClick={() => handleDateClick(day)}
              >

                <span className="relative z-10">{day}</span>
              </Button>
            </div>
          );
        })}
      </div>
    </div >
  );
}
