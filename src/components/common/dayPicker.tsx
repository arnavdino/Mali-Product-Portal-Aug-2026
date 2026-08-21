import React from "react";
import { newCharIsNum } from "../../util/generalActions";
import { AppInput } from "./appInput";

interface DayPickerProps {
    day: string,
    setDay(day: string): void
}

export const DayPicker: React.FC<DayPickerProps> = ({day,setDay}) =>{
    return       <AppInput
    invalid={false}
    label=""
    maxLength={10}
    value={day}
    className="my-2"
    placeholder="YYYY-MM-DD"
    onChange={(e) => {
      if (newCharIsNum(day, e.currentTarget.value)) {
        if (
          e.currentTarget.value.length > 4 &&
          !e.currentTarget.value.includes("-")
        ) {
          e.currentTarget.value = [
            e.currentTarget.value.slice(0, 4),
            "-",
            e.currentTarget.value.slice(4),
          ].join("");
        }
        if (
          e.currentTarget.value.length > 7 &&
          e.currentTarget.value.lastIndexOf("-") == 4
        ) {
          e.currentTarget.value = [
            e.currentTarget.value.slice(0, 7),
            "-",
            e.currentTarget.value.slice(7),
          ].join("");
        }
        if (
          e.currentTarget.value[e.currentTarget.value.length - 1] === "-"
        ) {
          e.currentTarget.value = e.currentTarget.value.slice(
            0,
            e.currentTarget.value.length - 1
          );
        }
        setDay(e.currentTarget.value);
      }
    }}
  />
}