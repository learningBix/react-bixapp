import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/homescreen/homescreen';
import HallSensorScreen from './src/screens/hallsensor/hallsensor';
import StructureScreen from './src/screens/structure/structurescreen';
import HomeScreenSurveillance from './src/screens/homesurvillance/homesurvillence'; 
import DevicesIotScreen from './src/screens/iotdevices/iot';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6750A4', 
  },
};

type RootStackParamList = {
  Home: undefined;
  StructureScreen: undefined;
  HomeScreenSurveillance: undefined;
  HallSensorScreen: undefined;
  DevicesIotScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="StructureScreen" component={StructureScreen} />
          <Stack.Screen name="HomeScreenSurveillance" component={HomeScreenSurveillance} />
          <Stack.Screen name="HallSensorScreen" component={HallSensorScreen} options={{ title: 'Hall Sensor' }}/>
          <Stack.Screen name="DevicesIotScreen" component={DevicesIotScreen} options={{ title: 'IoT Camera' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
