import React from "react";
import classnames from "better-classnames";

const invalid = {
  border: "1px solid red",
};
interface AppInputProps extends React.ComponentPropsWithoutRef<"input"> {
  inline?: boolean;
  errorMessage?: string;
  hardLabel?: string;
  invalid: boolean;
  label: string;
}

export const inputClassName =
  "border-solid green bg-main border-2 rounded-md p-2 text-sm outline-none w-full border-green";

export const AppInput: React.FC<AppInputProps> = (props) => {
  return (
    <div
      className={classnames({
        "mb-4 text-left flex flex-col w-full": "_DEFAULT_",
      })}
      key={props.label}
    >
      <span style={{ color: "red" }}> {props.errorMessage}</span>
      <span className="text-gray-600 text-left text-xs mb-2">
        {" "}
        {props.hardLabel}
      </span>
      <input
        id={props.id}
        {...props}
        className={classnames(
          "border-solid green bg-main border-2 rounded-md p-2 text-sm outline-none w-72 border-green",
          { "border-red-500": props.invalid, "border-gray-100": "_DEFAULT_" },
          props.className
        )}
        type={props.type || "text"}
        name={props.name}
        value={props.value || ""}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        placeholder={
          props.placeholder != undefined ? props.placeholder : props.label
        }
        min={props.min}
        max={props.max}
        maxLength={props.maxLength}
        onKeyPress={props.onKeyPress}
      ></input>
    </div>
  );
};
