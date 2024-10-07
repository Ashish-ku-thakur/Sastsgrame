import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export let USER_API = "https://sastsgrame.onrender.com/api/v1/user";
export let POST_API = "https://sastsgrame.onrender.com/api/v1/post";
export let COMMENT_API = "https://sastsgrame.onrender.com/api/v1/comment";
export let MESSAGE_API = "https://sastsgrame.onrender.com/api/v1/message";
export let BACKEND_PORT = "https://sastsgrame.onrender.com";
