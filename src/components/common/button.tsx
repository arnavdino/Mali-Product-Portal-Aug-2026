import React, { forwardRef, Ref } from "react";
import Class from "better-classnames";
import { AppSpinner } from "./appSpinner";
import { Link } from "react-router-dom";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  loading?: boolean;
  size?: "lg" | "m" | "sm" | "xs";
  type?: "button" | "submit" | "reset";
  href?: string;
  internal?: boolean;
  ariaLabel?: string;
  startIcon?: object;
  endIcon?: object;
  disabled?: boolean;
  formButton?: boolean;
  deleteButton?: boolean;
  style?: any
}
interface ContainerProps extends React.ComponentPropsWithoutRef<any> {
  internal: string;
  href: string;
}
/**
 * Container to switch to anchor or button
 */
const Container = forwardRef((props: ContainerProps, ref: Ref<any>) =>
  props.href ? (
    <Link to={props.href} {...props} ref={ref}>
      {props.children}
    </Link>
  ) : (
    <button {...props} ref={ref}>
      {props.children}
    </button>
  )
);

/**
 * Common button component
 */
export const Button = forwardRef(
  (
    {
      id = "",
      className = "",
      onClick = () => {},
      loading = false,
      disabled = false,
      size = "m",
      href = "",
      internal = false,
      ariaLabel = "",
      children,
      startIcon = null as any,
      endIcon = null as any,
      type = "button",
      formButton,
      deleteButton,
      style
    }: ButtonProps,
    ref: Ref<any>
  ) => {
    return (
      <Container
        id={id}
        style={style}
        ref={ref}
        className={`${
          className
            ? className
            : formButton
            ? "tracking-wide mt-2 mb-2 rounded-md py-1 font-bold text-black sm:text-base text-sm outline-none sm:w-72 w-64 secondary-bg"
            : deleteButton
            ? "delete-button"
            : "py-1 px-3 font-bold w-full rounded-md outline-none main bg-green"
        } relative `}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (!loading) {
            onClick(e);
          }
        }}
        size={size}
        href={href}
        internal={internal ? "true" : "false"}
        disabled={disabled}
        type={type}
        role={href && internal ? "link" : "button"}
        aria-disabled={disabled}
        aria-busy={loading}
        aria-label={ariaLabel || children}
      >
        <div className="flex flex-row justify-center relative">
          {loading ? (
            <AppSpinner loading={loading} color="light" size={20} />
          ) : (
            <>
              <div className="my-auto text-center">{children}</div>
            </>
          )}
        </div>
      </Container>
    );
  }
);
