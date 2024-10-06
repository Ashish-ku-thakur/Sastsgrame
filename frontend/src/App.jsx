import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./auth/MainPage";
import Signup from "./auth/Signup";
import Profile from "./center/Profile";
import CenterPosts from "./center/CenterPosts";
import MessagePage from "./center/MessagePage";
import EditProfile from "./center/EditProfile";
import { useEffect } from "react";
import { BACKEND_PORT } from "./lib/utils";
import { setOnlineUsers } from "./redux/userSlicer";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setSocket } from "./redux/chatSlicer";

function App() {
  let appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      children: [
        {
          path: "/",
          element: <CenterPosts />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/edit/profile",
          element: <EditProfile />,
        },
        {
          path: "/message",
          element: <MessagePage />,
        },
      ],
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  let { authUser, onlineUsers } = useSelector((state) => state.auth);
  let { socket } = useSelector((state) => state.chat);
  let dispatch = useDispatch();

  useEffect(() => {
    // Socket will only initialize if `authUser` exists and there is no active socket
    if (authUser) {
      let socketio = io(BACKEND_PORT, {
        query: {
          userId: authUser._id,
        },
        transports: ["websocket"],
      });

      socketio.on("getonlineusers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      // Save the socket instance in redux store
      dispatch(setSocket(socketio));

      // Cleanup function when the component unmounts or authUser changes
      return () => {
        socketio.close();
        dispatch(setSocket(null)); // Clear the socket from redux on unmount
      };
    } else {
      if (socket) {
        socket?.close(); // Close existing socket connection
        dispatch(setSocket(null)); // Reset socket in redux
        dispatch(setOnlineUsers(onlineUsers.filter((elm)=>elm!=authUser?._id)));
      }
    }
  }, [authUser?._id,setOnlineUsers, dispatch]);

  return <RouterProvider router={appRouter} />;
}

export default App;
