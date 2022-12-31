import React, { useEffect, useState, useRef } from 'react';
import { Animated, TextInput, ActivityIndicator, SafeAreaView, StyleSheet, Image, Text, View, AppRegistry, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../env';
import Header from './NonSearchHeader'
import SideBar from '../SideBar';

import StepIndicator from 'react-native-step-indicator';

const PreBuyPipeLabels = ["Order Confirmed", "Manual Verification", "Out For Delivery", "Completion"];

const IconUrls = [
    'https://img.icons8.com/3d-fluency/2x/verified-account.png',
    'https://img.icons8.com/3d-fluency/94/null/technical-support.png',
    'https://img.icons8.com/3d-fluency/94/null/truck.png',
    'https://img.icons8.com/3d-fluency/94/null/checkmark.png'

]

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



const GoToOldOrder = ({ props }) => {

    return (
        <>
            <TouchableOpacity onPress={() => props.navigation.navigate('OldOrderStatus')} style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 20,
                borderWidth: 1,
                borderColor: 'lightgrey',
                padding: 5,
                borderRadius: 5,
            }}>
                <Text style={{ color: 'grey', fontSize: 15, fontWeight: 'bold' }}>View Old Orders</Text>
            </TouchableOpacity>

        </>
    )
}


const ShowForm = ({ setCancelMode, cancelMode, cancelableOrder, navigation }) => {
    const [reasonPrime, setReasonPrime] = useState('')
    const [reasonSec, setReasonSec] = useState('')
    const [lastChanceEnable, setLastChanceEnable] = useState(false)

    const LastChance = () => {

        return (
            <>
                <Text style={{ marginTop: 10, fontSize: 18, color: 'black', fontWeight: 'bold' }}>
                    Are you sure you want to cancel your order ?
                </Text>
                <Text style={{ marginTop: 10, fontSize: 15, color: 'black' }}>
                    You can talk with our customer support team for more assistance. (We will consider you, pinky promise!)
                </Text>
                <TouchableOpacity style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'red',
                    width: 'auto',
                    height: 'auto',
                    padding: 20,
                    marginTop: 20
                }}
                    onPress={async () => {

                        if (cancelableOrder != null) {
                            var response = await fetch(BASE_URL + `orderManage/cancel_order?order_id=${cancelableOrder.order_id}&reason_prime=${reasonPrime}&reason_secondary=${reasonSec}`,
                                { method: 'POST' })

                            response = await response.json()

                            if (response.verdict == 1) {
                                alert('Order Cancelled Successfully')
                                setCancelMode(false)
                                setLastChanceEnable(false)
                                navigation.navigate('OldOrderStatus')
                            }
                        }

                    }}
                >
                    <Text style={{ color: 'red', fontSize: 18 }}>Yeah yeah, still wanna cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'green',
                    width: 'auto',
                    height: 'auto',
                    padding: 20,
                    marginTop: 20
                }}
                    onPress={() => {
                        setCancelMode(false)
                        setLastChanceEnable(false)
                    }}
                >
                    <Text style={{ color: 'green', fontSize: 18 }}>Uhm, Okay, don't cancel the order</Text>
                </TouchableOpacity>
            </>
        )

    }




    if (cancelMode) {

        if (!lastChanceEnable) {
            return (<>
                <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
                    <View style={{ height: 'auto' }}>
                        <Text style={{ fontSize: 25, fontWeight: '600', color: 'red' }}>
                            Cancel Order
                        </Text>
                        <View style={{ height: 2, backgroundColor: 'red', width: '100%', marginTop: 10 }}></View>

                        {/* reason prime */}
                        <Text style={{ marginTop: 10, fontSize: 18, color: 'black' }}>
                            Why do you want to cancel your order ?
                        </Text>
                        <TextInput
                            style={{
                                height: 'auto',
                                borderColor: 'lightgray',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginTop: 10,
                                textAlignVertical: 'top',
                                padding: 10
                            }}
                            onChangeText={text => setReasonPrime(text)}
                            value={reasonPrime}
                            placeholder="Enter Reason"
                        />

                        {/* reason second */}
                        <Text style={{ marginTop: 10, fontSize: 18, color: 'black' }}>
                            Can you describe why you want to cancel your order ?
                        </Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            style={{
                                height: 'auto',
                                borderColor: 'lightgray',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginTop: 10,
                                textAlignVertical: 'top',
                                padding: 10
                            }}
                            onChangeText={text => setReasonSec(text)}
                            value={reasonSec}
                            placeholder="Describe the Reason Please ?"
                        />

                        <TouchableOpacity style={{
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: 'red',
                            width: 'auto',
                            height: 'auto',
                            padding: 20,
                            marginTop: 20
                        }}
                            onPress={() => {

                                if (reasonPrime === '') {
                                    alert('Please enter the reason for cancelling the order')
                                }
                                else if (reasonSec === '') {
                                    alert('Please describe the reason for cancelling the order')
                                }
                                else {
                                    setLastChanceEnable(true)
                                }
                            }}>
                            <Text
                                style={{ color: 'red' }}>
                                Okay, Cancel the Order Now
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: 'green',
                            width: 'auto',
                            height: 'auto',
                            padding: 20,
                            marginTop: 20
                        }}
                            onPress={() => {
                                setCancelMode(false)
                                setLastChanceEnable(false)
                            }}>
                            <Text
                                style={{ color: 'green' }}>
                                Uh, changed my mind !
                            </Text>

                        </TouchableOpacity>

                    </View>
                </SafeAreaView>
            </>)
        }
        else {
            return (<>
                <LastChance />
            </>)
        }
    }
}

const CancelOrder = ({ setCancelMode }) => {

    return (<>
        <View style={{ height: 'auto' }}>
            <TouchableOpacity style={{
                marginLeft: 5,
                borderBottomWidth: 1,
                borderColor: 'lightgrey',
                width: 'auto',
                height: 100,
                paddingTop: 20
            }}
                onPress={() => setCancelMode(true)}
            >
                <Text>I want to Cancel My Order !</Text>
            </TouchableOpacity>
        </View>
    </>)
}



const OrderStatus = (props) => {

    const isFocused = useIsFocused()

    useEffect(() => {

        const sendPagePopularityMetric = async () => {

            if (isFocused) {
                var userId = await AsyncStorage.getItem('user_id')
                fetch(BASE_URL + `monitor/send_metric?metric=PAGE_ENGAGEMENT&pagename=ORDER&userid=${userId}`, { method: 'GET' })
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

    // -----------------------------




    useEffect(() => {

        const fetchUserId = async () => {
            var userIdLocal = await AsyncStorage.getItem('user_id')
            setUserId(userIdLocal)
        }

        const fetchOrderList = async () => {
            setLoading(true)

            var userIdLocal = await AsyncStorage.getItem('user_id')
            var orderListLocal = await fetch(BASE_URL + 'orderManage/get_orders?user_id=' + userIdLocal, { method: 'POST' })
            var orderListLocalJson = await orderListLocal.json()

            setOrderList(orderListLocalJson['response'])

            if (orderListLocalJson['response'].length > 0) {
                setOrder(orderListLocalJson['response'][0])
            }

            setLoading(false)
        }

        fetchOrderList()


    }, [props, isFocused])


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
                            <Text style={{ color: 'black' }}> Order Placed on {item.item.order_date}</Text>
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
                            <Text style={{ color: 'black' }}> Order Placed on {item.item.order_date}</Text>
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


    const OrderSpecific = (props) => {

        var Order = props.Order

        if (Order != null) {
            return (
                <SafeAreaView style={{ height: 'auto', paddingBottom: 20 }}>
                    <View style={{ marginTop: 25, marginBottom: 25 }}>
                        <StepIndicator
                            customStyles={PreBuyPipeStyles}
                            currentPosition={Order.stage}
                            labels={PreBuyPipeLabels}
                            stepCount={PreBuyPipeLabels.length}

                        />
                        <View style={{ alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                            <Image source={{ uri: IconUrls[Order.stage] }} style={{ width: 50, height: 50, marginBottom: 0 }} />
                            <Text style={{ fontSize: 20, marginLeft: 10 }}>{Order.stage_title}</Text>
                        </View>

                    </View>

                    <View style={{ padding: 10, marginRight: 20, borderWidth: 1, borderColor: '#039942', borderRadius: 10, width: '100%', paddingBottom: 100, height: 'auto' }}>
                        <Text>{Order.stage_description}</Text>
                    </View>
                </SafeAreaView>
            )
        }
        else {
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
        const [cancelMode, setCancelMode] = useState(false)



        useEffect(() => {

            const getItems = async () => {
                if (Order != null) {
                    setCartItems(Order.items)
                }


            }

            getItems()
        }, [])

        if (OrderList != null) {

            if (OrderList.length > 0) {
                if (!cancelMode) {

                    return (
                        <SafeAreaView style={{ height: 'auto', paddingBottom: 20, marginTop: 20 }}>
                            <View>
                                <FlatList
                                    data={cartItems}
                                    renderItem={ItemListingView}
                                    ListHeaderComponent={OrderStatus}
                                    ListFooterComponent={<CancelOrder setCancelMode={setCancelMode} />}
                                    initialNumToRender={1}
                                    // TODO: Fix in production
                                    keyExtractor={item => Math.random()}
                                />
                            </View>
                        </SafeAreaView>
                    )
                }
                else {
                    return (
                        <>
                            <ShowForm setCancelMode={setCancelMode} cancelMode={cancelMode} cancelableOrder={Order} navigation={props.navigation} />
                        </>
                    )
                }
            }
            else {
                return (
                    <>
                        <View style={{ justifyContent: 'center', height: '100%' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 100 }}>
                                <Image source={{ uri: "https://img.icons8.com/fluency/96/null/empty-box.png" }} style={{ width: 150, height: 150 }} />
                                <Text style={{ fontSize: 40, color: 'grey' }}>Nothing here</Text>
                            </View>
                        </View>
                    </>
                )
            }
        }
        else {
            return (<>
                <Loader />
            </>)
        }

    }



    const OrderStatus = () => {

        return (
            <>
                <View style={{ height: 'auto' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 25, fontWeight: '600', color: 'black' }}>Your Orders</Text>
                        <GoToOldOrder props={props} />
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
                    <SideBar props={props.navigation} setState={setSideMenu} />
                </Animated.View>

                <View style={{
                    width: mainWidth,
                    height: '100%',
                    backgroundColor: 'white',
                    elevation: 1
                }}>
                    <Header setState={setSideMenu} State={SideMenu} />
                    <SafeAreaView style={{ marginLeft: 15, marginRight: 15 }}>
                        <OrderDetails />
                    </SafeAreaView>
                </View>

            </View>





        </>
    );

}

export default OrderStatus;