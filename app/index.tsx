import { View, Text, Button, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome } from "@expo/vector-icons";
import { scale } from "@/constants/Dimensions";

const index = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const handleSelectFile = async () => {
    DocumentPicker.getDocumentAsync({
      type: "audio/*",
    })
      .then((res) => {
        console.log("res", res.assets[0]?.uri);
        setSelectedFile(res.assets[0]?.uri);
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="music" size={64} color="black" />
      <Text style={styles.title}>Audio Waveform Visualizer</Text>
      <Button title="Pick an Audio File" onPress={handleSelectFile} />

      {selectedFile && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileName}>
            Selected File: <Text style={styles.file}>{selectedFile}</Text>
          </Text>
          <Button
            title="Go to Visualizer"
            onPress={() =>
              router.push({
                pathname: "/visualizer",
                params: { file: selectedFile },
              })
            }
          />
        </View>
      )}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(16),
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: scale(24),
    marginVertical: scale(20),
    fontWeight: "bold",
  },
  fileContainer: {
    marginTop: scale(20),
    alignItems: "center",
    backgroundColor: "#DCD2CC",
    width: "100%",
    padding: scale(10),
  },
  fileName: {
    marginBottom: scale(10),
    fontSize: scale(16),
    color: "#333",
    fontWeight: "700",
  },
  file: {
    fontSize: scale(14),
    fontWeight: "600",
  },
});
