// import React, { useState, useEffect, useRef } from 'react';
// import { View, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Button, Card, Text, ActivityIndicator, useTheme, Modal, Portal } from 'react-native-paper';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const UDP_PORT = 8888;
// const ESP32_IP = '192.168.0.101';

// const DevicesIotScreen: React.FC = () => {
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
//     const [imageClicked, setImageClicked] = useState(false);
//     const [showSummaryModal, setShowSummaryModal] = useState(false);

//     const dummyResponse = `I can see that this image shows a modern living room with a contemporary design aesthetic. Here's what I observe:

// 1. Furniture: There's a large L-shaped gray sectional sofa that serves as the focal point of the room. A sleek wooden coffee table with interesting geometric patterns sits in front of it.

// 2. Natural Elements: Two tall potted plants are strategically placed near a floor-to-ceiling window, bringing nature indoors and adding life to the space.

// 3. Lighting: The room features recessed ceiling lights and a modern floor lamp, creating layers of ambient lighting that enhance the atmosphere.

// 4. Color Scheme: The space follows a neutral color palette with:
//    • Warm earth tones in the wall art
//    • Soft grays in the upholstery
//    • Rich brown tones in the hardwood flooring

// 5. Textural Elements: A plush white area rug adds softness and contrasts beautifully with the dark hardwood floors.

// Would you like me to provide more specific details about any particular aspect of the room?`;

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

//     const handleImageClick = () => {
//         setImageClicked(!imageClicked);
//     };

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View style={[styles.container, { paddingTop: insets.top }]}>
//                 <Card style={styles.card}>
//                     <View style={styles.twoPaneLayout}>
//                         <Card style={styles.controlsPanel}>
//                             <Card.Content>
//                                 <Text variant="titleLarge" style={styles.panelTitle}>
//                                     <Icon name="devices" size={18} color="#424242" style={{ marginRight: 10 }} />
//                                     Device Controls
//                                 </Text>
//                                 <View style={styles.controls}>
//                                     <Button
//                                         mode="contained"
//                                         onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
//                                         disabled={isOn}
//                                         style={[
//                                             styles.button,
//                                             isOn ? styles.buttonDisabled : styles.buttonActive,
//                                         ]}
//                                     >
//                                         <Icon
//                                             name="power"
//                                             size={20}
//                                             color={isOn ? '#757575' : 'black'}
//                                             style={styles.iconStyle}
//                                         />
//                                         <Text style={[styles.buttonText, { color: isOn ? '#757575' : 'black' }]}>
//                                             Activate Sensor
//                                         </Text>
//                                     </Button>
//                                     <Button
//                                         mode="contained-tonal"
//                                         onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
//                                         disabled={!isOn}
//                                         style={[
//                                             styles.button,
//                                             !isOn ? styles.buttonDisabled : styles.buttonActive,
//                                         ]}
//                                     >
//                                         <Icon
//                                             name="power-off"
//                                             size={20}
//                                             color={!isOn ? '#757575' : 'black'}
//                                             style={styles.iconStyle}
//                                         />
//                                         <Text style={[styles.buttonText, { color: !isOn ? '#757575' : 'black' }]}>
//                                             Deactivate Sensor
//                                         </Text>
//                                     </Button>
//                                     <Button
//                                         mode="contained-tonal"
//                                         onPress={() => setShowSummaryModal(true)}
//                                         disabled={!imageData}
//                                         style={[
//                                             styles.button,
//                                             styles.summaryButton,
//                                             !imageData && styles.buttonDisabled
//                                         ]}
//                                     >
//                                         <Icon
//                                             name="text-box-outline"
//                                             size={20}
//                                             color={!imageData ? '#757575' : '#2E7D32'}
//                                             style={styles.iconStyle}
//                                         />
//                                         <Text style={[styles.buttonText, { 
//                                             color: !imageData ? '#757575' : '#2E7D32' 
//                                         }]}>
//                                             Summarize Image
//                                         </Text>
//                                     </Button>
//                                 </View>
//                             </Card.Content>
//                         </Card>
//                         <Card style={styles.imagePreview}>
//                             <Card.Content>
//                                 <Text variant="titleLarge" style={styles.panelTitle}>
//                                     <Icon name="image" size={15} color="#424242" style={{ marginRight: 8 }} />
//                                     Captured Image
//                                 </Text>
//                                 <View style={styles.imageContainer}>
//                                     {isLoading ? (
//                                         <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
//                                     ) : imageClicked && imageData ? (
//                                         <TouchableOpacity onPress={handleImageClick}>
//                                             <Image source={{ uri: imageData }} style={styles.imageFull} />
//                                         </TouchableOpacity>
//                                     ) : imageData ? (
//                                         <TouchableOpacity onPress={handleImageClick}>
//                                             <Image source={{ uri: imageData }} style={styles.image} />
//                                         </TouchableOpacity>
//                                     ) : (
//                                         <View style={styles.waitingContainer}>
//                                             <Icon name="image-off" size={40} color="#777" style={{ marginBottom: 8 }} />
//                                             <Text variant="bodyMedium" style={styles.waitingText}>
//                                                 Waiting for image data...
//                                             </Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             </Card.Content>
//                         </Card>
//                     </View>
//                     <Card style={styles.dataOutput}>
//                         <Card.Content>
//                             <Text variant="titleMedium" style={styles.dataTitle}>
//                                 <Icon
//                                     name="code-braces"
//                                     size={24}
//                                     color="#2E7D32"
//                                     style={{ marginRight: 8, marginBottom: 8, textAlign: 'center' }}
//                                 />
//                                 Base64 Data Stream
//                             </Text>
//                             <ScrollView style={styles.base64Scroll}>
//                                 <Text variant="bodySmall" style={styles.base64Text}>
//                                     {base64Text}
//                                 </Text>
//                             </ScrollView>
//                         </Card.Content>
//                     </Card>
//                 </Card>

//                 <Portal>
//                     <Modal
//                         visible={showSummaryModal}
//                         onDismiss={() => setShowSummaryModal(false)}
//                         contentContainerStyle={styles.modalContainer}
//                     >
//                         <Card style={styles.summaryCard}>
//                             <Card.Title
//                                 title="Image Analysis"
//                                 titleStyle={styles.modalTitle}
//                                 left={(props) => (
//                                     <View style={styles.avatarContainer}>
//                                         <Icon name="robot" size={24} color="#19C37D" />
//                                     </View>
//                                 )}
//                                 right={(props) => (
//                                     <TouchableOpacity 
//                                         onPress={() => setShowSummaryModal(false)}
//                                         style={styles.closeButton}
//                                     >
//                                         <Icon name="close" size={24} color="#666" />
//                                     </TouchableOpacity>
//                                 )}
//                             />
//                             <Card.Content>
//                                 <ScrollView 
//                                     style={styles.summaryScroll}
//                                     showsVerticalScrollIndicator={false}
//                                 >
//                                     <View style={styles.chatBubble}>
//                                         <Text style={styles.summaryText}>
//                                             {dummyResponse}
//                                         </Text>
//                                     </View>
//                                 </ScrollView>
//                             </Card.Content>
//                         </Card>
//                     </Modal>
//                 </Portal>
//             </View>
//         </SafeAreaView>
//     );
// };
// // [Previous code remains exactly the same until the styles]

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//     },
//     container: {
//         flex: 1,
//         paddingHorizontal: 16,
//     },
//     card: {
//         marginVertical: 16,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#EEEEEE',
//         elevation: 0,
//     },
//     panelTitle: {
//         textAlign: 'center',
//         marginBottom: 16,
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#424242',
//         alignItems: "center"
//     },
//     twoPaneLayout: {
//         flexDirection: 'row',
//         gap: 16,
//     },
//     controlsPanel: {
//         borderWidth: 1,
//         borderColor: '#EEEEEE',
//         borderRadius: 12,
//         backgroundColor: '#FFFFFF',
//         padding: 16,
//         elevation: 0,
//         flex: 1,
//     },
//     controls: {
//         gap: 12,
//     },
//     button: {
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 12,
//     },
//     buttonActive: {
//         backgroundColor: '#c8e6c9',
//     },
//     buttonDisabled: {
//         backgroundColor: '#e8f5e9',
//     },
//     summaryButton: {
//         backgroundColor: '#E8F5E9',
//         borderColor: '#C8E6C9',
//         borderWidth: 1,
//     },
//     buttonText: {
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     imagePreview: {
//         flex: 2,
//         borderWidth: 1,
//         borderColor: '#EEEEEE',
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
//         elevation: 0,
//     },
//     imageFull: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 12,
//     },
//     waitingContainer: {
//         alignItems: 'center',
//     },
//     waitingText: {
//         fontStyle: 'italic',
//         color: '#616161',
//         textAlign: 'center',
//     },
//     dataOutput: {
//         marginTop: 16,
//         padding: 12,
//         backgroundColor: '#E8F5E9',
//         borderRadius: 12,
//     },
//     dataTitle: {
//         marginBottom: 8,
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#2E7D32',
//     },
//     base64Scroll: {
//         maxHeight: 150,
//         backgroundColor: '#EEEEEE',
//         padding: 8,
//         borderRadius: 8,
//     },
//     base64Text: {
//         fontFamily: 'monospace',
//         color: '#555555',
//     },
//     iconStyle: {
//         marginRight: 8,
//     },
//     modalContainer: {
//         paddingHorizontal: 16,
//         paddingTop: 60,
//         paddingBottom: 40,
//         margin: 20,
//     },
//     summaryCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 16,
//         maxHeight: '80%',
//         elevation: 4,
//     },
//     modalTitle: {
//         color: '#333333',
//         fontSize: 18,
//         fontWeight: '600',
//     },
//     avatarContainer: {
//         backgroundColor: '#E8F5E9',
//         borderRadius: 20,
//         padding: 8,
//         marginRight: 8,
//     },
//     closeButton: {
//         padding: 8,
//     },
//     summaryScroll: {
//         maxHeight: 400,
//         paddingHorizontal: 8,
//     },
//     chatBubble: {
//         backgroundColor: '#F7F7F8',
//         borderRadius: 12,
//         padding: 16,
//         marginVertical: 8,
//     },
//     summaryText: {
//         color: '#353740',
//         lineHeight: 24,
//         fontSize: 15,
//         letterSpacing: 0.3,
//     },
// });

// export default DevicesIotScreen;



import React, { useState, useEffect, useRef } from 'react';
import { View,ScrollView,Image,StyleSheet,TouchableOpacity,PermissionsAndroid,Platform,ActivityIndicator } from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Text, useTheme, Modal, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCropPicker from 'react-native-image-crop-picker';

const UDP_PORT = 8888;
const ESP32_IP = '192.168.0.101';

const DevicesIotScreen: React.FC = () => {
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
    const [imageClicked, setImageClicked] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const socket = dgram.createSocket('udp4');
        socketRef.current = socket;

        socket.on('message', (msg) => {
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
            socket.close();
        });

        socket.bind(UDP_PORT);

        return () => socket.close();
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
                error && console.error('UDP Send Error:', error);
                client.close();
            });
        });
    };

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
            const image = await ImageCropPicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                includeBase64: true,
                mediaType: 'photo',
            });

            if (image?.data) {
                const base64Image = `data:${image.mime};base64,${image.data}`;
                sendImageForAnalysis(base64Image);
            }
        } catch (err: any) {
            if (err.message !== 'User cancelled image selection') {
                console.error('Image picker error:', err);
            }
        }
    };

    const sendImageForAnalysis = async (base64Image: string) => {
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
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <Card style={styles.card}>
                    <View style={styles.twoPaneLayout}>
                        <Card style={styles.controlsPanel}>
                            <Card.Content>
                                <Text variant="titleLarge" style={styles.panelTitle}>
                                    <Icon name="devices" size={18} color="#424242" />
                                    Device Controls
                                </Text>
                                <View style={styles.controls}>
                                    <Button
                                        mode="contained"
                                        onPress={() => { sendServoCommand(0xC1); setIsOn(true); }}
                                        disabled={isOn}
                                        style={[styles.button, isOn && styles.buttonDisabled]}
                                    >
                                        <Icon name="power" size={20} color={isOn ? '#757575' : 'black'} />
                                        <Text style={[styles.buttonText, isOn && { color: '#757575' }]}>
                                            Activate Sensor
                                        </Text>
                                    </Button>
                                    <Button
                                        mode="contained-tonal"
                                        onPress={() => { sendServoCommand(0xC0); setIsOn(false); }}
                                        disabled={!isOn}
                                        style={[styles.button, !isOn && styles.buttonDisabled]}
                                    >
                                        <Icon name="power-off" size={20} color={!isOn ? '#757575' : 'black'} />
                                        <Text style={[styles.buttonText, !isOn && { color: '#757575' }]}>
                                            Deactivate Sensor
                                        </Text>
                                    </Button>
                                    <Button
                                        mode="contained-tonal"
                                        onPress={() => setShowSummaryModal(true)}
                                        style={[styles.button, styles.summaryButton]}
                                    >
                                        <Icon name="text-box-outline" size={20} color="#2E7D32" />
                                        <Text style={[styles.buttonText, { color: '#2E7D32' }]}>
                                            Summarize Image
                                        </Text>
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>

                        <Card style={styles.imagePreview}>
                            <Card.Content>
                                <Text variant="titleLarge" style={styles.panelTitle}>
                                    <Icon name="image" size={15} color="#424242" />
                                    Captured Image
                                </Text>
                                <View style={styles.imageContainer}>
                                    {isLoading ? (
                                        <ActivityIndicator size="large" color={theme.colors.primary} />
                                    ) : imageData ? (
                                        <TouchableOpacity
                                            onPress={() => setImageClicked(!imageClicked)}
                                            activeOpacity={0.8}
                                        >
                                            <Image
                                                source={{ uri: imageData }}
                                                style={imageClicked ? styles.imageFull : styles.image}
                                            />
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.waitingContainer}>
                                            <Icon name="image-off" size={40} color="#777" />
                                            <Text variant="bodyMedium" style={styles.waitingText}>
                                                Waiting for image data...
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Card.Content>
                        </Card>
                    </View>

                    <Card style={styles.dataOutput}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.dataTitle}>
                                <Icon name="code-braces" size={24} color="#2E7D32" />
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

                <Portal>
                    <Modal
                        visible={showSummaryModal}
                        onDismiss={() => {
                            setShowSummaryModal(false);
                            setAnalysisResult('');
                        }}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <Card style={styles.summaryCard}>
                            <Card.Title
                                title="Image Analysis"
                                titleStyle={styles.modalTitle}
                                left={() => (
                                    <View style={styles.avatarContainer}>
                                        <Icon name="robot" size={24} color="#19C37D" />
                                    </View>
                                )}
                                right={() => (
                                    <TouchableOpacity
                                        onPress={() => setShowSummaryModal(false)}
                                        style={styles.closeButton}
                                    >
                                        <Icon name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                )}
                            />
                            <Card.Content>
                                <ScrollView style={styles.summaryScroll} showsVerticalScrollIndicator={false}>
                                    {imageData ? (
                                        <>
                                            <Image
                                                source={{ uri: imageData }}
                                                style={styles.selectedImage}
                                                resizeMode="contain"
                                            />
                                            {isAnalyzing ? (
                                                <ActivityIndicator
                                                    size="large"
                                                    color={theme.colors.primary}
                                                    style={styles.loader}
                                                />
                                            ) : (
                                                <View style={styles.chatBubble}>
                                                    <Text style={styles.summaryText}>
                                                        {analysisResult || 'Click the button below to analyze'}
                                                    </Text>
                                                </View>
                                            )}
                                            <Button
                                                mode="contained"
                                                onPress={() => sendImageForAnalysis(imageData.split(',')[1])}
                                                style={styles.selectButton}
                                                loading={isAnalyzing}
                                                disabled={isAnalyzing}
                                            >
                                                Analyze Current Image
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            mode="contained"
                                            onPress={handleImagePick}
                                            style={styles.selectButton}
                                            icon="image"
                                        >
                                            Select Image for Analysis
                                        </Button>
                                    )}
                                </ScrollView>
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    card: {
        marginVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    panelTitle: {
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 14,
        fontWeight: '500',
        color: '#424242',
        alignItems: "center"
    },
    twoPaneLayout: {
        flexDirection: 'row',
        gap: 16,
    },
    controlsPanel: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 12,
        padding: 16,
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
    buttonDisabled: {
        backgroundColor: '#EEEEEE',
    },
    buttonText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    imagePreview: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 12,
        padding: 16,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageFull: {
        width: '100%',
        height: 400,
        resizeMode: 'contain',
    },
    waitingContainer: {
        alignItems: 'center',
    },
    waitingText: {
        color: '#777',
        marginTop: 8,
    },
    dataOutput: {
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 12,
        padding: 16,
    },
    dataTitle: {
        textAlign: 'center',
        marginBottom: 16,
        color: '#2E7D32',
        fontWeight: '600',
    },
    base64Scroll: {
        maxHeight: 100,
    },
    base64Text: {
        fontSize: 10,
        color: '#555',
    },
    summaryButton: {
        backgroundColor: '#E8F5E9',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        margin: 20,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    closeButton: {
        padding: 5,
    },
    selectButton: {
        marginTop: 20,
    },
    selectedImage: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    summaryText: {
        fontSize: 16,
        lineHeight: 24,
    },
    summaryScroll: {
        maxHeight: 300,
    },
    avatarContainer: {
        backgroundColor: '#E8F5E9',
        borderRadius: 20,
        padding: 5,
    },
    chatBubble: {
        backgroundColor: '#DCF8C6',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },
    loader: {
        marginTop: 20,
    },
});

export default DevicesIotScreen;

