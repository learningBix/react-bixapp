import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AutomationScreenProps {
  navigation: any;
}

const automationCategories = [
    { name: "RGB LED", icon: "lightbulb-o", screen: "RGBLEDScreen" },
    { name: "Vibration Motor", icon: "vibration", screen: "VibrationMotorScreen" },
    { name: "Buzzer", icon: "volume-up", screen: "BuzzerScreen" },
    { name: "Music", icon: "music", screen: "MusicScreen" },
    { name: "Fan Block", icon: "fan", screen: "FanBlockScreen" },
    { name: "Servo Motor / WiFi", icon: "wifi", screen: "ServoMotorWiFiScreen" },
    { name: "Motor Driver", icon: "cogs", screen: "MotorDriverScreen" },
    { name: "OLED Block", icon: "tv", screen: "OLEDBlockScreen" },
  ];

const OutputScreen: React.FC<AutomationScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View style={styles.gridContainer}>
          {automationCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.box}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={40} color="#000000" style={styles.icon} />
              <Text style={styles.boxText} numberOfLines={2} adjustsFontSizeToFit>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  scrollView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  box: {
    width: 180,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#A5D6A7',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  icon: {
    marginBottom: 12,
    color: '#000000',
    fontSize: 40,
  },
});

export default OutputScreen;
