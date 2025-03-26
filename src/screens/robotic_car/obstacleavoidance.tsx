import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const ESP32_IP = '192.168.0.196'; // Change to your ESP32 IP
const ESP32_PORT = 8888;
const STREAM_URL = 'http://192.168.0.196:81/stream';

export default function ObstacleCarController() {
    const [isMoving, setIsMoving] = useState(false);
    const [isActive, setIsActive] = useState(false); // New state for activity toggle
    const [distance, setDistance] = useState(50);

    const sendUDPCommand = (command, value) => {
        const client = dgram.createSocket('udp4');
        const message = Buffer.from([command, value]);

        client.on('error', (err) => {
            console.error('UDP Error:', err);
            client.close();
        });

        client.bind(0, () => {
            client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
                if (err) console.error('Send Error:', err);
                client.close();
            });
        });

        console.log(`📡 Sent command: 0x${command.toString(16).toUpperCase()} value: ${value}`);
    };

    const handleDistanceChange = (value) => {
        setDistance(value);
    };

    const toggleActive = () => {
        const newIsActive = !isActive;
        setIsActive(newIsActive);
        if (newIsActive) {
            // Send C7 command and distance value
            sendUDPCommand(0xC7, distance);
        }
    };

    const toggleMoving = () => {
        const newIsMoving = !isMoving;
        setIsMoving(newIsMoving);
        if (newIsMoving) {
            // Send C8 command
            sendUDPCommand(0xC8, distance);
        } else {
            //send D9 command
            sendUDPCommand(0xD9, distance);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground
                source={require('./assets/cartoon-road.jpg')}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.rowContainer}>
                    {/* Image Section */}
                    <View style={styles.imageContainer}>
                        <WebView
                            source={{ uri: STREAM_URL }}
                            style={styles.imageView}
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
                        {/* Distance Slider */}
                        <View style={styles.sliderContainer}>
                            <Text style={styles.sliderLabel}>Distance {distance}</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={10}
                                maximumValue={100}
                                step={1}
                                value={distance}
                                onValueChange={handleDistanceChange}
                                disabled={!isActive} // Disable slider when not active
                                minimumTrackTintColor="#007AFF"
                                maximumTrackTintColor="#D3D3D3"
                                thumbTintColor="#007AFF"
                            />
                        </View>

                        {/* Control Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.controlButton,
                                    isActive ? styles.activeButton : styles.inactiveButton,
                                ]}
                                onPress={toggleActive}
                            >
                                <Text style={styles.buttonText}>
                                    {isActive ? 'Deactivate' : 'Activate'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.controlButton,
                                    isMoving ? styles.stopButton : styles.playButton,
                                ]}
                                onPress={toggleMoving}
                                disabled={!isActive} // Disable play/stop when not active
                            >
                                <Text style={styles.buttonText}>
                                    {isMoving ? 'Stop' : 'Play'}
                                </Text>
                            </TouchableOpacity>
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
    imageContainer: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 15,
        paddingHorizontal: 5,
        paddingVertical: 5,
        width: width * 0.62, // Increased width from 0.5 to 0.6
        height: height * 0.75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageView: {
        width: width * 0.6, // Increased width from 0.5 to 0.6
        height: height * 0.7, // Increased height from 0.65 to 0.7
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },

    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
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
        width: width * 0.30,
        alignItems: 'center',
        justifyContent: 'space-around',
        height: height * 0.75,
    },
    sliderContainer: {
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20, // Increased margin for better spacing
    },
    sliderLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2F4F4F',
        marginBottom: 10, // Increased margin for better spacing
        textAlign: 'center',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    buttonContainer: {
        flexDirection: 'column', // Changed to column
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    controlButton: {
        paddingVertical: 12, // Increased padding
        paddingHorizontal: 25, // Increased padding
        borderRadius: 10,
        marginVertical: 10, // Added vertical margin
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%', // Adjusted width
    },
    activeButton: {
        backgroundColor: '#4CAF50', // Green
    },
    inactiveButton: {
        backgroundColor: '#F44336', // Red
    },
    playButton: {
        backgroundColor: '#2196F3', // Blue
    },
    stopButton: {
        backgroundColor: '#FF9800', // Orange
    },
    buttonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
