import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function DateSelector({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: string;
  setSelectedDate: (value: string) => void;
}) {
  const selected = new Date(selectedDate);

  return (
    <div className="space-y-2">
      <label htmlFor="date" className="text-sm text-white/80 font-medium">
        Select a date
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal text-white bg-white/5 border border-slate-700 hover:bg-white/10"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-white/80" />
            {selectedDate ? (
              format(selected, "PPP") // e.g. Aug 9, 2025
            ) : (
              <span className="text-white/50">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-800 text-white">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) setSelectedDate(date.toISOString().slice(0, 10));
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <p className="text-xs text-gray-400">
        Choose the day you’d like to play.
      </p>
    </div>
  );
}
