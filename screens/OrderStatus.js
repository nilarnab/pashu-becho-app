import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './HomeScreen'
import { CartView } from './CartView'
import { ProfilePage } from './ProfilePage'
import { Location } from './locationSetter'
import { PreBuyComp } from './PreBuyPipe'
import SideMenu from 'react-native-side-menu-updated'
import AsyncStorage from '@react-native-async-storage/async-storage';

import StepIndicator from 'react-native-step-indicator';



const orderData = [
    {
        'order_id': 'some_id',
        'stage': '1',
        'order_date': 'some_date',
        'stage_title': 'Manual Verification',
        'stage_description': 'We are verifying your order. Please wait for a while.',
        'items': [
            {
                'product': {
                    'name': 'some_name',
                    'price': 'some_price',
                },
                'qnt': 'some_qnt',
            }
        ]
    },
    {
        'order_id': 'some_id_2',
        'stage': '3',
        'order_date': 'some_date_2',
        'stage_title': 'Manual Verification',
        'stage_description': 'We are verifying your order. Please wait for a while.',
        'items': [
            {
                'product': {
                    'name': 'some_name',
                    'price': 'some_price',
                },
                'qnt': 'some_qnt',
            }
        ]
    }
]



const PreBuyPipeLabels = ["Order Confirmed", "Manual Verification", "Out For Delivery", "Completion"];
const PreBuyPipeStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013'
}





const OrderStatus = (props) => {

    const [userId, setUserId] = React.useState(null)
    const [pageStep, setPageStep] = React.useState(0)
    const [Order, setOrder] = React.useState(null)



    useEffect(() => {

        const fetchUserId = async () => {
            var userIdLocal = await AsyncStorage.getItem('user_id')
            setUserId(userIdLocal)

            console.log("User id found as", userIdLocal)
        }

        fetchUserId()

    }, [])


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
                    <Text> Order Placed on {item.item.order_date}</Text>
                </TouchableOpacity>
            </>
        )
    }


    const OrderSpecific = (props) => {

        console.log("order specific props")
        console.log(props)

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
                        <Text style={{ fontSize: 20 }}>{Order.stage_title}</Text>
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
                <Text style={{ fontSize: 20, marginLeft: 15 }}>Your Orders</Text>
                {/* list of orders */}

                <FlatList
                    horizontal={true}
                    data={orderData}
                    renderItem={({ item }) => <OrderView item={item} />}
                    keyExtractor={item => item.order_id}

                    style={{height: 150}}
                />

                <View style={{ height: 2, width: '100%', backgroundColor: '#e1e5e1', marginTop: 25, marginBottom: 0 }} ></View>
                {/* most active order */}
                <OrderSpecific Order={Order} />


            </SafeAreaView>
        </>
    );

}

export default OrderStatus;