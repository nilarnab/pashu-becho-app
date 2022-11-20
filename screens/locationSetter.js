import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Linking, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import GetLocation from 'react-native-get-location';
import MapView from "react-native-maps";


export const Location = (props) => {

    const [lat, setLat] = useState(0.0)
    const [long, setLong] = useState(0.0)

    state = {
        location: null
    };

    const findCoordinates = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                console.log(location);
                setLat(location.latitude)
                setLong(location.longitude)

            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    };

    async function requestPermissions() {

        console.log("requesting permission")
        if (Platform.OS === 'ios') {
            const auth = await Geolocation.requestAuthorization('whenInUse');
            if (auth === 'granted') {
                findCoordinates();
            }
        }

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            console.log(granted)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                findCoordinates();
            }
        }
    }


    return (
        <>
            <SafeAreaView>
                <Text>This is supposed to be the location page</Text>

                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: lat,
                        longitude: long,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    region={{
                        latitude: lat,
                        longitude: long,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />

                <TouchableOpacity onPress={findCoordinates}>
                    <View style={{
                        elevation: 5,
                        height: 100,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>Find My Coords?</Text>
                        <Text>Location: {state.location}</Text>
                        <Text>{lat}</Text>
                        <Text>{long}</Text>
                    </View>
                </TouchableOpacity>


            </SafeAreaView>
        </>

    )
}


const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
        height: 500
    },
});

