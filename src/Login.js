import { Button } from "@material-ui/core";
import React from "react";
import "./Login.css";
import { auth, provider } from "./firebase";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt=""
        />
        <div className="login_text">
          <h1>Sign in to Whatsapp</h1>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign in With Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
