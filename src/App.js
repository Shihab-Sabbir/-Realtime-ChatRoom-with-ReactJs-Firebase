import "./App.css";
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import db, { auth } from "./firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Loading from "./Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
function App() {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app_body" >
          <Router>
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
              <Route path="/">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
