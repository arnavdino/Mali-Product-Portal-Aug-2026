import React from "react";
import { newCharIsNum } from "../../util/generalActions";
import { AppInput } from "./appInput";

interface TimePickerProps {
  time: string;
  setTime(time: string): void;
}
export const TimePicker: React.FC<TimePickerProps> = ({ time, setTime }) => {
  return (
    <AppInput
      invalid={false}
      label=""
      maxLength={5}
      value={time}
      placeholder="HH:mm"
      onChange={(e) => {
        if (newCharIsNum(time, e.currentTarget.value)) {
          if (
            e.currentTarget.value.length > 2 &&
            !e.currentTarget.value.includes(":")
          ) {
            e.currentTarget.value = [
              e.currentTarget.value.slice(0, 2),
              ":",
              e.currentTarget.value.slice(2),
            ].join("");
          }
          if (e.currentTarget.value[e.currentTarget.value.length - 1] === ":") {
            e.currentTarget.value = e.currentTarget.value.slice(
              0,
              e.currentTarget.value.length - 1
            );
          }
          setTime(e.currentTarget.value);
        }
      }}
    />
  );
};
