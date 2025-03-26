import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { Easing } from 'react-native';


export default function LEDControl() {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [scaleValue] = useState(new Animated.Value(1));

  const toggleSwitch = () => {
    setIsOn(prevState => !prevState);
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Controls Container */}
      <View style={styles.controlsBox}>
        {/* Power Control & Bulb Inline */}
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
          <Text style={[styles.bulbIcon, isOn && styles.bulbOn]}>💡</Text>
        </View>

        {/* Brightness Control */}
        <View style={styles.controlGroup}>
          <Text style={styles.label}>🔆 Fan Speed{brightness}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={brightness}
            onValueChange={setBrightness}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Arial Rounded MT Bold',
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
