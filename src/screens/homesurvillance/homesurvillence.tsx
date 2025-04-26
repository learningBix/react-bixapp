import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const HomeScreenSurveillance = () => {
    const insets = useSafeAreaInsets();
    const [toggleEnabled, setToggleEnabled] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const lastSentTime = useRef(0);

    const handleToggle = () => setToggleEnabled((prev) => !prev);

    const sendServoCommand = (angle) => {
        const now = Date.now();
        if (now - lastSentTime.current < 50) return;
        lastSentTime.current = now;

        const client = dgram.createSocket('udp4');
        client.on('error', (err) => {
            console.error('UDP Socket Error:', err);
            client.close();
        });

        client.bind(0, () => {
            const message = Buffer.from([0xC3, angle]);
            client.send(message, 0, message.length, 8888, 'esptest.local', (error) => {
                if (error) console.error('UDP Send Error:', error);
                client.close();
            });
        });
    };

    const handleSliderChange = (value) => {
        setSliderValue(value);
        sendServoCommand(Math.round(value));
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>  
            <View style={styles.contentWrapper}>
                <View style={styles.content}>
                    {/* Camera Card - Left Panel */}
                    <View style={styles.cameraCard}>
                        {toggleEnabled ? (
                            <View style={styles.webviewWrapper}>
                                <WebView
                                    source={{ uri: `http://esptest.local:81/stream?time=${Date.now()}` }}
                                    style={styles.webview}
                                    allowsFullscreenVideo={false}
                                    scrollEnabled={false}
                                    originWhitelist={['*']}
                                    mixedContentMode="always"
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                />
                            </View>
                        ) : (
                            <View style={styles.cameraOff}>
                                <Text style={styles.cameraOffText}>Stream Here</Text>
                            </View>
                        )}
                    </View>

                    {/* Controls Card - Right Panel */}
                    <View style={styles.controlsCard}>
                        {/* Stream Controls */}
                        <View style={styles.sectionHeader}>
                            <Ionicons name="power" size={20} color="#FFA500" />
                            <Text style={styles.sectionTitle}>STREAM CONTROLS</Text>
                        </View>
                        <View style={styles.divider} />
                        
                        <View style={styles.toggleContainer}>
                            <Text style={styles.controlLabel}>Toggle Stream</Text>
                            <Switch value={toggleEnabled} onValueChange={handleToggle} color="#FFFFFF" />
                        </View>

                        {/* Servo Controls */}
                        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                            <Ionicons name="settings" size={20} color="#FFA500" />
                            <Text style={styles.sectionTitle}>SERVO CONTROLS</Text>
                        </View>
                        <View style={styles.divider} />
                        
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderHeader}>
                                <Text style={styles.controlLabel}>Servo Angle</Text>
                                <View style={styles.valueBox}>
                                    <Text style={styles.sliderValue}>{sliderValue}°</Text>
                                </View>
                            </View>
                            {/* Your original slider implementation preserved */}
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={180}
                                step={1}
                                value={sliderValue}
                                onValueChange={handleSliderChange}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#9370DB"
                                thumbTintColor="#FFFFFF"
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
        backgroundColor: '#3F1D68',
    },
    contentWrapper: {
        flex: 1,
        width: '100%',
        padding: 16,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        gap: 16,
    },
    cameraCard: {
        flex: 3,
        backgroundColor: '#2A0C4E',
        borderRadius: 20,
        minHeight: 300,
    },
    webviewWrapper: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: 'black',
    },
    cameraOff: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    cameraOffText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#5C2E91',
        fontFamily: 'Roboto-Bold',
    },
    controlsCard: {
        flex: 2,
        backgroundColor: '#652D90',
        borderRadius: 20,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#8A2BE2',
        marginBottom: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    controlLabel: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    sliderContainer: {
        marginTop: 8,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    valueBox: {
        backgroundColor: '#FF69B4',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    sliderValue: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

export default HomeScreenSurveillance;