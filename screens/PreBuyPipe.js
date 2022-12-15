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
    const [confLocationButton, setConfLocationButton] = useState('Confirm location')


    state = {
        location: null
    };

    const ItemListing = async () => {

        // var items = await fetch('http://')
        // var itemsJson = await items.json()
        // console.log(itemsJson)

        return <>

            {/* something with flat list */}

            {/* The following list is just for showing, we are to use flat list and not just text */}
            <Text>Vibrator 1</Text>
            <Text>Chicken nugget 200</Text>
            <Text>Bangali Macchhli 100</Text>
            <Text>oil 2</Text>

            <Text>Total amount: 10 rupees</Text>

        </>
    }

    const Declarations = () => {
        return <>
            <Text>
                We are considering it as a confirmation from your side
            </Text>
            <Text>
                The order will be revised automatically and then will go through a manual verificatition with human experts. If there is anything wrong, or we need more information of (or just to be more sure), you will receive a call
            </Text>
        </>
    }

    const OrderSummary = () => {

        // getCachedLocation()

        console.log(addr1)

        return <>
            <SafeAreaView style={{ backgroundColor: '#ffff', height: '100%' }}>
                <Text style={{ fontSize: 30, color: 'black' }}> The OrderSummary page</Text>
                <ItemListing />
                <Text style={{ fontSize: 30, color: 'black' }}> Deliver Address</Text>
                <Text>{addr1}</Text>
                <Text>{addr2}</Text>
                <Text>{pin}</Text>
                <Text>{city}</Text>
                <Text style={{ fontSize: 30, color: 'black' }}> Declarations</Text>
                <Declarations />

                <TouchableOpacity onPress={handleSummary} style={{
                    alignItems: 'center'
                }}>
                    <View style={styles.submitLocationButton}>
                        <Text style={styles.buttonTextLocation}>Yep! thats my order</Text>
                    </View>
                </TouchableOpacity>



            </SafeAreaView>
        </>
    }

    const PaymentGateway = () => {
        return <>
            <SafeAreaView>
                <Text> The PaymentGateway page</Text>
            </SafeAreaView>
        </>
    }

    const handleSummary = () => {
        setStage(2)
    }

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

        var loc_lat = await AsyncStorage.getItem("loc_lat")
        var loc_long = await AsyncStorage.getItem("loc_long")
        var loc_addr1 = await AsyncStorage.getItem("loc_addr1")
        var loc_addr2 = await AsyncStorage.getItem("loc_addr2")
        var loc_pin = await AsyncStorage.getItem("loc_pin")
        var loc_city = await AsyncStorage.getItem("city")

        if (!isNaN(loc_lat)) {
            console.log("setting up lat")
            setLat(parseFloat(loc_lat))
        }

        if (!isNaN(loc_long)) {
            console.log("setting up lat")
            setLong(parseFloat(loc_long))
        }

        console.log(loc_addr1)
        console.log(loc_addr2)

        if (loc_addr1 != null) {
            console.log("addr 1 is set as", loc_addr1)
            setAddr1(loc_addr1)
        }
        else {
            console.log("addr is not set")
            setAddr1('')
        }

        if (loc_addr2 != null) {
            setAddr2(loc_addr2)
        }
        else {
            setAddr2('')
        }

        if (loc_city != null) {
            setCity(loc_city)
        }
        else {
            setCity('')
        }

        if (loc_pin != null) {
            setPin(loc_pin)
        }
        else {
            setPin('')
        }


        console.log("received")
    }


    const submitLocation = async () => {
        setLoading(true)

        var message = ''

        console.log("submitting location")
        var lat_string = lat + ''
        var long_string = long + ''

        console.log(addr2)
        // console.log(lat_string)
        if (lat_string)
            await AsyncStorage.setItem("loc_lat", lat_string)
        else
            message = 'lattitude not set'

        if (long_string)
            await AsyncStorage.setItem("loc_long", long_string)
        else
            message = 'longitue not set'

        if (addr1)
            await AsyncStorage.setItem("loc_addr1", addr1)
        else
            message = 'First Address line is empty !!'

        if (addr2)
            await AsyncStorage.setItem("loc_addr2", addr2)
        else
            message = 'Second Address line is empty'

        if (pin)
            await AsyncStorage.setItem("loc_pin", pin)
        else
            message = 'Your PIN ?'

        if (city)
            await AsyncStorage.setItem("city", city)
        else
            message = "Please provide your city name"

        console.log("submission complete")

        setLoading(false)

        if (message == '') {
            setStage(1)
        }
        else {
            setConfLocationButton(message)
        }
    }

    var user = auth()


    if (user) {

        if (stage == 0) {

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
                                <Text style={styles.buttonTextLocation}>{confLocationButton}</Text>
                            </View>
                        </TouchableOpacity>


                    </SafeAreaView>
                </ScrollView>
            );
        }

        if (stage == 1) {
            return (
                <OrderSummary />
            )
        }

        if (stage == 2) {
            return (
                <PaymentGateway />
            )
        }
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