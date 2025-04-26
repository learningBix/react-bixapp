import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, useTheme, Modal, Portal, IconButton, Surface, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCropPicker from 'react-native-image-crop-picker';

const UDP_PORT = 8888;
const ESP32_IP = 'esptest.local';

const DevicesIotScreen = () => {
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
    const [imageClicked, setImageClicked] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    // --- Colors that approximate the screenshot's pink/purple style ---
    const designTheme = {
        background: '#372659',      // Main background (deep purple)
        cardLeftBg: '#F52C82',       // Left card (pink)
        cardRightBg: '#4A2266',      // Right card (darker purple)
        textHeading: '#FFFFFF',      // Heading text
        textBody: '#FCE4F2',         // Body text
        buttonActive: '#FF78B7',     // Button pink
        buttonInactive: '#EAA2D6',   // Lighter pink
    };

    // --- Setup the UDP socket on mount ---
    useEffect(() => {
        const socket = dgram.createSocket('udp4');
        socketRef.current = socket;
        setConnectionStatus('connecting');

        socket.on('message', (msg) => {
            setConnectionStatus('connected');
            const message = msg.toString();
            const parts = message.split(',');
            if (parts.length < 3) return;

            const [seq, total, ...dataParts] = parts;
            const data = dataParts.join(',');

            setReceivedChunks((prev) => ({
                ...prev,
                [parseInt(seq, 10)]: data
            }));
            setTotalChunks(parseInt(total, 10));
        });

        socket.on('error', (err) => {
            console.error('UDP Error:', err);
            setConnectionStatus('disconnected');
            socket.close();
        });

        socket.bind(UDP_PORT);

        // Simulate a connection check
        const connectionTimer = setTimeout(() => {
            if (connectionStatus === 'connecting') {
                setConnectionStatus('connected');
            }
        }, 3000);

        return () => {
            clearTimeout(connectionTimer);
            socket.close();
        };
    }, []);

    // --- Once all chunks arrive, build image and auto-analyze ---
    useEffect(() => {
        if (Object.keys(receivedChunks).length === totalChunks && totalChunks > 0) {
            const fullData = Array.from({ length: totalChunks }, (_, i) => receivedChunks[i] || '').join('');
            setBase64Text(fullData);
            setImageData(`data:image/jpeg;base64,${fullData}`);
            setReceivedChunks({});
            setTotalChunks(0);
            // Auto-analyze image when received
            if (fullData) {
                sendImageForAnalysis(`data:image/jpeg;base64,${fullData}`);
            }
        }
    }, [receivedChunks, totalChunks]);

    // --- Send servo command to device ---
    const sendServoCommand = (commandByte) => {
        const now = Date.now();
        if (now - lastSentTime.current < 50) return;
        lastSentTime.current = now;

        setIsLoading(true);
        const client = dgram.createSocket('udp4');
        client.bind(0, () => {
            const message = Buffer.from([commandByte]);
            client.send(message, 0, message.length, UDP_PORT, ESP32_IP, (error) => {
                setIsLoading(false);
                if (error) {
                    console.error('UDP Send Error:', error);
                }
                client.close();
            });
        });
    };

    // --- Pick an image from gallery for testing ---
    const handleImagePick = async () => {
        const requestPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        {
                            title: "Storage Permission",
                            message: "App needs access to your storage to pick images",
                            buttonPositive: "OK"
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } catch (err) {
                    console.warn(err);
                    return false;
                }
            }
            return true;
        };

        if (!(await requestPermission())) {
            return;
        }

        try {
            setIsLoading(true);
            const image = await ImageCropPicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                includeBase64: true,
                mediaType: 'photo',
            });

            if (image?.data) {
                const base64Image = `data:${image.mime};base64,${image.data}`;
                setImageData(base64Image);
                setBase64Text(image.data);
                sendImageForAnalysis(base64Image);
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            if (err.message !== 'User cancelled image selection') {
                console.error('Image picker error:', err);
            }
        }
    };

    // --- Send image to backend for analysis ---
    const sendImageForAnalysis = async (base64Image) => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('http://98.70.77.148:8000/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image }),
            });
            const data = await response.json();
            setAnalysisResult(data.analysis || 'No analysis available');
        } catch (error) {
            console.error('Analysis Error:', error);
            setAnalysisResult('Error analyzing image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: designTheme.background, paddingTop: insets.top }]}>
            <View style={styles.container}>
                <View style={styles.row}>
                    {/* Left Card: "Captured Image" */}
                    <Surface style={[styles.leftCard, { backgroundColor: designTheme.cardLeftBg }]}>
            
                        <View style={styles.imageArea}>
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#fff" />
                                    <Text style={{ color: '#fff', marginTop: 8 }}>Processing...</Text>
                                </View>
                            ) : imageData ? (
                                <TouchableOpacity
                                    onPress={() => setImageClicked(!imageClicked)}
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Image
                                        source={{ uri: imageData }}
                                        style={imageClicked ? styles.fullImage : styles.previewImage}
                                        resizeMode="contain"
                                    />
                                    {imageClicked && (
                                        <IconButton
                                            icon="close"
                                            size={24}
                                            style={styles.closeImageButton}
                                            onPress={() => setImageClicked(false)}
                                            color="#fff"
                                        />
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.waitingContainer}>
                                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                                        Waiting for image data...
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Surface>

                    {/* Right Card: "Device Control" */}
                    <Surface style={[styles.rightCard, { backgroundColor: designTheme.cardRightBg }]}>
                        <Text style={[styles.cardTitle, { color: designTheme.textHeading }]}>
                            Device Control
                        </Text>
                        <View style={styles.centeredButtonGroup}>
                            <Button
                                mode="contained"
                                onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
                                disabled={isOn || isLoading}
                                loading={isLoading && !isOn}
                                style={[styles.controlButton, { backgroundColor: designTheme.buttonActive }]}
                                labelStyle={styles.controlButtonLabel}
                            >
                                Active
                            </Button>

                            <Button
                                mode="contained"
                                onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
                                disabled={!isOn || isLoading}
                                loading={isLoading && isOn}
                                style={[styles.controlButton, { backgroundColor: designTheme.buttonInactive }]}
                                labelStyle={styles.controlButtonLabel}
                            >
                                Deactive
                            </Button>

                            <Button
                                mode="contained"
                                onPress={() => setShowSummaryModal(true)}
                                disabled={!imageData}
                                style={[styles.controlButton, { backgroundColor: designTheme.buttonInactive }]}
                                labelStyle={styles.controlButtonLabel}
                            >
                                Summarize
                            </Button>
                        </View>
                    </Surface>
                </View>

                {/* Analysis Modal - Summary appears only when "Summarize" is clicked */}
                <Portal>
                    <Modal
                        visible={showSummaryModal}
                        onDismiss={() => setShowSummaryModal(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <Surface style={styles.modalSurface}>
                            <View style={styles.modalHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Icon name="brain" size={24} color={theme.colors.primary} />
                                    <Text style={styles.modalTitle}>Image Analysis</Text>
                                </View>
                                <IconButton
                                    icon="close"
                                    size={24}
                                    onPress={() => setShowSummaryModal(false)}
                                />
                            </View>
                            <Divider />
                            <View style={styles.modalContent}>
                                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                                    {imageData && (
                                        <View style={styles.thumbnailContainer}>
                                            <Image
                                                source={{ uri: imageData }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    )}
                                    <View style={{ flex: 1, marginLeft: 16 }}>
                                        <Text style={styles.modalSummaryHeader}>
                                            {isAnalyzing
                                                ? "Processing image..."
                                                : analysisResult
                                                    ? analysisResult.split('.')[0] + '.'
                                                    : "No analysis available"}
                                        </Text>
                                    </View>
                                </View>
                                {isAnalyzing ? (
                                    <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                                        <ActivityIndicator size="large" color={theme.colors.primary} />
                                    </View>
                                ) : (
                                    <ScrollView style={styles.resultScroll}>
                                        <Text style={styles.resultText}>
                                            {analysisResult || 'No analysis available for this image yet.'}
                                        </Text>
                                    </ScrollView>
                                )}
                                <View style={styles.modalButtonContainer}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => setShowSummaryModal(false)}
                                        style={styles.modalButton}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={() => imageData && sendImageForAnalysis(imageData)}
                                        style={styles.modalButton}
                                        loading={isAnalyzing}
                                        disabled={!imageData || isAnalyzing}
                                    >
                                        Analyze Again
                                    </Button>
                                </View>
                            </View>
                        </Surface>
                    </Modal>
                </Portal>
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
        paddingBottom: 16,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    // Left Card (Captured Image)
    leftCard: {
        flex: 3,
        borderRadius: 24,
        padding: 16,
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    imageArea: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: 300,
        height: 300,
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    waitingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeImageButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    // Right Card (Device Control)
    rightCard: {
        flex: 2,
        borderRadius: 24,
        padding: 16,
        justifyContent: 'center', // Center vertically
    },
    centeredButtonGroup: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    controlButton: {
        borderRadius: 12,
        marginVertical: 6,
        height: 50,
        justifyContent: 'center',
        width: 150,
    },
    controlButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalContainer: {
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalSurface: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContent: {
        padding: 16,
    },
    thumbnailContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    modalSummaryHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    resultScroll: {
        maxHeight: 200,
        marginBottom: 16,
    },
    resultText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#444',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
        gap: 8,
    },
    modalButton: {
        borderRadius: 8,
        minWidth: 100,
    },
});

export default DevicesIotScreen;
