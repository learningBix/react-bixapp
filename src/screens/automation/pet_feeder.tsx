import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, Surface } from "react-native-paper";
import Slider from "@react-native-community/slider";
import dgram from "react-native-udp";
import { Buffer } from "buffer";

const ESP32_IP = "192.168.0.196"; // Change to your ESP32 IP
const ESP32_PORT = 8888;

const PetFeeder = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [dispenseTime, setDispenseTime] = useState(50);
  const [objectThreshold, setObjectThreshold] = useState(50);
  const lastSentTime = useRef(0);

  const sendUDPCommand = (cmd, val1 = 0, val2 = 0) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket("udp4");
    const message = Buffer.from([cmd, Math.round(val1), Math.round(val2)]);

    client.on("error", (err) => {
      console.error("UDP Socket Error:", err);
      client.close();
    });

    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
        if (err) console.error("Send Error:", err);
        client.close();
      });
    });

    console.log(`📡 Sent UDP: ${cmd.toString(16).toUpperCase()} ${val1} ${val2}`);
  };

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (newState) {
      sendUDPCommand(0xE5, dispenseTime, objectThreshold);
    } else {
      sendUDPCommand(0xD9);
    }
  };

  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Pet Feeder</Text>

      <Button
        mode="contained"
        onPress={handleToggle}
        style={[styles.toggleButton, isToggled ? styles.buttonOn : styles.buttonOff]}
        labelStyle={styles.buttonText}
      >
        {isToggled ? "Turn Off" : "Turn On"}
      </Button>

      <View style={styles.sliderGroup}>
        <Text style={styles.label}>Time to dispense: {dispenseTime}ms</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={dispenseTime}
          onValueChange={setDispenseTime}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#A5D6A7"
          thumbTintColor="#388E3C"
        />
      </View>

      <View style={styles.sliderGroup}>
        <Text style={styles.label}>Object threshold: {objectThreshold}%</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={objectThreshold}
          onValueChange={setObjectThreshold}
          minimumTrackTintColor="#FFB300"
          maximumTrackTintColor="#FFD54F"
          thumbTintColor="#FF8F00"
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    padding: 25,
    borderRadius: 12,
    elevation: 0,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2E7D32",
  },
  toggleButton: {
    alignSelf: "center",
    width: 160,
    borderRadius: 8,
    paddingVertical: 5,
    marginBottom: 20,
  },
  buttonOn: {
    backgroundColor: "#388E3C",
  },
  buttonOff: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sliderGroup: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#424242",
  },
  slider: {
    width: "100%",
  },
});

export default PetFeeder;

