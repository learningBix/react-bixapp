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


import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UDP_PORT = 8888;
const ESP32_IP = '192.168.0.101';

const HallSensorScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [isOn, setIsOn] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [base64Text, setBase64Text] = useState<string>('');
  const lastSentTime = useRef<number>(0);
  const socketRef = useRef<dgram.Socket | null>(null);
  const [receivedChunks, setReceivedChunks] = useState<{ [key: number]: string }>({});
  const [totalChunks, setTotalChunks] = useState<number>(0);

  useEffect(() => {
    const socket = dgram.createSocket('udp4');
    socketRef.current = socket;

    socket.on('message', (msg) => {
      const message = msg.toString();

      // Ensure we have enough commas to split
      const firstComma = message.indexOf(',');
      const secondComma = message.indexOf(',', firstComma + 1);

      if (firstComma === -1 || secondComma === -1) return;

      const seqStr = message.substring(0, firstComma);
      const totalStr = message.substring(firstComma + 1, secondComma);
      const data = message.substring(secondComma + 1);

      const seq = parseInt(seqStr, 10);
      const total = parseInt(totalStr, 10);

      console.log(`Chunk ${seq + 1}/${total} received, size: ${data.length}`);

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
      // Reconstruct the base64 string in correct order
      const fullData = Array.from({ length: totalChunks }, (_, i) => receivedChunks[i] || '').join('');
      
      console.log(`Full Base64 received, length: ${fullData.length}`);
      setBase64Text(fullData); // Display base64 string on screen
      setImageData(`data:image/jpeg;base64,${fullData}`);

      // Reset chunks
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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.text}>Hall Sensor</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isOn && styles.buttonDisabled]}
          onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
          disabled={isOn}
        >
          <Text style={styles.buttonText}>Turn On</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isOn && styles.buttonDisabled]}
          onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
          disabled={!isOn}
        >
          <Text style={styles.buttonText}>Turn Off</Text>
        </TouchableOpacity>
      </View>

      {imageData && (
        <Image source={{ uri: imageData }} style={styles.image} />
      )}

      <ScrollView style={styles.scrollView}>
        <Text style={styles.base64Text}>{base64Text}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgb(32, 59, 147)',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: 'rgb(32, 59, 147)',
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 200,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  },
  scrollView: {
    marginTop: 20,
    maxHeight: 200,
    paddingHorizontal: 10,
  },
  base64Text: {
    fontSize: 10,
    color: 'black',
  },
});

export default HallSensorScreen;


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
//   const [imageUpdated, setImageUpdated] = useState(false); // Force UI refresh
//   const base64Ref = useRef<string>(''); // Store latest base64 image
//   const socketRef = useRef<dgram.Socket | null>(null);
//   const receivedChunks = useRef<{ [key: number]: string }>({});
//   const totalChunks = useRef<number>(0);
//   const lastSentTime = useRef<number>(0);

//   useEffect(() => {
//     const socket = dgram.createSocket('udp4');
//     socketRef.current = socket;

//     socket.on('message', (msg) => {
//       const message = msg.toString();

//       const firstComma = message.indexOf(',');
//       const secondComma = message.indexOf(',', firstComma + 1);
//       if (firstComma === -1 || secondComma === -1) return;

//       const seqStr = message.substring(0, firstComma);
//       const totalStr = message.substring(firstComma + 1, secondComma);
//       const data = message.substring(secondComma + 1);

//       const seq = parseInt(seqStr, 10);
//       const total = parseInt(totalStr, 10);

//       // If new image starts, clear previous chunks and image
//       if (seq === 0) {
//         console.log('New image detected, clearing previous image and chunks...');
//         base64Ref.current = ''; // Remove current image
//         setImageUpdated((prev) => !prev); // Force immediate UI update
//         receivedChunks.current = {}; // Reset chunks
//         totalChunks.current = total;
//       }

//       receivedChunks.current[seq] = data;
//       console.log(`Chunk ${seq + 1}/${total} received`);

//       // When all chunks are received, assemble the image
//       if (Object.keys(receivedChunks.current).length === total && total > 0) {
//         const fullData = Array.from({ length: total }, (_, i) => receivedChunks.current[i] || '').join('');

//         console.log(`Full Base64 received, length: ${fullData.length}`);

//         base64Ref.current = `data:image/jpeg;base64,${fullData}`;
//         setImageUpdated((prev) => !prev); // Force re-render
//       }
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

//   const sendServoCommand = (commandByte: number) => {
//     const now = Date.now();
//     if (now - lastSentTime.current < 50) return;
//     lastSentTime.current = now;

//     // Clear the current image immediately before requesting a new one
//     base64Ref.current = '';
//     setImageUpdated((prev) => !prev); // Force UI update

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
      
//       {/* Buttons to control the ESP32 */}
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

//       {/* Image Preview */}
//       {base64Ref.current ? (
//         <Image key={imageUpdated ? 'image1' : 'image2'} source={{ uri: base64Ref.current }} style={styles.image} />
//       ) : (
//         <Text style={styles.text}>No Image Yet</Text>
//       )}

//       {/* Base64 Debugging Text */}
//       <ScrollView style={styles.debugBox}>
//         <Text selectable style={styles.debugText}>{base64Ref.current}</Text>
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
//   debugBox: {
//     marginTop: 20,
//     padding: 10,
//     width: '90%',
//     maxHeight: 150,
//     backgroundColor: '#EEE',
//     borderRadius: 8,
//   },
//   debugText: {
//     fontSize: 10,
//     color: 'black',
//   },
// });

// export default HallSensorScreen;
