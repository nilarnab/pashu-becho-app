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

            <Image style={styles.itemImageStyle} source={{ uri: item.image }} />
            <View style={styles.contentWrapperStyle}>
                <Text style={styles.txtNameStyle}>{item.name}</Text>

                <Text style={styles.title}>{item.description}</Text>
                <Text style={styles.title}>{item.price}</Text>
                <Text style={styles.title}>{item.ratings}</Text>
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
    title: { color: "black", fontSize: 12, flexShrink: 1, flexWrap: 'wrap' },
    txtNameStyle: {
        fontSize: 16,
        color:"brown"
    }
});

// TODO: Optimize large virtualized list
export default ProductView;