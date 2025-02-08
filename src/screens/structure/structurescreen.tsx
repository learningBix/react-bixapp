// StructureScreen.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';

import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcomeText}>Structure Details</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            >
                {structureCategories.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.box}
                        onPress={() => item === "Home Surveillance" ? navigation.navigate('HomeScreenSurveillance') : null}
                    >
                        <Icon name={structureCategoryIcons[index]} size={30} color="#FFFFFF" style={styles.icon} />
                        <Text style={styles.boxText} numberOfLines={2} adjustsFontSizeToFit>{item}</Text>
                    </TouchableOpacity>
                ))}
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
    welcomeText: {
        fontSize: 50,
        fontWeight: '900',
        color: 'rgb(32, 59, 147)',
        textAlign: 'left',
        marginVertical: 10,
        letterSpacing: -1.5,
    },
    scrollView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    box: {
        width: 220,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        borderRadius: 30,
        backgroundColor: 'rgb(32, 59, 147)',
        shadowColor: '#F7D547',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 5,
        borderColor: '#FFFFFF',
    },
    boxText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    icon: {
        marginBottom: 12,
        color: '#FFFFFF',
        fontSize: 40,
    },
});

export default StructureScreen;
