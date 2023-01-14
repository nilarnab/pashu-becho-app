import React, { useEffect, useState } from 'react';
import { SafeAreaView, PermissionsAndroid, StyleSheet, Image, Text, View, AppRegistry, FlatList, TextInput, Button, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import MapView, { Marker } from "react-native-maps";
import { parse } from '@babel/core';
import { BASE_URL } from '../env';

import { Dimensions } from 'react-native';

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
    const [latMarker, setLatMarker] = useState(0.0)
    const [longMarker, setLongMarker] = useState(0.0)
    const [addr1, setAddr1] = useState('')
    const [addr2, setAddr2] = useState('')
    const [pin, setPin] = useState('')
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false)
    const [getLocatonButton, setGetLocatonButton] = useState('Get Current Location')
    const [confLocationButton, setConfLocationButton] = useState('Confirm location')
    const [locationRecieved, setLocationRecieved] = useState(false)


    useEffect(() => {

        const getCachedLocation = async () => {

            var loc_lat = await AsyncStorage.getItem("loc_lat")
            var loc_long = await AsyncStorage.getItem("loc_long")
            var loc_addr1 = await AsyncStorage.getItem("loc_addr1")
            var loc_addr2 = await AsyncStorage.getItem("loc_addr2")
            var loc_pin = await AsyncStorage.getItem("loc_pin")
            var loc_city = await AsyncStorage.getItem("city")


            if (loc_lat == null || loc_long == null) {
                await findCoordinates()
            }


            if (loc_lat != null && !isNaN(loc_lat)) {

                setLat(parseFloat(loc_lat))
                setLatMarker(parseFloat(loc_lat))
            }

            if (loc_long != null && !isNaN(loc_long)) {
                console.log("setting up lat")
                setLong(parseFloat(loc_long))
                setLongMarker(parseFloat(loc_long))
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


        //r equest permission
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
        })
            .then(async (data) => {

                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                )

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                    GetLocation.getCurrentPosition({
                        enableHighAccuracy: false,
                        timeout: 15000,
                    })
                        .then(location => {
                            console.log(location);
                            setLat(location.latitude)
                            setLong(location.longitude)
                            setLatMarker(location.latitude)
                            setLongMarker(location.longitude)
                            setLoading(false)

                            setGetLocatonButton('Get Current Location')

                        })
                        .catch(error => {
                            const { code, message } = error;
                            console.warn(code, message);
                        })
                } else {
                    alert("Location permission denied");
                }

            })
            .catch((err) => {
                console.log("error is")
                console.log(err)
                // The user has not accepted to enable the location services or something went wrong during the process
                // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
                // codes :
                //  - ERR00 : The user has clicked on Cancel button in the popup
                //  - ERR01 : If the Settings change are unavailable
                //  - ERR02 : If the popup has failed to open
                //  - ERR03 : Internal error
            });
        // ---------------------









    };

    const submitLocation = async () => {
        setLoading(true)

        var message = ''

        setLat(latMarker)
        setLong(longMarker)

        var lat_string = latMarker + ''
        var long_string = longMarker + ''

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

        setLoading(false)

        if (message == '') {
            setStage(1)
        }
        else {
            setConfLocationButton(message)
        }
    }

    async function requestPermissions() {

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
                    borderRadius: 10, overflow: 'hidden', marginLeft: 20,
                    marginRight: 20
                }}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: 0,
                            longitude: 0,
                            latitudeDelta: 0,
                            longitudeDelta: 0,
                        }}
                        region={{
                            latitude: lat,
                            longitude: long,
                            latitudeDelta: 0.00922,
                            longitudeDelta: 0.00421,
                        }}
                        onPress={(e) => {
                            console.log("pressed")
                            let coordinates = e.nativeEvent.coordinate;
                            console.log(coordinates);
                            setLatMarker(coordinates.latitude);
                            setLongMarker(coordinates.longitude);
                        }}
                    >
                        <Marker coordinate={{
                            latitude: latMarker,
                            longitude: longMarker,
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
                                width: '30%', color: "black"
                            }} underlineColorAndroid='lightgray'
                            onChangeText={setPin}
                            placeholderTextColor="lightgray"
                            value={pin}>
                        </TextInput>
                        <TextInput placeholder='City' style={{
                            width: '70%', color: "black"
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


const OrderSummary = ({ setStage, prodId }) => {

    const [lat, setLat] = useState(0.0)
    const [long, setLong] = useState(0.0)
    const [addr1, setAddr1] = useState('')
    const [addr2, setAddr2] = useState('')
    const [pin, setPin] = useState('')
    const [city, setCity] = useState('')

    console.log("prod id", prodId)

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

        return <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            <View style={styles.SummaryItemContent}><Text style={{ color: "black" }}>{data.item.product.name}</Text></View>
            <View style={styles.SummaryItemContent}><Text style={{ color: "black" }}>{data.item.product.price}</Text></View>
            <View style={styles.SummaryItemContent}><Text style={{ color: "black" }}>{data.item.qnt}</Text></View>
        </View>
    }

    const ItemListing = () => {

        const [cartItems, setCartItems] = useState(null)
        const [totalCost, setTotalCost] = useState(0)

        useEffect(() => {

            const getItems = async () => {
                var userId = await AsyncStorage.getItem("user_id")

                console.log('user id found as', userId, "prod id found as", prodId)


                if (prodId == null) {

                    var response = await fetch(BASE_URL + `handleCartOps/show_items?user_id=${userId}`, { method: 'POST' })
                    var responseJson = await response.json()

                    if (responseJson.response != null) {

                        var cartItemsLocal = responseJson.response.cart_items
                        setCartItems(cartItemsLocal)


                        var sum = 0
                        cartItemsLocal.forEach((item, idex) => {
                            sum += item.product.price * item.qnt
                        });

                        setTotalCost(sum)
                    }
                }
                else {
                    var response = await fetch(BASE_URL + `products/get_one_product?prodId=${prodId}`, { method: 'GET' })
                    var responseJson = await response.json()

                    setCartItems(responseJson.response)

                    if (responseJson.response != null) {
                        console.log(responseJson.response.cart_items)
                        var cartItemsLocal = responseJson.response.cart_items
                        setCartItems(cartItemsLocal)


                        var sum = 0
                        cartItemsLocal.forEach((item, idex) => {
                            sum += item.product.price * item.qnt
                        });

                        setTotalCost(sum)
                    }
                }

            }

            getItems()
        }, [])



        if (cartItems == null) {
            return <>
                <View style={{ padding: 20, color: "black" }}><ActivityIndicator size="large" color="green" /></View>
            </>
        }
        else {
            return <>

                <View style={{ width: '100%' }}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginTop: 20,
                        borderColorBottom: 'lightgray',
                        borderBottomWidth: 0.5,
                        width: '100%'
                    }}>
                        <View style={styles.SummaryItemHeader}>
                            <Text style={{ color: 'black', fontWeight: 'bold', }}>Product</Text>
                        </View>
                        <View style={styles.SummaryItemHeader}>
                            <Text style={{ color: 'black', fontWeight: 'bold', }}>Cost</Text>
                        </View>
                        <View style={styles.SummaryItemHeader}>
                            <Text style={{ color: 'black', fontWeight: 'bold', }}>Quantity</Text>
                        </View>
                    </View>
                    <FlatList
                        data={cartItems}
                        renderItem={ItemListingView}
                        initialNumToRender={1}
                        // TODO: Fix in production
                        keyExtractor={item => Math.random()}

                    />
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginBottom: 20,
                        borderColorTop: 'lightgray',
                        borderTopWidth: 0.5,
                    }}>
                        <View style={styles.SummaryItemHeader}>
                            <Text style={{ color: 'black', fontWeight: 'bold', }}>Total Cost</Text>
                        </View>
                        <View style={styles.SummaryItemHeader}>
                            <Text style={{ color: 'black', fontWeight: 'bold', }}>{totalCost} /-</Text>
                        </View>
                        <View style={styles.SummaryItemHeader}>
                            <Text style={{ color: 'black', fontWeight: 'bold', }}></Text>
                        </View>
                    </View>
                </View>
            </>
        }
    }

    const Declarations = () => {
        return <>
            <Text style={{ color: "black" }}>
                We are considering it as a confirmation from your side
            </Text>
            <Text style={{ color: "black" }}>
                The order will be revised automatically and then will go through a manual verificatition with human experts. If there is anything wrong, or we need more information of (or just to be more sure), you will receive a call
            </Text>
        </>
    }

    return <>
        <ScrollView nestedScrollEnabled={true} style={{ width: '100%' }}>
            <View style={styles.SumamryWrapper}>
                <Text style={styles.SumamryHeader}> The Order Summary page</Text>
                <ScrollView horizontal={true} style={{
                    width: "100%",
                    height: 'auto'
                }}>
                    <View style={{
                        width: Dimensions.get('window').width,
                        height: 'auto',
                    }}>
                        <ItemListing />
                    </View>
                </ScrollView>

                <Text style={styles.SumamryHeader}> Delivery Address</Text>

                <View style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: 'lightgray',
                    marginTop: 20,
                }}>
                    <Text style={{ fontWeight: 'bold', color: "black" }}>Address Line 1: </Text>
                    <Text style={{ color: "black", marginTop: 5, marginBottom: 20 }}>{addr1}</Text>
                </View>

                <View style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: 'lightgray',
                    marginTop: 5,
                }}>
                    <Text style={{ fontWeight: 'bold', color: "black" }}>Address Line 2: </Text>
                    <Text style={{ color: "black", marginTop: 5, marginBottom: 20 }}>{addr2}</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    <View style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: 'lightgray',
                        marginTop: 5,
                        paddingRight: 20,
                        paddingVertical: 15,
                        flexDirection: 'row',
                        marginRight: 20,
                    }}>
                        <Text style={{ fontWeight: 'bold', color: "black" }}>PIN: </Text>
                        <Text style={{ color: "black" }}>{pin}</Text>
                    </View>

                    <View style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: 'lightgray',
                        marginTop: 5,
                        paddingRight: 20,
                        paddingVertical: 15,
                        flexDirection: 'row',
                        marginRight: 20,
                    }}>
                        <Text style={{ fontWeight: 'bold', color: "black" }}>City: </Text>
                        <Text style={{ color: "black" }}>{city}</Text>
                    </View>

                </View>

                <View style={{
                    marginTop: 20,
                }}>
                    <Text style={styles.SumamryHeader}> Declarations</Text>
                </View>
                <Declarations />

                <TouchableOpacity onPress={handleSummary} style={{
                    alignItems: 'center'
                }}>
                    <View style={styles.submitLocationButton}>
                        <Text style={styles.buttonTextLocation}>Yep! thats my order</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </>
}

const PreBuyComp = (props) => {

    const [stage, setStage] = React.useState(0)
    const [loading, setLoading] = useState(false)


    const [userId, setUserId] = useState(null)

    var prodId = null

    if (props.route.params != null) {
        prodId = props.route.params.prodId
        console.log("prod id is", prodId)
    }

    console.log("prod id", prodId)

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
                props.navigation.navigate('Order')
            }} style={{
                alignItems: 'center'
            }}>
                <Text style={{ color: "black" }}>Move to Orders</Text>
            </TouchableOpacity>

        </View>
    }

    const checkSession = async () => {
        const userId = await AsyncStorage.getItem("user_id")

        if (userId == null) {
            console.log("lost cache data")
            props.navigation.navigate("Profile")
        }
    }

    const PlaceOrder = async () => {
        console.log("paying now")

        await checkSession()

        var userId = await AsyncStorage.getItem("user_id")
        var loc_lat = await AsyncStorage.getItem("loc_lat")
        var loc_long = await AsyncStorage.getItem("loc_long")
        var loc_addr1 = await AsyncStorage.getItem("loc_addr1")
        var loc_addr2 = await AsyncStorage.getItem("loc_addr2")
        var loc_pin = await AsyncStorage.getItem("loc_pin")
        var loc_city = await AsyncStorage.getItem("city")


        if (prodId == null) {
            console.log("placing by cart")
            var resp_raw = await fetch(BASE_URL + `orderManage/place_by_cart?user_id=${userId}&lat=${loc_lat}&long=${loc_long}&loc1=${loc_addr1}&loc2=${loc_addr2}&pin=${loc_pin}&city=${loc_city}`, { method: 'POST' })
            var resp = await resp_raw.json()
        }
        else {
            console.log("placing by item")
            var resp_raw = await fetch(BASE_URL + `orderManage/place_by_item?user_id=${userId}&prod_id=${prodId}&lat=${loc_lat}&long=${loc_long}&loc1=${loc_addr1}&loc2=${loc_addr2}&pin=${loc_pin}&city=${loc_city}`, { method: 'POST' })
            var resp = await resp_raw.json()
            console.log("response")
            console.log(resp)
        }

        console.log(resp)

        if (resp.verdict == 1) {
            setStage(stage + 1)
        }
    }

    const PaymentGateway = () => {
        return <>
            <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center' }}>

                <TouchableOpacity onPress={async () => {
                    await PlaceOrder()
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
                        <OrderSummary setStage={setStage} prodId={prodId} />
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
        color: "black"
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
    },
    // Order summary design
    SumamryWrapper: {
        backgroundColor: 'white',
        height: '100%',
        padding: 20,
    },
    SumamryHeader: {
        fontSize: 25,
        fontWeight: '600',
        color: 'black',
        transform: [{ translateX: -8 }],
    },
    SummaryItemContent: {
        paddingVertical: 20,
        paddingLeft: 5,
        backgroundColor: 'white',
        borderRightWidth: 0.5,
        borderRightColor: 'rgb(200, 200, 200)',
        width: '33%',
    },
    SummaryItemHeader: {
        paddingVertical: 5,
        paddingLeft: 5,
        backgroundColor: 'white',
        borderRightWidth: 0.5,
        borderRightColor: 'rgb(200, 200, 200)',
        width: '33%',
    }

});



export default PreBuyComp;