import * as React from 'react'
import {Text, View, StyleSheet, Button, TouchableOpacity, FlatList} from 'react-native';
import db from '../config';
import {ScrollView, TextInput} from 'react-native-gesture-handler';

export default class SearchScreen extends React.Component {
    constructor() {
        super();
        this.state ={
            allTransactions: [],
            lastVisibleTransaction: null,
            search: ''
        }
    }

    fetchMoreTransactions = async() => {
        var text = this.state.search.toUpperCase();
        var enteredText = text.split("");
        if(enteredText[0].toUpperCase() === "B") {
            const query = await db.collection("transactions").where("bookId", "==", text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
            query.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        } else if(enteredText[0].toUpperCase() === "S") {
            const query = await db.collection("transactions").where("studentId", "==", text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
            query.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
    }

    searchTransaction = async(text) => {
        var enteredText = text.split("");
        if(enteredText[0].toUpperCase() === "B") {
            const transaction = await db.collection("transactions").where("bookId", "==", text).get()
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        } else if(enteredText[0].toUpperCase() === "S") {
            const transaction = await db.collection("transactions").where("studentId", "==", text).get()
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
    }

    componentDidMount = async() => {
        const query = await db.collection("transactions").limit(10).get()
        query.docs.map((doc)=>{
            this.setState({
                allTransactions: [],
                lastVisibleTransaction: doc
            })
        })
    }

    render() {
        return (
            <View style = {{
                flex: 1,
                marginTop: 20
            }}>
                <View style = {styles.searchBar}>
                    <TextInput style = {styles.bar}
                    placeHolder = "Enter book ID or student ID"
                    onChangeText = {text =>{
                        this.setState({
                            search: text
                        })
                    }}/>
                    <TouchableOpacity style = {styles.searchButton}
                    onPress = {() =>{
                        this.searchTransaction(this.state.search)
                    }}>
                        <Text>
                            Search
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                data = {this.state.allTransactions}
                renderItem = {({item}) => (
                    <View style={{
                        borderBottomWidth: 2
                    }}>
                        <Text>
                            {'Book ID: ' + item.bookId}
                        </Text>
                        <Text>
                            {'Student ID: ' + item.studentId}
                        </Text>
                        <Text>
                            {'Transaction Type: ' + item.transactionType}
                        </Text>
                        <Text>
                            {'Date: ' + item.date.toDate()}
                        </Text>
                    </View>
                )}
                keyExtractor = {(item, index) => index.toString()}
                onEndReached = {this.fetchMoreTransactions()}
                onEndReachedThreshold = {0.7}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        height: 40,
        width: 'auto',
        borderWidth: 0.5,
        alignItems: 'center',
        backgroundColor: 'grey'
    },
    bar: {
        borderEndWidth: 2,
        height: 30,
        width: 300,
        paddingLeft: 10
    },
    searchButton: {
        borderWidth: 1,
        height: 30,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green'
    }
})