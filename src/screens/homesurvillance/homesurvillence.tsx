// import React, { useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Slider from '@react-native-community/slider';
// import { Switch } from 'react-native-paper';
// import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
// import { WebView } from 'react-native-webview';
// import Orientation from 'react-native-orientation';

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#6750A4',
//     secondary: '#625B71',
//     tertiary: '#7D5260',
//     background: '#F1EFF4',
//     surface: '#FFFFFF',
//     onPrimary: '#FFFFFF',
//     onSecondary: '#FFFFFF',
//     onTertiary: '#FFFFFF',
//     onSurface: '#000000',
//     outline: '#79747E',
//   },
// };

// const HomeScreenSurveillance: React.FC = () => {
//     const insets = useSafeAreaInsets();
//     const [toggleEnabled, setToggleEnabled] = useState(false);
//     const [sliderValue, setSliderValue] = useState(180);
  
//     const handleToggle = () => setToggleEnabled((prev) => !prev);
  
//     return (
//       <PaperProvider theme={theme}>
//         <SafeAreaView
//           style={[
//             styles.container,
//             {
//               paddingTop: insets.top,
//               paddingBottom: insets.bottom,
//               backgroundColor: theme.colors.background,
//             },
//           ]}
//         >
//           {/* <Text style={[styles.title, { color: theme.colors.primary }]}>Hey, this is Home Surveillance</Text> */}
  
//           <View style={styles.content}>
//             {/* Conditionally render WebView based on toggle state */}
//             {toggleEnabled ? (
//               <WebView
//                 source={{ uri: 'http://192.168.0.101:81/stream' }}
//                 style={{ width: 400, height: 400 }}
//               />
//             ) : (
//                 <View><Text style={[styles.labelText, { color: theme.colors.onSurface }]}>Camera feed is off</Text></View>
              
//             )}
  
//             {/* Controls Section */}
//             <View style={styles.controls}>
//               <View style={styles.toggleContainer}>
//                 <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>Start Streaming</Text>
//                 <Switch
//                   value={toggleEnabled}
//                   onValueChange={handleToggle}
//                   color={theme.colors.primary}
//                 />
//               </View>
  
//               <View style={styles.sliderContainer}>
//                 <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>Set Angle: {sliderValue.toFixed(0)}</Text>
//                 <Slider
//                   style={styles.slider}
//                   minimumValue={0}
//                   maximumValue={100}
//                   step={1}
//                   value={sliderValue}
//                   onValueChange={setSliderValue}
//                   minimumTrackTintColor={theme.colors.primary}
//                   maximumTrackTintColor={theme.colors.outline}
//                   thumbTintColor={theme.colors.primary}
//                 />
//               </View>

              
              
//             </View>
//           </View>
//         </SafeAreaView>
//       </PaperProvider>
//     );
//   };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '500',
//     textAlign: 'center',
//     marginVertical: 16,
//   },
//   content: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     width: '100%',
//     height : '100%',
//     marginTop: 16,
//   },
//   controls: {
//     width: '50%',
//     justifyContent: 'flex-start',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 24,
//   },
//   sliderContainer: {
//     alignItems: 'stretch',
//   },
//   slider: {
//     height: 40,
//   },
//   labelText: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//   },
// });

// export default HomeScreenSurveillance;





// import React, { useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Slider from '@react-native-community/slider';
// import { Switch } from 'react-native-paper';
// import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
// import { WebView } from 'react-native-webview';

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#6750A4',
//     secondary: '#625B71',
//     tertiary: '#7D5260',
//     background: '#F1EFF4',
//     surface: '#FFFFFF',
//     onPrimary: '#FFFFFF',
//     onSecondary: '#FFFFFF',
//     onTertiary: '#FFFFFF',
//     onSurface: '#000000',
//     outline: '#79747E',
//   },
// };

// const HomeScreenSurveillance: React.FC = () => {
//   const insets = useSafeAreaInsets();
//   const [toggleEnabled, setToggleEnabled] = useState(false);
//   const [sliderValue, setSliderValue] = useState(180);

//   const handleToggle = () => setToggleEnabled((prev) => !prev);

//   return (
//     <PaperProvider theme={theme}>
//       <SafeAreaView
//         style={[
//           styles.container,
//           {
//             paddingTop: insets.top,
//             paddingBottom: insets.bottom,
//             backgroundColor: theme.colors.background,
//           },
//         ]}
//       >
//         <View style={styles.content}>


//         <View style={styles.cameraCard}>
//             {toggleEnabled ? (
//               <WebView
//                 source={{ uri: 'http://192.168.0.101:81/stream' }}
//                 style={styles.webview}
//               />
//             ) : (
//               <View style={styles.cameraOff}>
//                 <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>
//                   Camera feed is off
//                 </Text>
//               </View>
//             )}
//           </View>
//           {/* Controls Card */}
//           <View style={styles.controlsCard}>
//             <View style={styles.toggleContainer}>
//               <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>
//                 Start Streaming
//               </Text>
//               <Switch
//                 value={toggleEnabled}
//                 onValueChange={handleToggle}
//                 color={theme.colors.primary}
//               />
//             </View>

//             <View style={styles.sliderContainer}>
//               <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>
//                 Set Angle: {sliderValue.toFixed(0)}
//               </Text>
//               <Slider
//                 style={styles.slider}
//                 minimumValue={0}
//                 maximumValue={360}
//                 step={1}
//                 value={sliderValue}
//                 onValueChange={setSliderValue}
//                 minimumTrackTintColor={theme.colors.primary}
//                 maximumTrackTintColor={theme.colors.outline}
//                 thumbTintColor={theme.colors.primary}
//               />
//             </View>
//           </View>

//           {/* Camera Feed Card */}
         
//         </View>
//       </SafeAreaView>
//     </PaperProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   content: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//     gap: 16,
//   },
//   controlsCard: {
//     flex: 1,
//     backgroundColor: theme.colors.surface,
//     borderRadius: 16,
//     padding: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     maxWidth: '48%',
//   },
//   cameraCard: {
//     flex: 1,
//     backgroundColor: theme.colors.surface,
//     borderRadius: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: 'hidden',
//     maxWidth: '48%',
//   },
//   webview: {
//     flex: 1,
//   },
//   cameraOff: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   sliderContainer: {
//     alignItems: 'stretch',
//   },
//   slider: {
//     height: 40,
//   },
//   labelText: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//   },
// });

// export default HomeScreenSurveillance;




import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native-paper';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { WebView } from 'react-native-webview';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
    background: '#F1EFF4',
    surface: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onSurface: '#000000',
    outline: '#79747E',
  },
};

const HomeScreenSurveillance: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(180);

  const handleToggle = () => setToggleEnabled((prev) => !prev);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <View style={styles.content}>


        <View style={styles.cameraCard}>
            {toggleEnabled ? (
              <WebView
                source={{ uri: 'http://192.168.0.101:81/stream' }}
                style={styles.webview}
              />
            ) : (
              <View style={styles.cameraOff}>
                <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Camera feed is off
                </Text>
              </View>
            )}
          </View>
          {/* Controls Card */}
          <View style={styles.controlsCard}>
            <View style={styles.toggleContainer}>
              <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>
                Start Streaming
              </Text>
              <Switch
                value={toggleEnabled}
                onValueChange={handleToggle}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>
                Set Angle: {sliderValue.toFixed(0)}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={360}
                step={1}
                value={sliderValue}
                onValueChange={setSliderValue}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.outline}
                thumbTintColor={theme.colors.primary}
              />
            </View>
          </View>

          {/* Camera Feed Card */}
         
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  controlsCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: '48%',
  },
  cameraCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    maxWidth: '48%',
  },
  webview: {
    flex: 1,
  },
  cameraOff: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sliderContainer: {
    alignItems: 'stretch',
  },
  slider: {
    height: 40,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
});

export default HomeScreenSurveillance;

