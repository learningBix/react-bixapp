import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface AutomationScreenProps {
  navigation: any;
}

// Add your image imports here
// import roboCarImage from './assets/robo-car.png';
// import smartAvoidImage from './assets/smart-avoid.png';

const automationCategories = [
  { 
    name: "Robo Car", 
    image: require('./assets/roboticCar.png'), // Replace with actual import
    screen: "robocar"
  },
  { 
    name: "Smart Avoid", 
    image: require('./assets/obstacle_avoider.jpg'), // Replace with actual import
    screen: "obstacleavoid"
  },
];

const RoboticsScreen: React.FC<AutomationScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollWrapper}>
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
              <Image 
                source={item.image} 
                style={styles.image}
                resizeMode="contain"
              />
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
  },
  scrollWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  box: {
    width: 286,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
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
    width: '80%',
    height: '70%',
    marginBottom: 10,
  },
});

export default RoboticsScreen;
