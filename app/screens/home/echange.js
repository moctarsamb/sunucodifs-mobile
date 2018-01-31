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
const Chance = require("chance");

export default class Echange extends Component<{}> {
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
            selCodif: ""
        }
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
            this.setState({codifications : response.filter(obj => this.getEtudiant(obj.etudiantId).sexe === this.state.etudiant.sexe )})
        } )
    }
    render() {
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={this.state.selBat}
                    onValueChange={(itemValue, itemIndex) => this.setState({selBat: itemValue}) }
                >
                    <Picker.Item label="" value="none" />
                    {this.state.batiments.map((position, index)=> {
                        return (<Picker.Item key={index} label={position.nomBatiment} value={position.id} ></Picker.Item>)
                    } )}

                </Picker>

                <ScrollView>
                    <List
                        containerStyle={{borderTopWidth: 0,borderBottomWidth: 0}}
                    >
                        {this.state.codifications.map((codif,index)=> {
                            const chamb =this.getChambre(codif.chambreId);
                            const etu =this.getEtudiant(codif.etudiantId);
                            if(chamb && etu && chamb.batimentId === this.state.selBat && etu.id !== this.state.etudiant.id ) return(
                                <ListItem
                                    key={index}
                                    title={"Position "+ codif.position + " de la chambre " + chamb.numero}
                                    subtitle={
                                        <Text style={{alignItems: "center"}} >Detenu par {etu.prenom + " " + etu.nom} </Text>
                                    }
                                    onPress={() => {
                                        Alert.alert(
                                            'Voulez vous echanger votre codification ? ',
                                            'Nous enverrons une demande au proprietaire de la position ',
                                            [
                                                {text:"Confirmer ", onPress: ()=> {
                                                    this.echange(codif);
                                                }},
                                                {text:"Annuler", onPress: () => {
                                                    console.log("Annuler");
                                                }}
                                            ]
                                        )
                                    } }
                                />
                            )
                        })}
                    </List>
                </ScrollView>

            </View>
        );
    }
    echange(rec){
        const tem = new Chance();
        const verifCode = tem.hash({ length: 6 });
        const tosend = {
            "code": verifCode,
            "idUserEch": this.state.id,
            "idChaUserEch": this.state.codif.id,
            "idRecEch": rec.etudiantId,
            "idChaRecEch": rec.id
         }
         fetch(API_URL+"/echangeCodes",{
             method: 'POST',
             headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify(tosend),
         }).then(res=> res.json()).then(resp=> {
             if(resp.error){
                 alert("Impossible d'effectuer l'echange")
             }
             else{
                 db.refresh();
                 alert("Demande d'echange envoyée");
                 this.props.navigation.goBack();
             }
         } )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});
