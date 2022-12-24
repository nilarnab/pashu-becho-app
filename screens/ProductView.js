import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { navigate } from "../RootNavigator";

/**
 * Product View Componentnp
 */
const ProductView = ({ item }) => {
    const openSpecificView = () => {
        navigate("ProductSpecific", { item });
    };

    return (
        <TouchableOpacity style={styles.itemWrapperStyle} onPress={openSpecificView}>

            <Image style={styles.itemImageStyle}  source={{ uri: item.image }} />
            <View style={styles.contentWrapperStyle}>
                <Text style={styles.txtNameStyle} >{item.name}</Text>

                <Text style={styles.title}>{item.description}</Text>
                <Text style={styles.title}>{item.price}</Text>
                <Text style={styles.title}>{item.ratings}</Text>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemWrapperStyle: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
    },
    itemImageStyle: {
        width: '100%',
        aspectRatio: 1,
        // marginVertical: 16,
        borderRadius: 25,
    },
    contentWrapperStyle: {
        alignItems: "flex-start",
        marginTop: 20,
    },
    title: { color: "black", fontSize: 12, flexShrink: 1, flexWrap: 'wrap' },
    txtNameStyle: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",

    }
});

// TODO: Optimize large virtualized list
export default ProductView;