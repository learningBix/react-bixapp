import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; // Ensure correct import path

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
    "robot",
    "car",
    "server",
    "keyboard-o",
    "arrow-up",
    "lightbulb-o"
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.welcomeContainer}>
                <Icon name="rocket" size={50} color="rgb(32, 59, 147)" style={styles.welcomeIcon} />
                <Text style={styles.welcomeText}>Welcome to BixCode!</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            >
                {categories.map((item, index) => (
                    <Animated.View key={index} style={[styles.box, { transform: [{ scale: scaleAnim }] }]}>
                        <TouchableOpacity
                            onPress={() => item === "Structure" ? navigation.navigate('StructureScreen') : null}
                            style={styles.touchable}
                        >
                            <Icon name={categoryIcons[index]} size={30} color="#FFFFFF" style={styles.icon} />
                            <Text style={styles.boxText} numberOfLines={2} adjustsFontSizeToFit>{item}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
    welcomeContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
    welcomeIcon: { marginRight: 10 },
    welcomeText: { fontSize: 50, fontWeight: '900', color: 'rgb(32, 59, 147)', textAlign: 'left' },
    scrollView: { flexDirection: 'row', paddingVertical: 20 },
    box: { width: 220, height: 220, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15, borderRadius: 30, backgroundColor: 'rgb(32, 59, 147)', borderWidth: 5, borderColor: '#FFFFFF' },
    boxText: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
    icon: { marginBottom: 12, fontSize: 40 },
    touchable: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 25 },
});

export default HomeScreen;
