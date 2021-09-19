import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../UtilsFirebase/Authentication";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import {
  Button,
  InputGroupText
} from "shards-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) history.replace("/");
  }, [user, loading]);
  return (
    <div className="login-content">
      <div className="login-input-box">
        <input
          type="text"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div>
        <Button
          className="login-btn"
          onClick={() => signInWithEmailAndPassword(email, password)}
        >
          Login
        </Button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        </div>
        <div className="plain-text">
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Login;