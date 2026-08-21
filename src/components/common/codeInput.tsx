import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./button";
export const CodeInput: React.FC<{
  size: number;
  submit: (code: string) => Promise<()=>void>;
  normal?: boolean;
  button:string
}> = ({ size, submit,normal,button }) => {
  const [state, setState] = useState<{ values: { [key: string]: string } }>({
    values: {},
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const clearAll = () => {
    setState({ values: {} });
    document.getElementById(`inputter-0`)?.focus();
  };
  return (
    <>
      {errorMessage && <div className="my-2 text-red-600">{errorMessage}</div>}
      <div>
      {new Array(size).fill(0).map((_, idx) => (
        <input
          className=" border border-solid py-3 w-10 pl-3 rounded-md border-x-gray-200 mx-2 outline-none mb-4"
          key={idx}
          value={state.values[idx] || ""}
          id={`inputter-${idx}`}
          maxLength={1}
          onChange={(e) => {
            if (e.currentTarget.value) {
              e.currentTarget.value = e.currentTarget.value.toUpperCase();
              let newVal = e.currentTarget.value;
              setState((prev) => {
                prev.values[idx] = newVal;
                return {
                  values: prev.values,
                };
              });
              if (idx < size - 1) {
                document.getElementById(`inputter-${idx + 1}`)?.focus();
              } else {
                setLoading(true);
                let code = "";
                Object.values(state.values).forEach((a) => (code += a));
                code += e.currentTarget.value;
                submit(code)
                  .then((res) => {res()})
                  .catch((error) => {
                    clearAll();
                    setLoading(false);
                    setErrorMessage(error);
                  });
              }
            }else {
                setState((prev) => {
                    prev.values[idx] = "";
                    return {
                      values: prev.values,
                    };
                  });
            }
          }}
        />
      ))}
      </div>
      <Button
        loading={loading}
        disabled={true}
        formButton={true}
      >
        {button}
      </Button>
    </>
  );
};
