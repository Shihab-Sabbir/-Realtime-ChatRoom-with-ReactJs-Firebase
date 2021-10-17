import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import SidebarChat from "./SidebarChat";
import db, { auth } from "./firebase";
function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user?.photoURL} />
        <h4>{user?.displayName} </h4>
      </div>
      <div className="sidebar_logout">
        <button onClick={() => auth.signOut()}>Log Out</button>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
      <div></div>
    </div>
  );
}

export default Sidebar;
