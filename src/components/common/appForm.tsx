import React, { useEffect, useState } from "react";
import { AppInput } from "./appInput";
import Class from "better-classnames";
import { FaCheckCircle } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
import { Validation } from "../../util/formValidation";
import { Button } from "./button";
import classnames from "better-classnames";
import { FloatLabel } from "./floatLabel";

interface AppFormProps {
  names: FormItem[];
  inline: boolean;
  title?: string;
  onSubmit(fields: { [key: string]: FormItem }): void;
  onDelete?(fields: { [key: string]: FormItem }): void;
  submit: string;
  delete?: string;
  submitClass?: string;
  className?: string;
  submitLoading?: boolean;
}
export interface FormItem {
  value: string;
  validation?: Validation;
  label?: string;
  mandatory: boolean;
  hardLabel?: string;
  errorMessage?: string;
  type: string;
  min?: number;
  max?: number;
  name: string;
  checkboxComp?: JSX.Element;
  submitOnEnter?: boolean;
}


export const AppForm: React.FC<AppFormProps> = (props) => {
  const [state, setState] = useState<{
    fields: { [key: string]: FormItem };
    errorMessage: string;
  }>({ fields: {}, errorMessage: "" });

  const [focusedPass, setFocusedPass] = useState(false);

  const [inline, setInline] = useState(false);

  const [title, setTitle] = useState("");

  useEffect(() => {
    var fields: { [key: string]: FormItem } = {};
    props.names.map((item, key) => {
      let field = {
        value: item.value != undefined ? item.value : "",
        validation: item.validation || Validation.VALID,
        label: item.label,
        mandatory: item.mandatory,
        type: item.type,
        min: item.min,
        max: item.max,
        name: item.name,
        hardLabel: item.hardLabel,
        checkboxComp: item.checkboxComp,
        submitOnEnter: item.submitOnEnter,
      };
      fields[item.name] = field;
    });
    setState({ ...state, fields: fields });
    setInline(props.inline);
    props.title && setTitle(props.title);
  }, []);

  function handleChange(target: string, value: string) {
    let newState = { ...state, errorMessage: "" };
    newState.fields[target].value = value;
    newState.fields[target].validation = Validation.VALID;
    setState(newState);
  }

  function handleSubmit(after: (fields: { [key: string]: FormItem }) => void) {
    var hasError = false;
    let fields = state.fields;
    var errorMessage = "";
    Object.keys(fields).map((element) => {
      if (
        (fields[element].value == "" && fields[element].mandatory) ||
        fields[element].validation === "invalid"
      ) {
        fields[element].validation = Validation.INVALID;
        hasError = true;
        errorMessage = "Please Fill In All Inputs";
      } else if (
        fields[element].type === "email" &&
        !validEmail(fields[element].value)
      ) {
        fields[element].validation = Validation.INVALID;
        fields[element].errorMessage = "invalid email format";
        hasError = true;
      } else if (
        fields[element].name === "password" &&
        !validPassword(fields[element].value)
      ) {
        fields[element].validation = Validation.INVALID;
        hasError = true;
        fields[element].errorMessage = "invalid password format ";
      } else if (
        fields[element].name === "cpassword" &&
        fields[element].value !== fields["password"].value
      ) {
        fields[element].validation = Validation.INVALID;
        hasError = true;
        fields[element].errorMessage = "passwords must match";
      }
    });
    setState({ ...state, fields: fields });

    if (!hasError) {
      after(state.fields);
    } else {
      setState({ ...state, errorMessage: errorMessage });
    }
  }
  function validPassword(pass: string) {
    return (
      pass.length > 7 &&
      hasSpecial(pass) &&
      hasUpper(pass) &&
      hasLower(pass) &&
      hasNumber(pass)
    );
  }
  function validEmail(email: string) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    );
  }

  function handleDelete(
    onDelete: (fields: { [key: string]: FormItem }) => void
  ) {
    onDelete(state.fields);
  }

  function hasSpecial(pass: string) {
    return /[*@$!#%&()^~{}\-]+/.test(pass);
  }
  function hasUpper(pass: string) {
    return /[A-Z]+/.test(pass);
  }
  function hasLower(pass: string) {
    return /[a-z]+/.test(pass);
  }
  function hasNumber(pass: string) {
    return /[0-9]+/.test(pass);
  }

  return (
    <div className={props.className} key={props.title}>
      <div className="text-red-700 mb-1">{state.errorMessage}</div>
      <div className="mb-2 ml-2 font-bold main-text nice-font text-center green tracking-widest">
        {title}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {Object.keys(state.fields).map((element) => (
          <>
            {state.fields[element].name === "password" && (
              <div
                className={`${focusedPass ? "block" : "hidden"}`}
                style={{ marginBottom: "20px", textAlign: "left" }}
                key="pass-checker"
              >
                {hasUpper(state.fields.password.value) ? (
                  <span style={{ color: "green" }}>
                    <FaCheckCircle className="inline mr-2" />
                  </span>
                ) : (
                  <FaWindowClose className="inline mr-2" />
                )}{" "}
                At least one upper case letter<br></br>
                {hasLower(state.fields.password.value) ? (
                  <span style={{ color: "green" }}>
                    <FaCheckCircle className="inline mr-2" />
                  </span>
                ) : (
                  <FaWindowClose className="inline mr-2" />
                )}{" "}
                At least one lower case letter <br></br>
                {hasNumber(state.fields.password.value) ? (
                  <span style={{ color: "green" }}>
                    <FaCheckCircle className="inline mr-2" />
                  </span>
                ) : (
                  <FaWindowClose className="inline mr-2" />
                )}{" "}
                At least one number <br></br>
                {hasSpecial(state.fields.password.value) ? (
                  <span style={{ color: "green" }}>
                    <FaCheckCircle className="inline mr-2" />
                  </span>
                ) : (
                  <FaWindowClose className="inline mr-2" />
                )}{" "}
                At least one special character <br></br>
                {state.fields.password.value.length > 7 ? (
                  <span style={{ color: "green" }}>
                    <FaCheckCircle className="inline mr-2" />
                  </span>
                ) : (
                  <FaWindowClose className="inline mr-2" />
                )}
                {"   "}
                At least 8 characters
              </div>
            )}
            {state.fields[element].type === "checkbox" ? (
              <div className="text-left">
                {state.fields[element].validation === "invalid" && (
                  <p className="text-red-800 text-sm">
                    Please Agree to terms and conditions
                  </p>
                )}

                <input
                  type="checkbox"
                  className="cursor-pinter mr-2"
                  id={element}
                  name={element}
                  onChange={(event) =>
                    handleChange(
                      event.target.name,
                      event.target.checked ? "checked" : ""
                    )
                  }
                />
                {state.fields[element].checkboxComp}
              </div>
            ) : state.fields[element].type === "textarea" ? (
              <textarea
                className={classnames(
                  "border-solid text-black border-2 rounded-lg p-2 text-sm outline-none w-full",
                  {
                    "border-red-500":
                      state.fields[element].validation === "invalid",
                    "border-gray-100": "_DEFAULT_",
                  },
                  props.className
                )}
                value={state.fields[element].value || ""}
                name={element}
                placeholder={state.fields[element].label || ""}
                onChange={(event) =>
                  handleChange(
                    event.currentTarget.name,
                    event.currentTarget.value
                  )
                }
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  state.fields[element].submitOnEnter &&
                  handleSubmit((fields: { [key: string]: FormItem }) =>
                    props.onSubmit(fields)
                  )
                }
              />
            ) : (
              <FloatLabel label={state.fields[element].label || ""}>
                <AppInput
                  label={""}
                  value={state.fields[element].value}
                  type={state.fields[element].type}
                  name={element}
                  invalid={state.fields[element].validation === "invalid"}
                  onChange={(event) =>
                    handleChange(event.target.name, event.target.value)
                  }
                  key={element}
                  inline={inline}
                  min={state.fields[element].min}
                  max={state.fields[element].max}
                  hardLabel={state.fields[element].hardLabel}
                  onFocus={() =>
                    state.fields[element].name === "password" &&
                    setFocusedPass(true)
                  }
                  onBlur={() =>
                    state.fields[element].name === "password" &&
                    setFocusedPass(false)
                  }
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    state.fields[element].submitOnEnter &&
                    handleSubmit((fields: { [key: string]: FormItem }) =>
                      props.onSubmit(fields)
                    )
                  }
                  errorMessage={state.fields[element].errorMessage}
                />
              </FloatLabel>
            )}
          </>
        ))}
      </form>
      <div className="outline-none nice-font">
        <Button
          formButton={true}
          loading={props.submitLoading}
          className={props.submitClass}
          onClick={() =>
            handleSubmit((fields: { [key: string]: FormItem }) =>
              props.onSubmit(fields)
            )
          }
        >
          {props.submit}
        </Button>
      </div>
    </div>
  );
};
