import React, { Component } from 'react';
import {
    Alert,
    Picker,
    StyleSheet,
    Text,
    View
} from 'react-native';
import NavigationBar from "react-native-navbar";
import * as db from "../../db";
import {API_URL} from "../../config/api";
export default class Codification extends Component<{}> {
    constructor(props) {
        super(props);
        this.state= {
            batId : this.props.navigation.state.params.batId,
            etudiant : db.userJSON,
            couloirs: [],
            chambres: [],
            recommended: [],
            codifs: [],
            postaken:[],
            selChambre: "",
            selpos: ""
        }
    }
    componentDidMount() {fetch(API_URL + "/batiments/" + this.state.batId + "/couloir").then(res => res.json())
            .then(couloirs => {
                this.setState({couloirs : couloirs.filter(re => re.sexe === this.state.etudiant.sexe)})
                    for(let i = 0; i < this.state.couloirs.length ; ++i){
                        fetch(API_URL + "/couloirs/" + this.state.couloirs[i].id + "/chambre").then(res => res.json())
                            .then(cha => {
                                    for(let j = 0; j< cha.length ; ++j ){
                                        const toret = this.state.chambres;
                                        toret.push(cha[j]);
                                        this.setState({chambres : toret})
                                    }
                                }
                            )
                    }
                })

        fetch(API_URL + "/etudiants/recommended?request=" + this.state.etudiant.id + "&batiment="+ this.state.batId).then(res => res.json())
            .then(cha => {
                    this.setState({recommended : cha})
                }
            ).catch(err => {
        } )

        fetch(API_URL + "/codifications").then(res => res.json())
            .then(cha => {
                    this.setState({codifs : cha})
                }
            ).catch(err => {
            alert("Probleme Serveurs")
        } )
    }
    getCham(id){
        return this.state.chambres.filter(cha => cha.id === id)
    }
    posRest(idChambre){
        const chambresel = this.getCham(idChambre);
        const cods = this.state.codifs.filter(codif => codif.chambreId === idChambre);
        let post = [] ;
        for (let i = 0; i < cods.length ; ++i ){
            const obj = cods[i].position ;
            post.push(obj)
        }
        const rpositions = []
        for(let j = 1; j <= chambresel[0].nbpositions ; ++j ){
            let fine = true;
            for(let k = 0 ; k < post.length ; ++k){
                if(post[k] === j ){
                    fine = false ;
                    break;
                }
            }
            if(fine){
                rpositions.push(j);
            }
        }
        this.setState({postaken : rpositions });
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.title}
                    rightButton={this.right}
                    leftButton={this.left}
                />

                <View style={styles.head} >
                    <Text style={styles.headText} > Chambres recommandées </Text>

                </View>
                <View style={styles.center} >
                    {this.state.recommended.map((char,index)=> {
                        if(index < 4) return(<Text key={index} > {char.numero} </Text>)
                    })}
                </View>

                <View style={styles.head} >
                    <Text style={styles.headText} > Choisissez une chambre </Text>
                </View>
                <Picker
                    selectedValue={this.state.selChambre}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({selChambre: itemValue}) ;
                        if(itemValue !== "none") {
                            this.posRest(itemValue)
                        }
                        }
                    }>
                    <Picker.Item label="" value="none" />
                    {this.state.chambres.map((cham,index)=> {
                        if(!cham.reserve) return(<Picker.Item key={index} label={cham.numero} value={cham.id} />  )
                    })}
                </Picker>

                <View style={styles.head} >
                    <Text style={styles.headText} > Choisissez une Position </Text>
                </View>
                <Picker
                    selectedValue={this.state.selpos}
                    onValueChange={(itemValue, itemIndex) => this.setState({selpos: itemValue}) }
                >
                    <Picker.Item label="" value="none" />
                    {this.state.postaken.map((position, index)=> {
                        return (<Picker.Item key={index} label={""+position} value={""+position} ></Picker.Item>)
                    } )}

                </Picker>

            </View>
        );
    }
    title = {
        title: "Ajouter Reservation"
    };
    right = {
        title: "Reserver",
        handler: () => {
            this.ajout();
        },
    };
    left = {
        disabled: false,
        title: "Annuler",
        handler: () => {
                this.props.navigation.goBack();
        }
    };
    ajout() {
        if (this.state.selpos === "none" || this.state.selChambre === "none" ){
            alert("Veullez Choisir Une Chambre");
            return;
        }
        fetch(API_URL + "/codifications",{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                etudiantId: this.state.etudiant.id,
                chambreId: this.state.selChambre,
                position: this.state.selpos,
                date: new Date()
            }),
        }).then(res=> res.json()).then(resp => {
            if(resp.error){
                Alert.alert(
                    "Impossible de reserver",
                    resp.error.message
                )
            }
            else{
                Alert.alert(
                    "Chambre Reservée avec Succés",
                );
                db.codifier(resp)
                this.props.navigation.navigate("Batiment",{return : true});
            }
        } ).catch(err => {
            Alert.alert(
                "Impossible de reserver",
            )

        }).catch(err => {
            Alert.alert(
                "Impossible de reserver",
            )

        })

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    head:{
        height: 45,
        backgroundColor: "#0066ff",
        justifyContent: "center",
        alignItems: "center",

    },
    headText: {
        color: "#fff"
    },
    center: {
        justifyContent: "center",
        alignItems: "center",

    }
});
