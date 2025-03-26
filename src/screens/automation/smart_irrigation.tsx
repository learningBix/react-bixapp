// import React, { useState, useRef } from "react";
// import { View, StyleSheet, ScrollView } from "react-native";
// import { Button, Text, Surface } from "react-native-paper";
// import Slider from "@react-native-community/slider";
// import dgram from "react-native-udp";
// import { Buffer } from "buffer";

// const ESP32_IP = "192.168.0.196"; // Change this to match your ESP32 IP
// const ESP32_PORT = 8888;

// const SmartIrrigation = () => {
//   const [isToggled, setIsToggled] = useState(false);
//   const [soilMoisture, setSoilMoisture] = useState(500);
//   const [dispenseTime, setDispenseTime] = useState(500);
//   const [locked, setLocked] = useState(false);
//   const lastSentTime = useRef(0);

//   const sendUDPCommand = (command, moisture, time) => {
//     const now = Date.now();
//     if (now - lastSentTime.current < 50) return; // Prevent spamming
//     lastSentTime.current = now;

//     const client = dgram.createSocket("udp4");
//     const moistureValue = Math.round(moisture);
//     const timeValue = Math.round(time);
//     const message = Buffer.from([command, moistureValue, timeValue]);

//     client.on("error", (err) => {
//       console.error("UDP Socket Error:", err);
//       client.close();
//     });

//     client.bind(0, () => {
//       client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
//         if (err) console.error("Send Error:", err);
//         client.close();
//       });
//     });

//     console.log(`📡 Sent UDP: ${command.toString(16).toUpperCase()} ${moistureValue} ${timeValue}`);
//   };

//   const handleToggle = () => {
//     const newState = !isToggled;
//     setIsToggled(newState);
//     if (newState) {
//       sendUDPCommand(0xE2, soilMoisture, dispenseTime); // Send E2 when ON
//     } else {
//       sendUDPCommand(0xD9, 0, 0); // Send D9 when OFF
//     }
//   };

//   const handleSetValues = () => {
//     setLocked((prev) => !prev);
//     if (!locked) sendUDPCommand(0xE2, soilMoisture, dispenseTime);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Surface style={styles.container}>
//         <Text style={styles.title}>Smart Irrigation System</Text>

//         <Button
//           mode="contained"
//           onPress={handleToggle}
//           style={[styles.toggleButton, isToggled ? styles.buttonOn : styles.buttonOff]}
//           labelStyle={styles.buttonText}
//         >
//           {isToggled ? "Turn Off" : "Turn On"}
//         </Button>

//         <View style={styles.sliderGroup}>
//           <Text style={styles.label}>Soil Moisture Level: {soilMoisture}ms</Text>
//           <Slider
//             style={styles.slider}
//             minimumValue={0}
//             maximumValue={2000}
//             value={soilMoisture}
//             onValueChange={(value) => !locked && setSoilMoisture(value)}
//             minimumTrackTintColor="#4CAF50"
//             maximumTrackTintColor="#A5D6A7"
//             thumbTintColor="#388E3C"
//             disabled={locked}
//           />
//         </View>

//         <View style={styles.sliderGroup}>
//           <Text style={styles.label}>Time to Dispense: {dispenseTime}ms</Text>
//           <Slider
//             style={styles.slider}
//             minimumValue={0}
//             maximumValue={5000}
//             value={dispenseTime}
//             onValueChange={(value) => !locked && setDispenseTime(value)}
//             minimumTrackTintColor="#FFB300"
//             maximumTrackTintColor="#FFD54F"
//             thumbTintColor="#FF8F00"
//             disabled={locked}
//           />
//         </View>

//         <Button
//           mode="contained"
//           onPress={handleSetValues}
//           style={[styles.setButton, locked ? styles.lockedButton : {}]}
//           labelStyle={styles.buttonText}
//         >
//           {locked ? "Unlock" : "Set"}
//         </Button>
//       </Surface>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     padding: 10,
//   },
//   container: {
//     backgroundColor: "#FAFAFA",
//     padding: 20,
//     borderRadius: 12,
//     elevation: 3,
//     marginHorizontal: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 15,
//     color: "#2E7D32",
//   },
//   toggleButton: {
//     alignSelf: "center",
//     width: "80%",
//     borderRadius: 8,
//     paddingVertical: 8,
//     marginBottom: 15,
//   },
//   buttonOn: {
//     backgroundColor: "#388E3C",
//   },
//   buttonOff: {
//     backgroundColor: "#D32F2F",
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   sliderGroup: {
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 5,
//     color: "#424242",
//     textAlign: "center",
//   },
//   slider: {
//     width: "100%",
//   },
//   setButton: {
//     marginTop: 15,
//     backgroundColor: "#1976D2",
//     alignSelf: "center",
//     borderRadius: 8,
//     width: "80%",
//     paddingVertical: 8,
//   },
//   lockedButton: {
//     backgroundColor: "#757575",
//   },
// });

// export default SmartIrrigation;



import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196'; // Change this to your ESP32 IP
const ESP32_PORT = 8888;

export default function SmartIrrigation() {
  const [isOn, setIsOn] = useState(false);
  const [moistureThreshold, setMoistureThreshold] = useState(2000);
  const [dispenseTime, setDispenseTime] = useState(2000);
  const [locked, setLocked] = useState(false);
  const lastSentTime = useRef(0);

  const sendUDPCommand = (moisture, time) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const moistureValue = Math.round(moisture);
    const timeValue = Math.round(time);
    const message = Buffer.from([0xE2, moistureValue >> 8, moistureValue & 0xFF, timeValue >> 8, timeValue & 0xFF]);

    client.on('error', (err) => {
      console.error('UDP Socket Error:', err);
      client.close();
    });

    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
        if (err) console.error('Send Error:', err);
        client.close();
      });
    });

    console.log(`📡 Sent UDP: E2 ${moistureValue}ms ${timeValue}ms`);
  };

  const sendOffCommand = () => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const message = Buffer.from([0xD9]);

    client.on('error', (err) => {
      console.error('UDP Socket Error:', err);
      client.close();
    });

    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
        if (err) console.error('Send Error:', err);
        client.close();
      });
    });

    console.log('📡 Sent UDP: D9');
  };

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (newState) {
      sendUDPCommand(moistureThreshold, dispenseTime);
    } else {
      sendOffCommand();
    }
  };

  const handleMoistureChange = (value) => {
    if (!locked) setMoistureThreshold(value);
  };

  const handleDispenseChange = (value) => {
    if (!locked) setDispenseTime(value);
  };

  const handleSetValues = () => {
    setLocked((prev) => !prev);
    if (!locked) sendUDPCommand(moistureThreshold, dispenseTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsBox}>
        <View style={styles.topRow}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>🌱 <Text style={styles.boldText}>Irrigation {isOn ? 'ON' : 'OFF'}</Text></Text>
            <Switch
              trackColor={{ false: '#ff9999', true: '#99ff99' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggle}
              value={isOn}
              style={styles.switch}
            />
          </View>
          <Text style={[styles.plantIcon, isOn && styles.plantActive]}>💧</Text>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>🌧️ Moisture Threshold: {moistureThreshold}ms</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={5000}
            step={100}
            value={moistureThreshold}
            onValueChange={handleMoistureChange}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#A5D6A7"
            thumbTintColor="#388E3C"
            disabled={locked}
          />
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>⏲️ Dispense Time: {dispenseTime}ms</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10000}
            step={100}
            value={dispenseTime}
            onValueChange={handleDispenseChange}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#90CAF9"
            thumbTintColor="#1565C0"
            disabled={locked}
          />
        </View>

        <Button title={locked ? 'Unlock' : 'Set'} onPress={handleSetValues} />
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  controlsBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  slider: {
    width: '100%',
    height: 40,
  },
  plantIcon: {
    fontSize: 50,
    opacity: 0.3,
  },
  plantActive: {
    opacity: 1,
    color: '#2196F3',
    textShadowColor: '#1565C0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});