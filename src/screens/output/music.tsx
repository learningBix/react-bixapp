import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, TouchableOpacity } from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function MusicControl() {
  const [isOn, setIsOn] = useState(false);
  const [status, setStatus] = useState('Stopped');
  const lastSentTime = useRef(0);

  const sendUDPCommand = (command) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const message = Buffer.from([0xD4, command]);

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
    sendUDPCommand(newState ? 1 : 0); // D41 for on, D40 for off
    if (!newState) setStatus('Stopped');
  };

  const handlePlay = () => {
    setStatus('Playing');
    sendUDPCommand(2); // D42 for play
  };

  const handleStop = () => {
    setStatus('Stopped');
    sendUDPCommand(3); // D43 for stop
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsBox}>
        <View style={styles.powerRow}>
          <Text style={styles.label}>🔌 Power {isOn ? 'ON' : 'OFF'}</Text>
          <Text style={styles.statusText}>
            {status === 'Playing' ? '🎶 Now Playing' : '⏹ Stopped'}
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#ff9999', true: '#99ff99' }}
          thumbColor={'#ffffff'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isOn}
          style={styles.switch}
        />
        
        <View style={styles.controlGroup}>
          <Text style={styles.label}>🎚 Controls</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.playButton, !isOn && styles.disabled]}
              onPress={handlePlay}
              disabled={!isOn}
            >
              <Text style={styles.buttonText}>▶ PLAY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStop}
            >
              <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity>
          </View>
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
  powerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  switch: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  playButton: {
    backgroundColor: '#00e676',
  },
  stopButton: {
    backgroundColor: '#ff5252',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#666',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Arial Rounded MT Bold',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});