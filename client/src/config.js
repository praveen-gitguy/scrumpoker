import axios from "axios";
import socketIO from 'socket.io-client';

const baseURL = "https://scrumpoker-zeta.vercel.app"

export const axiosInstance = axios.create({ baseURL });

export const socket = socketIO.connect(baseURL);