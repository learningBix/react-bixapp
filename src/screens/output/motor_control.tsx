import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function MotorDrive() {
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [motor1State, setMotor1State] = useState('stop');
  const [motor2State, setMotor2State] = useState('stop');
  const [botState, setBotState] = useState('stop');
  const lastSentTime = useRef(0);

  const sendUDPCommand = (command) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const message = Buffer.from([0xD8, command]);

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
    const newState = !isPoweredOn;
    setIsPoweredOn(newState);
    
    if (!newState) {
      // Send stop commands when turning off
      sendUDPCommand(0x02); // For Motor 1
      sendUDPCommand(0x05); // For Motor 2
      sendUDPCommand(0x00); // For BOT
      setMotor1State('stop');
      setMotor2State('stop');
      setBotState('stop');
    }
  };

  const handleMotor1Command = (direction) => {
    if (!isPoweredOn) return;

    let command;
    switch(direction) {
      case 'clockwise': command = 0x00; break;
      case 'anticlockwise': command = 0x01; break;
      case 'stop': command = 0x02; break;
      default: command = 0x02;
    }

    setMotor1State(direction);
    sendUDPCommand(command);
  };

  const handleMotor2Command = (direction) => {
    if (!isPoweredOn) return;

    let command;
    switch(direction) {
      case 'clockwise': command = 0x03; break;
      case 'anticlockwise': command = 0x04; break;
      case 'stop': command = 0x05; break;
      default: command = 0x05;
    }

    setMotor2State(direction);
    sendUDPCommand(command);
  };

  const handleBotCommand = (direction) => {
    if (!isPoweredOn) return;

    let command;
    switch(direction) {
      case 'forward': command = 0x00; break;
      case 'backward': command = 0x01; break;
      case 'stop': command = 0x02; break; // Using same command as forward for stop
      default: command = 0x00;
    }

    setBotState(direction);
    sendUDPCommand(command);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Hey this is Motor Drive Activity!</Text>
          <Switch 
            trackColor={{ false: '#ff9999', true: '#99ff99' }}
            thumbColor={'#ffffff'}
            onValueChange={toggleSwitch}
            value={isPoweredOn}
            style={styles.switch}
          />
        </View>

        {/* Motor 1 Controls */}
        <View style={styles.controlBox}>
          <Text style={styles.sectionTitle}>🔧 Motor 1</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, motor1State === 'clockwise' && styles.activeButton]}
              onPress={() => handleMotor1Command('clockwise')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>🔄 Clockwise</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, motor1State === 'anticlockwise' && styles.activeButton]}
              onPress={() => handleMotor1Command('anticlockwise')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>↪️ Anti Clockwise</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.stopButton, motor1State === 'stop' && styles.activeStop]}
              onPress={() => handleMotor1Command('stop')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>🛑 Stop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motor 2 Controls */}
        <View style={styles.controlBox}>
          <Text style={styles.sectionTitle}>🔧 Motor 2</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, motor2State === 'clockwise' && styles.activeButton]}
              onPress={() => handleMotor2Command('clockwise')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>🔄 Clockwise</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, motor2State === 'anticlockwise' && styles.activeButton]}
              onPress={() => handleMotor2Command('anticlockwise')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>↪️ Anti Clockwise</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.stopButton, motor2State === 'stop' && styles.activeStop]}
              onPress={() => handleMotor2Command('stop')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>🛑 Stop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOT Controls */}
        <View style={styles.controlBox}>
          <Text style={styles.sectionTitle}>🤖 BOT</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, botState === 'forward' && styles.activeButton]}
              onPress={() => handleBotCommand('forward')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>⬆️ Forward</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, botState === 'backward' && styles.activeButton]}
              onPress={() => handleBotCommand('backward')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>⬇️ Backward</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.stopButton, botState === 'stop' && styles.activeStop]}
              onPress={() => handleBotCommand('stop')}
              disabled={!isPoweredOn}
            >
              <Text style={styles.buttonText}>🛑 Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.9,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f51b5',
    fontFamily: 'Arial Rounded MT Bold',
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  controlBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: width * 0.9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 8,
    fontFamily: 'Arial Rounded MT Bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  button: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: width * 0.25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#81b0ff',
    borderColor: '#3f51b5',
  },
  stopButton: {
    backgroundColor: '#ffe5e5',
    borderColor: '#ff9999',
  },
  activeStop: {
    backgroundColor: '#ff5252',
    borderColor: '#cc0000',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Arial Rounded MT Bold',
  },
});
