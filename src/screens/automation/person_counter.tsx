import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import dgram from "react-native-udp";
import { Buffer } from "buffer";

const ESP32_IP = "192.168.0.196";
const ESP32_PORT = 12345;

const PersonCounter = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [distanceThreshold, setDistanceThreshold] = useState(50);
  const [personCount, setPersonCount] = useState(0);
  const lastSentTime = useRef(0);
  const udpSocketRef = useRef(null);

  const sendUDPCommand = (command, value = 0) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket("udp4");
    const message = Buffer.from([command, Math.round(value)]);

    client.on("error", (err) => {
      console.error("UDP Error:", err);
      client.close();
    });

    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
        if (err) console.error("Send Failed:", err);
        client.close();
      });
    });

    console.log(`📡 Sent: 0x${command.toString(16).toUpperCase()} ${value}`);
  };

  useEffect(() => {
    if (isToggled) {
      sendUDPCommand(0xE6, distanceThreshold);
      
      // Setup UDP listener
      udpSocketRef.current = dgram.createSocket("udp4");
      udpSocketRef.current.bind(ESP32_PORT);

      udpSocketRef.current.on("message", (message) => {
        try {
          console.log(`📩 Received: ${message.toString('hex')}`);
          if (message.length > 0) {
            setPersonCount(message[0]); // Assume first byte is always count
          }
        } catch (error) {
          console.error("Parse Error:", error);
        }
      });

      udpSocketRef.current.on("error", (err) => {
        console.error("UDP Error:", err);
        udpSocketRef.current?.close();
      });

      return () => udpSocketRef.current?.close();
    } else {
      sendUDPCommand(0xD9);
      setPersonCount(0);
      udpSocketRef.current?.close();
    }
  }, [isToggled]);

  return (
    <View style={styles.container}>
      <View style={styles.inlineControls}>
        <View style={styles.counterCircle}>
          <Text style={styles.counterNumber}>{personCount}</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isToggled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsToggled}
          value={isToggled}
        />
      </View>

      <View style={styles.sliderBox}>
        <Text style={styles.sliderLabel}>🔭 Distance Threshold:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={distanceThreshold}
          onValueChange={(value) => {
            setDistanceThreshold(value);
            if (isToggled) sendUDPCommand(0xE6, value);
          }}
          minimumTrackTintColor="#FFD700"
          maximumTrackTintColor="#F0E68C"
          thumbTintColor="#FFA500"
          disabled={!isToggled}
        />
        <Text style={styles.sliderValue}>{Math.round(distanceThreshold)}%</Text>
      </View>
    </View>
  );
};

// Keep the same styles as before
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F9FF",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexShrink: 1,
  },
  inlineControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  counterCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#A5D6A7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#2E7D32",
    elevation: 10,
  },
  counterNumber: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1B5E20",
    textShadowColor: "#FFF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  sliderBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    padding: 15,
    width: "90%",
    marginTop: 20,
    elevation: 5,
    marginBottom: 15,
  },
  sliderLabel: {
    fontSize: 16,
    color: "#0D47A1",
    fontWeight: "bold",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 35,
  },
  sliderValue: {
    fontSize: 16,
    color: "#0D47A1",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
});

export default PersonCounter;





// import React, { useState, useRef } from "react";
// import { 
//   View, 
//   Text, 
//   Button, 
//   Alert, 
//   ActivityIndicator, 
//   PermissionsAndroid, 
//   Platform 
// } from "react-native";
// import AudioRecorderPlayer from "react-native-audio-recorder-player";
// import axios from "axios";

// const API_BASE_URL = "http://98.70.77.148:8000"; // Replace with your backend IP

// const SpeechToTextLive = () => {
//   const [recording, setRecording] = useState(false);
//   const [transcription, setTranscription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

//   // Request microphone permissions (Android only)
//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//       ]);
//     }
//   };

//   // Start recording audio
//   const startRecording = async () => {
//     await requestPermissions();
//     setRecording(true);
//     setTranscription(""); // Clear previous transcription

//     try {
//       const result = await audioRecorderPlayer.startRecorder();
//       console.log("Recording started at:", result);
//     } catch (error) {
//       Alert.alert("Error", "Failed to start recording.");
//       console.error(error);
//     }
//   };

//   // Stop recording and send audio file to backend
//   const stopRecording = async () => {
//     setRecording(false);
//     setLoading(true);

//     try {
//       const result = await audioRecorderPlayer.stopRecorder();
//       console.log("Recording saved at:", result);

//       // Prepare the audio file for upload
//       const formData = new FormData();
//       formData.append("audio", {
//         uri: result,
//         type: "audio/wav",  // Change to match your backend's expected format
//         name: "speech.wav",
//       });

//       // Send audio file to the speech-to-text backend
//       const response = await axios.post(`${API_BASE_URL}/speech-to-text`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("Full API Response:", response.data); // Debugging log

//       // Extract transcription from API response
//       const extractedText = response.data?.DisplayText || "No transcription available";
//       setTranscription(extractedText);
//     } catch (error) {
//       console.error("API Error:", error.response?.data || error);
//       Alert.alert("Error", error.response?.data?.error || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
//       <Button 
//         title={recording ? "Stop Recording" : "Start Recording"} 
//         onPress={recording ? stopRecording : startRecording} 
//       />
//       {loading && <ActivityIndicator size="large" color="blue" />}
//       {transcription ? (
//         <Text style={{ marginTop: 20, textAlign: "center" }}>{transcription}</Text>
//       ) : null}
//     </View>
//   );
// };

// export default SpeechToTextLive;



