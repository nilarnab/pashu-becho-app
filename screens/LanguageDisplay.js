import React, { useEffect, useState, useRef } from 'react';
import { Animated, SafeAreaView, Image, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, TouchableOpacity, ImageBackground, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InfiniteList from "./InfiniteList";
import Header from './UniversalHeader';
import { BASE_URL } from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native'
import SideBar from '../SideBar';

import { AvailableLanguages } from '../dictionary';



export const LangugaDisplay = ({ currentLangCode, setCurrentLangCode }) => {

    const RenderItem = ({ item }) => {

        if (item.code == currentLangCode) {
            return <>

                <View

                    style={{
                        padding: 10,
                        borderColor: 'green',
                        borderWidth: 0.5,
                        borderRadius: 10,
                        marginLeft: 10
                    }}
                >
                    <Text style={{
                        color: 'green',
                        fontWeight: 'bold',
                    }}>{item.name}</Text>
                </View>
            </>
        }
        else {
            return <>

                <TouchableOpacity
                    onPress={async () => {
                        // push language in async storage
                        await AsyncStorage.setItem('langCode', item.code)
                        setCurrentLangCode(item.code)
                    }}
                    style={{
                        padding: 10,
                        borderColor: 'lightgray',
                        borderWidth: 0.5,
                        borderRadius: 10,
                        marginLeft: 10,
                    }}
                >
                    <Text style={{
                        color: 'black',
                    }}>{item.name}</Text>
                </TouchableOpacity>
            </>
        }
    }


    return (<>
        <FlatList
            horizontal
            data={AvailableLanguages}
            renderItem={RenderItem}
            keyExtractor={item => item.code}
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
                marginHorizontal: 10,
                paddingVertical: 10,
                borderColor: 'lightgray',
                borderWidth: 0.5,
                borderRadius: 10,
            }}
        />

    </>)

}
