import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface StructureScreenProps {
  navigation: any;
}

const structureCategoryIcons = [
  "home",
  "pencil-square-o",
  "code",
  "cogs",
  "check-circle",
  "lock"
];

const structureCategories = [
  "Home Surveillance", 
  "Hall sensor security cam",
  "IOT cam",
  "Electric Cycle speedometer",
  "AI Based Petfeeder",
  "Portable AI-based safe box"
];

const StructureScreen: React.FC<StructureScreenProps> = ({ navigation }) => {

  const handleNavigation = (item: string) => {
    if (item === "Home Surveillance") {
      navigation.navigate('HomeScreenSurveillance');
    } else if (item === "Hall sensor security cam") {
      navigation.navigate('HallSensorScreen');
    }
    // Add additional navigation logic if needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {/* Container for the 2x3 grid layout */}
        <View style={styles.gridContainer}>
          {structureCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.box}
              onPress={() => handleNavigation(item)}
            >
              <Icon
                name={structureCategoryIcons[index]}
                size={40}
                color="#000000"  // Set icon color to black
                style={styles.icon}
              />
              <Text
                style={styles.boxText}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {item}
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
    flexDirection: 'row',  // Ensure horizontal scrolling
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  gridContainer: {
    flexDirection: 'row',  // Arrange items in a row
    flexWrap: 'wrap',      // Allow items to wrap into a new row
    justifyContent: 'flex-start', // Align items to the start
    width: '100%',
  },
  box: {
    width: 180,   // Adjust width for bigger boxes
    height: 240,  // Adjust height for bigger boxes
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,  // Space between items horizontally
    marginVertical: 20,    // Space between rows
    borderRadius: 12,
    backgroundColor: '#A5D6A7',  // Light green background
    borderWidth: 3,
    borderColor: '#FFFFFF',  // White border
  },
  boxText: {
    fontSize: 18,  // Adjust font size for readability
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  icon: {
    marginBottom: 12,
    color: '#000000',  // Ensure icon color is black
    fontSize: 40,
  },
});

export default StructureScreen;
