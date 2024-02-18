import React, { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as MediaLibrary from "expo-media-library";

export const HomeScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isCameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const handleDismissCamera = () => {
    setCameraOpen(false);
  };

  const handleOpenCamera = () => {
    setCameraOpen(true);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    console.log(`Scanned QR Code - Type: ${type}, Data: ${data}`);
    Alert.alert("QR Code Scanned", `Type: ${type}, Data: ${data}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  if (hasCameraPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!isCameraOpen ? (
        <TouchableOpacity
          style={styles.openCameraButton}
          onPress={handleOpenCamera}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.camera}>
          <BarCodeScanner
            style={StyleSheet.absoluteFillObject}
            onBarCodeScanned={handleBarCodeScanned}
          />
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleDismissCamera}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openCameraButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  cameraButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    transform: [{ translateX: -50 }],
  },
});
