import React, { useContext, useState } from "react";
import { AuthContext } from "../provider/auth";
import { Layout, Button, Input, Text } from "@ui-kitten/components";
import { BASE_URI } from "../data/constants";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const { isAuthenticated, setAuthenticated } = useContext(AuthContext);
  const loginUrl = `${BASE_URI}/api/method/login`;
  const resetPasswordUrl = `${BASE_URI}/api/reset-password`;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const showToast = (type, text1, text2 = null) => {
    Toast.show({
      type,
      text1,
      text2,
      visibilityTime: 3000,
    });
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showToast("error", "Username and password cannot be empty");
      return;
    }

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          usr: username,
          pwd: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      setAuthenticated(true);
      showToast("success", "Login Successful", `Welcome, ${username}!`);
    } catch (error) {
      console.error("Login failed:", error);
      showToast("error", "Login Failed", "There was an issue with login");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(resetPasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username,
          newPassword: generateRandomPassword(), // You may need to implement a function to generate a random password
        }),
      });

      if (!response.ok) {
        throw new Error("Password reset failed");
      }

      const data = await response.json();
      console.log("Password reset successful:", data);
      showToast(
        "success",
        "Password Reset Successful",
        "Check your email for further instructions"
      );
    } catch (error) {
      console.error("Password reset failed:", error);
      showToast(
        "error",
        "Password Reset Failed",
        "There was an issue with resetting your password"
      );
    }
  };
  
  const generateRandomPassword = () => {

    return "newPassword123"; 
  };

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text category="h1" style={{ marginBottom: 24 }}>
        Welcome Back!
      </Text>
      <Text category="label" style={{ marginBottom: 8 }}>
        Please enter your username and password:
      </Text>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 16 }}
        autoFocus
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ marginBottom: 24 }}
      />
      <Button
        onPress={handleLogin}
        style={{ marginBottom: 16, width: "100%", backgroundColor: "black" }}
        textStyle={{ color: "white" }}
      >
        Login
      </Button>
      <Text
        appearance="hint"
        onPress={handleForgotPassword}
        style={{ textDecorationLine: "underline" }}
      >
        Forgot Password?
      </Text>
    </Layout>
  );
};

export default LoginScreen;
