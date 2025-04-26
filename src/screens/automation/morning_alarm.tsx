import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  SafeAreaView,
  PanResponder
} from 'react-native';
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ESP32_IP = 'esptest.local';
const ESP32_PORT = 8888;

export default function MorningAlarm() {
  const [darkThreshold, setDarkThreshold] = useState(0);
  const [buzzerValue, setBuzzerValue] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const lastSentTime = useRef(0);

  const darknessSliderRef = useRef(null);
  const buzzerSliderRef = useRef(null);

  const [darknessSliderWidth, setDarknessSliderWidth] = useState(0);
  const [buzzerSliderWidth, setBuzzerSliderWidth] = useState(0);

  const sendUDPCommand = (darkness, buzzer) => {
    const now = Date.now();
    if (now - lastSentTime.current < 50) return;
    lastSentTime.current = now;
  
    const client = dgram.createSocket('udp4');
    const darknessValue = Math.round(darkness);
    const buzzerVal = Math.round(buzzer);
  
    // If darkness and buzzer values are both 0, send '0xC0'
    const message = Buffer.from([darkness === 0 && buzzer === 0 ? 0xC0 : 0xE1, darknessValue, buzzerVal]);
  
    client.on('error', (err) => {
      console.error('UDP Socket Error:', err);
      client.close();
    });
  
    client.bind(0, () => {
      client.send(message, 0, message.length, ESP32_PORT, ESP32_IP, (err) => {
        if (err) console.error('Send Error:', err);
        client.close();
      });
    });
  
    console.log(`📡 Sent UDP: ${darkness === 0 && buzzer === 0 ? 'C0' : 'E1'} ${darknessValue} ${buzzerVal}`);
  };
  
  

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    // Send the correct command based on the toggle state
    if (newState) {
      sendUDPCommand(darkThreshold, buzzerValue); // This will send 0xE1 when it's on
    } else {
      sendUDPCommand(0, 0); // This will send 0xC0 when it's off
    }
  };
  

  const updateDarkThreshold = (xPosition) => {
    const relativeX = Math.max(0, Math.min(xPosition, darknessSliderWidth));
    const newValue = Math.round((relativeX / darknessSliderWidth) * 100);
    setDarkThreshold(newValue);
  };

  const updateBuzzerValue = (xPosition) => {
    const relativeX = Math.max(0, Math.min(xPosition, buzzerSliderWidth));
    const newValue = Math.round((relativeX / buzzerSliderWidth) * 100);
    setBuzzerValue(newValue);
  };

  const darknessPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (darknessSliderRef.current) {
        darknessSliderRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = evt.nativeEvent.locationX;
          updateDarkThreshold(touchX);
        });
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (darknessSliderRef.current) {
        darknessSliderRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = gestureState.moveX - px;
          updateDarkThreshold(touchX);
        });
      }
    },
  });

  const buzzerPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (buzzerSliderRef.current) {
        buzzerSliderRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = evt.nativeEvent.locationX;
          updateBuzzerValue(touchX);
        });
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (buzzerSliderRef.current) {
        buzzerSliderRef.current.measure((fx, fy, width, height, px, py) => {
          const touchX = gestureState.moveX - px;
          updateBuzzerValue(touchX);
        });
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainerWrapper}>
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <Icon name="alarm" size={24} color="white" style={styles.iconMargin} />
              <Text style={styles.headerText}>Morning Alarm</Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsGrid}>
          <View style={styles.controlsRow}>
            <View style={styles.controlContainer}>
              <View style={styles.labelRow}>
                <Icon name="brightness-4" size={20} color="white" style={styles.iconMargin} />
                <Text style={styles.labelText}>Darkness</Text>
                <View style={styles.valueDisplayContainer}>
                  <Text style={styles.valueText}>{darkThreshold}</Text>
                </View>
              </View>
              <View
                style={styles.sliderContainer}
                ref={darknessSliderRef}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  setDarknessSliderWidth(width);
                }}
                {...darknessPanResponder.panHandlers}
              >
                <View style={styles.slider}>
                  <View style={[styles.sliderTrack, { width: `${darkThreshold}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${darkThreshold}%` }]} />
                </View>
              </View>
            </View>

            <View style={styles.controlContainer}>
              <View style={styles.labelRow}>
                <Icon name="volume-high" size={20} color="white" style={styles.iconMargin} />
                <Text style={styles.labelText}>Buzzer</Text>
                <View style={styles.valueDisplayContainer}>
                  <Text style={styles.valueText}>{buzzerValue}</Text>
                </View>
              </View>
              <View
                style={styles.sliderContainer}
                ref={buzzerSliderRef}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  setBuzzerSliderWidth(width);
                }}
                {...buzzerPanResponder.panHandlers}
              >
                <View style={styles.slider}>
                  <View style={[styles.sliderTrack, { width: `${buzzerValue}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${buzzerValue}%` }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.setButton,
            { backgroundColor: isOn ? '#F149A1' : '#F149A1' },
          ]}
          onPress={handleToggle}
        >
          <Icon
            name={isOn ? 'power' : 'power-standby'}  
            size={24}
            color="white"
            style={styles.iconMargin}
          />
          <Text style={styles.buttonText}>{isOn ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B2E83',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: '#673AB7',
    borderRadius: 30,
    alignItems: 'center',
    position: 'relative',
  },
  headerContainerWrapper: {
    position: 'absolute',
    top: -25,
    width: '100%',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F149A1',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  iconMargin: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controlsGrid: {
    width: '100%',
    marginTop: 30,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlContainer: {
    width: '48%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20,
  },
  valueDisplayContainer: {
    backgroundColor: '#F149A1',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  valueText: {
    color: 'white',
    fontSize: 18,
  },
  sliderContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  slider: {
    width: '100%',
    height: 8,
    backgroundColor: '#483285',
    borderRadius: 4,
    position: 'relative',
  },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFEB3B',
    borderRadius: 4,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
    top: -6,
    marginLeft: -10,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setButton: {
    paddingVertical: 10,  // Reduced padding for a smaller button
    paddingHorizontal: 50,  // Reduced horizontal padding
    borderRadius: 30,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,  // Reduced font size
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

