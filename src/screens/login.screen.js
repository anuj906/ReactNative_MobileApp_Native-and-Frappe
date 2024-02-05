import React, { useContext, useState } from "react";
import { AuthContext } from "../provider/auth";
import { Layout, Button, Input } from "@ui-kitten/components";
import { BASE_URI } from "../data/constants";
import Toast from "react-native-toast-message";
import { DetailsScreen } from "./details.screen";

const LoginScreen = () => {
  const { isAuthenticated, setAuthenticated } = useContext(AuthContext);
  const loginUrl = `${BASE_URI}/api/method/login`;

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

  return (
    <>
     <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 16 }}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ marginBottom: 16 }}
      />
      <Button onPress={handleLogin} style={{ marginBottom: 16 }}>
        Login
      </Button>
    </Layout>
    {/* <DetailsScreen  username={username}/> */}
    </>
   
    
  );
};

export default LoginScreen;
