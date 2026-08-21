import axios from "axios";

const isLocalFrontend =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const defaultApiUrl = isLocalFrontend
  ? "http://localhost:3001/market"
  : "http://13.247.42.215:3000/market";

export const apiCall = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultApiUrl,
});
