import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text, ScrollView } from "react-native";
import ProductView from "./ProductView";
import CarouselComp from "./CarouselComp"
import Catagories from "./Catagories"
import SearchableCatagories from "./SearchableCatagories";



const BASE_URL = 'http://192.168.29.211:3000/'

const Header = (props) => {
    return (
        <>
            <SearchableCatagories />
            <CarouselComp />
            <Catagories />
        </>
    )
}


const InfiniteList = (props) => {
    const [products, setProducts] = useState([]);
    const [refreshing,] = useState(false);
    const [pagination, setPagination] = useState(0);
    const [finished, setFinished] = useState(false);

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
        console.log("This function is called")
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
});

export default InfiniteList;