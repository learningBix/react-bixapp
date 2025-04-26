import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface AutomationScreenProps {
  navigation: any;
}

// Import images
import buzzerImage from '../../Output(s3)/buzzer.png';
import fanImage from '../../Output(s3)/fan.png';
import LEDImage from '../../Output(s3)/buzzer.png';
import motorImage from '../../Output(s3)/motor.png';
import OLEDImage from '../../Output(s3)/OLED.png';
import RGBImage from '../../Output(s3)/RGB.png';
import servoImage from '../../Output(s3)/servo.png';
import vibrationImage from '../../Output(s3)/vibration.png';
import music from '../../Output(s3)/music.png'

const automationCategories = [
  { name: "RGB LED", image: RGBImage, screen: "RGBLEDScreen" },
  { name: "Vibration Motor", image: vibrationImage, screen: "VibrationMotorScreen" },
  { name: "Buzzer", image: buzzerImage, screen: "BuzzerScreen" },
  { name: "Music", image: music, screen: "MusicScreen" }, // No image
  { name: "Fan Block", image: fanImage, screen: "FanBlockScreen" },
  { name: "Servo Motor / WiFi", image: servoImage, screen: "ServoMotorWiFiScreen" },
  { name: "Motor Driver", image: motorImage, screen: "MotorDriverScreen" },
  { name: "OLED Block", image: OLEDImage, screen: "OLEDBlockScreen" },
];

const OutputScreen: React.FC<AutomationScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {automationCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.box}
              onPress={() => navigation.navigate(item.screen)}
            >
              {item.image ? (
                <Image source={item.image} style={styles.image} />
              ) : (
                <Text>No Image</Text>
              )}
              <Text style={styles.boxText} numberOfLines={2} adjustsFontSizeToFit>
                {item.name}
              </Text>
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
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
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
    padding: 10,
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
    marginTop: 12,
  },
  image: {
    width: '90%', // Adjust as needed
    height: '70%', // Adjust as needed
    resizeMode: 'contain', // or 'cover'
  },
});

export default OutputScreen;
