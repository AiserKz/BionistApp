import type { PlateData } from "../types/types";
import axios from "axios";

export const BASE_URL = "http://localhost:5000";
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
  console.log(res.data);
  return res?.data as PlateData;
};
