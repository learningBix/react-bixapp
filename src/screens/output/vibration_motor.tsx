import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function VibrationMotor() {
  const [isOn, setIsOn] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const lastSentTime = useRef(0);

  const sendUDPCommand = (value) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const intensityValue = parseInt(value.replace('D0', ''), 10);
    const message = Buffer.from([0xD0, intensityValue]);

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

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState);
    sendUDPCommand(`D0${newState ? Math.round(intensity * 2.55) : 0}`);
  };

  const handleSliderChange = (value) => {
    const roundedValue = Math.round(value);
    setIntensity(roundedValue);
    if(isOn) sendUDPCommand(`D0${Math.round(roundedValue * 2.55)}`);
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
              onValueChange={toggleSwitch}
              value={isOn}
              style={styles.switch}
            />
          </View>
          <Text style={[styles.vibrationIcon, !isOn && styles.disabledIcon]}>📳</Text>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>🌀 Intensity: {intensity}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={intensity}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#ffd700"
            maximumTrackTintColor="#ffeeb5"
            thumbTintColor="#ffeb3b"
            disabled={!isOn}
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
    marginBottom: 15,
  },
  controlGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    fontFamily: 'Arial Rounded MT Bold',
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
  vibrationIcon: {
    fontSize: 48,
    color: '#ffeb3b',
    marginRight: 15,
  },
  disabledIcon: {
    opacity: 0.3,
  },
});