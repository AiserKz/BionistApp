import type { PlateData } from "../types/types";
import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000";
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Балансит";

export const generateFood = async (user_text: string) => {
  const res = await axios.post(
    `${BASE_URL}/food/generate`,
    { user_text },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const log = res.status === 200 ? res.data : res;
  console.log(log);
  return (res?.data as PlateData) || null;
};
