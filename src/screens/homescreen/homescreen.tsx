import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const categories = [
    "Structure", "Automation", "AI", "Robotic car",
    "Server", "Input", "Output", "Sensor"
];

const categoryIcons = [
    "building",
    "cogs",
    "lightbulb-o",
    "car",
    "server",
    "keyboard-o",
    "arrow-up",
    "lightbulb-o"
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

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
            case "Robotic car":
                navigation.navigate('Roboticsscreen');
                break;
            case "Input":
                navigation.navigate('InputHiveStatus');
                break;
            case "Sensor":
                navigation.navigate('SensorHiveStatus');
                break;
            default:
                console.log("No screen assigned for this category");
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            >
                {categories.map((item, index) => (
                    <Animated.View key={index} style={[styles.box, { transform: [{ scale: scaleAnim }] }]}>
                        <TouchableOpacity
                            onPress={() => handleNavigation(item)}
                            style={styles.touchable}
                        >
                            <Icon name={categoryIcons[index]} size={40} color="black" style={styles.icon} />
                            <Text style={styles.boxText} numberOfLines={2} adjustsFontSizeToFit>{item}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flexDirection: 'row',
        paddingVertical: 40,
    },
    box: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 30,
        backgroundColor: '#a5d6a7',
    },
    boxText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    icon: {
        marginBottom: 15,
        fontSize: 50,
        color: 'black'
    },
    touchable: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30
    },
});

export default HomeScreen;
