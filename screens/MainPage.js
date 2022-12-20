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

        const fetchUser = async () => {
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
                <Tab.Screen name="Home" options={{ tabBarIcon: () => (<Icon name="home" size={30} color="grey" />), headerShown: false }} children={() => <HomeScreen navigation={props.navigation} />} />
                <Tab.Screen name="Cart" options={{ tabBarIcon: () => (<Icon name="shopping-cart" size={30} color="grey" />) }} children={() => <CartView navigation={props.navigation} />} />
                <Tab.Screen name='Profile' options={{ tabBarIcon: () => (<Icon name="user" size={30} color="grey" />) }} children={() => <ProfilePage />} />
                <Tab.Screen name='Order' options={{ tabBarIcon: () => (<Icon name="shopping-bag" size={30} color="grey" />) }} children={() => <OrderStatus navigation={props.navigation} />} />
                <Tab.Screen name='Location' options={{ tabBarIcon: () => (<Icon name="map-marker" size={30} color="grey" />) }} children={() => <Location />} />
            </Tab.Navigator >
        </>
    );
}

export default MainPage;