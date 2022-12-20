import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Image, Text, View, AppRegistry, FlatList, TextInput, Button, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GetLocation from 'react-native-get-location';
import MapView, { Marker } from "react-native-maps";
import { parse } from '@babel/core';
import { BASE_URL } from '../env';
// const BASE_URL = 'http://159.223.90.95:3000/'

import { PreBuyPipeLabels, PreBuyPipeStyles } from './StepProgressBars';
import StepIndicator from 'react-native-step-indicator';


const StepProgressBar = ({ step }) => {

    return (
        <View style={{ marginTop: 20, marginBottom: 20, backgroundColor: 'white' }}>
            <StepIndicator
                customStyles={PreBuyPipeStyles}
                currentPosition={step}
                labels={PreBuyPipeLabels}
                stepCount={PreBuyPipeLabels.length}
            />
        </View>
    )
}

const AddressDetails = ({ setStage }, { stage }) => {

    const [lat, setLat] = useState(0.0)
    const [long, setLong] = useState(0.0)
    const [addr1, setAddr1] = useState('')
    const [addr2, setAddr2] = useState('')
    const [pin, setPin] = useState('')
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false)
    const [getLocatonButton, setGetLocatonButton] = useState('Get Current Location')
    const [confLocationButton, setConfLocationButton] = useState('Confirm location')


    useEffect(() => {


        console.log("stage is")
        console.log(setStage)
        console.log(stage)
        const getCachedLocation = async () => {
            console.log("getting cacehd location")

            var loc_lat = await AsyncStorage.getItem("loc_lat")
            var loc_long = await AsyncStorage.getItem("loc_long")
            var loc_addr1 = await AsyncStorage.getItem("loc_addr1")
            var loc_addr2 = await AsyncStorage.getItem("loc_addr2")
            var loc_pin = await AsyncStorage.getItem("loc_pin")
            var loc_city = await AsyncStorage.getItem("city")

            console.log(loc_lat)
            if (loc_lat != null && !isNaN(loc_lat)) {
                console.log("setting up lat")
                setLat(parseFloat(loc_lat))
            }

            if (loc_long != null && !isNaN(loc_long)) {
                console.log("setting up lat")
                setLong(parseFloat(loc_long))
            }
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

        getCachedLocation()
    }, [])

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
                    <ActivityIndicator size="large" color="green" />
                </>
            )
        }

    }

    const findCoordinates = async () => {
        setLoading(true)
        setGetLocatonButton('Getting permission .... ')
        // await requestPermissions()
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

            <ScrollView>
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
                        onPress={(e)=>{
                            let coordinates = e.nativeEvent.coordinate;
                            console.log(coordinates);
                            setLat(coordinates.latitude);
                            setLong(coordinates.longitude);
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
                <View style={styles.addressDetails}>
                    <TextInput
                        placeholder='Room No., Building No/Name, Locality Name'
                        style={styles.inputStyle}
                        underlineColorAndroid='lightgray'
                        onChangeText={text => setAddr1(text)}
                        value={addr1}
                        placeholderTextColor="lightgray"
                    >

                    </TextInput>

                    <TextInput
                        placeholder='Road No./ LandMark'
                        style={styles.inputStyle}
                        underlineColorAndroid='lightgray'
                        onChangeText={setAddr2}
                        placeholderTextColor="lightgray"
                        value={addr2}>

                    </TextInput>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        width: 'auto',
                    }}>
                        <TextInput placeholder='Pin Address' keyboardType="numeric"
                            style={{
                                width: '30%',color:"black"
                            }} underlineColorAndroid='lightgray'
                            onChangeText={setPin}
                            placeholderTextColor="lightgray"
                            value={pin}>
                        </TextInput>
                        <TextInput placeholder='City' style={{
                            width: '70%',color:"black"
                        }} underlineColorAndroid='lightgray'
                            onChangeText={setCity}
                            placeholderTextColor="lightgray"
                            value={city}>
                        </TextInput>

                    </View>

                </View>


                <TouchableOpacity onPress={submitLocation} style={{
                    alignItems: 'center'
                }}>
                    <View style={styles.submitLocationButton}>
                        <Text style={styles.buttonTextLocation}>{confLocationButton}</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>


        </>

    )
}


const OrderSummary = ({ setStage }) => {

    const [lat, setLat] = useState(0.0)
    const [long, setLong] = useState(0.0)
    const [addr1, setAddr1] = useState('')
    const [addr2, setAddr2] = useState('')
    const [pin, setPin] = useState('')
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false)
    const [getLocatonButton, setGetLocatonButton] = useState('Get Current Location')
    const [confLocationButton, setConfLocationButton] = useState('Confirm location')


    useEffect(() => {


        console.log("stage is")
        console.log(setStage)
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

        getCachedLocation()
    }, [])

    const handleSummary = () => {
        setStage(2)
    }

    const ItemListingView = (data) => {

        return <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View style={{ padding: 20, backgroundColor: 'white', elevation: 1, borderBottomWidth: 1, borderColor: 'rgb(200, 200, 200)' }}><Text style={{color:"black"}}>{data.item.product.name}</Text></View>
            <View style={{ padding: 20, backgroundColor: 'white', elevation: 1, borderBottomWidth: 1, borderColor: 'rgb(200, 200, 200)' }}><Text style={{color:"black"}}>{data.item.product.price}</Text></View>
            <View style={{ padding: 20, backgroundColor: 'white', elevation: 1, borderBottomWidth: 1, borderColor: 'rgb(200, 200, 200)' }}><Text style={{color:"black"}}>{data.item.qnt}</Text></View>
        </View>
    }

    const ItemListing = () => {

        const [cartItems, setCartItems] = useState(null)

        useEffect(() => {

            const getItems = async () => {
                var userId = await AsyncStorage.getItem("user_id")

                console.log('user id found as', userId)

                var response = await fetch(BASE_URL + `handleCartOps/show_items?user_id=${userId}`, { method: 'POST' })
                var responseJson = await response.json()

                if (responseJson.response != null) {
                    console.log(responseJson.response.cart_items)
                    var cartItemsLocal = responseJson.response.cart_items
                    setCartItems(cartItemsLocal)
                }

            }

            getItems()
        }, [])

        if (cartItems == null) {
            return <>
                <View style={{ padding: 20,color:"black" }}><Text>Noting here ..</Text></View>
            </>
        }
        else {
            return <>

                <View>
                    <FlatList
                        data={cartItems}
                        renderItem={ItemListingView}
                        initialNumToRender={1}
                        // TODO: Fix in production
                        keyExtractor={item => Math.random()}
                    />
                </View>
            </>
        }
    }

    const Declarations = () => {
        return <>
            <Text style={{color:"black"}}>
                We are considering it as a confirmation from your side
            </Text>
            <Text style={{color:"black"}}>
                The order will be revised automatically and then will go through a manual verificatition with human experts. If there is anything wrong, or we need more information of (or just to be more sure), you will receive a call
            </Text>
        </>
    }

    return <>

        <Text style={{ fontSize: 30, color: 'black' }}> The Order Summary page</Text>
        <ItemListing />
        <Text style={{ fontSize: 30, color: 'black' }}> Deliver Address</Text>
        <Text style={{color:"black"}}>{addr1}</Text>
        <Text style={{color:"black"}}>{addr2}</Text>
        <Text style={{color:"black"}}>{pin}</Text>
        <Text style={{color:"black"}}>{city}</Text>
        <Text style={{ fontSize: 30, color: 'black' }}> Declarations</Text>
        <Declarations />

        <TouchableOpacity onPress={handleSummary} style={{
            alignItems: 'center'
        }}>
            <View style={styles.submitLocationButton}>
                <Text style={styles.buttonTextLocation}>Yep! thats my order</Text>
            </View>
        </TouchableOpacity>
    </>
}

const PreBuyComp = (props) => {

    const [stage, setStage] = React.useState(0)
    const [loading, setLoading] = useState(false)


    const [userId, setUserId] = useState(null)

    state = {
        location: null
    };

    const updateStage = (stage) => {
        setStage(stage)
    }

    const Success = () => {

        return <View style={{ alignItems: 'center', justifyContent: 'center' }}>

            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0ea0QZqeq5H33F4EDbIY5VtcbcO1y1fiyFQ&usqp=CAU' }} style={{ width: 200, height: 200 }} />
            <Text style={{
                fontSize: 30,
                color: 'black'
            }}>Success</Text>
            <TouchableOpacity onPress={() => {

                props.navigation.reset({
                    index: 3,
                    routes: [{ name: 'Order' }],
                })
                props.navigation.navigate('Main')
            }} style={{
                alignItems: 'center'
            }}>
                <Text style={{color:"black"}}>Move to Home</Text>
            </TouchableOpacity>

        </View>
    }

    const PaymentGateway = () => {
        return <>
            <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center' }}>

                <TouchableOpacity onPress={async () => {
                    console.log("paying now")
                    var userId = await AsyncStorage.getItem("user_id")
                    var resp_raw = await fetch(BASE_URL + `orderManage/place_by_cart?user_id=${userId}`, { method: 'POST' })
                    var resp = await resp_raw.json()
                    console.log(props)
                    if (resp.verdict == 1) {
                        setStage(stage + 1)
                    }
                }} style={{
                    alignItems: 'center',
                    padding: 20,
                    borderWidth: 1,
                    borderColor: 'green',
                    borderRadius: 10,
                    width: 100,

                }}>
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/null/cash-in-hand.png' }} style={{ height: 50, width: 50 }} />
                    <Text style={{ fontWeight: 'bold', color: 'green' }}>Cash on Delivery</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
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
                    <ActivityIndicator size="large" color="green" />
                </>
            )
        }

    }

    var user = auth()


    if (user) {

        if (stage == 0) {

            return (
                <>
                    <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
                        <StepProgressBar step={0} />
                        <AddressDetails setStage={setStage} stage={stage} />
                    </SafeAreaView>
                </>
            );
        }

        if (stage == 1) {
            return (
                <>
                    <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
                        <StepProgressBar step={1} />
                        <OrderSummary setStage={setStage} />
                    </SafeAreaView>
                </>
            )
        }
        if (stage == 2) {
            return (
                <>
                    <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
                        <StepProgressBar step={2} setStage={setStage} />
                        <PaymentGateway />
                    </SafeAreaView>
                </>
            )
        }

        if (stage == 3) {

            return (
                <>
                    <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
                        <StepProgressBar step={3} setStage={setStage} />
                        <Success />
                    </SafeAreaView>
                </>
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
        color: 'green'
    },
    inputStyle: {
        fontSize: 15,
        color:"black"
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
        borderColor: 'green',
        margin: 20,
        backgroundColor: 'white',
        color: 'green',
    }
});



export default PreBuyComp;