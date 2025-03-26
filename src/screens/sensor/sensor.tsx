// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, Animated } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';

// const ESP32_IP = '192.168.0.196';
// const ESP32_PORT = 8888;
// const LISTEN_PORT = 12345; // Port to listen for incoming UDP packets

// export default function SensorHiveStatus() {
//   const [isPoweredOn, setIsPoweredOn] = useState(true);
//   const [hiveConnected, setHiveConnected] = useState(true);
//   const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedSensor, setSelectedSensor] = useState('IR');
//   const [sensorValue, setSensorValue] = useState(0);
//   const lastSentTime = useRef(0);

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, [fadeAnim]);

//   const sensors = ['IR', 'LDR', 'PIR', 'TILT', 'SOUND', 'MOIST', 'MAGNET', 'VIBRATION'];

//   const sendUDPCommand = async (command) => {
//     const now = Date.now();
//     if (now - lastSentTime.current < 50) return;
//     lastSentTime.current = now;

//     try {
//       const client = dgram.createSocket('udp4');
//       const message = Buffer.from([command]);

//       client.on('error', (err) => {
//         console.error('UDP Error:', err);
//         client.close();
//       });

//       await new Promise(resolve => {
//         client.bind(0, () => {
//           client.send(
//             message,
//             0,
//             message.length,
//             ESP32_PORT,
//             ESP32_IP,
//             (err) => {
//               if (err) console.error('Send Failed:', err);
//               client.close();
//               resolve();
//             }
//           );
//         });
//       });
//     } catch (error) {
//       console.error('Error sending UDP command:', error);
//     }
//   };

//   const handlePowerToggle = async (state) => {
//     setIsPoweredOn(state);
//     if (state) {
//       await sendUDPCommand(0xA0); // Send A0 for Turn On
//     } else {
//       await sendUDPCommand(0xD9); // Send D9 for Turn Off
//     }
//   };

//   // useEffect(() => {
//   //   const server = dgram.createSocket('udp4');

//   //   server.on('listening', () => {
//   //     console.log('UDP server listening');
//   //   });

//   //   server.on('message', (msg, rinfo) => {
//   //     try {
//   //       const value = Buffer.from(msg)[0]; // Read first byte (0-255)
//   //       const percentage = Math.round((value / 255) * 100); // Convert to percentage
//   //       setSensorValue(percentage);
//   //       setHiveConnected(true);
//   //     } catch (error) {
//   //       console.error('Error processing sensor data:', error);
//   //       setHiveConnected(false);
//   //     }
//   //   });

//   //   server.on('error', (err) => {
//   //     console.error('UDP server error:', err);
//   //     setHiveConnected(false);
//   //   });

//   //   server.bind(LISTEN_PORT);

//   //   return () => {
//   //     server.close();
//   //   };
//   // }, []);
//   // useEffect(() => {
//   //   const server = dgram.createSocket('udp4');
  
//   //   server.on('message', (msg, rinfo) => {
//   //     try {
//   //       // For 1-byte payload (0-255)
//   //       const rawValue = msg.readUInt8(0); 
//   //       const percentage = Math.round((rawValue / 255) * 100);
        
//   //       // For 2-byte payload (if using 0-4095 range)
//   //       // const rawValue = msg.readUInt16BE(0);
//   //       // const percentage = Math.round((rawValue / 4095) * 100);
        
//   //       setSensorValue(percentage);
//   //       setHiveConnected(true);
//   //     } catch (error) {
//   //       console.error('Error processing sensor data:', error);
//   //       setHiveConnected(false);
//   //     }
//   //   });
  
//   //   // Add error handling
//   //   server.on('error', (err) => {
//   //     console.error('UDP error:', err);
//   //     setHiveConnected(false);
//   //   });
  
//   //   server.bind(LISTEN_PORT);
//   //   return () => server.close();
//   // }, []);



//   useEffect(() => {
//     const server = dgram.createSocket('udp4');
  
//     server.on('message', (msg, rinfo) => {
//       try {
//         const rawValue = msg.readUInt8(0); // Directly use the byte (0-100)
//         console.log('Received sensor value:', rawValue); // Debug log
//         setSensorValue(rawValue);
//         setHiveConnected(true);
//       } catch (error) {
//         console.error('Error processing sensor data:', error);
//         setHiveConnected(false);
//       }
//     });
  
//     server.on('error', (err) => {
//       console.error('UDP error:', err);
//       setHiveConnected(false);
//     });
  
//     server.bind(LISTEN_PORT);
//     return () => server.close();
//   }, []);

//   return (
//     <ImageBackground source={require('../robotic_car/assets/cartoon-road.jpg')} style={styles.container}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity style={styles.dropdownContainer} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
//           <Text style={styles.dropdownText}>{selectedSensor}</Text>
//           <Icon name="arrow-drop-down" size={15} color="black" />
//         </TouchableOpacity>
//         {isDropdownOpen && (
//           <View style={styles.dropdownOptions}>
//             {sensors.map(sensor => (
//               <TouchableOpacity key={sensor} style={styles.option} onPress={() => {
//                 setSelectedSensor(sensor);
//                 setIsDropdownOpen(false);
//               }}>
//                 <Text style={styles.optionText}>{sensor}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>

//       <View style={styles.rowContainer}>
//         <View style={styles.statusCard}>
//           <Text style={styles.title}>Power Control</Text>
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity 
//               style={[styles.powerButton, !isPoweredOn ? styles.activeButton : styles.inactiveButton]}
//               onPress={() => handlePowerToggle(false)}
//             >
//               <View style={styles.buttonContent}>
//                 <Icon name="power-off" size={15} color="white" />
//                 <Text style={styles.buttonText}>Turn Off</Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[styles.powerButton, isPoweredOn ? styles.activeButton : styles.inactiveButton]}
//               onPress={() => handlePowerToggle(true)}
//             >
//               <View style={styles.buttonContent}>
//                 <Icon name="power" size={15} color="white" />
//                 <Text style={styles.buttonText}>Turn On</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={[styles.statusCard, styles.hiveCard]}>
//           <Text style={styles.title}>Hive Connection</Text>
//           <View style={styles.statusRow}>
//             <Animated.View style={[styles.ledIndicator, hiveConnected ? styles.ledOn : styles.ledOff,
//               { opacity: hiveConnected ? 1 : fadeAnim }]} />
//             <Text style={styles.statusText}>
//               {hiveConnected ? 'Connected' : 'Searching...'}
//             </Text>
//           </View>
//           <Text style={styles.hiveMessage}>
//             Hive Status: {hiveConnected ? 'Receiving Data' : 'No Connection'}
//           </Text>
//           {hiveConnected && (
//             <Text style={styles.sensorValueText}>
//               IR Sensor Value: {sensorValue}%
//             </Text>
//           )}
//           {!hiveConnected && (
//             <Text style={styles.searchingText}>
//               Trying to establish connection...
//             </Text>
//           )}
//         </View>
//       </View>
//     </ImageBackground>
//   );
// }

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//   },
//   headerContainer: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     zIndex: 10, // Set zIndex higher for the dropdown
//   },
//   dropdownContainer: {
//     backgroundColor: '#fff',
//     padding: 5,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: 120, // Adjusted width
//     zIndex: 10, // Ensure dropdown container is above other elements
//   },
//   dropdownText: {
//     fontSize: 12,
//     marginRight: 5,
//   },
//   dropdownOptions: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     backgroundColor: '#fff',
//     padding: 5,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 4,
//     width: 120, // Adjusted width
//     zIndex: 10, // Ensure dropdown options are above other elements
//   },
//   option: {
//     padding: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     width: '100%', // Ensure option width matches dropdown width
//   },
//   optionText: {
//     fontSize: 12,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: width * 0.9,
//     marginTop: 100, // Adjusted for dropdown space
//   },
//   statusCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     width: width * 0.44,
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   hiveCard: {
//     backgroundColor: 'rgba(240,240,240,0.95)',
//    },
//    title:{
//        fontSize :18 ,
//        fontWeight :'bold',
//        color:'#1565C0',
//        marginBottom :10 ,
//        textAlign:'center'
//    },
//    buttonContainer:{
//        flexDirection:'column',
//        alignItems:'center'
//    },
//    powerButton:{
//        paddingVertical :10 ,
//        paddingHorizontal :15 ,
//        borderRadius :15 ,
//        alignItems:'center',
//        width:'100%',
//        marginBottom :10
//    },
//    activeButton:{
//        backgroundColor:'#87CEEB'
//    },
//    inactiveButton:{
//        backgroundColor:'#FF0000'
//    },
//    buttonContent:{
//        flexDirection:'row',
//        alignItems:'center'
//    },
//    buttonText:{
//        fontSize :14 ,
//        fontWeight :'bold',
//        color:'white' ,
//        marginLeft :5
//    },
//    statusRow:{
//        flexDirection:'row',
//        alignItems:'center',
//        justifyContent:'center' ,
//        marginVertical :10
//    },
//    ledIndicator:{
//        width :15 ,
//        height :15 ,
//        borderRadius :7.5 ,
//        marginRight :10
//    },
//    ledOn:{
//        backgroundColor:'#4CAF50'
//    },
//    ledOff:{
//        backgroundColor:'#F44336'
//    },
//    statusText:{
//        fontSize :14 ,
//        fontWeight :'bold' ,
//        color:'#37474F'
//    },
//    hiveMessage:{
//        fontSize :12 ,
//        color:'#1565C0' ,
//        textAlign:'center' ,
//        marginTop :10 ,
//        padding :8 ,
//        backgroundColor:'rgba(255 ,255 ,255 ,0.5)' ,
//        borderRadius :10
//    },
//    sensorValueText: {
//      fontSize: 12,
//      color: '#1565C0',
//      textAlign: 'center',
//      marginTop: 5,
//      padding: 8,
//      backgroundColor: 'rgba(255,255,255,0.5)',
//      borderRadius: 10,
//    },
//    searchingText:{
//       fontSize :10 ,
//       fontStyle :'italic' ,
//       color:'#777' ,
//       marginTop :5 ,
//       textAlign:'center'
//    }
// });

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;
const LISTEN_PORT = 12345;

// Sensor command mapping
const sensorCommands = {
  'IR': 0xA0,
  'LDR': 0xA1,
  'PIR': 0xA2,
  'TILT': 0xA3,
  'SOUND': 0xA4,
  'MOIST': 0xA5,
  'MAGNET': 0xA6,
  'VIBRATION': 0xA7
};

export default function SensorHiveStatus() {
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [hiveConnected, setHiveConnected] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState('IR');
  const [rawSensorValue, setRawSensorValue] = useState(0);
  const lastSentTime = useRef(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const sensors = Object.keys(sensorCommands);

  const sendUDPCommand = async (command) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    try {
      const client = dgram.createSocket('udp4');
      const message = Buffer.from([command]);

      client.on('error', (err) => {
        console.error('UDP Error:', err);
        client.close();
      });

      await new Promise(resolve => {
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
              resolve();
            }
          );
        });
      });
    } catch (error) {
      console.error('Error sending UDP command:', error);
    }
  };

  const handlePowerToggle = async (state) => {
    setIsPoweredOn(state);
    await sendUDPCommand(state ? 0xA0 : 0xD9);
  };

  useEffect(() => {
    const server = dgram.createSocket('udp4');
  
    server.on('message', (msg, rinfo) => {
      try {
        const rawValue = msg.readUInt8(0);
        console.log('Raw sensor value:', rawValue);
        setRawSensorValue(rawValue);
        setHiveConnected(true);
      } catch (error) {
        console.error('Error processing sensor data:', error);
        setHiveConnected(false);
      }
    });
  
    server.on('error', (err) => {
      console.error('UDP error:', err);
      setHiveConnected(false);
    });
  
    server.bind(LISTEN_PORT);
    return () => server.close();
  }, []);

  const getSensorValue = () => {
    switch(selectedSensor) {
      case 'IR':
      case 'MOIST':
        return Math.round((rawSensorValue));
      case 'LDR':
        return rawSensorValue;
      case 'PIR':
        return rawSensorValue > 128 ? 'Motion Detected' : 'No Motion';
      case 'TILT':
        return rawSensorValue > 0 ? 'Tilted' : 'Level';
      case 'SOUND':
        return `${Math.round(rawSensorValue / 2.55)} dB`;
      case 'MAGNET':
        return rawSensorValue > 0 ? 'Magnetic Field' : 'No Field';
      case 'VIBRATION':
        return rawSensorValue > 128 ? 'Vibrating' : 'Stable';
      default:
        return 0;
    }
  };

  const getUnit = () => {
    if (['IR', 'MOIST'].includes(selectedSensor)) return '%';
    if (selectedSensor === 'LDR') return 'lux';
    if (selectedSensor === 'SOUND') return '';
    return '';
  };

  const handleSensorSelect = (sensor) => {
    setSelectedSensor(sensor);
    setIsDropdownOpen(false);
    sendUDPCommand(sensorCommands[sensor]);
  };

  return (
    <ImageBackground source={require('../robotic_car/assets/cartoon-road.jpg')} style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.dropdownContainer} 
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.dropdownText}>{selectedSensor}</Text>
          <Icon name="arrow-drop-down" size={15} color="black" />
        </TouchableOpacity>
        
        {isDropdownOpen && (
          <View style={styles.dropdownOptions}>
            {sensors.map(sensor => (
              <TouchableOpacity 
                key={sensor} 
                style={styles.option} 
                onPress={() => handleSensorSelect(sensor)}
              >
                <Text style={styles.optionText}>{sensor}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.statusCard}>
          <Text style={styles.title}>Power Control</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.powerButton, !isPoweredOn ? styles.activeButton : styles.inactiveButton]}
              onPress={() => handlePowerToggle(false)}
            >
              <View style={styles.buttonContent}>
                <Icon name="power-off" size={15} color="white" />
                <Text style={styles.buttonText}>Turn Off</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.powerButton, isPoweredOn ? styles.activeButton : styles.inactiveButton]}
              onPress={() => handlePowerToggle(true)}
            >
              <View style={styles.buttonContent}>
                <Icon name="power" size={15} color="white" />
                <Text style={styles.buttonText}>Turn On</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.statusCard, styles.hiveCard]}>
          <Text style={styles.title}>Hive Connection</Text>
          <View style={styles.statusRow}>
            <Animated.View 
              style={[
                styles.ledIndicator, 
                hiveConnected ? styles.ledOn : styles.ledOff,
                { opacity: hiveConnected ? 1 : fadeAnim }
              ]} 
            />
            <Text style={styles.statusText}>
              {hiveConnected ? 'Connected' : 'Searching...'}
            </Text>
          </View>
          <Text style={styles.hiveMessage}>
            Hive Status: {hiveConnected ? 'Receiving Data' : 'No Connection'}
          </Text>
          {hiveConnected ? (
            <Text style={styles.sensorValueText}>
              {selectedSensor} Sensor: {getSensorValue()} {getUnit()}
            </Text>
          ) : (
            <Text style={styles.searchingText}>
              Trying to establish connection...
            </Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}



const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  headerContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10, // Set zIndex higher for the dropdown
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    width: 120, // Adjusted width
    zIndex: 10, // Ensure dropdown container is above other elements
  },
  dropdownText: {
    fontSize: 12,
    marginRight: 5,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    width: 120, // Adjusted width
    zIndex: 10, // Ensure dropdown options are above other elements
  },
  option: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%', // Ensure option width matches dropdown width
  },
  optionText: {
    fontSize: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginTop: 100, // Adjusted for dropdown space
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: width * 0.44,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  hiveCard: {
    backgroundColor: 'rgba(240,240,240,0.95)',
   },
   title:{
       fontSize :18 ,
       fontWeight :'bold',
       color:'#1565C0',
       marginBottom :10 ,
       textAlign:'center'
   },
   buttonContainer:{
       flexDirection:'column',
       alignItems:'center'
   },
   powerButton:{
       paddingVertical :10 ,
       paddingHorizontal :15 ,
       borderRadius :15 ,
       alignItems:'center',
       width:'100%',
       marginBottom :10
   },
   activeButton:{
       backgroundColor:'#87CEEB'
   },
   inactiveButton:{
       backgroundColor:'#FF0000'
   },
   buttonContent:{
       flexDirection:'row',
       alignItems:'center'
   },
   buttonText:{
       fontSize :14 ,
       fontWeight :'bold',
       color:'white' ,
       marginLeft :5
   },
   statusRow:{
       flexDirection:'row',
       alignItems:'center',
       justifyContent:'center' ,
       marginVertical :10
   },
   ledIndicator:{
       width :15 ,
       height :15 ,
       borderRadius :7.5 ,
       marginRight :10
   },
   ledOn:{
       backgroundColor:'#4CAF50'
   },
   ledOff:{
       backgroundColor:'#F44336'
   },
   statusText:{
       fontSize :14 ,
       fontWeight :'bold' ,
       color:'#37474F'
   },
   hiveMessage:{
       fontSize :12 ,
       color:'#1565C0' ,
       textAlign:'center' ,
       marginTop :10 ,
       padding :8 ,
       backgroundColor:'rgba(255 ,255 ,255 ,0.5)' ,
       borderRadius :10
   },
   sensorValueText: {
     fontSize: 12,
     color: '#1565C0',
     textAlign: 'center',
     marginTop: 5,
     padding: 8,
     backgroundColor: 'rgba(255,255,255,0.5)',
     borderRadius: 10,
   },
   searchingText:{
      fontSize :10 ,
      fontStyle :'italic' ,
      color:'#777' ,
      marginTop :5 ,
      textAlign:'center'
   }
});
