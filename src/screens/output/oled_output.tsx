import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function OLEDDisplay() {
  const [isOn, setIsOn] = useState(false);
  const [text, setText] = useState('');
  const lastSentTime = useRef(0);

  const sendUDPCommand = (command, data = '') => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    let message;

    if (data) {
      message = Buffer.from([command, ...Buffer.from(data)]);
    } else {
      message = Buffer.from([command]);
    }

    client.on('error', (err) => {
      console.error('UDP Error:', err);
      client.close();
    });

    client.bind(0, () => {
      client.send(
        message,
        0,
        message.length,
        ESP32_PORT,
        ESP32_IP,
        (err) => {
          if (err) console.error('Send Failed:', err);
          client.close();
        }
      );
    });
  };

  const handlePowerToggle = (state) => {
    setIsOn(state);
    if (state) {
      sendUDPCommand(0xD6);
    } else {
      sendUDPCommand(0xD9);
    }
  };

  const handleDisplayText = () => {
    if (text) {
      sendUDPCommand(0xD7, text);
    }
  };

  return (
    <View style={styles.container}>
      {/* Power Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isOn && styles.activeButton]}
          onPress={() => handlePowerToggle(true)}
        >
          <Text style={styles.buttonText}>ON</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isOn && styles.activeButton]}
          onPress={() => handlePowerToggle(false)}
        >
          <Text style={styles.buttonText}>OFF</Text>
        </TouchableOpacity>
      </View>

      {/* Text Input Section */}
      <Text style={styles.heading}>Enter Text to Display on OLED:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Text here"
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
      />

      {/* Display Button */}
      <TouchableOpacity style={styles.displayButton} onPress={handleDisplayText}>
        <Text style={styles.displayButtonText}>Display</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9e7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#000',
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
  },
  activeButton: {
    backgroundColor: '#81b0ff',
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Comic Sans MS',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Comic Sans MS',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  input: {
    width: width * 0.7,
    padding: 12,
    fontSize: 16,
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Comic Sans MS',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
  },
  displayButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
  },
  displayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Comic Sans MS',
  },
});
