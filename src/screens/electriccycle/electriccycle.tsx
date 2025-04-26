import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import dgram from "react-native-udp";
import { Buffer } from "buffer";

// Replace with your ESP32's IP and port
const REMOTE_HOST = "esptest.local";
const REMOTE_PORT = 8888;
// A separate local port to listen on
const LISTEN_PORT = 12345;

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [wheelDiameter, setWheelDiameter] = useState("0");
  const [distanceCovered, setDistanceCovered] = useState(0); // in meters
  const [rotationalSpeed, setRotationalSpeed] = useState(0); // RPM value
  const [speed, setSpeed] = useState(0); // km/h
  const [dimensions] = useState(Dimensions.get("window"));
  const socketRef = useRef(null);
  const lastTimestampRef = useRef(null);

  useEffect(() => {
    // Create and bind socket
    const s = dgram.createSocket("udp4");
    socketRef.current = s;

    s.on("error", (err) => {
      console.error("Socket error:", err);
    });

    s.bind(LISTEN_PORT, () => {
      console.log(`UDP socket bound on port ${LISTEN_PORT}`);
    });

    s.on("message", (msg, rinfo) => {
      try {
        const data = new Uint8Array(msg);
        console.log(`Received ${data.length} bytes from ${rinfo.address}:`, data);

        if (data.length >= 2) {
          const command = data[0];
          const value = data[1];

          // Update RPM
          setRotationalSpeed(value);

          // Calculate speed from RPM & wheel diameter
          const diameterInMeters = parseFloat(wheelDiameter) * 0.0254;
          let currentSpeed = 0;
          if (diameterInMeters > 0) {
            const circumference = diameterInMeters * Math.PI; // meters per revolution
            const mPerMinute = value * circumference;
            const mPerHour = mPerMinute * 60;
            const kmPerHour = mPerHour / 1000;
            currentSpeed = Number(kmPerHour.toFixed(1));
            setSpeed(currentSpeed);
          } else {
            setSpeed(0);
          }

          // Compute distance traveled since last update
          const now = Date.now();
          if (lastTimestampRef.current) {
            const deltaSec = (now - lastTimestampRef.current) / 1000;
            // speed in km/h -> m/s: divide by 3.6
            const speedMps = currentSpeed / 3.6;
            const deltaDist = speedMps * deltaSec;
            setDistanceCovered(prev => Number((prev + deltaDist).toFixed(2)));
          }
          lastTimestampRef.current = now;
        }
      } catch (error) {
        console.error("Message processing error:", error);
      }
    });

    return () => {
      s.close();
      console.log("Socket closed");
    };
  }, [wheelDiameter]);

  // Helper to send a command over UDP
  const sendCommand = (command, value) => {
    const socket = socketRef.current;
    if (!socket) {
      console.warn("Socket not initialized");
      return;
    }
    const msg = Buffer.from([command, value]);
    socket.send(msg, 0, msg.length, REMOTE_PORT, REMOTE_HOST, (err) => {
      if (err) console.error("UDP send error:", err);
      else console.log("UDP message sent:", msg);
    });
  };

  // Handle Set button: send 0xC6 + wheelDiameter value
  const handleSetWheelDiameter = () => {
    const val = parseInt(wheelDiameter, 10) || 0;
    console.log("Wheel Diameter Set:", val);
    sendCommand(0xC6, val);
    // reset distance tracker
    setDistanceCovered(0);
    lastTimestampRef.current = null;
  };

  // Determine if we should show mobile layout
  const isMobile = dimensions.width < 768;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.container,
          isMobile && styles.containerMobile,
          { maxWidth: isMobile ? "100%" : 1000 },
        ]}
      >
        {/* Left Section - Stats */}
        <View style={[styles.boxContainer, isMobile && styles.boxContainerMobile]}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Distance Covered</Text>
            <Text style={styles.value}>{distanceCovered} m</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>RPM</Text>
            <Text style={styles.value}>{rotationalSpeed} rpm</Text>
          </View>
        </View>

        {/* Center Speed Indicator */}
        <View style={[styles.speedContainer, isMobile && styles.speedContainerMobile]}>
          <View style={styles.speedCircle}>
            <Text style={styles.speedValue}>{speed}</Text>
            <Text style={styles.speedUnit}>km/h</Text>
          </View>
        </View>

        {/* Right Section - Controls */}
        <View style={[styles.controlBox, isMobile && styles.controlBoxMobile]}>
          <View style={styles.controlRow}>
            <Text style={styles.label}>Connect</Text>
            <Switch
              value={isConnected}
              onValueChange={(value) => {
                setIsConnected(value);
                // send on/off command 0xC5
                sendCommand(0xC5, value ? 1 : 0);
              }}
            />
          </View>
          <Text style={styles.label}>Wheel Diameter (inches)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={wheelDiameter}
            onChangeText={setWheelDiameter}
          />
          <TouchableOpacity style={styles.setButton} onPress={handleSetWheelDiameter}>
            <Text style={styles.setButtonText}>Set</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#3E1D7A",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 20,
    maxWidth: 1000,
  },
  containerMobile: {
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  boxContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginRight: 15,
  },
  boxContainerMobile: {
    width: "100%",
    marginRight: 0,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    backgroundColor: "#5A2BAF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  speedContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 15,
  },
  speedContainerMobile: {
    width: "100%",
    marginHorizontal: 0,
    marginBottom: 20,
  },
  speedCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#5A2BAF",
    borderWidth: 4,
    borderColor: "#FFC72C",
    justifyContent: "center",
    alignItems: "center",
  },
  speedValue: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  speedUnit: {
    color: "#FFF",
    fontSize: 16,
  },
  controlBox: {
    flex: 1,
    backgroundColor: "#5A2BAF",
    borderRadius: 20,
    padding: 20,
    marginLeft: 15,
  },
  controlBoxMobile: {
    width: "100%",
    marginLeft: 0,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#3E1D7A",
    borderRadius: 10,
    padding: 10,
    color: "#FFF",
    marginBottom: 15,
  },
  setButton: {
    backgroundColor: "#FF5A87",
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: "center",
  },
  setButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Dashboard;

