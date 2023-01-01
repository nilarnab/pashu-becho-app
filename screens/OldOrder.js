import React, { useEffect, useState, useRef } from 'react';
import { Animated, ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../env';
import Header from './NonSearchHeader'

import StepIndicator from 'react-native-step-indicator';


const PreBuyPipeLabels = ["Order Confirmed", "Manual Verification", "Out For Delivery", "Completion"];
const PreBuyPipeStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 50,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#039942',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#039942',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#039942',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#039942',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#039942',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#039942'
}

const PreBuyPipeDeathStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 50,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: 'tomato',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: 'red',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: 'tomato',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: 'red',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: 'red',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: 'red'
}


const OldOrderStatus = (props) => {

    const isFocused = useIsFocused()

    useEffect(() => {

        const sendPagePopularityMetric = async () => {

            if (isFocused) {
                var userId = await AsyncStorage.getItem('user_id')
                fetch(BASE_URL + `monitor/send_metric?metric=PAGE_ENGAGEMENT&pagename=OLD_ORDER&userid=${userId}`, { method: 'GET' })
            }

        }

        sendPagePopularityMetric()

    }, [isFocused])

    const [userId, setUserId] = React.useState(null)
    const [Order, setOrder] = React.useState(null)
    const [OrderList, setOrderList] = React.useState(null)
    const [loading, setLoading] = React.useState(false)


    /* Side bar */
    // -----------------------------
    const [SideMenu, setSideMenu] = useState(0)
    const [mainWidth, setMainWidth] = useState('100%')
    const fadeAnim = useRef(new Animated.Value(0)).current


    useEffect(() => {

        if (SideMenu == 1) {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 200,
                    duration: 1000,
                    useNativeDriver: false
                }
            ).start();
        }
        else {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false
                }
            ).start();
        }
    }, [SideMenu])

    const SideBar = () => {

        return (
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Side bar</Text>
                <TouchableOpacity onPress={async () => {

                    // console.log("logging out")

                    await AsyncStorage.removeItem('name')
                    await AsyncStorage.removeItem('phone')
                    await AsyncStorage.removeItem('uuid')
                    await AsyncStorage.removeItem('email')
                    await AsyncStorage.removeItem('user_id')

                    await auth().signOut()

                    props.navigation.navigate('Phone')

                }} style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', color: 'white' }}>
                    <Text style={{ color: 'white' }}>Logout</Text>
                </TouchableOpacity>

            </View>
        )
    }


    // -----------------------------




    useEffect(() => {

        const fetchUserId = async () => {
            var userIdLocal = await AsyncStorage.getItem('user_id')
            setUserId(userIdLocal)

            // console.log("User id found as", userIdLocal)
        }

        const fetchOrderList = async () => {
            setLoading(true)
            // console.log("fetching order list")
            var userIdLocal = await AsyncStorage.getItem('user_id')
            var orderListLocal = await fetch(BASE_URL + 'orderManage/get_old_orders?user_id=' + userIdLocal, { method: 'POST' })
            var orderListLocalJson = await orderListLocal.json()
            // console.log(orderListLocalJson['response'])

            setOrderList(orderListLocalJson['response'])

            if (orderListLocalJson['response'].length > 0) {
                setOrder(orderListLocalJson['response'][0])
            }

            setLoading(false)
        }

        fetchOrderList()


    }, [props, useIsFocused])


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

    const OrderView = (item) => {

        if (Order != null) {

            var date = new Date(item.item.order_date)

            var renderableDate = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()

            if (item.item.order_id == Order.order_id) {

                return (
                    <>
                        <TouchableOpacity style={{
                            borderWidth: 1,
                            borderColor: '#039942',
                            height: 100,
                            width: 300,
                            justifyContent: 'center',
                            padding: 20,
                            borderRadius: 10,
                            margin: 10
                        }} onPress={
                            () => {
                                setOrder(item.item)
                            }
                        }>
                            <Text style={{ color: 'black' }}> Order Placed on</Text>
                            <Text style={{
                                color: 'black',
                                fontWeight: 'bold',
                                fontSize: 20,
                                marginLeft: 5
                            }}>{renderableDate}</Text>
                        </TouchableOpacity>

                    </>
                )
            }
            else {
                return (
                    <>
                        <TouchableOpacity style={{
                            borderWidth: 1,
                            borderColor: '#e1e5e1',
                            height: 100,
                            width: 300,
                            justifyContent: 'center',
                            padding: 20,
                            borderRadius: 10,
                            margin: 10
                        }} onPress={
                            () => {
                                setOrder(item.item)
                            }
                        }>
                            <Text style={{ color: 'black' }}> Order Placed on</Text>
                            <Text style={{
                                color: 'black',
                                fontWeight: 'bold',
                                fontSize: 20,
                                marginLeft: 5
                            }}>{renderableDate}</Text>
                        </TouchableOpacity>
                    </>
                )
            }
        }
        else {
            return (
                <>
                    <Text>Nothin to see here</Text>
                </>
            )
        }

    }


    const OrderSpecific = ({ Order }) => {

        if (Order != null) {

            if (Order.cancel_code == null && Order.stage == 3) {
                return (
                    <SafeAreaView style={{ height: 'auto', paddingBottom: 20 }}>
                        <View style={{ marginTop: 25, marginBottom: 25, opacity: 0.2 }}>
                            <StepIndicator
                                customStyles={PreBuyPipeStyles}
                                currentPosition={Order.stage}
                                labels={PreBuyPipeLabels}
                                stepCount={PreBuyPipeLabels.length}

                            />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', marginBottom: 20, flexDirection: 'row' }}>
                                <Image source={{ uri: "https://img.icons8.com/3d-fluency/94/null/checkmark.png" }} style={{ width: 50, height: 50, marginBottom: 20 }} />
                                <Text style={{ fontSize: 20, marginLeft: 10, marginBottom: 10 }}>Order Delivered Successfully</Text>
                            </View>
                        </View>

                        <View style={{ padding: 10, marginRight: 20, borderWidth: 1, borderColor: '#039942', borderRadius: 10, width: 'auto', paddingBottom: 100, height: 'auto' }}>
                            <Text style={{ fontSize: 20, color: 'black' }}>{Order.stage_title}</Text>
                            <View style={{ height: 1, width: '100%', backgroundColor: '#039942', marginTop: 10, marginBottom: 10 }} ></View>
                            <Text>{Order.stage_description}</Text>
                        </View>
                    </SafeAreaView>
                )
            }
            else {
                return (
                    <SafeAreaView style={{ height: 'auto', paddingBottom: 20 }}>
                        <View style={{ marginTop: 25, marginBottom: 25, opacity: 0.2 }}>
                            <StepIndicator
                                customStyles={PreBuyPipeDeathStyles}
                                currentPosition={Order.stage}
                                labels={PreBuyPipeLabels}
                                stepCount={PreBuyPipeLabels.length}

                            />
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', marginBottom: 20, flexDirection: 'row' }}>
                                <Image source={{ uri: "https://img.icons8.com/3d-fluency/94/null/delete-sign.png" }} style={{ width: 50, height: 50, marginBottom: 10 }} />
                                <Text style={{ fontSize: 20, marginLeft: 10, marginBottom: 10 }}>The Order Is Cancelled</Text>
                            </View>
                        </View>

                        <View style={{ padding: 10, marginRight: 20, borderWidth: 1, borderColor: 'grey', borderRadius: 10, width: 'auto', paddingBottom: 100, height: 'auto' }}>
                            <Text>{Order.cancel_reason}</Text>
                        </View>
                    </SafeAreaView>
                )
            }
        }
        else {
            return (
                <SafeAreaView>
                    <Text>No Orders Yet</Text>
                </SafeAreaView>
            )
        }

    }

    const ItemListingView = (data) => {

        return (
            <>
                <View style={{ height: 'auto', flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 1, borderBottomColor: 'lightgrey', paddingBottom: 30 }}>
                    <View style={{ height: 'auto', width: '50%', paddingTop: 10, paddingBottom: 25 }}>
                        <View ><Text style={{ fontSize: 20, color: 'black' }}>{data.item.product.name}</Text></View>
                        <View ><Text style={{ fontSize: 15 }}>{data.item.product.description}</Text></View>

                    </View>
                    <View style={{ height: 'auto', width: '50%', alignItems: 'center' }}>
                        <View style={{}}><Text style={{ fontSize: 40, color: 'black' }}>{data.item.product.price} /-</Text></View>
                        <Text style={{ fontSize: 20 }}>Quantity: {data.item.qnt}</Text>
                    </View>
                </View>
            </>
        )
    }

    const OrderDetails = () => {

        const [cartItems, setCartItems] = useState(null)

        useEffect(() => {

            const getItems = async () => {
                if (Order != null) {
                    setCartItems(Order.items)
                }


            }

            getItems()
        }, [])

        return (
            <SafeAreaView style={{ height: 'auto', paddingBottom: 20, marginTop: 20 }}>
                <View>
                    <FlatList
                        data={cartItems}
                        renderItem={ItemListingView}
                        ListHeaderComponent={OrderStatus}
                        initialNumToRender={1}
                        // TODO: Fix in production
                        keyExtractor={item => Math.random()}
                    />
                </View>
            </SafeAreaView>
        )
    }


    const OrderStatus = () => {

        return (
            <>
                <View style={{ height: 'auto' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 25, fontWeight: '600', color: 'black' }}>Your Older Orders</Text>
                    </View>

                    {/* list of orders */}
                    <Loader />
                    <FlatList
                        horizontal={true}
                        data={OrderList}
                        renderItem={({ item }) => <OrderView item={item} />}
                        keyExtractor={item => item.order_id}

                        style={{ height: 'auto' }}
                    />
                </View>
                <View style={{ height: 2, width: '100%', backgroundColor: 'lightgrey', marginTop: 25, marginBottom: 0 }} ></View>
                {/* most active order */}
                <Loader />
                <View style={{ height: 'auto' }}>
                    <Text style={{ fontSize: 25, fontWeight: '600', color: 'black' }}>Order Status</Text>
                    <OrderSpecific Order={Order} />
                    {/* <View style={{ height: 1000 }}></View> */}
                </View>
                <View style={{ height: 2, width: '100%', backgroundColor: 'lightgrey', marginTop: 25, marginBottom: 0 }} ></View>

                <Text style={{ fontSize: 25, fontWeight: '600', color: 'black' }}>Order Details</Text>
            </>
        )
    }

    if (OrderList == null) {

        return (
            <>
                <Loader />
            </>
        )
    }
    else {

        if (OrderList.length == 0) {

            return (
                <SafeAreaView style={{ height: '100%', backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <View style={{ alignItems: 'center', marginBottom: 100 }}>
                            <Image source={{ uri: "https://img.icons8.com/fluency/96/null/empty-box.png" }} style={{ width: 100, height: 100 }} />
                            <Text style={{ fontSize: 40 }}>Nothing here</Text>
                        </View>
                    </View>
                </SafeAreaView>
            )
        }
        else {
            return (

                <>

                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ffff',
                        elevation: 2,
                        flexDirection: 'row'
                    }}>


                        <Animated.View style={{
                            width: fadeAnim,
                            height: '100%',
                            backgroundColor: 'rgb(240, 240, 245)',
                        }}>
                            <SideBar props={props} />
                        </Animated.View>

                        <View style={{
                            width: mainWidth,
                            height: '100%',
                            backgroundColor: 'white',
                            elevation: 1
                        }}>
                            <SafeAreaView style={{ marginLeft: 15, marginRight: 15 }}>
                                <OrderDetails />
                            </SafeAreaView>
                        </View>
                    </View>
                </>
            );
        }
    }


}


export default OldOrderStatus;