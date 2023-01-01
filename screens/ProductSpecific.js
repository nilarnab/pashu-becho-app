import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, ImageBackground, FlatList } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';
import Video, { DRMType } from 'react-native-video';
import { ActivityIndicator, Button } from 'react-native-paper';
import { navigate } from "../RootNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import Carousel, { Pagination } from 'react-native-snap-carousel'

import { useIsFocused } from '@react-navigation/native';

import { BASE_URL } from '../env';

// testing

ITEM_WIDTH = Dimensions.get('window').width;

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH_SLIDER = Math.round(SLIDER_WIDTH)


const ProductImage = (url, index) => {
    console.log("show image with url :- ", url);
    return <View style={styles.container} key={index} >
        <ImageBackground source={{ uri: url }} resizeMode="cover" style={styles.image}>
        </ImageBackground>
    </View>

}

function AddToCartButton({ productID }) {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartID, setCartID] = useState(null);
    const [userId, setUserId] = useState(null)


    const fetchCart = async () => {
        setLoading(true);

        // get user id  

        var user_id_temp = await AsyncStorage.getItem('user_id')
        setUserId(user_id_temp)

        const resp = await fetch(BASE_URL + `handleCartOps/show_item?user_id=${user_id_temp}&prod_id=${productID}`, { method: 'POST' })
        const response = await resp.json();

        console.log("response from cart", response);

        if (response.cart_item == null) {
            setCount(0);
            setCartID(null);
        } else {

            const cartItem = response.cart_item
            const count = cartItem["qnt"];

            setCount(count);
            setCartID(cartItem["_id"]);
        }

        setLoading(false);
    };

    // useEffect does not support async functions directly
    useEffect(() => {
        fetchCart();
    }, [])

    const addProduct = async () => {
        setLoading(true);

        const resp = await fetch(BASE_URL + `handleCartOps/insert?user_id=${userId}&prod_id=${productID}&qnt=1`, { method: 'POST' })
        const data = await resp.json();
        fetchCart()
    };

    const modifyCount = async (newCount) => {
        setLoading(true);
        await fetch(BASE_URL + `handleCartOps/alter?cart_id=${cartID}&qnt_new=${newCount}`, { method: 'POST' })

        fetchCart()
    }

    if (loading) {
        return (
            <ActivityIndicator size={38} color="black" />
        );
    }

    if (count === 0)
        return (
            <Button icon="cart" mode="contained" style={{ backgroundColor: "black" }} onPress={addProduct}>
                Add To Cart
            </Button>
        )
    else
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: "center" }}>
                <Button style={styles.button} onPress={() => modifyCount(count - 1)} mode="contained">-</Button>
                <Text style={{ flexGrow: 1, textAlign: "center", fontSize: 20, color: "black" }}>{count}</Text>
                <Button style={styles.button} onPress={() => modifyCount(count + 1)} mode="contained">+</Button>
            </View>
        );
}


export default function ProductSpecific({ route }) {


    const { item } = route.params;
    const [resourceData, setresourceData] = useState([]);
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)
    const [pageIndex, setPageIndex] = useState(0)

    const isFocused = useIsFocused()

    useEffect(() => {

        const sendPagePopularityMetric = async () => {

            if (isFocused) {
                var userId = await AsyncStorage.getItem('user_id')
                fetch(BASE_URL + `monitor/send_metric?metric=PAGE_ENGAGEMENT&pagename=PROD_SPEC&userid=${userId}&pagesubname=${item.name}`, { method: 'GET' })
            }

        }

        sendPagePopularityMetric()

    }, [isFocused])


    useEffect(() => {
        // fecth will be here (guess so)
        fetch(BASE_URL + `stream/getResources?pid=${item._id}`)
            .then(res => res.json())
            .then(result => { setresourceData(result) })
    }, []);

    const fetch_session_phone = async () => {
        var phoneNo = await AsyncStorage.getItem('user_phone')
        const items = {
            phone: phoneNo,
        }

        if (phoneNo == null) {
            // console.log('navigating to main page')
            props.navigation.navigate("Main")
        }
        else {
            navigate("Pay", { items });
        }

    };

    function DashVideo(url, vidIndex) {

        if (index == vidIndex) {
            return (
                <View style={styles.container} key={index} >
                    <Video key={index}
                        source={{ uri: url }}
                        rate={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        controls={true}
                        paused={false}
                        repeat={true}
                        style={styles.image}
                    />
                </View>
            );
        }
        else {
            return (
                <>
                    <View style={styles.container} key={index} >
                        <Video key={index}
                            source={{ uri: url }}
                            rate={1.0}
                            isMuted={true}
                            resizeMode="cover"
                            shouldPlay
                            paused={true}
                            repeat={true}
                            style={styles.image}
                        />
                    </View>
                </>
            )
        }
    }

    const CarouselCardItem = ({ item, index }) => {
        // console.log(item)
        if (item.type === "video") {
            return DashVideo(item.url, index);
        }
        else if (item.type == "image") {
            return ProductImage(item.url, index);
        }
    }

    const InactiveImage = () => {

        return (
            <>
                <View
                    style={{
                        height: 10,
                        width: 10,
                        borderRadius: 10,
                        backgroundColor: 'black',
                        marginTop: 5
                    }}
                >

                </View>
            </>
        )

    }

    const ActiveImage = () => {
        return (
            <>
                <View
                    style={{
                        height: 10,
                        width: 10,
                        borderRadius: 10,
                        backgroundColor: '#4c77e6',
                        marginTop: 5
                    }}
                >

                </View>
            </>
        )
    }

    const InactiveVideo = () => {

        return (
            <>
                <Image source={{ uri: 'https://img.icons8.com/material-outlined/24/null/play-button-circled--v1.png' }} style={{ height: 20, width: 20 }} />
            </>
        )

    }

    const ActiveVideo = () => {

        return (
            <>
                <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/null/play.png' }} style={{ height: 20, width: 20 }} />
            </>
        )
    }

    const PageView = (props) => {

        var pageInd = props.index
        var itemType = props.item.type
        console.log("index is", index)

        if (pageInd != index) {
            if (itemType == 'image')

                return (
                    <>
                        <View style={{ marginLeft: 10 }}>
                            <InactiveImage />
                        </View>

                    </>
                )
            else
                return (
                    <>
                        <View style={{ marginLeft: 10 }}>
                            <InactiveVideo />
                        </View>

                    </>
                )
        }
        else {
            if (itemType == 'image')

                return (
                    <>
                        <View style={{ marginLeft: 10 }}>
                            <ActiveImage />
                        </View>

                    </>
                )
            else
                return (
                    <>
                        <View style={{ marginLeft: 10 }}>
                            <ActiveVideo />
                        </View>

                    </>
                )
        }
    }



    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: "rgb(250, 250, 250)" }}>

                <View style={{
                    marginTop: 20
                }}
                >
                    <Carousel
                        layout="default"
                        layoutCardOffset={20}
                        ref={isCarousel}
                        data={resourceData}
                        renderItem={CarouselCardItem}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH_SLIDER}
                        inactiveSlideShift={0}
                        onSnapToItem={(index) => setIndex(index)}
                        useScrollView={true}
                        activeSlideAlignment="start"
                    />
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <FlatList
                        horizontal
                        data={resourceData}
                        renderItem={PageView}
                        keyExtractor={(item, index) => {
                            index.toString()
                            setPageIndex(item)

                            return Math.random()
                        }}
                    />

                </View>

                <View style={styles.screen}>
                    <Text style={styles.productname}>{item.name}</Text>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ paddingRight: 2, ...styles.text }}>{item.ratings}</Text>
                            {/* <Ionicons name="star" size={20} color="orange" /> */}
                        </View>
                        <Text style={styles.text}>₹{item.price}</Text>
                    </View>
                    <View style={{ height: 2, backgroundColor: "lightgrey", marginVertical: 10 }} />
                    <Text style={styles.description}>{item.description}</Text>
                    <TouchableOpacity mode="contained" style={{
                        backgroundColor: 'white',
                        marginVertical: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        marginTop: 50,
                        borderColor: 'green',
                    }} onPress={fetch_session_phone}>
                        <Text style={{ color: 'green', fontSize: 20, fontWeight: 'bold' }}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
            <View style={styles.footer}>
                <AddToCartButton productID={item._id} />
            </View>
        </View >
    );


}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        marginHorizontal: 0,
        marginBottom: 0,
        marginTop: 0,
        borderRadius: 15,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        // marginLeft: ITEM_WIDTH,
        // marginRight: ITEM_WIDTH,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginLeft: 0,
        marginBottom: 12
    },
    image: {
        width: ITEM_WIDTH,
        height: 'auto',
        height: 300
    },
    productname: {
        paddingBottom: 5,
        fontWeight: "bold",
        fontSize: 30,
        color: 'black'
    },
    text: {
        fontSize: 20,
        color: "black"
    },
    description: {
        marginTop: 10,
        fontSize: 15,
        color: "black"
    },
    button: {
        backgroundColor: "black",
        width: "30%"
    },
    footer: {
        padding: 20,
        backgroundColor: "#fff",
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowColor: 'black',
        elevation: 10,
    },
});