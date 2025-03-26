import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196'; // Change this to your ESP32 IP
const ESP32_PORT = 8888;

export default function SmartIrrigation() {
  const [isOn, setIsOn] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(50);
  const [buzzerTime, setBuzzerTime] = useState(50);
  const lastSentTime = useRef(0);

  const sendUDPCommand = (light, buzzer) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const lightValue = Math.round(light);
    const buzzerValue = Math.round(buzzer);
    const message = Buffer.from([0xE3, lightValue, buzzerValue]);

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

    console.log(`📡 Sent UDP: E3 ${lightValue} ${buzzerValue}`);
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
      sendUDPCommand(lightIntensity, buzzerTime);
    } else {
      sendOffCommand();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsBox}>
        <View style={styles.topRow}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>🚪 <Text style={styles.boldText}>Door Alarm {isOn ? 'ON' : 'OFF'}</Text></Text>
            <Switch
              trackColor={{ false: '#ff9999', true: '#99ff99' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggle}
              value={isOn}
              style={styles.switch}
            />
          </View>
          <Text style={[styles.icon, isOn && styles.activeIcon]}>🔔</Text>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>💡 Light Intensity: {lightIntensity}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={lightIntensity}
            onValueChange={setLightIntensity}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#A5D6A7"
            thumbTintColor="#388E3C"
          />
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>⏲️ Buzzer: {buzzerTime}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={buzzerTime}
            onValueChange={setBuzzerTime}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#90CAF9"
            thumbTintColor="#1565C0"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Set Values"
            onPress={() => sendUDPCommand(lightIntensity, buzzerTime)}
            color="#4CAF50"
          />
        </View>

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
  icon: {
    fontSize: 50,
    opacity: 0.3,
  },
  activeIcon: {
    opacity: 1,
    color: '#2196F3',
    textShadowColor: '#1565C0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});



// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid } from 'react-native';
// import Voice from '@react-native-voice/voice';

// const SpeechToText = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recognizedText, setRecognizedText] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Initialize voice recognition settings
//     Voice.onSpeechStart = () => setIsRecording(true);
//     Voice.onSpeechEnd = () => setIsRecording(false);
//     Voice.onSpeechResults = (event) => {
//       setRecognizedText(event.value[0]);
//     };
//     Voice.onSpeechError = (event) => {
//       setError(event.error?.message);
//     };

//     // Request microphone permission on Android
//     const requestPermission = async () => {
//       try {
//         await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: 'Microphone Permission',
//             message: 'This app needs access to your microphone',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     requestPermission();

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       setError('');
//       await Voice.start('en-US');
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await Voice.stop();
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[styles.button, isRecording && styles.recording]}
//         onPress={isRecording ? stopRecording : startRecording}
//       >
//         <Text style={styles.buttonText}>
//           {isRecording ? 'Stop Recording' : 'Start Recording'}
//         </Text>
//       </TouchableOpacity>

//       {recognizedText ? (
//         <Text style={styles.text}>Recognized Text: {recognizedText}</Text>
//       ) : null}

//       {error ? <Text style={styles.error}>Error: {error}</Text> : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   recording: {
//     backgroundColor: '#FF3B30',
//   },
//   text: {
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   error: {
//     color: 'red',
//     marginTop: 10,
//   },
// });

// export default SpeechToText;
