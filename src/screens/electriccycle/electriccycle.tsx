import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

const ESP32_IP = '192.168.0.196';
const ESP32_PORT = 8888;

const Dashboard = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [diameter, setDiameter] = useState('');
  const lastSentTime = useRef(0);

  const sendUDPCommand = async (command, value = null) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;

    try {
      const client = dgram.createSocket('udp4');
      let message;
      
      if (value !== null) {
        const valueBuffer = Buffer.alloc(2);
        valueBuffer.writeUInt16BE(parseInt(value) || 0);
        message = Buffer.concat([Buffer.from([command]), valueBuffer]);
      } else {
        message = Buffer.from([command]);
      }

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

  const toggleSwitch = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    sendUDPCommand(0xC5); // Send C5 command on toggle
  };

  const handleSend = () => {
    console.log(diameter)
    if (diameter) {
      sendUDPCommand(0xC6, diameter); // Send C6 command with diameter value
    }
    console.log("Diameter:", diameter);
    console.log("Toggle State:", isEnabled);
  };

  // Rest of the component remains the same...
  const renderMeter = (label, progress, color, emoji) => (
    <View style={styles.meterContainer}>
      <Svg height="120" width="120" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="40" stroke="#fff" strokeWidth="8" fill="none" />
        <Circle cx="50" cy="50" r="40" stroke={color} strokeWidth="8" fill="none" 
          strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress)} strokeLinecap="round" />
        <SvgText x="50" y="40" textAnchor="middle" fontSize="18" fill="#333" fontWeight="bold">
          {emoji}
        </SvgText>
        <SvgText x="50" y="60" textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold">
          {label}
        </SvgText>
      </Svg>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.container}>
            {/* Left Section - Meters */}
            <View style={styles.dataSection}>
              {renderMeter("Distance", 0.7, "#FF6B6B", "🚀")}
              {renderMeter("Speed", 0.5, "#4ECDC4", "🚗")}
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Right Section - Controls */}
            <View style={styles.controlSection}>
              <View style={styles.powerControl}>
                <Text style={styles.powerLabel}>{isEnabled ? 'Power On 🔌' : 'Power Off 🔴'}</Text>
                <Switch
                  value={isEnabled}
                  onValueChange={toggleSwitch}
                  style={styles.switch}
                  thumbColor={isEnabled ? '#FFD93D' : '#fff'}
                  trackColor={{ false: '#FFD93D', true: '#77dd77' }}
                />
              </View>

              <View style={styles.inlineInputContainer}>
                <Text style={styles.inlineLabel}>Wheel Size:</Text>
                <TextInput
                  style={styles.inlineInput}
                  placeholder="Type number here..."
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={diameter}
                  onChangeText={setDiameter}
                />
              </View>

              <TouchableOpacity style={styles.flatButton} onPress={handleSend}>
                <Text style={styles.buttonText}>LAUNCH!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#B8E8FC',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3639',
    textAlign: 'center',
    marginVertical: 15,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: {width: 1, height: 1},
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 3,
    borderColor: '#FFD93D',
    borderRadius: 15,
    backgroundColor: '#FFF7D4',
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginHorizontal: 10,
  },
  dataSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  controlSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  divider: {
    width: 3,
    backgroundColor: '#FFD93D',
    height: '80%',
    marginHorizontal: 8,
    borderRadius: 2,
    alignSelf: 'center',
  },
  meterContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  switch: {
    marginVertical: 15,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  powerControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  powerLabel: {
    fontSize: 18,
    color: '#2C3639',
    fontWeight: 'bold',
    marginVertical: 5,
    marginRight: 10,
  },
  inlineInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
  },
  inlineLabel: {
    fontSize: 18,
    color: '#2C3639',
    fontWeight: 'bold',
    marginRight: 10,
  },
  inlineInput: {
    width: '60%',
    borderWidth: 2,
    borderColor: '#4ECDC4',
    padding: 8,
    color: '#2C3639',
    borderRadius: 12,
    textAlign: 'center',
    backgroundColor: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Dashboard;


// import React, { useState } from 'react';
// import { View, Image, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
// import ImagePicker from 'react-native-image-crop-picker';
// import FaceDetection from '@react-native-ml-kit/face-detection';

// const { width, height } = Dimensions.get('window');

// const Dashboard = () => {
//   const [image, setImage] = useState(null);
//   const [faces, setFaces] = useState([]); // Changed labels to faces for clarity
//   const [loading, setLoading] = useState(false);

//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.openPicker({
//         mediaType: 'photo',
//         cropping: true,
//       });
//       setImage(result.path);
//       detectFaces(result.path);
//     } catch (error) {
//       console.error('Image selection error:', error);
//     }
//   };

//   const detectFaces = async (imagePath) => {
//     try {
//       setLoading(true);
//       const detectedFaces = await FaceDetection.detect(imagePath, { landmarkMode: 'all' });
//       setFaces(detectedFaces);
//     } catch (error) {
//       console.error('Face detection error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, width, height }}>
//       <View style={{ flex: 1, alignItems: 'center' }}>
//         <TouchableOpacity onPress={pickImage} style={{ padding: 12, backgroundColor: '#6200EE', borderRadius: 8 }}>
//           <Text style={{ color: 'white', fontSize: 16 }}>Pick an Image</Text>
//         </TouchableOpacity>
//         {image && <Image source={{ uri: image }} style={{ width: width * 0.4, height: height * 0.5, marginVertical: 20, resizeMode: 'contain' }} />}
//       </View>
//       <View style={{ flex: 1, alignItems: 'center' }}>
//         {loading && <ActivityIndicator size="large" color="#6200EE" />}
//         {faces.length > 0 && (
//           <View style={{ marginTop: 10, width: width * 0.4 }}>
//             <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Detected Faces:</Text>
//             {faces.map((face, index) => (
//               <Text key={index} style={{ fontSize: 16, textAlign: 'center' }}>
//                 Face {index + 1} - 
//                 {face.landmarks && Object.keys(face.landmarks).length > 0 ? 'Landmarks detected' : 'No landmarks'}
//               </Text>
//             ))}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default Dashboard;



// import React, { useState } from 'react';
// import { View, Image, Button, StyleSheet , Text } from 'react-native';
// import FaceDetection from '@react-native-ml-kit/face-detection';
// import * as ImagePicker from 'expo-image-picker';

// const FaceDetectionScreen = () => {
//   const [image, setImage] = useState(null);
//   const [faces, setFaces] = useState([]);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       base64: true,
//     });

//     if (!result.canceled) {
//       setImage(result.uri);
//       detectFaces(result.uri);
//     }
//   };

//   const detectFaces = async (imageUri) => {
//     try {
//       const detectedFaces = await FaceDetection.detect(imageUri, {
//         landmarkMode: 'all',
//       });
//       setFaces(detectedFaces);
//     } catch (error) {
//       console.error('Face detection failed:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Pick an image" onPress={pickImage} />
//       {image && (
//         <Image source={{ uri: image }} style={styles.image} />
//       )}
//       {faces.length > 0 && <Text>{faces.length} faces detected</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 300,
//     height: 400,
//     marginTop: 10,
//   },
// });

// export default FaceDetectionScreen;
