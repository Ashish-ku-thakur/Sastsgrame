import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export let USER_API = 'http://localhost:8003/api/v1/user'
export let POST_API = 'http://localhost:8003/api/v1/post'
export let COMMENT_API = 'http://localhost:8003/api/v1/comment'
export let MESSAGE_API = 'http://localhost:8003/api/v1/message'
export let BACKEND_PORT = 'http://localhost:8003'
