// import React, { useState, useRef } from 'react';
// import { View, Text, StyleSheet, Switch, Dimensions, Button } from 'react-native';
// import Slider from '@react-native-community/slider';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';

// const ESP32_IP = '192.168.0.196'; // Change this to your ESP32 IP
// const ESP32_PORT = 8888;

// export default function MorningAlarm() {
//   const [isOn, setIsOn] = useState(false);
//   const [lightIntensity, setLightIntensity] = useState(50);
//   const [buzzerIntensity, setBuzzerIntensity] = useState(50);
//   const [locked, setLocked] = useState(false);
//   const lastSentTime = useRef(0);

//   const sendUDPCommand = (light, buzzer) => {
//     const now = Date.now();
//     if (now - lastSentTime.current < 50) return;
//     lastSentTime.current = now;

//     const client = dgram.createSocket('udp4');
//     const lightValue = Math.round(light);
//     const buzzerValue = Math.round(buzzer);
//     const message = Buffer.from([0xE1, lightValue, buzzerValue]);

//     client.on('error', (err) => {
//       console.error('UDP Socket Error:', err);
//       client.close();
//     });

//     client.bind(0, () => {
//       client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
//         if (err) console.error('Send Error:', err);
//         client.close();
//       });
//     });

//     console.log(`📡 Sent UDP: E1 ${lightValue} ${buzzerValue}`);
//   };

//   const sendOffCommand = () => {
//     const now = Date.now();
//     if (now - lastSentTime.current < 50) return;
//     lastSentTime.current = now;

//     const client = dgram.createSocket('udp4');
//     const message = Buffer.from([0xD9]);

//     client.on('error', (err) => {
//       console.error('UDP Socket Error:', err);
//       client.close();
//     });

//     client.bind(0, () => {
//       client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
//         if (err) console.error('Send Error:', err);
//         client.close();
//       });
//     });

//     console.log('📡 Sent UDP: D9');
//   };

//   const handleToggle = () => {
//     const newState = !isOn;
//     setIsOn(newState);
//     if (newState) {
//       sendUDPCommand(lightIntensity, buzzerIntensity);
//     } else {
//       sendOffCommand();
//     }
//   };

//   const handleLightChange = (value) => {
//     if (!locked) setLightIntensity(value);
//   };

//   const handleBuzzerChange = (value) => {
//     if (!locked) setBuzzerIntensity(value);
//   };

//   const handleSetValues = () => {
//     setLocked((prev) => !prev);
//     if (!locked) sendUDPCommand(lightIntensity, buzzerIntensity);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.controlsBox}>
//         <View style={styles.topRow}>
//           <View style={styles.controlGroup}>
//             <Text style={styles.label}>⏰ <Text style={styles.boldText}>Alarm {isOn ? 'ON' : 'OFF'}</Text></Text>
//             <Switch
//               trackColor={{ false: '#ff9999', true: '#99ff99' }}
//               thumbColor={'#ffffff'}
//               ios_backgroundColor="#3e3e3e"
//               onValueChange={handleToggle}
//               value={isOn}
//               style={styles.switch}
//             />
//           </View>
//           <Text style={[styles.alarmIcon, isOn && styles.alarmActive]}>🔔</Text>
//         </View>

//         <View style={styles.controlGroup}>
//           <Text style={styles.label}>💡 Light Intensity: {lightIntensity}%</Text>
//           <Slider
//             style={styles.slider}
//             minimumValue={0}
//             maximumValue={100}
//             step={1}
//             value={lightIntensity}
//             onValueChange={handleLightChange}
//             minimumTrackTintColor="#A5D6A7"
//             maximumTrackTintColor="#4CAF50"
//             thumbTintColor="#388E3C"
//             disabled={locked}
//           />
//         </View>

//         <View style={styles.controlGroup}>
//           <Text style={styles.label}>🔊 Buzzer Intensity: {buzzerIntensity}%</Text>
//           <Slider
//             style={styles.slider}
//             minimumValue={0}
//             maximumValue={100}
//             step={1}
//             value={buzzerIntensity}
//             onValueChange={handleBuzzerChange}
//             minimumTrackTintColor="#FFD54F"
//             maximumTrackTintColor="#FFB300"
//             thumbTintColor="#FF8F00"
//             disabled={locked}
//           />
//         </View>

//         <Button title={locked ? 'Unlock' : 'Set'} onPress={handleSetValues} />
//       </View>
//     </View>
//   );
// }

// const { width } = Dimensions.get('window');
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#E8F5E9',
//     padding: 20,
//   },
//   controlsBox: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     width: width * 0.9,
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   controlGroup: {
//     marginVertical: 10,
//   },
//   label: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#4A4A4A',
//     marginBottom: 10,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   switch: {
//     transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
//   },
//   slider: {
//     width: '100%',
//     height: 40,
//   },
//   alarmIcon: {
//     fontSize: 50,
//     opacity: 0.3,
//   },
//   alarmActive: {
//     opacity: 1,
//     color: '#FFD700',
//     textShadowColor: '#FFA000',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 20,
//   },
// });




// import React, { useState } from 'react';
// import { View, Text, Button, ToastAndroid, PermissionsAndroid, Platform } from 'react-native';
// import SpeechAndroid from 'react-native-android-voice';

// const MorningAlarm = () => {
//   const [spokenText, setSpokenText] = useState('');

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: 'Microphone Permission',
//             message: 'App needs access to your microphone to use speech recognition.',
//             buttonPositive: 'OK',
//           }
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           ToastAndroid.show('Microphone permission denied', ToastAndroid.LONG);
//           return false;
//         }
//         return true;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const startSpeechRecognition = async () => {
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) return;

//     try {
//       const result = await SpeechAndroid.startSpeech('Speak now', SpeechAndroid.ENGLISH);
//       setSpokenText(result);
//       ToastAndroid.show('Speech recognized!', ToastAndroid.LONG);
//     } catch (error) {
//       switch (error) {
//         case SpeechAndroid.E_VOICE_CANCELLED:
//           ToastAndroid.show('Voice Recognizer cancelled', ToastAndroid.LONG);
//           break;
//         case SpeechAndroid.E_NO_MATCH:
//           ToastAndroid.show('No match for what you said', ToastAndroid.LONG);
//           break;
//         case SpeechAndroid.E_SERVER_ERROR:
//           ToastAndroid.show('Google Server Error', ToastAndroid.LONG);
//           break;
//         default:
//           ToastAndroid.show(`Error: ${error}`, ToastAndroid.LONG);
//           break;
//       }
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ marginBottom: 10, fontSize: 16 }}>
//         Speech Recognition Example (English)
//       </Text>
//       <Button title="Start Speech" onPress={startSpeechRecognition} />
//       {spokenText ? (
//         <Text style={{ marginTop: 20, fontSize: 16, color: 'blue' }}>
//           Recognized Text: {spokenText}
//         </Text>
//       ) : null}
//     </View>
//   );
// };

// export default MorningAlarm;

// import React, { useState,useRef } from 'react';
// import { View, Text, Button, ToastAndroid, PermissionsAndroid, Platform } from 'react-native';
// import SpeechAndroid from 'react-native-android-voice';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';

// const ESP32_IP = '192.168.0.101'; // Change to your ESP32 IP
// const ESP32_PORT = 8888;

// const MorningAlarm = () => {
//   const [spokenText, setSpokenText] = useState('');
//   const lastSentTime = useRef(0);

//   // Command mapping
//   const COMMANDS = {
//     'forward': 0xB1,
//     'backward': 0xB2,
//     'left': 0xB3,
//     'right': 0xB4,
//     'stop': 0xB0
//   };

//   const sendUDPCommand = (commandByte) => {
//     const now = Date.now();
//     if (now - lastSentTime.current < 50) return;
//     lastSentTime.current = now;

//     const client = dgram.createSocket('udp4');
//     const message = Buffer.from([commandByte]);

//     client.on('error', (err) => {
//       console.error('UDP Error:', err);
//       client.close();
//     });

//     client.bind(0, () => {
//       client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
//         if (err) console.error('Send Error:', err);
//         client.close();
//       });
//     });

//     console.log(`📡 Sent UDP: 0x${commandByte.toString(16).toUpperCase()}`);
//   };

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: 'Microphone Permission',
//             message: 'App needs microphone access for voice commands',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleVoiceCommand = async () => {
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       ToastAndroid.show('Permission denied!', ToastAndroid.LONG);
//       return;
//     }

//     try {
//       const result = await SpeechAndroid.startSpeech('Say command:', SpeechAndroid.ENGLISH);
//       const cleanCommand = result.toLowerCase().trim();
//       setSpokenText(cleanCommand);

//       // Find matching command
//       const commandKey = Object.keys(COMMANDS).find(key => cleanCommand.includes(key));
//       if (commandKey) {
//         sendUDPCommand(COMMANDS[commandKey]);
//         ToastAndroid.show(`Sent: ${commandKey.toUpperCase()}`, ToastAndroid.SHORT);
//       } else {
//         ToastAndroid.show('Unknown command', ToastAndroid.SHORT);
//       }
//     } catch (error) {
//       handleSpeechError(error);
//     }
//   };

//   const handleSpeechError = (error) => {
//     switch (error) {
//       case SpeechAndroid.E_VOICE_CANCELLED:
//         ToastAndroid.show('Voice cancelled', ToastAndroid.LONG);
//         break;
//       case SpeechAndroid.E_NO_MATCH:
//         ToastAndroid.show('No command recognized', ToastAndroid.LONG);
//         break;
//       case SpeechAndroid.E_SERVER_ERROR:
//         ToastAndroid.show('Server error', ToastAndroid.LONG);
//         break;
//       default:
//         ToastAndroid.show(`Error: ${error}`, ToastAndroid.LONG);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 18, marginBottom: 20 }}>
//         Voice Commands: "forward", "backward", "left", "right", "stop"
//       </Text>
      
//       <Button 
//         title="Start Voice Control"
//         onPress={handleVoiceCommand}
//         color="#4CAF50"
//       />

//       {spokenText ? (
//         <Text style={{ marginTop: 20, fontSize: 16, color: '#2196F3' }}>
//           Recognized: {spokenText}
//         </Text>
//       ) : null}
//     </View>
//   );
// };

// export default MorningAlarm;


import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid, PermissionsAndroid, Platform, StyleSheet, SafeAreaView } from 'react-native';
import SpeechAndroid from 'react-native-android-voice';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.101'; // Change to your ESP32 IP
const ESP32_PORT = 8888;

const MorningAlarm = () => {
  const [spokenText, setSpokenText] = useState('');
  const lastSentTime = useRef(0);

  // Command mapping
  const COMMANDS = {
    forward: 0xB1,
    backward: 0xB2,
    left: 0xB3,
    right: 0xB4,
    stop: 0xB0,
  };

  const sendUDPCommand = (commandByte) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const message = Buffer.from([commandByte]);

    client.on('error', (err) => {
      console.error('UDP Error:', err);
      client.close();
    });

    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
        if (err) console.error('Send Error:', err);
        client.close();
      });
    });

    console.log(`📡 Sent UDP: 0x${commandByte.toString(16).toUpperCase()}`);
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs microphone access for voice commands',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleVoiceCommand = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      ToastAndroid.show('Permission denied!', ToastAndroid.LONG);
      return;
    }

    try {
      const result = await SpeechAndroid.startSpeech('Say command:', SpeechAndroid.ENGLISH);
      const cleanCommand = result.toLowerCase().trim();
      setSpokenText(cleanCommand);

      // Find matching command
      const commandKey = Object.keys(COMMANDS).find(key => cleanCommand.includes(key));
      if (commandKey) {
        sendUDPCommand(COMMANDS[commandKey]);
        ToastAndroid.show(`Sent: ${commandKey.toUpperCase()}`, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Unknown command', ToastAndroid.SHORT);
      }
    } catch (error) {
      handleSpeechError(error);
    }
  };

  const handleSpeechError = (error) => {
    switch (error) {
      case SpeechAndroid.E_VOICE_CANCELLED:
        ToastAndroid.show('Voice cancelled', ToastAndroid.LONG);
        break;
      case SpeechAndroid.E_NO_MATCH:
        ToastAndroid.show('No command recognized', ToastAndroid.LONG);
        break;
      case SpeechAndroid.E_SERVER_ERROR:
        ToastAndroid.show('Server error', ToastAndroid.LONG);
        break;
      default:
        ToastAndroid.show(`Error: ${error}`, ToastAndroid.LONG);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Voice control car</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.instructions}>
          Try saying: "forward", "backward", "left", "right", "stop"
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleVoiceCommand}>
          <Text style={styles.buttonText}>Start Voice Control</Text>
        </TouchableOpacity>
        {spokenText ? (
          <Text style={styles.recognizedText}>Recognized: {spokenText}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  recognizedText: {
    marginTop: 25,
    fontSize: 16,
    color: '#FF5722',
    textAlign: 'center',
  },
});

export default MorningAlarm;


