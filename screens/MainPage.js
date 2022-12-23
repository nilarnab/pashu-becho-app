import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './HomeScreen'
import { CartView } from './CartView'
import { ProfilePage } from './ProfilePage'
import { Location } from './locationSetter'
import { PreBuyComp } from './PreBuyPipe'
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderStatus from './OrderStatus';
import SideMenu from 'react-native-side-menu-updated'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';


AppRegistry.registerComponent('Appname', () => App);

const userId = "630dc78ee20ed11eea7fb99f"
const Tab = createBottomTabNavigator()
function MainPage(props) {

    useEffect(() => {

        async function fetchUser() {
            // check from remote server if logged in 
            var user = auth()._user

            if (user) {
                console.log("user already logged in")
            }
            else {
                console.log("user not logged in")
                props.navigation.navigate('Phone')
            }

            // try to get user id
            console.log("fetching user >>>>>>>>>>> <<<<<<<<<<")

            var userId = await AsyncStorage.getItem('user_id')

            console.log("User id found as", userId)

            if (userId == null) {
                console.log("User id not found")
                props.navigation.navigate('Phone')
            }

        }

        fetchUser()
    }, [])


    return (

        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({

                    "tabBarActiveTintColor": "black",
                    tabBarInactiveTintColor: 'gray',
                    "tabBarStyle": [
                        {
                            "display": "flex"
                        },
                        null
                    ],

                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Home')
                            iconName = 'home';
                        else if (route.name === 'Cart')
                            iconName = 'shopping-cart';
                        else if (route.name === 'Profile')
                            iconName = 'user';
                        else if (route.name === 'Order')
                            iconName = 'shopping-bag';
                        else if (route.name === 'Location')
                            iconName = 'map-marker';

                        return <Icon name={iconName} size={size} color={color} />;
                    },



                    contentStyle: {
                        backgroundColor: '#FFFFFF',
                        activeTintColor: '#ffffff',
                    },
                    headerMode: 'screen',
                    defaultNavigationOptions: {
                        cardStyle: { backgroundColor: '#FFFFFF', activeTintColor: '#ffffff' },
                    },
                })}
                sceneContainerStyle={{ backgroundColor: 'white', elevation: 10 }}
            // tabBarOptions={{
            //     activeTintColor: '#ffffff',
            // }}
            >
                <Tab.Screen name="Home" options={{ headerShown: false }} children={() => <HomeScreen navigation={props.navigation} />} />
                <Tab.Screen name="Cart" options={{}} children={() => <CartView navigation={props.navigation} />} />
                <Tab.Screen name='Profile' options={{}} children={() => <ProfilePage />} />
                <Tab.Screen name='Order' options={{}} children={() => <OrderStatus navigation={props.navigation} />} />
                <Tab.Screen name='Location' options={{}} children={() => <Location />} />
            </Tab.Navigator >
        </>
    );
}

export default MainPage;