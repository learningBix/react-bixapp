import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UDP_PORT = 8888;
const ESP32_IP = 'esptest.local';

const HallSensorScreen = () => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [isOn, setIsOn] = useState(false);
    const [imageData, setImageData] = useState(null);
    const [base64Text, setBase64Text] = useState('');
    const lastSentTime = useRef(0);
    const socketRef = useRef(null);
    const [receivedChunks, setReceivedChunks] = useState({});
    const [totalChunks, setTotalChunks] = useState(0);
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

    const sendServoCommand = (commandByte) => {
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
                <View style={styles.layout}>
                    {/* Stream Panel */}
                    <View style={styles.streamContainer}>
                        <View style={styles.streamContent}>
                            {isLoading ? (
                                <ActivityIndicator animating={true} size="large" color="#ffffff" />
                            ) : imageData ? (
                                <Image source={{ uri: imageData }} style={styles.image} />
                            ) : (
                                <View style={styles.waitingContainer}>
                                    <Text style={styles.streamText}>Stream Here</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Control Panel */}
                    <View style={styles.controlContainer}>
                        <View style={styles.controlHeader}>
                            <Icon name="tune-vertical" size={22} color="#FFE566" style={{ marginRight: 8 }} />
                            <Text style={styles.controlHeaderText}>Device Control</Text>
                        </View>
                        
                        <View style={styles.buttonsContainer}>
                            <Button 
                                mode="contained"
                                onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
                                disabled={isOn}
                                style={[styles.button, styles.activeButton]}
                                labelStyle={styles.buttonLabel}
                            >
                                <Icon name="power" size={16} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Active</Text>
                            </Button>

                            <Button
                                mode="contained"
                                onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
                                disabled={!isOn}
                                style={[styles.button, styles.deactiveButton]}
                                labelStyle={styles.buttonLabel}
                            >
                                <Icon name="power-off" size={16} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Deactive</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2D1156', // Dark purple background
    },
    container: {
        flex: 1,
        padding: 8,
    },
    layout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    streamContainer: {
        flex: 2,
        borderRadius: 30,
        overflow: 'hidden',
        marginRight: 10,
        backgroundColor: '#E96D8A', // Pink container
        padding: 10,
    },
    streamContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    streamText: {
        color: '#7030A0', // Purple text
        fontSize: 24,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    waitingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    controlContainer: {
        flex: 1,
        backgroundColor: '#5D3A89', // Lighter purple
        borderRadius: 20,
        padding: 16,
    },
    controlHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#7A54AB',
        paddingBottom: 12,
        marginBottom: 20,
    },
    controlHeaderText: {
        color: '#FFE566', // Yellow text
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 16,
    },
    button: {
        borderRadius: 12,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#E86D8A', // Pink
    },
    deactiveButton: {
        backgroundColor: '#BB8AC0', // Light purple
    },
    buttonLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default HallSensorScreen;