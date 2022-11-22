import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './HomeScreen'
import { CartView } from './CartView'
import { ProfilePage } from './ProfilePage'
import { Location } from './locationSetter'

AppRegistry.registerComponent('Appname', () => App);

const userId = "630dc78ee20ed11eea7fb99f"
const Tab = createBottomTabNavigator()
function MainPage() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // tabBarIcon: ({ color, size }) => {
                //     let iconName;
                //     if (route.name === 'Home')
                //         iconName = 'home';
                //     else if (route.name === 'Cart')
                //         iconName = 'cart';
                //     return <Ionicons name={iconName} size={size} color={color} />;
                // },
                contentStyle: {
                    backgroundColor: '#FFFFFF'
                },
                headerMode: 'screen',
                defaultNavigationOptions: {
                    cardStyle: { backgroundColor: '#FFFFFF' },
                },
            })}
            sceneContainerStyle={{ backgroundColor: 'white', elevation: 10 }}
        >
            <Tab.Screen name="Home" component={HomeScreen} screenOptions={{
                headerMode: 'screen',
                defaultNavigationOptions: {
                    cardStyle: { backgroundColor: '#FFFFFF' },
                },
            }} />
            <Tab.Screen name="Cart" children={() => <CartView userProfile={userId} />} />
            <Tab.Screen name='Profile' children={() => <ProfilePage />} />
            <Tab.Screen name='Location' children={() => <Location />} />
        </Tab.Navigator >
    );
}

export default MainPage;