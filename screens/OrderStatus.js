import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../env';

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





const OrderStatus = (props) => {

    const [userId, setUserId] = React.useState(null)
    const [Order, setOrder] = React.useState(null)
    const [OrderList, setOrderList] = React.useState(null)



    useEffect(() => {

        const fetchUserId = async () => {
            var userIdLocal = await AsyncStorage.getItem('user_id')
            setUserId(userIdLocal)

            // console.log("User id found as", userIdLocal)
        }

        const fetchOrderList = async () => {
            console.log("fetching order list")
            var userIdLocal = await AsyncStorage.getItem('user_id')
            var orderListLocal = await fetch(BASE_URL + 'orderManage/get_orders?user_id=' + userIdLocal, { method: 'POST' })
            var orderListLocalJson = await orderListLocal.json()
            console.log(orderListLocalJson['response'])

            setOrderList(orderListLocalJson['response'])

            if (orderListLocalJson['response'].length > 0) {
                setOrder(orderListLocalJson['response'][0])
            }
        }

        fetchUserId()
        fetchOrderList()


    }, [props, useIsFocused])


    const OrderView = (item) => {


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


    const OrderSpecific = (props) => {

        // console.log("order specific props")
        // console.log(props)

        var Order = props.Order

        if (Order != null) {
            return (
                <SafeAreaView>
                    <View style={{ marginTop: 25, marginBottom: 25 }}>
                        <StepIndicator
                            customStyles={PreBuyPipeStyles}
                            currentPosition={Order.stage}
                            labels={PreBuyPipeLabels}
                            stepCount={PreBuyPipeLabels.length}

                        />
                    </View>

                    <View style={{ padding: 10, marginRight: 20, borderWidth: 1, borderColor: '#e1e5e1', borderRadius: 10, width: 'auto', height: '60%' }}>
                        <Text style={{ fontSize: 20, color: 'black' }}>{Order.stage_title}</Text>
                        <View style={{ height: 2, width: '100%', backgroundColor: '#e1e5e1', marginTop: 10, marginBottom: 10 }} ></View>
                        <Text>{Order.stage_description}</Text>
                    </View>
                </SafeAreaView>
            )
        }
        else {
            return (
                <SafeAreaView>
                    <Text>No Orders Yet</Text>
                </SafeAreaView>
            )
        }

    }


    return (

        <>
            <SafeAreaView style={{ marginLeft: 15 }}>
                <View style={{ height: 'auto' }}>
                    <Text style={{ fontSize: 20, marginLeft: 15, color: 'black' }}>Your Orders</Text>
                    {/* list of orders */}

                    <FlatList
                        horizontal={true}
                        data={OrderList}
                        renderItem={({ item }) => <OrderView item={item} />}
                        keyExtractor={item => item.order_id}

                        style={{ height: 'auto' }}
                    />
                </View>
                <View style={{ height: 2, width: '100%', backgroundColor: '#e1e5e1', marginTop: 25, marginBottom: 0 }} ></View>
                {/* most active order */}
                <OrderSpecific Order={Order} />


            </SafeAreaView>
        </>
    );

}

export default OrderStatus;