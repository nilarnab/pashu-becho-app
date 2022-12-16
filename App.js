/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './screens/MainPage';
import ProductSpecific from './screens/ProductSpecific';
import PreBuyComp from './screens/PreBuyPipe';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// internal imports
import PhoneNumber from './screens/PhoneNumber';
import { navigationRef } from './RootNavigator';
import Payment from './screens/payment';
import SideMenu from 'react-native-side-menu-updated'


const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>


      <NavigationContainer ref={navigationRef}>

        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false }} />
          <Stack.Screen name="Phone" component={PhoneNumber}
            screenOptions={{
              headerMode: 'screen',
              defaultNavigationOptions: {
                cardStyle: { backgroundColor: '#FFFFFF' },
              },
            }}
          />
          <Stack.Screen name="ProductSpecific" component={ProductSpecific} />
          <Stack.Screen name="Pay" component={Payment} />
          <Stack.Screen name="PreBuyPipe" component={PreBuyComp} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
