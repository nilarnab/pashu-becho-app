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
                <Tab.Screen name="Home" options={{ headerShown: false }}
                    navigationOptions={{

                        tabBarIcon: (focused, tintColor) => (
                            <Image style={{ width: 50, height: 50 }}
                                source={{ uri: "https://img.icons8.com/ios-filled/50/737373/home-page.png" }} />
                        )
                    }} children={() => <HomeScreen navigation={props.navigation} />} />
                <Tab.Screen name="Cart" children={() => <CartView navigation={props.navigation} />} />
                <Tab.Screen name='Profile' children={() => <ProfilePage />} />
                <Tab.Screen name='Order' children={() => <OrderStatus navigation={props.navigation} />} />
                <Tab.Screen name='Location' children={() => <Location />} />
            </Tab.Navigator >
        </>
    );
}

export default MainPage;