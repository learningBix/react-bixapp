import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');

interface AutomationScreenProps {
  navigation: any;
}

const automationCategories = [
  { 
    name: "Robo Car", 
    icon: "car", // FontAwesome5 icon
    screen: "robocar", 
    color: 'rgba(255,255,255,0.6)' 
  },
  { 
    name: "Smart Avoid", 
    icon: "robot", // FontAwesome5 icon
    screen: "obstacleavoid", 
    color: 'rgba(255,255,255,0.6)' 
  },
];

const RoboticsScreen: React.FC<AutomationScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('./assets/bb.jpg')} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.gridContainer}>
          {automationCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.box, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.squareBubble}>
                <FontAwesome5 
                  name={item.icon} 
                  size={width * 0.1} 
                  color="red" 
                />
              </View>
              <Text style={styles.boxText}>{item.name}</Text>
              <View style={styles.sticker}>
                {/* <Text style={styles.stickerText}>🚀⭐</Text> */}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: width * 0.03,
  },
  box: {
    width: width * 0.25, // Smaller size
    height: width * 0.3, // Smaller size
    margin: width * 0.02,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF', // More opaque
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  squareBubble: {
    backgroundColor: '#FFFFFF',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  boxText: {
    fontSize: width * 0.03, // Adjusted for smaller size
    fontFamily: 'Comic Sans MS',
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 4,
  },
  sticker: {
    position: 'absolute',
    top: 6,
    right: 6,
    transform: [{ rotate: '15deg' }],
  },
  stickerText: {
    fontSize: width * 0.035,
    opacity: 0.8,
  },
});

export default RoboticsScreen;



// forward - B1
// backward - B2
// left B3 
// right B4
// stop B0


