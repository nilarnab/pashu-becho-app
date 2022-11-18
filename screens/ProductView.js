import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { navigate } from "../RootNavigator";

/**
 * Product View Component
 */
const ProductView = ({ item }) => {
    const openSpecificView = () => {
        navigate("ProductSpecific", { item });
    };

    return (
        <TouchableOpacity style={styles.itemWrapperStyle} onPress={openSpecificView}>

            <Image style={styles.itemImageStyle} source={{ uri: "https://images.pexels.com/photos/7686290/pexels-photo-7686290.jpeg?auto=compress&cs=tinysrgb&w=800" }} />
            <View style={styles.contentWrapperStyle}>
                <Text style={styles.txtNameStyle}>{item.name}</Text>

                <Text>{item.description}</Text>
                <Text>{item.price}</Text>
                <Text>{item.ratings}</Text>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemWrapperStyle: {
        flexDirection: "column",
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: "#ddd"
    },
    itemImageStyle: {
        width: '100%',
        aspectRatio: 1,
        // marginVertical: 16,
        // borderRadius: 25,
    },
    contentWrapperStyle: {
        alignItems: "flex-start",
    },
    txtNameStyle: {
        // fontSize: 16,
    }
});

// TODO: Optimize large virtualized list
export default ProductView;