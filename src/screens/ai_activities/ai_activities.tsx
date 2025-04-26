import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AutomationScreenProps {
  navigation: any;
}

const aiCategories = [
  { name: "Camera Based Activity", icon: "camera", screen: "CameraActivityScreen", image: require('../ai_activities/ai_images/CameraBase(1).jpg') },
  { name: "Voice Based Activity", icon: "microphone", screen: "VoiceActivityScreen", image: require('../ai_activities/ai_images/voiceBase(1).jpg') },
];

const cameraActivities = [
  { name: "Face Detection", icon: "bell", screen: "FaceDetectionDoorAlarmScreen", image: require('../ai_activities/ai_images/faceDectionBot.jpg')},
  { name: "Face Detection Bot", icon: "user", screen: "FaceDetectionBotScreen", image: require('../ai_activities/ai_images/faceDectionDoorAlarm.jpg')},
  // { name: "Color Detection Bot", icon: "tint", screen: "ColorDetectionBotScreen", image: require('../ai_activities/camera_based/FaceDetectionBotScreen') },
  // { name: "QR Based Detection Bot", icon: "qrcode", screen: "QRDetectionBotScreen", image: require('../ai_activities/camera_based/FaceDetectionBotScreen') },
];

const voiceActivities = [
  { name: "voice output", icon: "volume-up", screen: "VoiceControllerOutputScreen", image: require('../ai_activities/ai_images/VoiceControlOutput.png') },
  { name: "voice control car", icon: "car", screen: "VoiceControllerCarScreen", image: require('../ai_activities/ai_images/VoiceControlCar.jpg') },
];

const Aibased: React.FC<AutomationScreenProps> = ({ navigation }) => {
  const [currentActivities, setCurrentActivities] = React.useState(aiCategories);

  const handlePress = (screen: string) => {
    if (screen === 'CameraActivityScreen') {
      setCurrentActivities(cameraActivities);
    } else if (screen === 'VoiceActivityScreen') {
      setCurrentActivities(voiceActivities);
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredContainer}>
        <Text style={styles.headerText}>
          {currentActivities === aiCategories 
            ? 'AI Based Activities' 
            : currentActivities === cameraActivities 
              ? 'Camera Based Activities' 
              : 'Voice Based Activities'
          }
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {currentActivities.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(item.screen)}
              style={styles.box}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.boxText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B8EDD',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  centeredContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  box: {
    width: 286,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  boxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 8,
  },
  image: {
    width: '95%',
    height: '80%',
    borderRadius: 5,
    resizeMode: 'cover',
  },
});

export default Aibased;