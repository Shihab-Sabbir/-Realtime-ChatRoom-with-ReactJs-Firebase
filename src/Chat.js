import React, { useState, useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { MoreVert, AddPhotoAlternate } from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MicIcon from "@material-ui/icons/Mic";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import "./Chat.css";
import { useParams, useHistory, useLocation } from "react-router-dom";
import db, { auth } from "./firebase";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
function Chat() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [state] = useState(location.state ? location.state : {});
  const history = useHistory();
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  const deleteRoom = async () => {
    if (window.navigator.onLine) {
      setOpenMenu(false);
      setDeleting(true);
      try {
        const room = db.collection("rooms").doc(roomId);
        const fetchedMessages = await room.collection("messages").get();
        var usersChats = [];
        if (state.userID) {
          usersChats = [state.userID, user.uid];
        } else {
          usersChats = [
            ...new Set(fetchedMessages.docs.map((cur) => cur.data().uid)),
          ];
        }
        await Promise.all([
          ...fetchedMessages.docs.map((doc) => doc.ref.delete()),
          ...usersChats.map((userChat) =>
            db
              .collection("users")
              .doc(userChat)
              .collection("chats")
              .doc(roomId)
              .delete()
          ),
          room.delete(),
        ]);
        history.replace("/chats");
      } catch (e) {
        console.log(e.message);
        history.replace("/chats");
      }
    } else {
      alert("No access to internet !!!");
    }
    window.location.reload(true);
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3 className="chat-room-name">{roomName}</h3>
          <p className="chat-room-last-seen">
            Last seen at{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat_headerRight">
          <div>
            <IconButton
              aria-controls="menu"
              aria-haspopup="true"
              onClick={(event) => setOpenMenu(event.currentTarget)}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={openMenu}
              id={"menu"}
              open={Boolean(openMenu)}
              onClose={() => setOpenMenu(null)}
              keepMounted
            >
              <MenuItem onClick={deleteRoom}>Delete Room</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name == user.displayName && "chat_receiver"
            }`}
          >
            {" "}
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestemp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send a Message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
