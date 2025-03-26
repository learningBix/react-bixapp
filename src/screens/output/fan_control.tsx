import React, { useState, useRef,useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { Easing } from 'react-native';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function FanControl() {
  const [isOn, setIsOn] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [scaleValue] = useState(new Animated.Value(1));
  const spinAnim = useState(new Animated.Value(0))[0];
  const lastSentTime = useRef(0);

  const sendUDPCommand = (value) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const speedValue = parseInt(value.replace('D2', ''), 10);
    const message = Buffer.from([0xD2, speedValue]);

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
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
    
    // Send 0 when turning off, current speed when turning on
    sendUDPCommand(`D2${newState ? Math.round(speed * 2.55) : 0}`);
  };

  const handleSpeedChange = (value) => {
    const roundedValue = Math.round(value);
    setSpeed(roundedValue);
    if(isOn) sendUDPCommand(`D2${Math.round(roundedValue * 2.55)}`);
  };

  useEffect(() => {
    if (isOn) {
      spinAnim.setValue(0);
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1500 - (speed * 10),
          useNativeDriver: true,
          easing: Easing.linear
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [isOn, speed]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <View style={styles.controlsBox}>
        <View style={styles.topRow}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>🌀 <Text style={styles.boldText}>Power {isOn ? 'ON' : 'OFF'}</Text></Text>
            <Switch
              trackColor={{ false: '#ff9999', true: '#99ff99' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isOn}
              style={styles.switch}
            />
          </View>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Text style={[styles.fanIcon, isOn && styles.fanActive]}>🎐</Text>
          </Animated.View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>🌪️ Fan Speed: {speed}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={speed}
            onValueChange={handleSpeedChange}
            minimumTrackTintColor="#4a90e2"
            maximumTrackTintColor="#c8e1ff"
            thumbTintColor="#3f51b5"
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
  fanIcon: {
    fontSize: 50,
    opacity: 0.3,
    color: '#4a90e2',
  },
  fanActive: {
    opacity: 1,
    color: '#3f51b5',
    textShadowColor: '#4a90e2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});