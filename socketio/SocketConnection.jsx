import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers } from "../redux/chatSlice";
import { setLikeNotify } from "../redux/rtmLikeSlice";
import {
  setSocketConnectionStatus,
  setConnectionId,
} from "../redux/soketSlice";

const SocketConnection = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const socketio = io("https://instagram-olwk.onrender.com", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      socketRef.current = socketio;

      dispatch(setSocketConnectionStatus(true));
      dispatch(setConnectionId(user?._id));

      socketio.on("getOnlineUser", (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotify(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocketConnectionStatus(false));
        dispatch(setConnectionId(null));
        socketRef.current = null;
      };
    } else if (socketRef.current) {
      socketRef.current.close();
      dispatch(setSocketConnectionStatus(false));
      dispatch(setConnectionId(null));
      socketRef.current = null;
    }
  }, [user, dispatch]);

  return null;
};

export default SocketConnection;
