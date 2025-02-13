// // import React, { useState, useEffect, useRef } from 'react';
// // import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
// // import dgram from 'react-native-udp';
// // import { Buffer } from 'buffer';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // const UDP_PORT = 8888;
// // const ESP32_IP = '192.168.0.101';

// // const HallSensorScreen: React.FC = () => {
// //   const insets = useSafeAreaInsets();
// //   const [isOn, setIsOn] = useState(false);
// //   const [imageData, setImageData] = useState<string | null>(null);
// //   const lastSentTime = useRef<number>(0);
// //   const socketRef = useRef<dgram.Socket | null>(null);

// //   useEffect(() => {
// //     const socket = dgram.createSocket('udp4');
// //     socketRef.current = socket;

// //     socket.on('message', (msg) => {
// //       const chunk = msg.toString();
      
// //       // Check for start/end markers (implement these on ESP32)
// //       if (chunk.startsWith('[START]')) {
// //         bufferRef.current = []; // Reset buffer
// //       }
// //       bufferRef.current.push(chunk);
      
// //       if (chunk.endsWith('[END]')) {
// //         const fullImage = bufferRef.current.join('');
// //         setImageData(`data:image/jpeg;base64,${fullImage}`);
// //       }
// //     });

// //     socket.on('error', (err) => {
// //       console.error('UDP Socket Error:', err);
// //       socket.close();
// //     });

// //     socket.bind(UDP_PORT);

// //     return () => {
// //       socket.close();
// //     };
// //   }, []);

// //   const sendServoCommand = (commandByte: number) => {
// //     const now = Date.now();
// //     if (now - lastSentTime.current < 50) return;
// //     lastSentTime.current = now;

// //     const client = dgram.createSocket('udp4');
// //     client.bind(0, () => {
// //       const message = Buffer.from([commandByte]);
// //       client.send(message, 0, message.length, UDP_PORT, ESP32_IP, (error) => {
// //         if (error) console.error('UDP Send Error:', error);
// //         client.close();
// //       });
// //     });
// //   };

// //   return (
// //     <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}> 
// //       <Text style={styles.text}>Hall Sensor</Text>
// //       <View style={styles.buttonContainer}>
// //         <TouchableOpacity
// //           style={[styles.button, isOn && styles.buttonDisabled]}
// //           onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
// //           disabled={isOn}
// //         >
// //           <Text style={styles.buttonText}>Turn On</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity
// //           style={[styles.button, !isOn && styles.buttonDisabled]}
// //           onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
// //           disabled={!isOn}
// //         >
// //           <Text style={styles.buttonText}>Turn Off</Text>
// //         </TouchableOpacity>
// //       </View>
// //       {imageData && (
// //         <Image source={{ uri: imageData }} style={styles.image} />
// //       )}
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#FFFFFF',
// //   },
// //   text: {
// //     fontSize: 30,
// //     fontWeight: 'bold',
// //     color: 'rgb(32, 59, 147)',
// //   },
// //   buttonContainer: {
// //     flexDirection: 'row',
// //     marginTop: 20,
// //   },
// //   button: {
// //     marginHorizontal: 10,
// //     paddingVertical: 12,
// //     paddingHorizontal: 25,
// //     backgroundColor: 'rgb(32, 59, 147)',
// //     borderRadius: 8,
// //   },
// //   buttonDisabled: {
// //     backgroundColor: 'gray',
// //   },
// //   buttonText: {
// //     color: '#FFFFFF',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   image: {
// //     width: 300,
// //     height: 200,
// //     marginTop: 20,
// //     borderRadius: 8,
// //     backgroundColor: 'lightgray', // Added background color to see if image is loading
// //   },
// // });

// // export default HallSensorScreen;


// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const UDP_PORT = 8888;
// const ESP32_IP = '192.168.0.101';

// const HallSensorScreen: React.FC = () => {
//   const insets = useSafeAreaInsets();
//   const [isOn, setIsOn] = useState(false);
//   const [imageData, setImageData] = useState<string | null>(null);
//   const [base64Text, setBase64Text] = useState<string>('');
//   const lastSentTime = useRef<number>(0);
//   const socketRef = useRef<dgram.Socket | null>(null);
//   const [receivedChunks, setReceivedChunks] = useState<{ [key: number]: string }>({});
//   const [totalChunks, setTotalChunks] = useState<number>(0);

//   useEffect(() => {
//     const socket = dgram.createSocket('udp4');
//     socketRef.current = socket;

//     socket.on('message', (msg) => {
//       const message = msg.toString();

//       // Ensure we have enough commas to split
//       const firstComma = message.indexOf(',');
//       const secondComma = message.indexOf(',', firstComma + 1);

//       if (firstComma === -1 || secondComma === -1) return;

//       const seqStr = message.substring(0, firstComma);
//       const totalStr = message.substring(firstComma + 1, secondComma);
//       const data = message.substring(secondComma + 1);

//       const seq = parseInt(seqStr, 10);
//       const total = parseInt(totalStr, 10);

//       console.log(`Chunk ${seq + 1}/${total} received, size: ${data.length}`);

//       setReceivedChunks((prev) => ({ ...prev, [seq]: data }));
//       setTotalChunks(total);
//     });

//     socket.on('error', (err) => {
//       console.error('UDP Socket Error:', err);
//       socket.close();
//     });

//     socket.bind(UDP_PORT);

//     return () => {
//       socket.close();
//     };
//   }, []);

//   useEffect(() => {
//     if (Object.keys(receivedChunks).length === totalChunks && totalChunks > 0) {
//       // Reconstruct the base64 string in correct order
//       const fullData = Array.from({ length: totalChunks }, (_, i) => receivedChunks[i] || '').join('');
      
//       console.log(`Full Base64 received, length: ${fullData.length}`);
//       setBase64Text(fullData); 
//       setImageData(`data:image/jpeg;base64,${fullData}`);

//       // Reset chunks
//       setReceivedChunks({});
//       setTotalChunks(0);
//     }
//   }, [receivedChunks, totalChunks]);

//   const sendServoCommand = (commandByte: number) => {
//     const now = Date.now();
//     if (now - lastSentTime.current < 50) return;
//     lastSentTime.current = now;

//     const client = dgram.createSocket('udp4');
//     client.bind(0, () => {
//       const message = Buffer.from([commandByte]);
//       client.send(message, 0, message.length, UDP_PORT, ESP32_IP, (error) => {
//         if (error) console.error('UDP Send Error:', error);
//         client.close();
//       });
//     });
//   };

//   return (
//     <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
//       <Text style={styles.text}>Hall Sensor</Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, isOn && styles.buttonDisabled]}
//           onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
//           disabled={isOn}
//         >
//           <Text style={styles.buttonText}>Turn On</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, !isOn && styles.buttonDisabled]}
//           onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
//           disabled={!isOn}
//         >
//           <Text style={styles.buttonText}>Turn Off</Text>
//         </TouchableOpacity>
//       </View>

//       {imageData && (
//         <Image source={{ uri: imageData }} style={styles.image} />
//       )}

//       <ScrollView style={styles.scrollView}>
//         <Text style={styles.base64Text}>{base64Text}</Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   text: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: 'rgb(32, 59, 147)',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//   },
//   button: {
//     marginHorizontal: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     backgroundColor: 'rgb(32, 59, 147)',
//     borderRadius: 8,
//   },
//   buttonDisabled: {
//     backgroundColor: 'gray',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   image: {
//     width: 300,
//     height: 200,
//     marginTop: 20,
//     borderRadius: 8,
//     backgroundColor: 'lightgray',
//   },
//   scrollView: {
//     marginTop: 20,
//     maxHeight: 200,
//     paddingHorizontal: 10,
//   },
//   base64Text: {
//     fontSize: 10,
//     color: 'black',
//   },
// });

// export default HallSensorScreen;



// import React, { useState, useEffect, useRef } from 'react';
// import { View, ScrollView, Image, StyleSheet } from 'react-native';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Button, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const UDP_PORT = 8888;
// const ESP32_IP = '192.168.0.101';

// const HallSensorScreen: React.FC = () => {
//     const theme = useTheme();
//     const insets = useSafeAreaInsets();
//     const [isOn, setIsOn] = useState(false);
//     const [imageData, setImageData] = useState<string | null>(null);
//     const [base64Text, setBase64Text] = useState<string>('');
//     const lastSentTime = useRef<number>(0);
//     const socketRef = useRef<dgram.Socket | null>(null);
//     const [receivedChunks, setReceivedChunks] = useState<{ [key: number]: string }>({});
//     const [totalChunks, setTotalChunks] = useState<number>(0);
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         const socket = dgram.createSocket('udp4');
//         socketRef.current = socket;

//         socket.on('message', (msg) => {
//             const message = msg.toString();
//             const firstComma = message.indexOf(',');
//             const secondComma = message.indexOf(',', firstComma + 1);

//             if (firstComma === -1 || secondComma === -1) return;

//             const seqStr = message.substring(0, firstComma);
//             const totalStr = message.substring(firstComma + 1, secondComma);
//             const data = message.substring(secondComma + 1);

//             const seq = parseInt(seqStr, 10);
//             const total = parseInt(totalStr, 10);

//             setReceivedChunks((prev) => ({ ...prev, [seq]: data }));
//             setTotalChunks(total);
//         });

//         socket.on('error', (err) => {
//             console.error('UDP Socket Error:', err);
//             socket.close();
//         });

//         socket.bind(UDP_PORT);

//         return () => {
//             socket.close();
//         };
//     }, []);

//     useEffect(() => {
//         if (Object.keys(receivedChunks).length === totalChunks && totalChunks > 0) {
//             const fullData = Array.from({ length: totalChunks }, (_, i) => receivedChunks[i] || '').join('');

//             setBase64Text(fullData);
//             setImageData(`data:image/jpeg;base64,${fullData}`);

//             setReceivedChunks({});
//             setTotalChunks(0);
//         }
//     }, [receivedChunks, totalChunks]);

//     const sendServoCommand = (commandByte: number) => {
//         const now = Date.now();
//         if (now - lastSentTime.current < 50) return;
//         lastSentTime.current = now;

//         const client = dgram.createSocket('udp4');
//         client.bind(0, () => {
//             const message = Buffer.from([commandByte]);
//             client.send(message, 0, message.length, UDP_PORT, ESP32_IP, (error) => {
//                 if (error) console.error('UDP Send Error:', error);
//                 client.close();
//             });
//         });
//     };

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View style={[styles.container, { paddingTop: insets.top }]}>
//                 <Card style={styles.card}>
                    
//                         {/* Controls Panel */}
//                         <View style={styles.twoPaneLayout}>
//                             <Card style={styles.controlsPanel}>
//                                 <Card.Content>
//                                     <Text variant="titleLarge" style={styles.panelTitle}>
//                                         Device Controls
//                                     </Text>
//                                     <View style={styles.controls}>
//                                         <Button
//                                             mode="contained"
//                                             onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
//                                             disabled={isOn}
//                                             style={styles.button}
//                                         >
//                                             <Icon name="power" size={20} color="white" style={{ marginRight: 8 }} />
//                                             Activate Sensor
//                                         </Button>
//                                         <Button
//                                             mode="contained-tonal"
//                                             onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
//                                             disabled={!isOn}
//                                             style={styles.button}
//                                         >
//                                             <Icon name="power-off" size={20} color={theme.colors.onSurface} style={{ marginRight: 8 }} />
//                                             Deactivate Sensor
//                                         </Button>
//                                     </View>
//                                 </Card.Content>
//                             </Card>

//                             {/* Image Preview */}
//                             <Card style={styles.imagePreview}>
//                                 <Card.Content>
//                                     <Text variant="titleLarge" style={styles.panelTitle}>
//                                          Preview
//                                     </Text>
//                                     <View style={styles.imageContainer}>
//                                         {isLoading ? (
//                                             <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
//                                         ) : imageData ? (
//                                             <Image source={{ uri: imageData }} style={styles.image} />
//                                         ) : (
//                                             <View style={styles.waitingContainer}>
//                                                 <Icon name="image-off" size={40} color="#777" style={{ marginBottom: 8 }} />
//                                                 <Text variant="bodyMedium" style={styles.waitingText}>
//                                                     Waiting for image data...
//                                                 </Text>
//                                             </View>
//                                         )}
//                                     </View>
//                                 </Card.Content>
//                             </Card>
//                         </View>

//                         {/* Data Output */}
                       
                    
//                 </Card>
//             </View>
//         </SafeAreaView>
//     );
// };

// // const styles = StyleSheet.create({
// //     safeArea: {
// //         flex: 1,
// //         backgroundColor: '#F5F5F5', // Light gray background
// //     },
// //     container: {
// //         flex: 1,
// //         paddingHorizontal: 16,
// //     },
// //     card: {
// //         marginVertical: 16,
    
// //         borderRadius: 12,
// //         borderWidth: 1,
// //         borderColor: '#EEEEEE', // Subtle border
// //         elevation: 0, // Minimal shadow
// //     },
// //     headerText: {
// //         textAlign: 'center',
// //         marginBottom: 16,
// //         fontWeight: '700',
// //         fontSize: 18,
// //         color: '#212121', // Darker text
// //     },
// //     twoPaneLayout: {
// //         flexDirection: 'row',
// //         gap: 16,
// //     },
// //     controlsPanel: {
// //         borderWidth: 1,
// //         borderColor: '#EEEEEE', // Light gray border
// //         borderRadius: 12,
// //         backgroundColor: '#FFFFFF', // White background
// //         padding: 16,
// //     },
// //     panelTitle: {
// //         textAlign: 'center',
// //         marginBottom: 16,
// //         fontSize: 16,
// //         fontWeight: '500',
// //         color: '#424242', // Dark gray
// //     },
// //     controls: {
// //         gap: 12,
// //     },
// //     button: {
// //         borderRadius: 8,
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         backgroundColor: '#2E7D32', // Green accent
// //         paddingVertical: 12,
// //     },
// //     buttonText: {
// //         fontSize: 14,
// //         fontWeight: '600',
// //         color: '#FFFFFF', // White text for contrast
// //     },
// //     imagePreview: {
// //         flex: 2,
// //         borderWidth: 1,
// //         borderColor: '#EEEEEE', // Subtle border
// //         borderRadius: 12,
// //         backgroundColor: '#FFFFFF',
// //     },
// //     imageContainer: {
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         minHeight: 250,
// //         backgroundColor: '#FFFFFF',
// //         borderRadius: 12,
// //     },
// //     image: {
// //         width: '100%',
// //         height: 250,
// //         borderWidth: 1,
// //         borderColor: '#EEEEEE',
// //         borderRadius: 12,
// //     },
// //     waitingContainer: {
// //         alignItems: 'center',
// //     },
// //     waitingText: {
// //         fontStyle: 'italic',
// //         color: '#616161', // Neutral gray
// //         textAlign: 'center',
// //     },
// //     dataOutput: {
// //         marginTop: 16,
// //         padding: 12,
// //         backgroundColor: '#E8F5E9', // Soft green highlight
// //         borderRadius: 12,
// //     },
// //     dataTitle: {
// //         marginBottom: 8,
// //         fontSize: 14,
// //         fontWeight: '500',
// //         color: '#2E7D32', // Green accent
// //     },
// //     base64Scroll: {
// //         maxHeight: 150,
// //         backgroundColor: '#EEEEEE', // Light gray
// //         padding: 8,
// //         borderRadius: 8,
// //     },
// //     base64Text: {
// //         fontFamily: 'monospace',
// //         color: '#555555',
// //     },
// // });
// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#F5F5F5', // Light gray background
//     },
//     container: {
//         flex: 1,
//         paddingHorizontal: 16,
//     },
//     card: {
//         marginVertical: 16,
    
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#EEEEEE', // Subtle border
//         elevation: 0, // Minimal shadow
//     },
//     headerText: {
//         textAlign: 'center',
//         marginBottom: 16,
//         fontWeight: '700',
//         fontSize: 18,
//         color: '#212121', // Darker text
//     },
//     twoPaneLayout: {
//         flexDirection: 'row',
//         gap: 16,
//     },
//     controlsPanel: {
//         borderWidth: 1,
//         borderColor: '#EEEEEE', // Light gray border
//         borderRadius: 12,
//         backgroundColor: '#FFFFFF', // White background
//         padding: 16,
//     },
//     panelTitle: {
//         textAlign: 'center',
//         marginBottom: 16,
//         fontSize: 16,
//         fontWeight: '500',
//         color: '#424242', // Dark gray
//     },
//     controls: {
//         gap: 12,
//     },
//     button: {
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#e8f5e9', // Green accent
//         paddingVertical: 12,
//     },
//     buttonText: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#000000', // White text for contrast
//     },
//     imagePreview: {
//         flex: 2,
//         borderWidth: 1,
//         borderColor: '#EEEEEE', // Subtle border
//         borderRadius: 12,
//         backgroundColor: '#FFFFFF',
//     },
//     imageContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: 250,
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//     },
//     image: {
//         width: '100%',
//         height: 250,
//         borderWidth: 1,
//         borderColor: '#EEEEEE',
//         borderRadius: 12,
//     },
//     waitingContainer: {
//         alignItems: 'center',
//     },
//     waitingText: {
//         fontStyle: 'italic',
//         color: '#616161', // Neutral gray
//         textAlign: 'center',
//     },
//     dataOutput: {
//         marginTop: 16,
//         padding: 12,
//         backgroundColor: '#E8F5E9', // Soft green highlight
//         borderRadius: 12,
//     },
//     dataTitle: {
//         marginBottom: 8,
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#2E7D32', // Green accent
//     },
//     base64Scroll: {
//         maxHeight: 150,
//         backgroundColor: '#EEEEEE', // Light gray
//         padding: 8,
//         borderRadius: 8,
//     },
//     base64Text: {
//         fontFamily: 'monospace',
//         color: '#555555',
//     },
// });


// export default HallSensorScreen;


import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UDP_PORT = 8888;
const ESP32_IP = '192.168.0.101';

const HallSensorScreen: React.FC = () => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [isOn, setIsOn] = useState(false);
    const [imageData, setImageData] = useState<string | null>(null);
    const [base64Text, setBase64Text] = useState<string>('');
    const lastSentTime = useRef<number>(0);
    const socketRef = useRef<dgram.Socket | null>(null);
    const [receivedChunks, setReceivedChunks] = useState<{ [key: number]: string }>({});
    const [totalChunks, setTotalChunks] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const socket = dgram.createSocket('udp4');
        socketRef.current = socket;

        socket.on('message', (msg) => {
            const message = msg.toString();
            const firstComma = message.indexOf(',');
            const secondComma = message.indexOf(',', firstComma + 1);

            if (firstComma === -1 || secondComma === -1) return;

            const seqStr = message.substring(0, firstComma);
            const totalStr = message.substring(firstComma + 1, secondComma);
            const data = message.substring(secondComma + 1);

            const seq = parseInt(seqStr, 10);
            const total = parseInt(totalStr, 10);

            setReceivedChunks((prev) => ({ ...prev, [seq]: data }));
            setTotalChunks(total);
        });

        socket.on('error', (err) => {
            console.error('UDP Socket Error:', err);
            socket.close();
        });

        socket.bind(UDP_PORT);

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        if (Object.keys(receivedChunks).length === totalChunks && totalChunks > 0) {
            const fullData = Array.from({ length: totalChunks }, (_, i) => receivedChunks[i] || '').join('');

            setBase64Text(fullData);
            setImageData(`data:image/jpeg;base64,${fullData}`);

            setReceivedChunks({});
            setTotalChunks(0);
        }
    }, [receivedChunks, totalChunks]);

    const sendServoCommand = (commandByte: number) => {
        const now = Date.now();
        if (now - lastSentTime.current < 50) return;
        lastSentTime.current = now;

        const client = dgram.createSocket('udp4');
        client.bind(0, () => {
            const message = Buffer.from([commandByte]);
            client.send(message, 0, message.length, UDP_PORT, ESP32_IP, (error) => {
                if (error) console.error('UDP Send Error:', error);
                client.close();
            });
        });
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Card style={styles.card}>
          {/* Controls Panel */}
          <View style={styles.twoPaneLayout}>
            <Card style={styles.controlsPanel}>
              <Card.Content>
              <Text variant="titleLarge" style={styles.panelTitle}>
                  <Icon name="devices" size={18} color="#424242" style={{ marginRight: 10 }} />
                  Device Controls
                </Text>
                <View style={styles.controls}>
                  <Button
                    mode="contained"
                    onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
                    disabled={isOn}
                    style={[
                      styles.button,
                      isOn ? styles.buttonDisabled : styles.buttonActive,
                    ]}
                  >
                    <Icon
                      name="power"
                      size={20}
                      color={isOn ? '#757575' : 'black'}
                      style={styles.iconStyle}
                    />
                    <Text style={[styles.buttonText, { color: isOn ? '#757575' : 'black' }]}>
                      Activate Sensor
                    </Text>
                  </Button>
                  <Button
                    mode="contained-tonal"
                    onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
                    disabled={!isOn}
                    style={[
                      styles.button,
                      !isOn ? styles.buttonDisabled : styles.buttonActive,
                    ]}
                  >
                    <Icon
                      name="power-off"
                      size={20}
                      color={!isOn ? '#757575' : 'black'}
                      style={styles.iconStyle}
                    />
                    <Text style={[styles.buttonText, { color: !isOn ? '#757575' : 'black' }]}>
                      Deactivate Sensor
                    </Text>
                  </Button>
                </View>
              </Card.Content>
            </Card>
            {/* Image Preview */}
            <Card style={styles.imagePreview}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.panelTitle}>
                  <Icon name="image" size={15} color="#424242" style={{ marginRight: 8 }} />
                  Captured Image
                </Text>
                <View style={styles.imageContainer}>
                  {isLoading ? (
                    <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
                  ) : imageData ? (
                    <Image source={{ uri: imageData }} style={styles.image} />
                  ) : (
                    <View style={styles.waitingContainer}>
                      <Icon name="image-off" size={40} color="#777" style={{ marginBottom: 8 }} />
                      <Text variant="bodyMedium" style={styles.waitingText}>
                        Waiting for image data...
                      </Text>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          </View>
          {/* Data Output */}
          <Card style={styles.dataOutput}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.dataTitle}>
                <Icon
                  name="code-braces"
                  size={24}
                  color="#2E7D32"
                  style={{ marginRight: 8, marginBottom: 8, textAlign: 'center' }}
                />
                Base64 Data Stream
              </Text>
              <ScrollView style={styles.base64Scroll}>
                <Text variant="bodySmall" style={styles.base64Text}>
                  {base64Text}
                </Text>
              </ScrollView>
            </Card.Content>
          </Card>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE', // Subtle border
    elevation: 0, // Minimal shadow
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
    fontSize: 18,
    color: '#212121', // Darker text
  },
  twoPaneLayout: {
    flexDirection: 'row',
    gap: 16,
  },
  controlsPanel: {
    borderWidth: 1,
    borderColor: '#EEEEEE', // Light gray border
    borderRadius: 12,
    backgroundColor: '#FFFFFF', // White background
    padding: 16,
    elevation : 0,
  },
  panelTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#424242', // Dark gray
    alignItems: "center"
  },
  controls: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonActive: {
    backgroundColor: '#c8e6c9', // A little dark shade than the color you are using to activate
  },
  buttonDisabled: {
    backgroundColor: '#e8f5e9', // The color you are using for deactivate sensor
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  imagePreview: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#EEEEEE', // Subtle border
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: 250,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    elevation:0,
  },
  waitingContainer: {
    alignItems: 'center',
  },
  waitingText: {
    fontStyle: 'italic',
    color: '#616161', // Neutral gray
    textAlign: 'center',
  },
  dataOutput: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9', // Soft green highlight
    borderRadius: 12,
  },
  dataTitle: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32', // Green accent
  },
  base64Scroll: {
    maxHeight: 150,
    backgroundColor: '#EEEEEE', // Light gray
    padding: 8,
    borderRadius: 8,
  },
  base64Text: {
    fontFamily: 'monospace',
    color: '#555555',
  },
  iconStyle: {
    marginRight: 8,
  },
});

export default HallSensorScreen;



