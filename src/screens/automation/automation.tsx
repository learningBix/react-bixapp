import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface AutomationScreenProps {
  navigation: any;
}

const automationCategories = [
  { name: 'Night Lamp', image: require('../../main/smartLamp.jpg'), screen: 'NightLamp' },
  { name: 'Morning Alarm', image: require('../../main/MorningAlarm.png'), screen: 'MorningAlarmScreen' },
  { name: 'Smart Irrigation System', image: require('../../main/SmartIrigation.jpg'), screen: 'SmartIrrigationScreen' },
  { name: 'Door Alarm', image: require('../../main/doorAlarm.jpg'), screen: 'DoorAlarmScreen' },
  { name: 'Water Overflow Indication', image: require('../../main/WaterOverflow.jpg'), screen: 'WaterOverflowScreen' },
  { name: 'Pet Feeder', image: require('../../main/pet_feeder.jpg'), screen: 'PetFeederScreen' },
  { name: 'Person Counter', image: require('../../main/perosonCounter.jpg'), screen: 'PersonCounterScreen' },
  // { name: 'Home Security System', image: require('../../main/perosonCounter.jpg'), screen: 'HomeSecurityScreen' },
  { name: 'Liquid Dispenser', image: require('../../main/Liquidispenser.jpg'), screen: 'LiquidDispenserScreen' },
];

const AutomationScreen: React.FC<AutomationScreenProps> = ({ navigation }) => {
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
              onPress={() => navigation.navigate(item.screen)}
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

export default AutomationScreen;
