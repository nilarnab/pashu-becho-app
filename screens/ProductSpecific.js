import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';
import Video, {DRMType} from 'react-native-video';
import { ActivityIndicator, Button } from 'react-native-paper';
import { navigate } from "../RootNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
const uri= "http://43.205.195.106:5000/video/id_video_2/_manifest.mpd"
function DashVideo() {
    return (
        <Video
                    source={{ uri: uri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.dash}
                />
//        <Video
//            source={{ uri: uri2 }}
//            style={{ width: 'auto', height: 300 }}
//            controls={true}
//            ref={(ref) => {
//                this.player = ref
//            }}
//        />
    );
}

// const userId = "630dc78ee20ed11eea7fb99f"
const BASE_URL = 'https://desolate-gorge-42271.herokuapp.com/'

function AddToCartButton({ productID }) {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartID, setCartID] = useState(null);
    const [userId, setUserId] = useState('630dc78ee20ed11eea7fb99f')


    const fetchCart = async () => {
        setLoading(true);
        console.log("Loading product specific view for", productID)

        const resp = await fetch(BASE_URL + `handleCartOps/show_items?user_id=${userId}`, { method: 'POST' })
        const { response } = await resp.json();
        const cartItems = response["cart_items"];
        const item = cartItems.find(e => e[Object.keys(e)[0]]._id === productID)
        if (item === undefined) {
            setCount(0);
            setCartID(null);
        } else {
            setCount(item["qnt"]);
            setCartID(Object.keys(item)[0]);
        }
        console.log(JSON.stringify(item, null, 2));
        setLoading(false);
    };

    // useEffect does not support async functions directly
    useEffect(() => { fetchCart(); }, [])


    const fetch_session = async () => {

        console.log("fetching user id")
        var user_id_temp = await AsyncStorage.getItem('user_id')

        setUserId(user_id_temp)
        // console.log("user id")
        // console.log(userId)

    };

    const addProduct = async () => {
        setLoading(true);
        await fetch_session()

        console.log("Adding product", productID);
        const resp = await fetch(BASE_URL + `handleCartOps/insert?user_id=${userId}&prod_id=${productID}&qnt=1`, { method: 'POST' })
        const data = await resp.json();
        console.log(data);

        fetchCart()
    };

    const modifyCount = async (newCount) => {
        setLoading(true);

        await fetch_session()

        const resp = await fetch(BASE_URL + `handleCartOps/alter?cart_id=${cartID}&qnt_new=${newCount}`, { method: 'POST' })
        console.log("response")
        console.log(resp.json())

        fetchCart()
    }

    if (loading){
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
                <Text style={{ flexGrow: 1, textAlign: "center", fontSize: 20 }}>{count}</Text>
                <Button style={styles.button} onPress={() => modifyCount(count + 1)} mode="contained">+</Button>
            </View>
        );
}






export default function ProductSpecific({ route }) {
    const { item } = route.params;
    const fetch_session_phone = async () => {
        var phoneNo = await AsyncStorage.getItem('user_phone')
        const items = {
            phone: phoneNo,
        }
        console.log(items.phone)

        if (phoneNo == null) {
            // console.log('navigating to main page')
            props.navigation.navigate("Main")
        }
        else {
            navigate("Pay", { items });
        }

    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: "#d1e0e0" }}>
                <DashVideo />
                <View style={styles.screen}>
                    <Text style={styles.productname}>{item.name}</Text>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ paddingRight: 2, ...styles.text }}>{item.ratings}</Text>
                            {/* <Ionicons name="star" size={20} color="orange" /> */}
                        </View>
                        <Text style={styles.text}>₹{item.price}</Text>
                    </View>
                    <Text style={styles.description}>{item.description}</Text>
                    <Button icon="cart" mode="contained" style={{ backgroundColor: "blue" }} onPress={fetch_session_phone}>
                        Buy Now
                    </Button>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <AddToCartButton productID={item._id} />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginBottom: 15,
        marginTop: -15,
        borderRadius: 15,
    },
    productname: {
        paddingBottom: 5,
        fontWeight: "bold",
        fontSize: 30
    },
    dash: {
        height: 300,
    },
    text: {
        fontSize: 20,
    },
    description: {
        marginTop: 10,
        fontSize: 15,
    },
    button: {
        backgroundColor: "black",
        width: "30%"
    },
    footer: {
        padding: 20,
        backgroundColor: "#fff",
    },
});