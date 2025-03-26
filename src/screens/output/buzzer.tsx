import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function BuzzerControl() {
  const [isOn, setIsOn] = useState(false);
  const [volume, setVolume] = useState(50);
  const lastSentTime = useRef(0);

  const sendUDPCommand = (value) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const volumeValue = parseInt(value.replace('D1', ''), 10);
    const message = Buffer.from([0xD1, volumeValue]);

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
    sendUDPCommand(`D1${newState ? Math.round(volume * 2.55) : 0}`);
  };

  const handleSliderChange = (value) => {
    const roundedValue = Math.round(value);
    setVolume(roundedValue);
    if(isOn) sendUDPCommand(`D1${Math.round(roundedValue * 2.55)}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsBox}>
        <View style={styles.topRow}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>🔔 <Text style={styles.boldText}>Power {isOn ? 'ON' : 'OFF'}</Text></Text>
            <Switch
              trackColor={{ false: '#ff9999', true: '#99ff99' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isOn}
              style={styles.switch}
            />
          </View>
          <Text style={[styles.buzzerIcon, !isOn && styles.buzzerOff]}>📢</Text>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>🔊 Volume: {volume}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={volume}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#ff9800"
            maximumTrackTintColor="#ffcc80"
            thumbTintColor="#ff5722"
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
  },
  controlGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4a4a4a',
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
  buzzerIcon: {
    fontSize: 50,
    color: '#ff5722',
    textShadowColor: '#ff9800',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  buzzerOff: {
    opacity: 0.3,
    textShadowRadius: 0,
  },
});