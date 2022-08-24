import { io } from "socket.io-client";
import { COLORS, SIZES, FONTS } from "./theme";
import images from "./images";

const apiUrl = "http://192.168.2.103:5000/api";
const serverUrl = "http://192.168.2.103:3000";
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
  serverUrl,
};
