import React, { Component } from 'react';
import {
    StyleSheet,
    Text, TouchableOpacity,
    View,
    ScrollView
} from 'react-native';
import {API_URL} from "../../config/api";
import {Loading} from "../../components/loading";
import {Icon} from "react-native-elements";

export default class Batiment extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading : true,
            bats: []
        }
    }
    componentDidMount(){
        if (this.props.navigation.state.params.return) this.props.navigation.goBack();
        fetch(API_URL + "/batiments").then(res => res.json()).then(response => {
            if(response.error){
                alert("Connexion Impossible avec le serveur");
                this.props.navigation.goBack();
                return
            }
            this.setState({bats:response, loading:false});
        } )
    }
    randomColors(){
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    render() {
        if(this.state.loading){
            return (
                <Loading />
            )
        }
        return (
            <ScrollView>
            <View style={styles.container}>
                    {this.state.bats.map((bat,index) => {
                        return(
                            <TouchableOpacity key={index} style={styles.batim}  >
                                <Icon
                                    size={50}
                                    raised
                                    name='building'
                                    type='font-awesome'
                                    color={this.randomColors()}
                                    onPress={() => this.props.navigation.navigate("Codification", {batId: bat.id} )} />
                                <Text> {bat.nomBatiment} </Text>
                            </TouchableOpacity>
                        )
                    })}
            </View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    batim: {
        alignItems: "center",
        justifyContent: "center",
        width: 175,
        height: 175,
    }
});
