import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import Svg, { Polyline } from "react-native-svg";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Visualizer = () => {
  const { file } = useLocalSearchParams();
  const [sound, setSound] = useState(null);
  const [data, setData] = useState([]);
  const intervalRef = useRef<React.MutableRefObject<null>>(null);
  const router = useRouter();

  useEffect(() => {
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      clearInterval(intervalRef.current);
    };
  }, []);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: file });
    setSound(sound);
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && status.isPlaying) {
      // Simulate waveform data generation
      const simulatedData = new Float32Array(width).map(
        () => Math.random() * 2 - 1
      );
      setData(simulatedData);
    }
  };

  const playSound = async () => {
    await sound.playAsync();
    intervalRef.current = setInterval(() => {
      onPlaybackStatusUpdate({ isLoaded: true, isPlaying: true });
    }, 100);
  };

  const pauseSound = async () => {
    await sound.pauseAsync();
    clearInterval(intervalRef.current);
  };

  const stopSound = async () => {
    await sound.stopAsync();
    clearInterval(intervalRef.current);
  };

  const points = data
    .map((value, index) => `${index},${150 - value * 100}`)
    .join(" ");

  return (
    <View style={styles.container}>
      <Svg height="300" width={width} style={styles.svg}>
        <Polyline
          points={points}
          fill="none"
          stroke="#007AFF"
          strokeWidth="2"
        />
      </Svg>
      <View style={styles.controls}>
        <TouchableOpacity onPress={playSound}>
          <FontAwesome name="play" size={32} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pauseSound}>
          <FontAwesome name="pause" size={32} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopSound}>
          <FontAwesome name="stop" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  svg: {
    marginBottom: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 50,
  },
});

export default Visualizer;
