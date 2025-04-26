// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import Svg, { Polygon } from 'react-native-svg';

// // Custom gradient background component
// const GradientBackground = ({ children }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.gradientOverlay} />
//       {children}
//     </View>
//   );
// };

// // Hexagon button component using SVG
// const HexagonButton = ({ label, color, style }) => {
//   return (
//     <View style={[styles.hexagonContainer, style]}>
//       <Svg height="100" width="100" viewBox="0 0 100 100">
//         <Polygon
//           points="50,10 90,30 90,70 50,90 10,70 10,30"
//           fill={color}
//           stroke="white"
//           strokeWidth="3"
//         />
//       </Svg>
//       <Text style={styles.hexagonText}>{label}</Text>
//     </View>
//   );
// };

// const LearnAndPlayScreen = () => {
//   const [isPressed, setIsPressed] = useState(false);
  
//   const handlePlayPress = () => {
//     // Example action when Play Now is pressed
//     Alert.alert('Play Now', 'Starting your adventure!');
//     // Navigation could be handled here, e.g.:
//     // navigation.navigate('GameScreen');
//   };

//   return (
//     <GradientBackground>
//       {/* Logo */}
//       <View style={styles.logoContainer}>
//         <View style={styles.logoSquare} />
//         <View style={styles.logoCircle} />
//         <View style={styles.logoSquareBottom} />
//         <View style={styles.logoHalfCircle} />
//       </View>

//       {/* Title */}
//       <Text style={styles.title}>Lets Learn & Play !</Text>
//       <Text style={styles.subtitle}>Adventure awaits you!</Text>

//       {/* Play Button - with press feedback */}
//       <TouchableOpacity 
//         style={[
//           styles.playButton,
//           isPressed && styles.playButtonPressed
//         ]}
//         activeOpacity={0.7}
//         onPress={handlePlayPress}
//         onPressIn={() => setIsPressed(true)}
//         onPressOut={() => setIsPressed(false)}
//       >
//         <View style={styles.playIcon}>
//           <View style={styles.playTriangle} />
//         </View>
//         <Text style={styles.playButtonText}>Play Now</Text>
//       </TouchableOpacity>

//       {/* Hexagon buttons */}
//       <HexagonButton label="AI" color="#e57bb8" style={styles.aiHex} />
//       <HexagonButton label="Robotic\ncar" color="#7be57b" style={styles.roboticHex} />
//       <HexagonButton label="Automation" color="#e5b97b" style={styles.automationHex} />
//       <HexagonButton label="Sensor" color="#7bcce5" style={styles.sensorHex} />
//       <HexagonButton label="Input" color="#e57b7b" style={styles.inputHex} />
//       <HexagonButton label="Output" color="#b57be5" style={styles.outputHex} />
      
//       {/* Connection lines */}
//       <View style={styles.connectorLine} />
//     </GradientBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4c8bf5',
//   },
//   gradientOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#63a4ff',
//     opacity: 0.5,
//   },
//   logoContainer: {
//     position: 'absolute',
//     top: 40,
//     left: 40,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logoSquare: {
//     width: 30,
//     height: 30,
//     backgroundColor: '#ff7f50',
//   },
//   logoCircle: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#7bcce5',
//     marginLeft: -15,
//   },
//   logoSquareBottom: {
//     width: 30,
//     height: 30,
//     backgroundColor: '#ff7f50',
//     position: 'absolute',
//     top: 25,
//   },
//   logoHalfCircle: {
//     width: 30,
//     height: 30,
//     borderTopRightRadius: 30,
//     borderBottomRightRadius: 30,
//     backgroundColor: '#ff7f50',
//     position: 'absolute',
//     top: 25,
//     left: 15,
//   },
//   title: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 28,
//     color: 'white',
//     marginBottom: 40,
//   },
//   playButton: {
//     flexDirection: 'row',
//     backgroundColor: '#ff7f50',
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 50,
//     elevation: 5, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   playButtonPressed: {
//     backgroundColor: '#e06e40', // Slightly darker when pressed
//     elevation: 2,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     transform: [{ scale: 0.98 }],
//   },
//   playIcon: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   playTriangle: {
//     width: 0,
//     height: 0,
//     backgroundColor: 'transparent',
//     borderStyle: 'solid',
//     borderLeftWidth: 8,
//     borderRightWidth: 8,
//     borderBottomWidth: 12,
//     borderLeftColor: 'transparent',
//     borderRightColor: 'transparent',
//     borderBottomColor: 'white',
//     transform: [{ rotate: '90deg' }],
//     marginLeft: 3,
//   },
//   playButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   hexagonContainer: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   hexagonText: {
//     position: 'absolute',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//     width: 80,
//   },
//   aiHex: {
//     top: '25%',
//     left: '15%',
//   },
//   roboticHex: {
//     top: '45%',
//     left: '10%',
//   },
//   automationHex: {
//     top: '65%',
//     left: '20%',
//   },
//   sensorHex: {
//     top: '15%',
//     right: '10%',
//   },
//   inputHex: {
//     top: '40%',
//     right: '15%',
//   },
//   outputHex: {
//     top: '65%',
//     right: '25%',
//   },
//   connectorLine: {
//     position: 'absolute',
//     width: '80%',
//     height: '70%',
//     borderWidth: 1,
//     borderColor: 'white',
//     borderRadius: 250,
//     borderBottomWidth: 0,
//     borderRightWidth: 0.5,
//     borderLeftWidth: 0.5,
//   },
// });

// export default LearnAndPlayScreen;


import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  SafeAreaView,
  PanResponder
} from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

export default function MorningAlarm() {
  const [darkThreshold, setDarkThreshold] = useState(0);
  const [buzzerValue, setBuzzerValue] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const lastSentTime = useRef(0);

  const darknessSliderRef = useRef(null);
  const buzzerSliderRef = useRef(null);

  const [darknessSliderWidth, setDarknessSliderWidth] = useState(0);
  const [buzzerSliderWidth, setBuzzerSliderWidth] = useState(0);

  const sendUDPCommand = (darkness, buzzer) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;
  
    const client = dgram.createSocket('udp4');
    const darknessValue = Math.round(darkness);
    const buzzerVal = Math.round(buzzer);
  
    // If darkness and buzzer values are both 0, send '0xC0'
    const message = Buffer.from([darkness === 0 && buzzer === 0 ? 0xC0 : 0xE1, darknessValue, buzzerVal]);
  
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
  
    console.log(`📡 Sent UDP: ${darkness === 0 && buzzer === 0 ? 'C0' : 'E0'} ${darknessValue} ${buzzerVal}`);
  };

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    // Send the correct command based on the toggle state
    if (newState) {
      sendUDPCommand(darkThreshold, buzzerValue); // This will send 0xE1 when it's on
    } else {
      sendUDPCommand(0, 0); // This will send 0xC0 when it's off
    }
  };

  const updateDarkThreshold = (xPosition) => {
    const relativeX = Math.max(0, Math.min(xPosition, darknessSliderWidth));
    const newValue = Math.round((relativeX / darknessSliderWidth) * 100);
    setDarkThreshold(newValue);
  };

  const updateBuzzerValue = (xPosition) => {
    const relativeX = Math.max(0, Math.min(xPosition, buzzerSliderWidth));
    const newValue = Math.round((relativeX / buzzerSliderWidth) * 100);
    setBuzzerValue(newValue);
  };

  const darknessPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (darknessSliderRef.current) {
        darknessSliderRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = evt.nativeEvent.locationX;
          updateDarkThreshold(touchX);
        });
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (darknessSliderRef.current) {
        darknessSliderRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = gestureState.moveX - px;
          updateDarkThreshold(touchX);
        });
      }
    },
  });

  const buzzerPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (buzzerSliderRef.current) {
        buzzerSliderRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = evt.nativeEvent.locationX;
          updateBuzzerValue(touchX);
        });
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (buzzerSliderRef.current) {
        buzzerSliderRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = gestureState.moveX - px;
          updateBuzzerValue(touchX);
        });
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainerWrapper}>
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <Icon name="lamp" size={24} color="white" style={styles.iconMargin} />
              <Text style={styles.headerText}>Night Lamp</Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsGrid}>
          <View style={styles.controlsRow}>
            <View style={styles.controlContainer}>
              <View style={styles.labelRow}>
                <Icon name="brightness-7" size={20} color="white" style={styles.iconMargin} />
                <Text style={styles.labelText}>Darkness</Text>
                <View style={styles.valueDisplayContainer}>
                  <Text style={styles.valueText}>{darkThreshold}</Text>
                </View>
              </View>
              <View
                style={styles.sliderContainer}
                ref={darknessSliderRef}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  setDarknessSliderWidth(width);
                }}
                {...darknessPanResponder.panHandlers}
              >
                <View style={styles.slider}>
                  <View style={[styles.sliderTrack, { width: `${darkThreshold}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${darkThreshold}%` }]} />
                </View>
              </View>
            </View>

            <View style={styles.controlContainer}>
              <View style={styles.labelRow}>
                <Icon name="brightness-7" size={20} color="white" style={styles.iconMargin} />
                <Text style={styles.labelText}>LED Brightness</Text>
                <View style={styles.valueDisplayContainer}>
                  <Text style={styles.valueText}>{buzzerValue}</Text>
                </View>
              </View>
              <View
                style={styles.sliderContainer}
                ref={buzzerSliderRef}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  setBuzzerSliderWidth(width);
                }}
                {...buzzerPanResponder.panHandlers}
              >
                <View style={styles.slider}>
                  <View style={[styles.sliderTrack, { width: `${buzzerValue}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${buzzerValue}%` }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.setButton,
            { backgroundColor: isOn ? '#F149A1' : '#F149A1' },
          ]}
          onPress={handleToggle}
        >
          <Icon
            name={isOn ? 'power' : 'power-standby'}  
            size={24}
            color="white"
            style={styles.iconMargin}
          />
          <Text style={styles.buttonText}>{isOn ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B2E83',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: '#673AB7',
    borderRadius: 30,
    alignItems: 'center',
    position: 'relative',
  },
  headerContainerWrapper: {
    position: 'absolute',
    top: -25,
    width: '100%',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F149A1',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  iconMargin: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controlsGrid: {
    width: '100%',
    marginTop: 30,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlContainer: {
    width: '48%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20,
  },
  valueDisplayContainer: {
    backgroundColor: '#F149A1',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  valueText: {
    color: 'white',
    fontSize: 18,
  },
  sliderContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  slider: {
    width: '100%',
    height: 8,
    backgroundColor: '#483285',
    borderRadius: 4,
    position: 'relative',
  },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFEB3B',
    borderRadius: 4,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
    top: -6,
    marginLeft: -10,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setButton: {
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
