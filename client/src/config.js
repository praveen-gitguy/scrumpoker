import axios from "axios";
import socketIO from 'socket.io-client';

const baseURL = "http://localhost:3001"

export const axiosInstance = axios.create({ baseURL });

export const socket = socketIO.connect('http://localhost:3001');