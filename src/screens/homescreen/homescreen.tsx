import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const categories = [
    { name: "Structure", image: require('../../structure/Structure.jpg') },
    { name: "Automation", image: require('../../structure/Automation.png') },
    { name: "AI", image: require('../../structure/AI.jpg') },
    { name: "Robotic Car", image: require('../../structure/robotic_car.jpg') },
    { name: "Sensors", image: require('../../structure/Sensor.jpg') },
    { name: "Input", image: require('../../structure/input.png') },
    { name: "Output", image: require('../../structure/output.png') },
    { name: "Server", image: require('../../structure/server.png') }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

    const handleNavigation = (category: string) => {
        switch (category) {
            case "Structure":
                navigation.navigate('StructureScreen');
                break;
            case "Automation":
                navigation.navigate('AutomationScreen');
                break;
            case "Output":
                navigation.navigate('OutputScreen');
                break;
            case "Robotic Car":
                navigation.navigate('Roboticsscreen');
                break;
            case "Input":
                navigation.navigate('InputHiveStatus');
                break;
            case "Sensors":
                navigation.navigate('SensorHiveStatus');
                break;
            case "AI":
                navigation.navigate('AIScreen');
                break;
            default:
                console.log("No screen assigned for this category");
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centeredContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollView}
                >
                    {categories.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleNavigation(item.name)} style={styles.box}>
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
        padding: 5, // Reduced padding to minimize space around image
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    boxText: {
        fontSize: 18, // Slightly reduced for better fit
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginTop: 8, // Reduced margin to keep text closer to image
    },
    image: {
        width: "95%", // Making the image take up almost full width
        height: "80%", // Making the image taller
        borderRadius: 5,
        resizeMode: 'cover', // Ensures image fills space properly
    }
});

export default HomeScreen;
