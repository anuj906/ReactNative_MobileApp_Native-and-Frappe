import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import styled from "styled-components/native";
import { Layout, Text, Button } from "@ui-kitten/components";
import { AuthContext } from "../provider/auth";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import uploadFile from "../utils/fileUploader";
import { useFrappe } from "../provider/backend";
import { CircularProgressBar } from "@ui-kitten/components";

import { BASE_URI } from "../data/constants";

const LogoutButton = styled(Button)`
  border-radius: 6px;
`;

const ProfileImage = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 9999px;
`;

export const DetailsScreen = () => {
  const { isAuthenticated, setAuthenticated, userInfo, fetchUserInfo } =
    useContext(AuthContext);
  const { db } = useFrappe();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleLogout = async () => {
    try {
      // Perform a GET request to logout
      const logoutResponse = await fetch(`${BASE_URI}/api/method/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!logoutResponse.ok) {
        throw new Error("Logout failed");
      }

      // Set isAuthenticated to false in the local state
      setAuthenticated(false);

      // Additional logic to navigate or perform actions after logout if needed
    } catch (error) {
      // Handle errors during logout
      console.error("Logout failed:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Layout style={{ marginVertical: 20, position: "relative" }}>
          <ProfileImage
            source={{
              uri: userInfo?.user_image,
            }}
            contentFit="cover"
          />

          {loading && (
            <CircularProgressBar
              style={{
                position: "absolute",
                top: 30,
                left: 30,
                backgroundColor: "white",
              }}
              progress={uploadProgress}
            />
          )}
        </Layout>

        <Button
          appearance="ghost"
          onPress={async () => {
            // Implement change profile pic
            // Let the user pick an image from the gallery
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

            if (!result.canceled) {
              try {
                setLoading(true);
                await uploadFile(
                  result.assets[0].uri,
                  result.assets[0].uri.split("/").pop(),
                  result.assets[0].type,
                  {
                    onUploadProgress: (progressEvent) => {
                      let progress =
                        (progressEvent.loaded / progressEvent.total) * 100;
                      setUploadProgress(progress);
                    },
                    onUploadComplete: async (data) => {
                      const fileUrl = data.message.file_url;

                      // Update user image
                      await db.updateDoc("User", userInfo.email, {
                        user_image: fileUrl,
                      });

                      // Fetch updated user information
                      await fetchUserInfo();

                      setLoading(false);
                    },
                    isPrivate: false,
                    doctype: "User",
                    docname: userInfo.email,
                    fieldname: "user_image",
                  }
                );
              } catch (error) {
                console.log(error);
                setLoading(false);
              }
            }
          }}
        >
          Change Profile Pic
        </Button>

        <Layout style={{ marginVertical: 20 }}></Layout>

        <Text category="h4">
          {isAuthenticated ? userInfo?.name : "Not Logged In"}
        </Text>
        <Text>{isAuthenticated ? `@${userInfo?.username}` : ""}</Text>

        {isAuthenticated && (
          <LogoutButton onPress={handleLogout}>Logout</LogoutButton>
        )}
      </Layout>
    </SafeAreaView>
  );
};
