// import React from 'react';
// import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// interface StructureScreenProps {
//   navigation: any;
// }

// const structureCategoryIcons = [
//   "home",
//   "pencil-square-o",
//   "code",
//   "cogs",
//   "check-circle",
//   "lock"
// ];

// const structureCategories = [
//   "Home Surveillance", 
//   "Hall sensor security cam",
//   "IOT cam",
//   "Electric Cycle speedometer",
//   "AI Based Petfeeder",
//   "Portable AI-based safe box"
// ];

// const StructureScreen: React.FC<StructureScreenProps> = ({ navigation }) => {

//   const handleNavigation = (item: string) => {
//     if (item === "Home Surveillance") {
//       navigation.navigate('HomeScreenSurveillance');
//     } else if (item === "Hall sensor security cam") {
//       navigation.navigate('HallSensorScreen');
//     } else if (item === "IOT cam") { 
//       navigation.navigate("DevicesIotScreen"); 
//     }else if (item === "Electric Cycle speedometer"){
//       navigation.navigate("Dashboard");
//     }else if(item === "AI Based Petfeeder"){
//       navigation.navigate("petfeeder");
//     }else if(item === "Portable AI-based safe box"){
//       navigation.navigate("safebox")
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollView}
//       >
//         <View style={styles.gridContainer}>
//           {structureCategories.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.box}
//               onPress={() => handleNavigation(item)}
//             >
//               <Icon
//                 name={structureCategoryIcons[index]}
//                 size={40}
//                 color="#000000"
//                 style={styles.icon}
//               />
//               <Text style={styles.boxText} numberOfLines={2} adjustsFontSizeToFit>
//                 {item}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//   },
//   scrollView: {
//     flexDirection: 'row',  
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   gridContainer: {
//     flexDirection: 'row', 
//     flexWrap: 'wrap',     
//     justifyContent: 'flex-start', 
//     width: '100%',
//   },
//   box: {
//     width: 180,   
//     height: 240,  
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 20,  
//     marginVertical: 20,    
//     borderRadius: 12,
//     backgroundColor: '#A5D6A7',  
//     borderWidth: 3,
//     borderColor: '#FFFFFF',   
//   },
//   boxText: {
//     fontSize: 18,  
//     fontWeight: 'bold',
//     color: '#000000',
//     textAlign: 'center',
//   },
//   icon: {
//     marginBottom: 12,
//     color: '#000000',  
//     fontSize: 40,
//   },
// });

// export default StructureScreen;




import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface StructureScreenProps {
  navigation: any;
}

const categories = [
  { name: "Home Surveillance Security", icon: "home", image: require('../../structure_home/homeSurvillance.jpg') },
  { name: "IOT Camera", icon: "camera", image: require('../../structure_home/IOT.jpg') },
  { name: "Hall Sensor Security Cam", icon: "bell", image: require('../../structure_home/HallSecurityCam.jpeg') },
  { name: "Electric Cycle Speedometer", icon: "tachometer", image: require('../../structure_home/ElectricCycle.jpg') },
  // { name: "AI Safe-box", icon: "cube", image: require('../../structure/safe_box.jpg') },
  // { name: "AI Smart Pet Feeder", icon: "paw", image: require('../../structure/pet_feeder.jpg') }
];

const StructureScreen: React.FC<StructureScreenProps> = ({ navigation }) => {
  const handleNavigation = (category: string) => {
    switch (category) {
      case "Home Surveillance Security":
        navigation.navigate('HomeScreenSurveillance');
        break;
      case "Hall Sensor Security Cam":
        navigation.navigate('HallSensorScreen');
        break;
      case "IOT Camera":
        navigation.navigate('DevicesIotScreen');
        break;
      case "Electric Cycle Speedometer":
        navigation.navigate('Dashboard');
        break;
      case "AI Smart Pet Feeder":
        navigation.navigate('petfeeder');
        break;
      case "AI Safe-box":
        navigation.navigate('safebox');
        break;
      default:
        console.log("No screen assigned for this category");
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
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
    backgroundColor: '#3F71FF',
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
    width: "95%",
    height: "80%",
    borderRadius: 5,
    resizeMode: 'cover',
  }
});

export default StructureScreen;






// import React from 'react';
// import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// interface StructureScreenProps {
//   navigation: any;
// }

// const structureCategoryIcons = [
//   "home",
//   "eye",
//   "bolt",
//   "bicycle",
//   "bell",
//   "cube",
//   "shield"
// ];

// const structureCategories = [
//   "Home",
//   "Surveillance",
//   "Electric",
//   "Cycle Speed",
//   "Hall",
//   "LOT",
//   "Security"
// ];

// const StructureScreen: React.FC<StructureScreenProps> = ({ navigation }) => {
//   const handleNavigation = (item: string) => {
//     const routes: Record<string, string> = {
//       "Home": "HomeScreenSurveillance",
//       "Surveillance": "HallSensorScreen",
//       "Electric": "Dashboard",
//       "Cycle Speed": "Dashboard",
//       "Hall": "HallSensorScreen",
//       "LOT": "DevicesIotScreen",
//       "Security": "safebox"
//     };
//     if (routes[item]) navigation.navigate(routes[item]);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.honeycomb}>
//         {structureCategories.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[styles.hexagonContainer, index >= 4 && styles.secondRow]}
//             onPress={() => handleNavigation(item)}
//           >
//             <View style={styles.hexagon}>
//               <View style={styles.hexagonInner}>
//                 <Icon 
//                   name={structureCategoryIcons[index]} 
//                   size={40} 
//                   color="#FFF" 
//                   style={styles.icon} 
//                 />
//                 <Text style={styles.boxText}>{item}</Text>
//               </View>
//               <View style={styles.hexagonBefore} />
//               <View style={styles.hexagonAfter} />
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#87CEEB',
//     padding: 20,
//   },
//   honeycomb: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     paddingTop: 40,
//   },
//   hexagonContainer: {
//     margin: 8,
//     width: 100,
//   },
//   secondRow: {
//     marginTop: -30,
//   },
//   hexagon: {
//     width: 100,
//     height: 115,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   hexagonInner: {
//     width: 100,
//     height: 58,
//     backgroundColor: '#FF6B6B',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 12,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   hexagonBefore: {
//     position: 'absolute',
//     top: -29,
//     width: 0,
//     height: 0,
//     borderLeftWidth: 50,
//     borderRightWidth: 50,
//     borderBottomWidth: 29,
//     borderStyle: 'solid',
//     borderLeftColor: 'transparent',
//     borderRightColor: 'transparent',
//     borderBottomColor: '#FF6B6B',
//   },
//   hexagonAfter: {
//     position: 'absolute',
//     bottom: -29,
//     width: 0,
//     height: 0,
//     borderLeftWidth: 50,
//     borderRightWidth: 50,
//     borderTopWidth: 29,
//     borderStyle: 'solid',
//     borderLeftColor: 'transparent',
//     borderRightColor: 'transparent',
//     borderTopColor: '#FF6B6B',
//   },
//   boxText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFF',
//     textAlign: 'center',
//     marginTop: 5,
//     textShadowColor: 'rgba(0,0,0,0.2)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   icon: {
//     marginBottom: 5,
//     textShadowColor: 'rgba(0,0,0,0.2)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
// });

// export default StructureScreen;






