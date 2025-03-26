import React, { useState, useRef,useEffect} from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function ServoControl() {
  const [isOn, setIsOn] = useState(false);
  const [angle, setAngle] = useState(90);
  const [scaleValue] = useState(new Animated.Value(1));
  const rotateAnim = useState(new Animated.Value(90))[0];
  const bgColorAnim = useState(new Animated.Value(0))[0];
  const lastSentTime = useRef(0);

  const sendUDPCommand = (value) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const message = Buffer.from([0xC3, value]);

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
    
    if (newState) {
      sendUDPCommand(angle); // Send current angle when turning on
    } else {
      setAngle(90);          // Reset to 90° when turning off
      sendUDPCommand(90);     // Send center position
    }
    
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const handleAngleChange = (newAngle) => {
    const roundedAngle = Math.round(newAngle);
    setAngle(roundedAngle);
    if(isOn) sendUDPCommand(roundedAngle);
  };

  useEffect(() => {
    bgColorAnim.setValue(angle);
    if (isOn) {
      Animated.spring(rotateAnim, {
        toValue: angle,
        speed: 20,
        useNativeDriver: true
      }).start();
    } else {
      rotateAnim.setValue(90);
    }
  }, [angle, isOn]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['-90deg', '90deg']
  });

  const bgColor = bgColorAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['rgba(255,255,255,1)', 'rgba(255,200,200,1)']
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.controlsBox, { backgroundColor: bgColor }]}>
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
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Text style={[styles.servoIcon, isOn && styles.servoActive]}>⚙️</Text>
          </Animated.View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>📐 Angle: {angle}°</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={180}
            step={1}
            value={angle}
            onValueChange={handleAngleChange}
            minimumTrackTintColor="#ff6b6b"
            maximumTrackTintColor="#ffd3b6"
            thumbTintColor="#ff5252"
            disabled={!isOn}
          />
          <View style={styles.angleMarks}>
            <Text>0°</Text>
            <Text>180°</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

// Keep the same style definitions as original
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
  servoIcon: {
    fontSize: 50,
    opacity: 0.3,
    color: '#ff6b6b',
  },
  servoActive: {
    opacity: 1,
    color: '#ff5252',
    textShadowColor: '#ff6b6b',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  angleMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 5,
  },
});