import { io } from "socket.io-client";
import { COLORS, SIZES, FONTS } from "./theme";
import images from "./images";

const apiUrl = "http://172.20.10.4:5000/api";
const serverUrl = "http://172.20.10.4:3000";
const socket = io(serverUrl);

const LOCAL_STORAGE_TOKEN_NAME = "instagram-token";

export {
  COLORS,
  SIZES,
  FONTS,
  images,
  LOCAL_STORAGE_TOKEN_NAME,
  apiUrl,
  socket,
};
