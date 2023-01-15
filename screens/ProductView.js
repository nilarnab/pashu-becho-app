import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { navigate } from "../RootNavigator";
import { ActivityIndicator, Button } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import { BASE_URL } from '../env'
import Video, { DRMType } from 'react-native-video';
import { SLIDER_WIDTH } from "./CarouselCardItem";

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
            <Button icon="cart" mode="contained" style={{ backgroundColor: "black", borderRadius: 50 }} onPress={addProduct}>Add to Cart</Button>
        )
    else
        return (
            <View style={{ width: 200 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: "center", width: '100%' }}>
                    <Button style={styles.button} onPress={() => modifyCount(count - 1)} mode="contained">-</Button>
                    <Text style={{ flexGrow: 1, textAlign: "center", fontSize: 20, color: "black" }}>{count}</Text>
                    <Button style={styles.button} onPress={() => modifyCount(count + 1)} mode="contained">+</Button>
                </View>
            </View>
        );
}
/**
 * Product View Componentnp
 */
const ProductView = ({ item, navigation }) => {

    const openSpecificView = () => {
        navigate("ProductSpecific", { item, navigation });
    };

    return (
        <TouchableOpacity style={styles.itemWrapperStyle} >
            <Text style={styles.title}>{item.milk + "L milk "+ (item.price?", "+item.price+" Rs.":"")}</Text>
            <View style={{flex:1,flexDirection:'row'}}>
            <Icon name="clock-o" size={15} color="gray" />
            <Text style={styles.postDetail} >{" "+2+" hours ago | "}</Text>
            <Icon name="map-marker" size={15} color="gray" />
            <Text style={styles.postDetail} >{" "+(item.location?item.location.address:"Ganga Hostel, MNIT Jaipur" + ` (${"3 km away"})`)}</Text>
            </View>
            <Video key={1}
                        source={{ uri: item.video }}
                        rate={1.0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay
                        style={styles.videoContainer}
                        paused={true}
                        onBuffer={this.onBuffer}              
                        onError={this.videoError}               
                        controls                        
                    />
            {/* <Image style={styles.itemImageStyle} source={{ uri: item.image1 }} /> */}
            <View style={styles.contentWrapperStyle}>
                <Text style={styles.bottomContentText}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemWrapperStyle: {
        width: SLIDER_WIDTH - 100,
        marginHorizontal:10,
        padding:5,
        borderColor: 'lightgrey',
        borderWidth:1,
        borderRadius: 10,
    },
    itemImageStyle: {
        width: '100%',
        height:200,
        // aspectRatio: 1,
        borderRadius: 5
    },
    contentWrapperStyle: {
        alignItems: "flex-start",
        marginTop: 10,
        height: 'auto',
    },
    title: {
        color: "black",
        fontSize: 24,
        flex:1,
        fontStyle:"italic",
        justifyContent:'center'
    },
    bottomContent: {
        width: '20%',
        textAlign: 'center',
        height: 'auto',
    },
    postDetail:{
        color:'gray',
        fontSize:12,
    },
    bottomContentWrapper: {
        borderWidth: 1,
        borderColor: 'lightgrey',
    },
    bottomIcon: {
        width: '10%',
        marginHorizontal: 0,
    },
    bottomContentText: {
        color: "black",
        fontSize: 14,
        height: 'auto'
    },

    txtNameStyle: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",

    },
    videoContainer: {
        height: 200,
        width: '100%',
        backgroundColor: 'lightgrey',
        paddingVertical: 5
    },
    button: {
        backgroundColor: "black",
        width: "10%"
    },
});

// TODO: Optimize large virtualized list
export default ProductView;