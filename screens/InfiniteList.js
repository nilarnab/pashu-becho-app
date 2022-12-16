import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text, ScrollView } from "react-native";
import ProductView from "./ProductView";
import CarouselComp from "./CarouselComp"
import Catagories from "./Catagories"
import SearchableCatagories from "./SearchableCatagories";



const BASE_URL = 'http://159.223.90.95:3000/'

const Header = (props) => {
    return (
        <>
            <SearchableCatagories />
            <View style={{ height: 2, width: '100%', backgroundColor: '#e1e3e1', marginBottom: 10 }} />
            <CarouselComp />
            <View style={{ height: 2, width: '100%', backgroundColor: '#e1e3e1' }} />
            <Catagories />
            <View style={{ height: 2, width: '100%', backgroundColor: '#e1e3e1' }} />
            <View style={styles.catagoryText}>
                <Text style={styles.catagoryText}>Buy Exclusive ..</Text>
            </View>
        </>
    )
}


const InfiniteList = (props) => {
    const [products, setProducts] = useState([]);
    const [refreshing,] = useState(false);
    const [pagination, setPagination] = useState(0);
    const [finished, setFinished] = useState(false);



    /**
     * The compoenent visible at the bottom of the infinite list
     */
    const renderFooter = () => {
        return (
            <View style={styles.loaderStyle}>
                {finished ?
                    <Text>Finished infinite list</Text>
                    :
                    <ActivityIndicator size="large" color="#aaa" />
                }
            </View>
        );
    };

    const loadMoreItems = () => {
        setPagination(pagination + 1);
    };

    const resetList = () => {
        setProducts([]);
        setFinished(false);
        setPagination(0);
    };

    useEffect(() => {

        /**
     * Fetch the products via the API, then update the products state
     */
        const getProducts = () => {
            console.log("trying to get products")
            fetch(BASE_URL + `products/infiniteScroll/${pagination}`, { method: 'GET' })
                .then(res => res.json())
                .then(({ query }) => {
                    if (query.length === 0)
                        setFinished(true);
                    else
                        setProducts([...products, ...query])
                });
        };

        getProducts();
    }, [pagination]);

    const renderItems = (arr) => {

        return <ScrollView style={{}}>

            {
                arr.map(el =>
                    (<ProductView item={el} key={el._id} />)
                )
            }
        </ScrollView>
    }

    if (props.list.length == 0) {

        return (

            <FlatList
                data={products}
                renderItem={ProductView}
                initialNumToRender={1}
                // TODO: Fix in production
                keyExtractor={item => Math.random()}
                ListHeaderComponent={Header}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreItems}
                onEndReachedThreshold={1}
                refreshing={refreshing}
                onRefresh={resetList}
            />
        )
    }
    else
        return renderItems(props.list);

};

const styles = StyleSheet.create({
    loaderStyle: {
        marginVertical: 16,
        alignItems: "center",
    },
    catagoryText: {
        fontWeight: '800',
        fontSize: 25,
        marginTop: 0,
        marginLeft: 10,
    },
});

export default InfiniteList;