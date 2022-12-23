import React, { useEffect, useState } from "react";
import { Animated, View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text, ScrollView } from "react-native";
import ProductView from "./ProductView";
import CarouselComp from "./CarouselComp"
import Catagories from "./Catagories"
import SearchableCatagories from "./SearchableCatagories";
import { BASE_URL } from '../env'

const Header = ({ setHiddenStateProducts, setHideHeader, setIgnoreSearch, catagorySearchProducts, setCatagorySearchProducts }) => {

    return (
        <>
            <SearchableCatagories setHiddenStateProducts={setHiddenStateProducts} setHideHeader={setHideHeader} setIgnoreSearch={setIgnoreSearch} setCatagorySearchProducts={setCatagorySearchProducts} />
            <CarouselComp />
            <Catagories />
            <View style={styles.catagoryText}>
                <Text style={styles.catagoryText}>Buy Exclusive ..</Text>
            </View>
        </>
    )
}

const renderItems = (arr) => {

    return <ScrollView style={{}}>

        {
            arr.map(el =>
                (<ProductView item={el} key={el._id} />)
            )


        }
    </ScrollView>

}



const InfiniteList = (props) => {
    const [products, setProducts] = useState([]);
    const [refreshing,] = useState(false);
    const [pagination, setPagination] = useState(0);
    const [finished, setFinished] = useState(false);
    const [HiddenStateProduct, setHiddenStateProduct] = useState([]);

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

        setHiddenStateProduct(props.list)

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


    if (props.ignoreSearch) {
        return (
            <>
                <FlatList
                    data={props.catagorySearchProducts}
                    renderItem={ProductView}
                    initialNumToRender={1}
                    // TODO: Fix in production
                    keyExtractor={item => Math.random()}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={1}
                />
            </>
        )

    }
    else {

        if (!props.hideHeader) {

            return (

                <FlatList
                    data={products}
                    renderItem={ProductView}
                    initialNumToRender={1}
                    // TODO: Fix in production
                    keyExtractor={item => Math.random()}
                    ListHeaderComponent={
                        <Header
                            setHiddenStateProducts={setHiddenStateProduct}
                            setHideHeader={props.setHideHeader}
                            setIgnoreSearch={props.setIgnoreSearch}
                            catagorySearchProducts={props.catagorySearchProducts}
                            setCatagorySearchProducts={props.setCatagorySearchProducts}
                        />}
                    ListFooterComponent={renderFooter}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={1}
                    refreshing={refreshing}
                    onRefresh={resetList}
                />
            )
        }
        else {
            console.log("now shoing hidden state products")
            return (
                <>
                    <FlatList
                        data={HiddenStateProduct}
                        renderItem={ProductView}
                        initialNumToRender={1}
                        // TODO: Fix in production
                        keyExtractor={item => Math.random()}
                        onEndReached={loadMoreItems}
                        onEndReachedThreshold={1}
                    />
                </>
            )
        }
    }

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
        color: 'black'
    },
});

export default InfiniteList;