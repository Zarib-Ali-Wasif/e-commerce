import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const credentials = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    login(credentials);
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
