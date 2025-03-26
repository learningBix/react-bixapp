import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196'; // Change this to your ESP32 IP
const ESP32_PORT = 8888;

export default function NightLamp() {
  const [isOn, setIsOn] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(50);
  const [ledBrightness, setLedBrightness] = useState(50);
  const [locked, setLocked] = useState(false);
  const lastSentTime = useRef(0);

  const sendUDPCommand = (light, brightness) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return; // Prevent spamming
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const lightValue = Math.round(light);
    const brightnessValue = Math.round(brightness);
    const message = Buffer.from([0xE0, lightValue, brightnessValue]);

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

    console.log(`📡 Sent UDP: E0 ${lightValue} ${brightnessValue}`);
  };

  const sendOffCommand = () => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const message = Buffer.from([0xD9]); // Single byte command

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
      sendUDPCommand(lightIntensity, ledBrightness);
    } else {
      sendOffCommand(); // Use the new off command
    }
  };

  const handleLightIntensityChange = (value) => {
    if (!locked) setLightIntensity(value);
  };

  const handleBrightnessChange = (value) => {
    if (!locked) setLedBrightness(value);
  };

  const handleSetValues = () => {
    setLocked((prev) => !prev);
    if (!locked) sendUDPCommand(lightIntensity, ledBrightness);
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsBox}>
        <View style={styles.topRow}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>✨ <Text style={styles.boldText}>Lamp {isOn ? 'ON' : 'OFF'}</Text></Text>
            <Switch
              trackColor={{ false: '#ff9999', true: '#99ff99' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggle}
              value={isOn}
              style={styles.switch}
            />
          </View>
          <Text style={[styles.lampIcon, isOn && styles.lampOn]}>🛋️</Text>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>💡 Light Intensity: {lightIntensity}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={lightIntensity}
            onValueChange={handleLightIntensityChange}
            minimumTrackTintColor="#FFD54F"
            maximumTrackTintColor="#FFF59D"
            thumbTintColor="#FFB300"
            disabled={locked}
          />
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>🔆 LED Brightness: {ledBrightness}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={ledBrightness}
            onValueChange={handleBrightnessChange}
            minimumTrackTintColor="#80D8FF"
            maximumTrackTintColor="#B3E5FC"
            thumbTintColor="#03A9F4"
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
  lampIcon: {
    fontSize: 50,
    opacity: 0.3,
  },
  lampOn: {
    opacity: 1,
    color: '#FFD700',
    textShadowColor: '#FFA000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});

export default NightLamp;


// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Voice from '@wdragon/react-native-voice';

// const SpeechToText = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recognizedText, setRecognizedText] = useState('');
//   const [pitch, setPitch] = useState('');
//   const [error, setError] = useState('');

//   // Initialize voice recognition settings
//   useEffect(() => {
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechRecognized = onSpeechRecognized;
//     Voice.onSpeechEnd = onSpeechEnd;
//     Voice.onSpeechError = onSpeechError;
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechStart = (e: any) => {
//     setIsRecording(true);
//     setError('');
//   };

//   const onSpeechRecognized = (e: any) => {
//     console.log('Speech recognized');
//   };

//   const onSpeechEnd = (e: any) => {
//     setIsRecording(false);
//   };

//   const onSpeechError = (e: any) => {
//     setError(JSON.stringify(e.error));
//     setIsRecording(false);
//   };

//   const onSpeechResults = (e: any) => {
//     setRecognizedText(e.value[0]);
//   };

//   const onSpeechVolumeChanged = (e: any) => {
//     setPitch(e.value);
//   };

//   const startRecognizing = useCallback(async () => {
//     try {
//       await Voice.start('en-US');
//     } catch (e) {
//       console.error(e);
//     }
//   }, []);

//   const stopRecognizing = useCallback(async () => {
//     try {
//       await Voice.stop();
//     } catch (e) {
//       console.error(e);
//     }
//   }, []);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[styles.button, isRecording && styles.recording]}
//         onPress={isRecording ? stopRecognizing : startRecognizing}
//       >
//         <Text style={styles.buttonText}>
//           {isRecording ? 'Stop Recording' : 'Start Recording'}
//         </Text>
//       </TouchableOpacity>

//       {recognizedText ? (
//         <Text style={styles.resultText}>Result: {recognizedText}</Text>
//       ) : null}

//       {pitch ? (
//         <Text style={styles.pitchText}>Pitch: {pitch}</Text>
//       ) : null}

//       {error ? (
//         <Text style={styles.errorText}>Error: {error}</Text>
//       ) : null}
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
//     padding: 15,
//     borderRadius: 8,
//     backgroundColor: '#007AFF',
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   recording: {
//     backgroundColor: '#FF3B30',
//   },
//   resultText: {
//     fontSize: 18,
//     marginVertical: 10,
//     textAlign: 'center',
//   },
//   pitchText: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 5,
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//   },
// });

// export default SpeechToText;