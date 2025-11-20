import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DatePicker>;

function Calendar({
  className,
  selected,
  onChange,
  ...props
}: CalendarProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      className={cn("p-3", className)}
      calendarClassName="border-0"
      dayClassName={(date) =>
        cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          !selected && "text-muted-foreground",
          selected?.getDate() === date.getDate() &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          selected?.getDate() !== date.getDate() &&
            "hover:bg-accent hover:text-accent-foreground",
          "aria-selected:bg-accent aria-selected:text-accent-foreground"
        )
      }
      weekDayClassName={() => "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"}
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="flex items-center justify-between">
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">
            {date.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
