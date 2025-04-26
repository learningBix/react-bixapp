import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid, PermissionsAndroid, Platform, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import SpeechAndroid from 'react-native-android-voice';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const { width, height } = Dimensions.get('window');
const ESP32_IP = 'esptest.local'; // Change to your ESP32 IP
const ESP32_PORT = 8888;

// Define command mapping for voice commands.
// Each command maps to an array [commandByte, parameterValue].
const COMMANDS = {
  'led on': [0xD5, 100],
  'led off': [0xD5, 0],
  'fan on': [0xD2, 100],
  'fan off': [0xD2, 0],
  'motor on': [0xD3, 100],
  'motor off': [0xD3, 0],
};

const VoiceControlScreen = () => {
  const [spokenText, setSpokenText] = useState('');
  const [ledStatus, setLedStatus] = useState('OFF');
  const [fanStatus, setFanStatus] = useState('OFF');
  const [motorStatus, setMotorStatus] = useState('OFF');
  const lastSentTime = useRef(0);

  const sendUDPCommand = (commandBytes) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return; // throttle
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    // Create a buffer with two bytes: command and parameter.
    const message = Buffer.from(commandBytes);

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

    console.log(`📡 Sent UDP: ${commandBytes.map(b => "0x" + b.toString(16).toUpperCase()).join(' ')}`);
    
    // Update status based on command
    if (commandBytes[0] === 0xD5) {
      setLedStatus(commandBytes[1] > 0 ? 'ON' : 'OFF');
    } else if (commandBytes[0] === 0xD2) {
      setFanStatus(commandBytes[1] > 0 ? 'ON' : 'OFF');
    } else if (commandBytes[0] === 0xD3) {
      setMotorStatus(commandBytes[1] > 0 ? 'ON' : 'OFF');
    }
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

      // Check if any command is included in the recognized speech.
      let foundCommand = null;
      for (const key of Object.keys(COMMANDS)) {
        if (cleanCommand.includes(key)) {
          foundCommand = key;
          break;
        }
      }
      if (foundCommand) {
        sendUDPCommand(COMMANDS[foundCommand]);
        ToastAndroid.show(`Sent: ${foundCommand.toUpperCase()}`, ToastAndroid.SHORT);
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
      <View style={styles.innerContainer}>
        {/* Command Section */}
        <View style={styles.commandSection}>
          <Text style={styles.commandLabel}>Received Command</Text>
          <Text style={styles.commandText}>{spokenText}</Text>
          
          <TouchableOpacity style={styles.micButton} onPress={handleVoiceCommand}>
            <View style={styles.micIconCircle}>
              <Text style={styles.micIcon}>🎤</Text>
            </View>
          </TouchableOpacity>
        </View>
      
        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          {/* RGB LED Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>RGB LED</Text>
              <View style={styles.iconContainer}>
                <Text style={styles.deviceIcon}>💡</Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text style={styles.statusValue}>{ledStatus}</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Brightness:</Text>
              <Text style={styles.statusValue}>100%</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Color:</Text>
              <View style={styles.colorIndicator} />
            </View>
          </View>
          
          {/* Fan Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Fan</Text>
              <View style={styles.iconContainer}>
                <Text style={styles.deviceIcon}>🌀</Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text style={styles.statusValue}>{fanStatus}</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Speed:</Text>
              <Text style={styles.statusValue}>LOW</Text>
            </View>
          </View>
          
          {/* Motor Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Motor</Text>
              <View style={styles.iconContainer}>
                <Text style={styles.deviceIcon}>⚙️</Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text style={styles.statusValue}>{motorStatus}</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Speed:</Text>
              <Text style={styles.statusValue}>100%</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Direction:</Text>
              <Text style={styles.statusValue}>Clockwise</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5D2F91', // Deep purple background
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center',     // Centers content horizontally
  },
  innerContainer: {
    width: '90%',
    alignItems: 'center',
  },
  commandSection: {
    width: '100%',
    padding: 16,
    backgroundColor: '#6B3FA0', // Lighter purple
    borderRadius: 16,
    marginBottom: 20,
    position: 'relative',
  },
  commandLabel: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    
  },
  commandText: {
    fontSize: 16,
    color: 'white',
    marginRight: 70, // To ensure it doesn't overlap with the mic button
  },
  micButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -15, // Half the height for centering
  },
  micIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F14AA1', // Pink
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: 22,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spread out cards evenly
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '30%',
    backgroundColor: '#F14AA1', // Pink
    borderRadius: 14,
    padding: 10,
    height: 180, // Fixed height that should fit most screens
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceIcon: {
    fontSize: 18,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: 'white',
  },
  statusValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  colorIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'yellow',
  },
});

export default VoiceControlScreen;
