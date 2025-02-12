
// import React, { useState, useRef } from 'react';
// import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
// import Slider from '@react-native-community/slider';
// import { Switch } from 'react-native-paper';
// import { WebView } from 'react-native-webview';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const HomeScreenSurveillance: React.FC = () => {
//     const insets = useSafeAreaInsets();
//     const [toggleEnabled, setToggleEnabled] = useState(false);
//     const [sliderValue, setSliderValue] = useState(180);
//     const lastSentTime = useRef<number>(0); // Track last sent time

//     const handleToggle = () => setToggleEnabled((prev) => !prev);

//     const sendServoCommand = (angle: number) => {
//         const now = Date.now();

//         if (now - lastSentTime.current < 30) {
//             // Only send if at least 50ms has passed
//             return;
//         }

//         lastSentTime.current = now; // Update last sent time

//         const client = dgram.createSocket('udp4');

//         client.on('error', (err) => {
//             console.error('UDP Socket Error:', err);
//             client.close();
//         });

//         client.bind(0, () => {
//             const message = Buffer.from([0xC3, angle]);
//             client.send(message, 0, message.length, 8888, '192.168.0.101', (error) => {
//                 if (error) {
//                     console.error('UDP Send Error:', error);
//                 }
//                 client.close();
//             });
//         });
//     };

//     const handleSliderChange = (value: number) => {
//         setSliderValue(value);
//         sendServoCommand(Math.round(value)); // Send immediately with rate limit
//     };

//     return (
//         <SafeAreaView
//             style={[
//                 styles.container,
//                 {
//                     paddingTop: insets.top,
//                     paddingBottom: insets.bottom,
//                     backgroundColor: '#F1EFF4',
//                 },
//             ]}
//         >
//             <View style={styles.content}>
//                 <View style={styles.cameraCard}>
//                     {toggleEnabled ? (
//                         <WebView
//                             source={{ uri: 'http://192.168.0.101:81/stream' }}
//                             style={styles.webview}
//                         />
//                     ) : (
//                         <View style={styles.cameraOff}>
//                             <Text style={styles.labelText}>Camera feed is off</Text>
//                         </View>
//                     )}
//                 </View>

//                 <View style={styles.controlsCard}>
//                     <View style={styles.toggleContainer}>
//                         <Text style={styles.labelText}>Start Streaming</Text>
//                         <Switch
//                             value={toggleEnabled}
//                             onValueChange={handleToggle}
//                             color="#6750A4"
//                         />
//                     </View>

//                     <View style={styles.sliderContainer}>
//                         <Text style={styles.labelText}>Set Angle: {sliderValue.toFixed(0)}</Text>
//                         {/* <Slider
//                             style={styles.slider}
//                             minimumValue={0}
//                             maximumValue={180}
//                             step={1}
//                             value={sliderValue}
//                             onValueChange={handleSliderChange} // Send continuously but throttled
//                             minimumTrackTintColor="#6750A4"
//                             maximumTrackTintColor="#79747E"
//                             thumbTintColor="#6750A4"
//                         /> */}

//                         <Slider
//                             style={styles.slider}
//                             minimumValue={0}
//                             maximumValue={180}
//                             step={1}
//                             value={sliderValue}
//                             onValueChange={handleSliderChange}
//                             minimumTrackTintColor="#6750A4"
//                             maximumTrackTintColor="#D1C4E9" // Softer contrast
//                             thumbTintColor="#4A148C" // Darker purple for better visibility
//                             thumbStyle={{ width: 30, height: 30 }} // Larger thumb
//                             trackStyle={{ height: 10, borderRadius: 5 }} // Thicker track
//                         />
//                     </View>
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingHorizontal: 20,
//     },
//     content: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 16,
//         gap: 16,
//     },
//     controlsCard: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//         borderRadius: 16,
//         padding: 16,
//         elevation: 4,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         maxWidth: '48%',
//     },
//     cameraCard: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//         borderRadius: 16,
//         elevation: 4,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         overflow: 'hidden',
//         maxWidth: '48%',
//     },
//     webview: {
//         flex: 1,
//     },
//     cameraOff: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     toggleContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 24,
//     },
//     sliderContainer: {
//         alignItems: 'stretch',
//     },
//     slider: {
//         height: 40,
//     },
//     labelText: {
//         fontSize: 14,
//         fontWeight: '500',
//         marginBottom: 8,
//     },
// });

// export default HomeScreenSurveillance;



// // import React, { useState, useRef } from 'react';
// // import { View, Text, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
// // import Slider from '@react-native-community/slider';
// // import { Switch, TextInput } from 'react-native-paper';
// // import { WebView } from 'react-native-webview';
// // import dgram from 'react-native-udp';
// // import { Buffer } from 'buffer';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// // const { width } = Dimensions.get('window');
// // const isSmallScreen = width < 375;

// // // Custom Card Component
// // const Card: React.FC<{title: string; style?: any}> = ({ title, children, style }) => (
// //   <View style={[styles.card, style]}>
// //     <Text style={styles.cardTitle}>{title}</Text>
// //     {children}
// //   </View>
// // );

// // const HomeScreenSurveillance: React.FC = () => {
// //   const insets = useSafeAreaInsets();
// //   const [toggleEnabled, setToggleEnabled] = useState(false);
// //   const [sliderValue, setSliderValue] = useState(180);
// //   const [ipAddress, setIpAddress] = useState('192.168.0.101');
// //   const [port, setPort] = useState('8888');
// //   const lastSentTime = useRef<number>(0);

// //   const handleToggle = () => setToggleEnabled((prev) => !prev);

// //   const sendServoCommand = (angle: number) => {
// //     const now = Date.now();
// //     if (now - lastSentTime.current < 50) return;
// //     lastSentTime.current = now;

// //     const client = dgram.createSocket('udp4');
// //     client.on('error', (err) => {
// //       console.error('UDP Socket Error:', err);
// //       client.close();
// //     });

// //     client.bind(0, () => {
// //       const message = Buffer.from([0xC3, angle]);
// //       client.send(message, 0, message.length, parseInt(port), ipAddress, (error) => {
// //         if (error) console.error('UDP Send Error:', error);
// //         client.close();
// //       });
// //     });
// //   };

// //   const handleSliderChange = (value: number) => {
// //     setSliderValue(value);
// //     sendServoCommand(Math.round(value));
// //   };

// //   return (
// //     <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
// //       <View style={styles.content}>
// //         <Card title="Camera Feed" style={styles.cameraCard}>
// //           {toggleEnabled ? (
// //             <WebView
// //               source={{ uri: `http://${ipAddress}:81/stream` }}
// //               style={styles.webview}
// //               allowsFullscreenVideo={false}
// //               allowsInlineMediaPlayback
// //               mediaPlaybackRequiresUserAction={false}
// //             />
// //           ) : (
// //             <View style={styles.cameraOff}>
// //               <MaterialCommunityIcons
// //                 name="camera-off"
// //                 size={40}
// //                 color="#6750A4"
// //                 style={styles.cameraIcon}
// //               />
// //               <Text style={styles.cameraOffText}>Streaming Disabled</Text>
// //             </View>
// //           )}
// //         </Card>

// //         <Card title="Controls" style={styles.controlsCard}>
// //           <View style={styles.configInputs}>
// //             <TextInput
// //               label="IP Address"
// //               value={ipAddress}
// //               onChangeText={setIpAddress}
// //               mode="outlined"
// //               style={styles.input}
// //               dense
// //               theme={{ colors: { primary: '#6750A4' } }}
// //             />
// //             <TextInput
// //               label="Port"
// //               value={port}
// //               onChangeText={setPort}
// //               mode="outlined"
// //               style={styles.input}
// //               keyboardType="numeric"
// //               dense
// //               theme={{ colors: { primary: '#6750A4' } }}
// //             />
// //           </View>

// //           <View style={styles.toggleContainer}>
// //             <Text style={styles.labelText}>Video Stream</Text>
// //             <Switch
// //               value={toggleEnabled}
// //               onValueChange={handleToggle}
// //               color="#6750A4"
// //               thumbColor={toggleEnabled ? '#FFFFFF' : '#FFFFFF'}
// //             />
// //           </View>

// //           <View style={styles.sliderContainer}>
// //             <View style={styles.sliderHeader}>
// //               <Text style={styles.labelText}>Servo Angle</Text>
// //               <View style={styles.angleBadge}>
// //                 <Text style={styles.angleText}>{sliderValue.toFixed(0)}°</Text>
// //               </View>
// //             </View>

// //             <Slider
// //               style={styles.slider}
// //               minimumValue={0}
// //               maximumValue={180}
// //               step={1}
// //               value={sliderValue}
// //               onValueChange={handleSliderChange}
// //               minimumTrackTintColor="#6750A4"
// //               maximumTrackTintColor="#EADDFF"
// //               thumbTintColor="#FFFFFF"
// //               thumbStyle={styles.thumb}
// //               trackStyle={styles.track}
// //             />

// //             <View style={styles.sliderScale}>
// //               <Text style={styles.scaleText}>0°</Text>
// //               <Text style={styles.scaleText}>180°</Text>
// //             </View>
// //           </View>
// //         </Card>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F7F2FA',
// //   },
// //   content: {
// //     flex: 1,
// //     flexDirection: isSmallScreen ? 'column' : 'row',
// //     padding: 16,
// //     gap: 16,
// //   },
// //   card: {
// //     flex: 1,
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 16,
// //     padding: 16,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 4 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 8,
// //       },
// //       android: {
// //         elevation: 4,
// //       },
// //     }),
// //   },
// //   cardTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#1D1B20',
// //     marginBottom: 16,
// //   },
// //   cameraCard: {
// //     minHeight: isSmallScreen ? 250 : 'auto',
// //   },
// //   controlsCard: {
// //     gap: 24,
// //   },
// //   webview: {
// //     flex: 1,
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //   },
// //   cameraOff: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#F7F2FA',
// //     borderRadius: 12,
// //   },
// //   cameraIcon: {
// //     marginBottom: 8,
// //   },
// //   cameraOffText: {
// //     fontSize: 16,
// //     color: '#6750A4',
// //     fontWeight: '500',
// //   },
// //   configInputs: {
// //     gap: 12,
// //   },
// //   input: {
// //     backgroundColor: '#FFF',
// //     fontSize: 14,
// //   },
// //   toggleContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 8,
// //   },
// //   sliderContainer: {
// //     gap: 12,
// //   },
// //   sliderHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   angleBadge: {
// //     backgroundColor: '#E8DEF8',
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 8,
// //   },
// //   angleText: {
// //     color: '#6750A4',
// //     fontWeight: '600',
// //   },
// //   slider: {
// //     height: 40,
// //   },
// //   thumb: {
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     borderWidth: 2,
// //     borderColor: '#6750A4',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.2,
// //         shadowRadius: 3,
// //       },
// //       android: {
// //         elevation: 3,
// //       },
// //     }),
// //   },
// //   track: {
// //     height: 6,
// //     borderRadius: 3,
// //   },
// //   sliderScale: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   scaleText: {
// //     color: '#49454F',
// //     fontSize: 12,
// //   },
// //   labelText: {
// //     color: '#1D1B20',
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// // });

// // export default HomeScreenSurveillance;

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const HomeScreenSurveillance: React.FC = () => {
    // const insets = useSafeAreaInsets();
    // const [toggleEnabled, setToggleEnabled] = useState(false);
    // const [sliderValue, setSliderValue] = useState(180);
    // const lastSentTime = useRef<number>(0);

    // const handleToggle = () => setToggleEnabled((prev) => !prev);

    // const sendServoCommand = (angle: number) => {
    //     const now = Date.now();
    //     if (now - lastSentTime.current < 30) return;
    //     lastSentTime.current = now;

    //     const client = dgram.createSocket('udp4');
    //     client.on('error', (err) => {
    //         console.error('UDP Socket Error:', err);
    //         client.close();
    //     });

    //     client.bind(0, () => {
    //         const message = Buffer.from([0xC3, angle]);
    //         client.send(message, 0, message.length, 8888, '192.168.0.101', (error) => {
    //             if (error) console.error('UDP Send Error:', error);
    //             client.close();
    //         });
    //     });
    // };

    // const handleSliderChange = (value: number) => {
    //     setSliderValue(value);
    //     sendServoCommand(Math.round(value));
    // };
    const insets = useSafeAreaInsets();
    const [toggleEnabled, setToggleEnabled] = useState(false);
    const [sliderValue, setSliderValue] = useState(180);
    const lastSentTime = useRef<number>(0); 

    const handleToggle = () => setToggleEnabled((prev) => !prev);

    const sendServoCommand = (angle: number) => {
        const now = Date.now();

        if (now - lastSentTime.current < 50) {
            return;
        }

        lastSentTime.current = now; // Update last sent time

        const client = dgram.createSocket('udp4');

        client.on('error', (err) => {
            console.error('UDP Socket Error:', err);
            client.close();
        });

        client.bind(0, () => {
            const message = Buffer.from([0xC3, angle]);
            client.send(message, 0, message.length, 8888, '192.168.0.101', (error) => {
                if (error) {
                    console.error('UDP Send Error:', error);
                }
                client.close();
            });
        });
    };

    const handleSliderChange = (value: number) => {
        setSliderValue(value);
        sendServoCommand(Math.round(value)); // Send immediately with rate limit
    };
    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            {/* <View style={styles.header}> */}
                {/* <Text style={styles.title}>Surveillance Control</Text> */}
                <View style={styles.statusContainer}>
                    <Ionicons name="radio-button-on" size={14} color={toggleEnabled ? '#4CAF50' : '#BDBDBD'} />
                    <Text style={styles.statusText}>{toggleEnabled ? 'Connected' : 'Disconnected'}</Text>
                </View>
            {/* </View> */}

            <View style={styles.content}>
                <View style={styles.cameraCard}>
                    {toggleEnabled ? (
                        <WebView
                            source={{ uri: 'http://192.168.0.101:81/stream' }}
                            style={styles.webview}
                            allowsFullscreenVideo={false}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View style={styles.cameraOff}>
                            <Ionicons name="videocam-off" size={32} color="#616161" />
                            <Text style={styles.cameraOffText}>Camera Feed Disabled</Text>
                        </View>
                    )}
                </View>

                <View style={styles.controlsCard}>
                    <View style={styles.controlGroup}>
                        <View style={styles.controlHeader}>
                            <Ionicons name="power" size={20} color="#424242" />
                            <Text style={styles.controlTitle}>Stream Controls</Text>
                        </View>
                        <View style={styles.toggleContainer}>
                            <Text style={styles.controlLabel}>Enable Live Feed</Text>
                            <Switch
                                value={toggleEnabled}
                                onValueChange={handleToggle}
                                color="#4CAF50"
                                trackColor={{ false: '#BDBDBD', true: '#E8F5E9' }}
                            />
                        </View>
                    </View>

                    <View style={styles.controlGroup}>
                        <View style={styles.controlHeader}>
                            <Ionicons name="settings" size={20} color="#424242" />
                            <Text style={styles.controlTitle}>Servo Control</Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderHeader}>
                                <Text style={styles.controlLabel}>Rotation Angle</Text>
                                <View style={styles.valueBadge}>
                                    <Text style={styles.valueText}>{sliderValue.toFixed(0)}°</Text>
                                </View>
                            </View>
                            {/* <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={180}
                                step={1}
                                value={sliderValue}
                                onValueChange={handleSliderChange}
                                minimumTrackTintColor="#4CAF50"
                                maximumTrackTintColor="#E0E0E0"
                                thumbTintColor="#4CAF50"
                                thumbStyle={styles.thumb}
                                trackStyle={styles.track}
                            /> */}

                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={180}
                                step={1}
                                value={sliderValue}
                                onValueChange={handleSliderChange} // Send continuously but throttled
                                minimumTrackTintColor="#4CAF50"
                                maximumTrackTintColor="#E0E0E0"
                                thumbTintColor="#4CAF50"
                            />

                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#212121',
        letterSpacing: 0.5,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        marginLeft:16
    },
    statusText: {
        fontSize: 14,
        color: '#616161',
    },
    content: {
        flex: 1,
        flexDirection: width > 600 ? 'row' : 'column',
        padding: 16,
        gap: 16,
    },
    cameraCard: {
        flex: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
       
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.05,
        // shadowRadius: 8,
        elevation: 2,
        // overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraOff: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        gap: 8,
    },
    cameraOffText: {
        fontSize: 16,
        color: '#9E9E9E',
    },
    controlsCard: {
        flex: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.05,
        // shadowRadius: 8,
        // elevation: 2,
        gap: 24,
    },
    controlGroup: {
        gap: 16,
    },
    controlHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    controlTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#424242',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlLabel: {
        fontSize: 14,
        color: '#616161',
    },
    sliderContainer: {
        gap: 12,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    valueBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    valueText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2E7D32',
    },
    slider: {
        height: 40,
    },
    thumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    track: {
        height: 6,
        borderRadius: 3,
    },
    sliderScale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scaleText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
});

export default HomeScreenSurveillance;

