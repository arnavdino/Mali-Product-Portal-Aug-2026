import moment from "moment-timezone";
import { apiCall } from "./api";

export const NOTHING = "NOTHING";
export const daysOfWeak = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function addMinutesToTime(
  startDate: string | moment.Moment,
  minutes: number
) {
  if (typeof startDate == "string") {
    startDate = getMoment(startDate);
  }
  return moment(startDate.toDate()).add("minutes", minutes).format("hh:mm a");
}

export function removeFromArray<Type>(
  arr: { [key in keyof Type]: any }[],
  attr: keyof Type,
  value: any
) {
  var i = arr.length;
  var newArr = [...arr];
  while (i--) {
    if (
      newArr[i] &&
      newArr[i].hasOwnProperty(attr) &&
      arguments.length > 2 &&
      newArr[i][attr] === value
    ) {
      newArr.splice(i, 1);
    }
  }
  return newArr;
}

export function formatDate(date: string) {
  return moment.utc(date).format("DD-MM-YYYY hh:mm a");
}

export function getMoment(date: string) {
  return moment.utc(date);
}

export function removeFromTypeArray<T>(arr: T[], element: T) {
  let arr2 = [...arr];
  for (var i = 0; i < arr2.length; i++) {
    if (arr2[i] === element) {
      arr2.splice(i, 1);
    }
  }
  return arr2;
}

export const publicGet = async <T>(path: string) => {
  const response = await apiCall.get<T>("/public/" + path);
  return await response.data;
};
export const get = async <T>(path: string, token: string | null) => {
  const response = await apiCall.get<T>(path, {
    headers: token ? { authorization: token } : {},
  });
  return await response.data;
};

export const getPromise = async <T>(path: string, token: string) => {
  const response = await apiCall.get<T>(path, {
    headers: token ? { authorization: token } : {},
  });
  return response.data;
};

export const post = async <T>(path: string, body: any, token?: string) => {
  const response = await apiCall.post<T>(path, body, {
    headers: token ? { authorization: token } : {},
  });
  return response;
};
export const deleteRequest = async <T>(path: string, token?: string) => {
  const response = await apiCall.delete<T>(path, {
    headers: token ? { authorization: token } : {},
  });
  return response;
};
export const put = async <T>(path: string, body: any, token: string) => {
  const response = await apiCall.put<T>(path, body, {
    headers: { authorization: token },
  });
  return response.data;
};
export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export const isAuthenticationError = (error: any) => {
  return error.response && error.response.status == "403";
};
export const isBadRequestError = (error: any) => {
  return error.response && error.response.status == "400";
};
export const doOnNotFound = (error: any, callback: () => void) => {
  return error.response && error.response.status == "404" && callback();
};
export const doOnAuthenticationError = (error: any, callback: () => void) => {
  return error.response && error.response.status == "403" && callback();
};
export const doOnBadRequest = (error: any, callback: () => void) => {
  return error.response && error.response.status == "400" && callback();
};

export const doOnServerError = (error: any, callback: () => void) => {
  return (
    ((error.response && error.response.status == "500") || !error.response) &&
    callback()
  );
};

export function getMessageFromError(
  error: any,
  defaultMessage = "Something wrong happened!"
) {
  if (error.response != null && error.response.data != null) {
    if (error.response.data.message != null) {
      return error.response.data.message;
    } else if (error.response.data.errors != null) {
      return error.response.data.errors.join(",");
    }
  }
  return defaultMessage;
}
export const newCharIsNum = (oldValue: string, newValue: string) => {
  let c = newValue[newValue.length - 1];
  return oldValue.length > newValue.length || (c >= "0" && c <= "9");
};
