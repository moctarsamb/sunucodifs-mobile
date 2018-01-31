import React, { Component } from 'react';
import {
    Alert,
    Picker, ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {API_URL} from "../../config/api";
import * as db from "../../db";
import { List, ListItem } from 'react-native-elements'

// noinspection JSAnnotator
export default class Liste extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            etudiant : db.userJSON,
            id: db.userId,
            codif: db.codif[0],
            codifications: [],
            etudiants: [],
            chambres: [],
            batiments: [],
            selBat: "",
            selChamb: ""
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.head} >
                    <Text style={styles.headText} > Choisissez un batiment </Text>
                </View>
                <Picker
                    selectedValue={this.state.selBat}
                    onValueChange={(itemValue, itemIndex) => this.setState({selBat: itemValue}) }
                >
                    <Picker.Item label="" value="none" />
                    {this.state.batiments.map((position, index)=> {
                        return (<Picker.Item key={index} label={position.nomBatiment} value={position.id} ></Picker.Item>)
                    } )}

                </Picker>
                <View style={styles.head} >
                    <Text style={styles.headText} > Choisissez une chambre </Text>
                </View>
                <Picker
                    selectedValue={this.state.selChamb}
                    onValueChange={(itemValue, itemIndex) => this.setState({selChamb: itemValue}) }
                >
                    <Picker.Item label="" value="none" />
                    {this.state.chambres.map((chamb, index)=> {
                        if(chamb && chamb.batimentId === this.state.selBat )return (<Picker.Item key={index} label={chamb.numero} value={chamb.id} ></Picker.Item>)
                    } )}
                </Picker>
                <ScrollView>
                    <List
                        containerStyle={{borderTopWidth: 0,borderBottomWidth: 0}}
                    >
                        {this.state.codifications.map((codif,index)=> {
                            const chamb =this.getChambre(codif.chambreId);
                            const etu =this.getEtudiant(codif.etudiantId);
                            if(chamb && etu && chamb.id === this.state.selChamb ) return(
                                <ListItem
                                    key={index}
                                    title={"Position "+ codif.position }
                                    subtitle={
                                        <Text style={{alignItems: "center"}} >Detenu par {etu.prenom + " " + etu.nom} </Text>
                                    }
                                    onPress={() => {
                                    } }
                                />
                            )
                        })}
                    </List>
                </ScrollView>

            </View>
        );
    }
    getEtudiant(id){
        return this.state.etudiants.filter(etu => etu.id === id)[0]
    }
    getChambre(id){
        return this.state.chambres.filter(etu => etu.id === id)[0]
    }
    componentDidMount(){
        fetch(API_URL + "/batiments").then(res=> res.json()).then(response => {
            this.setState({batiments : response})
        } )
        fetch(API_URL + "/etudiants").then(res=> res.json()).then(response => {
            this.setState({etudiants : response})
        } )
        fetch(API_URL + "/chambres").then(res=> res.json()).then(response => {
            this.setState({chambres : response})
        } )
        fetch(API_URL + "/codifications").then(res=> res.json()).then(response => {
            this.setState({codifications : response })
        } )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    head:{
        height: 35,
        backgroundColor: "#0066ff",
        justifyContent: "center",
        alignItems: "center",

    },
    headText: {
        color: "#fff"
    }
});
