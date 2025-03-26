// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   ImageBackground,
//   SafeAreaView,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';
// import { WebView } from 'react-native-webview';

// const { width, height } = Dimensions.get('window');

// const ESP32_IP = '192.168.0.101'; // Change to your ESP32 IP
// const ESP32_PORT = 8888;
// const COMMAND_STOP = 0xB0;
// const COMMANDS = {
//   forward: 0xB1,
//   backward: 0xB2,
//   left: 0xB3,
//   right: 0xB4,
// };

// // Replace with the URL of your video stream
// const STREAM_URL = 'http://192.168.0.196:81/stream';

// export default function RoboticCarController() {
//   const [isMoving, setIsMoving] = useState(false);
//   const [activeDirection, setActiveDirection] = useState(null);
//   const lastSentTime = useRef(0);

//   const sendUDPCommand = command => {
//     const now = Date.now();
//     if (now - lastSentTime.current < 50) return;
//     lastSentTime.current = now;

//     const client = dgram.createSocket('udp4');
//     const message = Buffer.from([command]);

//     client.on('error', err => {
//       console.error('UDP Error:', err);
//       client.close();
//     });

//     client.bind(0, () => {
//       client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, err => {
//         if (err) console.error('Send Error:', err);
//         client.close();
//       });
//     });

//     console.log(`📡 Sent command: 0x${command.toString(16).toUpperCase()}`);
//   };

//   const handleDirectionPress = direction => {
//     setActiveDirection(direction);
//     sendUDPCommand(COMMANDS[direction]);
//   };

//   const handleDirectionRelease = () => {
//     setActiveDirection(null);
//     sendUDPCommand(COMMAND_STOP);
//   };

//   const toggleMovement = () => {
//     const newIsMoving = !isMoving;
//     setIsMoving(newIsMoving);
//   };

//   useEffect(() => {
//     if (!isMoving) {
//       sendUDPCommand(COMMAND_STOP);
//     }
//   }, [isMoving]);

//   const DirectionButton = ({ direction, icon }) => (
//     <TouchableOpacity
//       style={[
//         styles.directionButton,
//         styles[`${direction}Button`],
//         activeDirection === direction && styles.activeDirection,
//       ]}
//       onPressIn={() => handleDirectionPress(direction)}
//       onPressOut={handleDirectionRelease}
//     >
//       <Icon name={icon} size={40} color="#FFFFFF" />
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ImageBackground
//         source={require('./assets/cartoon-road.jpg')}
//         style={styles.container}
//         resizeMode="cover"
//       >
//         <View style={styles.rowContainer}>
//           {/* Video Stream Section */}
//           <View style={styles.videoContainer}>
//             <WebView
//               source={{ uri: STREAM_URL }}
//               style={styles.videoStream}
//               onError={error => {
//                 console.error('WebView Error:', error);
//                 if (error.nativeEvent && error.nativeEvent.description) {
//                   console.error('WebView Error Description:', error.nativeEvent.description);
//                 }
//               }}
//               javaScriptEnabled={Platform.OS === 'android'} // Enable JavaScript for Android
//             />
//           </View>

//           {/* Spacing */}
//           <View style={{ width: 10 }} />

//           {/* Controls Section */}
//           <View style={styles.controlsContainer}>
//             {/* Directional Controls */}
//             <View style={styles.directionalControls}>
//               {/* Update directional controls to use DirectionButton */}
//               <DirectionButton direction="forward" icon="arrow-up" />

//               <View style={styles.horizontalControls}>
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
//                   <DirectionButton direction="left" icon="arrow-back" />
//                 </View>

//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                   <TouchableOpacity
//                     style={[
//                       styles.directionButton,
//                       isMoving
//                         ? styles.startStopButtonActive
//                         : styles.startStopButtonInactive,
//                     ]}
//                     onPress={toggleMovement}
//                   >
//                     <Icon name={isMoving ? 'pause' : 'play'} size={40} color="#FFFFFF" />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
//                   <DirectionButton direction="right" icon="arrow-forward" />
//                 </View>
//               </View>

//               <DirectionButton direction="backward" icon="arrow-down" />
//             </View>
//           </View>
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 20,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   videoContainer: {
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     borderRadius: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     width: width * 0.55,
//     height: height * 0.75,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   videoStream: {
//     width: width * 0.5,
//     height: height * 0.65,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   videoPlaceholder: {
//     fontSize: 24,
//     fontFamily: 'Comic Sans MS',
//     color: '#2F4F4F',
//   },
//   offCameraView: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   offCameraText: {
//     fontSize: 18,
//     color: '#2F4F4F',
//     marginTop: 10,
//   },
//   controlsContainer: {
//     backgroundColor: 'rgba(255,255,255,0.8)',
//     borderRadius: 30,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     width: width * 0.3,
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     height: height * 0.75,
//   },
//   directionalControls: {
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     height: height * 0.55,
//   },
//   directionButton: {
//     padding: 10,
//     borderRadius: 15,
//     margin: 2,
//     alignItems: 'center',
//     borderWidth: 1,
//     justifyContent: 'center',
//   },
//   forwardButton: { backgroundColor: '#6495ED', borderColor: '#1E90FF' },
//   backwardButton: { backgroundColor: '#FFC0CB', borderColor: '#DC143C' },
//   leftButton: { backgroundColor: '#87CEEB', borderColor: '#1E90FF' },
//   rightButton: { backgroundColor: '#FFA07A', borderColor: '#FF4500' },
//   startStopButtonActive: { backgroundColor: '#32CD32', borderColor: '#228B22' },
//   startStopButtonInactive: { backgroundColor: '#FF3737', borderColor: '#FF0000' },
//   activeDirection: {
//     transform: [{ scale: 1.05 }],
//     elevation: 5,
//   },
//   horizontalControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//   },
// });








import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const ESP32_IP = '192.168.0.101'; // Change to your ESP32 IP
const ESP32_PORT = 8888;
const COMMAND_STOP = 0xB0;
const COMMANDS = {
  forward: 0xB1,
  backward: 0xB2,
  left: 0xB3,
  right: 0xB4,
};

// Replace with the URL of your video stream
const STREAM_URL = 'http://192.168.0.196:81/stream';

export default function RoboticCarController() {
  const [isMoving, setIsMoving] = useState(false);
  const [activeDirection, setActiveDirection] = useState(null);
  const lastSentTime = useRef(0);

  const sendUDPCommand = command => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    const client = dgram.createSocket('udp4');
    const message = Buffer.from([command]);

    client.on('error', err => {
      console.error('UDP Error:', err);
      client.close();
    });

    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, err => {
        if (err) console.error('Send Error:', err);
        client.close();
      });
    });

    console.log(`📡 Sent command: 0x${command.toString(16).toUpperCase()}`);
  };

  const handleDirectionPress = direction => {
    setActiveDirection(direction);
    sendUDPCommand(COMMANDS[direction]);
  };

  const handleDirectionRelease = () => {
    setActiveDirection(null);
    sendUDPCommand(COMMAND_STOP);
  };

  const toggleMovement = () => {
    const newIsMoving = !isMoving;
    setIsMoving(newIsMoving);
  };

  useEffect(() => {
    if (!isMoving) {
      sendUDPCommand(COMMAND_STOP);
    }
  }, [isMoving]);

  const DirectionButton = ({ direction, icon }) => (
    <TouchableOpacity
      style={[
        styles.directionButton,
        styles[`${direction}Button`],
        activeDirection === direction && styles.activeDirection,
      ]}
      onPressIn={() => handleDirectionPress(direction)}
      onPressOut={handleDirectionRelease}
    >
      <Icon name={icon} size={40} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('./assets/cartoon-road.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.rowContainer}>
          {/* Video Stream Section */}
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: STREAM_URL }}
              style={styles.videoStream}
              onError={error => {
                console.error('WebView Error:', error);
                if (error.nativeEvent && error.nativeEvent.description) {
                  console.error('WebView Error Description:', error.nativeEvent.description);
                }
              }}
              javaScriptEnabled={Platform.OS === 'android'} // Enable JavaScript for Android
            />
          </View>

          {/* Spacing */}
          <View style={{ width: 10 }} />

          {/* Controls Section */}
          <View style={styles.controlsContainer}>
            {/* Directional Controls */}
            <View style={styles.directionalControls}>
              {/* Update directional controls to use DirectionButton */}
              <DirectionButton direction="forward" icon="arrow-up" />

              <View style={styles.horizontalControls}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <DirectionButton direction="left" icon="arrow-back" />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[
                      styles.directionButton,
                      isMoving
                        ? styles.startStopButtonActive
                        : styles.startStopButtonInactive,
                    ]}
                    onPress={toggleMovement}
                  >
                    <Icon name={isMoving ? 'pause' : 'play'} size={40} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                  <DirectionButton direction="right" icon="arrow-forward" />
                </View>
              </View>

              <DirectionButton direction="backward" icon="arrow-down" />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  videoContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: width * 0.55,
    height: height * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoStream: {
    width: width * 0.5,
    height: height * 0.65,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  videoPlaceholder: {
    fontSize: 24,
    fontFamily: 'Comic Sans MS',
    color: '#2F4F4F',
  },
  offCameraView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  offCameraText: {
    fontSize: 18,
    color: '#2F4F4F',
    marginTop: 10,
  },
  controlsContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: width * 0.3,
    alignItems: 'center',
    justifyContent: 'space-around',
    height: height * 0.75,
  },
  directionalControls: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: height * 0.55,
  },
  directionButton: {
    padding: 10,
    borderRadius: 15,
    margin: 2,
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  forwardButton: { backgroundColor: '#6495ED', borderColor: '#1E90FF' },
  backwardButton: { backgroundColor: '#FFC0CB', borderColor: '#DC143C' },
  leftButton: { backgroundColor: '#87CEEB', borderColor: '#1E90FF' },
  rightButton: { backgroundColor: '#FFA07A', borderColor: '#FF4500' },
  startStopButtonActive: { backgroundColor: '#32CD32', borderColor: '#228B22' },
  startStopButtonInactive: { backgroundColor: '#FF3737', borderColor: '#FF0000' },
  activeDirection: {
    transform: [{ scale: 1.05 }],
    elevation: 5,
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
