import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { navigate } from "../RootNavigator";
import { ActivityIndicator, Button } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from '../env'

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
        <TouchableOpacity style={styles.itemWrapperStyle} onPress={openSpecificView}>

            <Image style={styles.itemImageStyle} source={{ uri: item.image }} />
            <View style={styles.contentWrapperStyle}>
                <Text style={styles.txtNameStyle} >{item.name}</Text>

                <Text style={styles.title}>{item.description}</Text>


            </View>

            <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: '100%',
                justifyContent: "center",
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                left: 0,
                marginLeft: 15,
            }}>
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 10,
                    }}>
                    <View style={styles.bottomIcon}>
                        <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/null/star.png' }} style={{ width: 20, height: 20 }} />
                    </View>
                    <View style={styles.bottomContent}>
                        <Text style={styles.bottomContentText}>{item.ratings}</Text>
                    </View>
                    <View style={styles.bottomIcon}>
                        <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/null/price-tag.png' }} style={{ width: 20, height: 20 }} />
                    </View>
                    <View style={styles.bottomContent}>
                        <Text style={styles.bottomContentText}>{item.price}</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <AddToCartButton productID={item._id} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemWrapperStyle: {
        width: '50%',
        height: 'auto',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        borderColor: 'lightgrey',
        borderBottomWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRadius: 0,
    },
    itemImageStyle: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 5
    },
    contentWrapperStyle: {
        alignItems: "flex-start",
        marginTop: 10,
        marginBottom: 55,
        height: 'auto',
    },
    title: {
        color: "black",
        fontSize: 14,
    },
    bottomContent: {
        width: '20%',
        textAlign: 'center',
        height: 'auto',
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

    button: {
        backgroundColor: "black",
        width: "10%"
    },
});

// TODO: Optimize large virtualized list
export default ProductView;