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
                <Text style={styles.txtNameStyle} >{item.name}</Text>

                <Text style={styles.title}>{item.description}</Text>


            </View>

            <View style={{
                flexDirection: "row",
                marginVertical: 5,
                flexWrap: "wrap",
                width: '100%',
                justifyContent: "center",
                alignItems: 'center',
                position: 'absolute',
                bottom: 10,
                marginLeft: 15,
                // backgroundColor: 'red'
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemWrapperStyle: {
        width: '50%',
        height: 'auto',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderColor: 'lightgrey',
        borderBottomWidth: 1,
        borderRadius: 15,
    },
    itemImageStyle: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 5
    },
    contentWrapperStyle: {
        alignItems: "flex-start",
        marginTop: 10,
        marginBottom: 35,
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

    }
});

// TODO: Optimize large virtualized list
export default ProductView;