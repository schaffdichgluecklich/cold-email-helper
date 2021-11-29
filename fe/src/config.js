export const API_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5555/api"
    : "https://yourdomain.tld/api";
