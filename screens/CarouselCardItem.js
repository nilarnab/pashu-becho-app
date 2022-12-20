import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image, ImageBackground } from "react-native"

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const image = { uri: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" };

const CarouselCardItem = ({ item, index }) => {
    console.log(item);
    return (
        <View style={styles.container} key={index}>
            <ImageBackground source={{ uri: item.imgUrl }} resizeMode="cover" style={styles.image} imageStyle={{ borderRadius: 8 }}>
                <Text style={styles.header}>{item.title}</Text>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginLeft: 20,
        marginBottom: 12
    },
    image: {
        width: ITEM_WIDTH,
        height: 200,
        borderRadius: 8
    },
    header: {
        color: "#222",
        fontSize: 28,
        fontWeight: "bold",
        paddingLeft: 20,
        paddingTop: 20,
        position: 'absolute',
        bottom: 0
    },
    body: {
        color: "#222",
        fontSize: 18,
        paddingLeft: 0,
        paddingRight: 0
    }
})

export default CarouselCardItem