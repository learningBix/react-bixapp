import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function LEDControl() {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const lastSentTime = useRef(0);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    // Send as byte value (0-255) instead of percentage
    sendUDPCommand(`D5${newState ? Math.round(brightness * 2.55) : 0}`);
  };

  const sendUDPCommand = (value) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;
  
    const client = dgram.createSocket('udp4');
    
    // Convert string command to byte array
    const brightnessValue = parseInt(value.replace('D5', ''), 10);
    const message = Buffer.from([0xD5, brightnessValue]); // Use byte array format
  
    client.on('error', (err) => {
      console.error('UDP Socket Error:', err);
      client.close();
    });
  
    // Add bind() like in working example
    client.bind(0, () => {
      client.send(
        message,
        0,
        message.length,
        ESP32_PORT,
        ESP32_IP,
        (err) => {
          if (err) console.error('Send Error:', err);
          client.close();
        }
      );
    });
  };

  const handleSliderChange = (value) => {
    const roundedValue = Math.round(value);
    setBrightness(roundedValue);
    // Convert percentage to 0-255 scale
    sendUDPCommand(`D5${Math.round(roundedValue * 2.55)}`);
  };
  return (
    <View style={styles.container}>
      <View style={styles.controlsBox}>
        <View style={styles.topRow}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>⚡ <Text style={styles.boldText}>Power {isOn ? 'ON' : 'OFF'}</Text></Text>
            <Switch
              trackColor={{ false: '#ff9999', true: '#99ff99' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggle}
              value={isOn}
              style={styles.switch}
            />
          </View>
          <Text style={[styles.bulbIcon, isOn && styles.bulbOn]}>💡</Text>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>🔆 Brightness: {brightness}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={brightness}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#ffd700"
            maximumTrackTintColor="#ffeeb5"
            thumbTintColor="#ffeb3b"
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
    backgroundColor: '#e3f2fd',
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
    color: '#4a4a4a',
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
  bulbIcon: {
    fontSize: 50,
    opacity: 0.3,
  },
  bulbOn: {
    opacity: 1,
    color: '#ffeb3b',
    textShadowColor: '#ffd700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});