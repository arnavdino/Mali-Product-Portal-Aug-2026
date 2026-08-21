import { FaAngleDown } from "react-icons/fa";
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
interface DropDownProps extends React.ComponentPropsWithoutRef<"select"> {
  name: string;
  containerClassName?: string;
  buttonClassName?: string;
  ariaLabel?: string;
  disabled?: boolean;
  options: Option[];
  setSelected(value: string): void;
  label: string;
  id: string;
  defaultOption?: Option;
}

export interface Option {
  label: string;
  value: string;
  preLabel?: JSX.Element;
  subTitle?: string;
}

export const DropDown = forwardRef(
  (
    {
      id = "",
      name = "",
      options = [],
      containerClassName = "",
      buttonClassName,
      setSelected = () => {},
      ariaLabel = "",
      label = "",
      defaultOption,
    }: DropDownProps,
    ref: Ref<HTMLSelectElement>
  ) => {
    const [open, setOpen] = useState(false);
    const [option, setOption] = useState(
      defaultOption ? defaultOption : { label: label, value: "" }
    );
    const [hovered, setHovered] = useState("");
    const optRef = React.useRef(option.label);

    const toggleOpen = useCallback(() => {
      setOpen((open) => !open);
    }, [options]);

    const close = useCallback(() => {
      setOpen(false);
    }, [options]);

    const mouseEnter = (label: string) => {
      setHovered(label);
    };
    const mouseLeave = () => {
      setHovered("");
    };
    const handlekeys = (event: KeyboardEvent) => {
      let labels = options.map((opt) => opt.label);
      if (
        document.activeElement === buttonRef.current &&
        (event.key === "ArrowDown" ||
          event.key === "Escape" ||
          event.key === "ArrowUp")
      ) {
        event.preventDefault();
        if (event.key === "Escape") {
          close();
        }
        let index = labels.indexOf(optRef.current);
        if (event.key == "ArrowUp" && index > 0) {
          optRef.current = labels[index - 1];
          setOption(options[index - 1]);
          setSelected(options[index - 1].value);
          mouseLeave();
        } else if (event.key == "ArrowDown" && index < labels.length - 1) {
          optRef.current = labels[index + 1];
          setOption(options[index + 1]);
          setSelected(options[index + 1].value);
          mouseLeave();
        }
      }
    };
    function handleClickOutside(event: any) {
      if (
        buttonRef != null &&
        buttonRef.current &&
        !(buttonRef.current as any).contains(event.target)
      ) {
        close();
      }
    }
    useEffect(() => {
      document.addEventListener("keydown", handlekeys);
      document.addEventListener("click", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.addEventListener("keydown", handlekeys);
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);
    const buttonRef = useRef(null);

    return (
      <div className={containerClassName}>
        <select
          id={`${id}-select-hidden`}
          name={name}
          ref={ref}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          aria-label={ariaLabel || name}
        >
          {options.map(({ label, value }, idx) => {
            return (
              <option key={idx} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <div className={` relative`}>
          <button
            className={buttonClassName}
            aria-haspopup="listbox"
            aria-labelledby={`${id}-label`}
            aria-owns={`${id}-list`}
            onClick={toggleOpen}
            id={id}
            ref={buttonRef}
          >
            <div className={` text-left flex flex-row`}>
              <span className={`${!option.value && "text-gray-500"}`}>
                {option.preLabel}
                {option.label}{" "}
              </span>{" "}
              <span className="flex flex-col justify-center items-center ml-auto">
                {" "}
                <FaAngleDown />
              </span>
            </div>
          </button>
          <ul
            role="listbox"
            id={`${id}-list`}
            tabIndex={-1}
            className={` z-50 outline-none absolute top-12  text-sm text-black ${
              !open && "hidden"
            } w-full h-64 bg-white border border-solid border-gray-300  overflow-scroll overflow-x-hidden`}
          >
            {options.map((opt, idx) => {
              return (
                <li
                  className={`list-none  cursor-pointer py-2 px-2 font-bold ${
                    option.label === opt.label &&
                    hovered === "" &&
                    "main-bg text-white"
                  } ${hovered === opt.label && "main-bg text-white"}`}
                  id={opt.value}
                  role="option"
                  key={idx}
                  onClick={() => {
                    optRef.current = opt.label;
                    setOption(opt);
                    setSelected(opt.value);
                  }}
                  onMouseEnter={() => mouseEnter(opt.label)}
                  onMouseLeave={mouseLeave}
                >
                  <div className="flex flex-row border border-solid border-gray-300 border-l-0 border-r-0 border-t-0">
                    {opt.preLabel}
                    <div className="flex flex-col">
                      {opt.label}{" "}
                      <span className="font-normal text-xs mt-1 mb-1">
                        {opt.subTitle}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
);
