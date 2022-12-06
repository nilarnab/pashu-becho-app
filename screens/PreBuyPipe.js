import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GetLocation from 'react-native-get-location';
import MapView, { Marker } from "react-native-maps";
import { parse } from '@babel/core';


const PreBuyComp = (props) => {

    useEffect(() => {
        getCachedLocation()
    }, [])




    const [stage, setStage] = React.useState(0)
    const [lat, setLat] = useState(0.0)
    const [long, setLong] = useState(0.0)

    const [addr1, setAddr1] = useState('')
    const [addr2, setAddr2] = useState('')
    const [pin, setPin] = useState('')
    const [city, setCity] = useState('')

    const [loading, setLoading] = useState(false)
    const [getLocatonButton, setGetLocatonButton] = useState('Get Current Location')

    state = {
        location: null
    };



    const AddressDetails = () => {

        return (
            <>
                <View style={styles.addressDetails}>
                    <TextInput
                        placeholder='Room No., Building No/Name, Locality Name'
                        style={styles.inputStyle}
                        underlineColorAndroid='tomato'
                        onChangeText={text => setAddr1(text)}
                        value={addr1}
                    >

                    </TextInput>

                    <TextInput
                        placeholder='Road No./ LandMark'
                        style={styles.inputStyle}
                        underlineColorAndroid='tomato'
                        onChangeText={setAddr2}
                        value={addr2}>

                    </TextInput>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        width: 'auto',
                    }}>
                        <TextInput placeholder='Pin Address' keyboardType="numeric"
                            style={{
                                width: '30%',
                            }} underlineColorAndroid='tomato'
                            onChangeText={setPin}
                            value={pin}>
                        </TextInput>
                        <TextInput placeholder='City' style={{
                            width: '70%',
                        }} underlineColorAndroid='tomato'
                            onChangeText={setCity}
                            value={city}>
                        </TextInput>

                    </View>


                </View>

            </>

        )
    }

    const findCoordinates = () => {
        setLoading(true)
        setGetLocatonButton('Finding you .... ')
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                console.log(location);
                setLat(location.latitude)
                setLong(location.longitude)
                setLoading(false)

                setGetLocatonButton('Get Current Location')

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

    const Loader = () => {


        if (loading === false) {
            return (
                <>

                </>
            )
        }
        else {
            return (
                <>
                    <ActivityIndicator size="large" color="tomato" />
                </>
            )
        }

    }

    const getCachedLocation = async () => {
        console.log("getting cacehd location")

        var loc_lat = await AsyncStorage.setItem("loc_lat")
        var loc_long = await AsyncStorage.setItem("loc_long")
        var loc_addr1 = await AsyncStorage.setItem("loc_addr1")
        var loc_addr2 = AsyncStorage.setItem("loc_addr2")
        var loc_pin = await AsyncStorage.setItem("loc_pin")
        var city = await AsyncStorage.setItem("city")

        setAddr1(loc_addr1)
        setAddr2(loc_addr2)
        setPin(loc_pin)
        setCity(loc_city)
        setLat(loc_lat)
        setLong(loc_long)
    }


    const submitLocation = async () => {
        setLoading(true)

        console.log("submitting location")
        var lat_string = parseFloat(loc_lat)
        console.log(lat_string)
        await AsyncStorage.setItem("loc_lat", parseFloat(lat))
        await AsyncStorage.setItem("loc_long", parseFloat(long))
        await AsyncStorage.setItem("loc_addr1", addr1)
        await AsyncStorage.setItem("loc_addr2", addr2)
        await AsyncStorage.setItem("loc_pin", pin)
        await AsyncStorage.setItem("city", city)

        setLoading(false)
    }

    var user = auth()


    if (user) {
        return (
            <ScrollView>
                <SafeAreaView>
                    <View style={{
                        borderRadius: 10, overflow: 'hidden', backgroundColor: 'red', marginLeft: 20,
                        marginRight: 20
                    }}>
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
                        >
                            <Marker coordinate={{
                                latitude: lat,
                                longitude: long,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }} />
                        </MapView>
                    </View>
                    <View>
                        <Text>{lat}, {long}</Text>
                    </View>

                    <Loader />

                    <TouchableOpacity onPress={findCoordinates} style={{
                        alignItems: 'center'
                    }}>
                        <View style={styles.submitLocationButton}>
                            <Text style={styles.buttonTextLocation}>{getLocatonButton}</Text>
                        </View>
                    </TouchableOpacity>

                    <AddressDetails />

                    <TouchableOpacity onPress={submitLocation} style={{
                        alignItems: 'center'
                    }}>
                        <View style={styles.submitLocationButton}>
                            <Text style={styles.buttonTextLocation}>Set Location</Text>
                        </View>
                    </TouchableOpacity>


                </SafeAreaView>
            </ScrollView>
        );
    }

    else {
        console.log("not logged in")
        props.navigation.navigate("Phone")
    }


}



const styles = StyleSheet.create({

    addressDetails: {
        marginLeft: 20,
        marginRight: 20,
    },
    buttonTextLocation: {
        color: 'tomato'
    },
    inputStyle: {
        fontSize: 15
    },
    map: {
        height: 500,
        backgroundColor: 'green',
        borderRadius: 8,
        marginBottom: 0,
    },
    findMyLocationButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        height: 50,
        width: 200,
        borderRadius: 8,
        borderColor: 'gray',
        margin: 20,
        backgroundColor: 'white',
        elevation: 2,
    },
    submitLocationButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        height: 50,
        width: 200,
        borderRadius: 8,
        borderColor: 'tomato',
        margin: 20,
        shadowColor: 'red',
        backgroundColor: 'white',
        color: 'tomato',
        elevation: 6,
    }
});



export default PreBuyComp;