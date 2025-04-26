import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { WebView } from 'react-native-webview';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = 'esptest.local'; // Change this to your ESP32 IP
const ESP32_PORT = 8888;

export default function FaceDetectionDoorAlarmScreen() {
  const [faceDetected, setFaceDetected] = useState(false);
  const [streamActive, setStreamActive] = useState(true);
  const [deviceActive, setDeviceActive] = useState(true);
  const lastSentTime = useRef(0);
  const [lastDetectionTime, setLastDetectionTime] = useState(null);

  const sendFaceDetectedCommand = () => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const message = Buffer.from([0xD3, 90]);

    console.log('Sending UDP command with values:', message);

    client.on('error', (err) => {
      console.error('UDP Socket Error:', err);
      client.close();
    });

    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
        if (err) console.error('Send Error:', err);
        client.close();
      });
    });

    console.log('📡 Sent UDP: D3 90');
  };

  const sendActiveCommand = () => {
    const client = dgram.createSocket('udp4');
    const message = Buffer.from([0xA8]); // Send 0xA8 command when active button is toggled ON

    client.on('error', (err) => {
      console.error('UDP Socket Error:', err);
      client.close();
    });

    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
        if (err) console.error('Send Error:', err);
        client.close();
      });
    });

    console.log('📡 Sent UDP: A8');
  };

  const toggleDeviceActive = () => {
    const newState = !deviceActive;
    setDeviceActive(newState);
    
    if (newState) {
      // Only send the command when toggling to active state
      sendActiveCommand();
    }
  };

  useEffect(() => {
    const checkFaceStatus = async () => {
      try {
        const response = await fetch('http://98.70.77.148:5999/face_status');
        const data = await response.arrayBuffer();
        const status = new Uint8Array(data)[0];
        const newFaceDetected = status === 0xD1;
        
        if (newFaceDetected && !faceDetected) {
          // Face just detected now
          setLastDetectionTime(new Date().toLocaleTimeString());
        }
        
        setFaceDetected(newFaceDetected);
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    const intervalId = setInterval(checkFaceStatus, 1000);
    return () => clearInterval(intervalId);
  }, [faceDetected]);

  useEffect(() => {
    if (faceDetected) {
      sendFaceDetectedCommand();
    }
  }, [faceDetected]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left Panel - Face Detection */}
        <View style={styles.faceDetectionPanel}>
          <Text style={styles.panelTitle}>Face Detection</Text>
          <View style={styles.videoContainer}>
            {streamActive && (
              <WebView 
                source={{ uri: 'http://98.70.77.148:5999/video_feed' }} 
                style={styles.webview} 
              />
            )}
          </View>
          
          {/* Face Detected Message */}
          {faceDetected && (
            <View style={styles.faceDetectedContainer}>
              <Text style={styles.faceDetectedText}>Face Detected</Text>
            </View>
          )}
        </View>

        {/* Right Panel - Controls */}
        <View style={styles.controlsPanel}>
          {/* Stream Controls */}
          <View style={styles.controlSection}>
            {/* <View style={styles.sectionHeader}>
              <View style={styles.powerIcon} />
              <Text style={styles.sectionTitle}>STREAM CONTROLS</Text>
            </View> */}
            
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Stream</Text>
              <Switch
                value={streamActive}
                onValueChange={setStreamActive}
                trackColor={{ false: '#767577', true: '#e1e1e1' }}
                thumbColor={streamActive ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
              />
            </View>
          </View>

          {/* Device Controls */}
          <View style={styles.controlSection}>
            {/* <View style={styles.sectionHeader}>
              <View style={styles.powerIcon} />
              <Text style={styles.sectionTitle}>DEVICE CONTROLS</Text>
            </View> */}
            
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Active</Text>
              <Switch
                value={deviceActive}
                onValueChange={(newValue) => {
                  setDeviceActive(newValue);
                  if (newValue) {
                    sendActiveCommand(); // Send 0xA8 command when toggled to active
                  }
                }}
                trackColor={{ false: '#767577', true: '#F06C9B' }}
                thumbColor={deviceActive ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
              />
            </View>
          </View>
          
          {/* Message Section */}
          <View style={styles.controlSection}>
            {/* <View style={styles.sectionHeader}>
              <View style={styles.powerIcon} />
              <Text style={styles.sectionTitle}>MESSAGE SECTION</Text>
            </View> */}
            
            <View style={styles.messageContainer}>
              <Text style={styles.messageTitle}>Detection Status:</Text>
              <View style={[styles.statusIndicator, faceDetected ? styles.statusActive : styles.statusInactive]}>
                <Text style={styles.statusText}>{faceDetected ? "Face Detected" : "No Face Detected"}</Text>
              </View>
              
              {lastDetectionTime && (
                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>Last Detection:</Text>
                  <Text style={styles.timeValue}>{lastDetectionTime}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#662D91', // Purple background
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  faceDetectionPanel: {
    flex: 2, // Increased to take up more space
    backgroundColor: '#F06C9B', // Pink background
    borderRadius: 20,
    padding: 20,
    marginRight: 10,
    alignItems: 'center',
    position: 'relative', // Added to position the face detected message
  },
  panelTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  faceDetectedContainer: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -75 }], // Center the element (half of the width)
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: 150,
    alignItems: 'center',
  },
  faceDetectedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsPanel: {
    flex: 1, // Keeps right panel smaller compared to left panel
    borderRadius: 20,
    padding: 20,
  },
  controlSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  powerIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F9A826', // Yellow/orange border
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 15,
  },
  controlLabel: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 15,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  statusIndicator: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  statusActive: {
    backgroundColor: '#4CAF50', // Green for active
  },
  statusInactive: {
    backgroundColor: '#F44336', // Red for inactive
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 6,
  },
  timeLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  timeValue: {
    color: '#F9A826', // Yellow/orange for time value
    fontWeight: 'bold',
    fontSize: 14,
  }
});