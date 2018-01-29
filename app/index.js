import React, { Component } from "react";
import * as db from "./db";

import { Tabs } from "./config/router";
import {Loading} from "./components/loading";
export const Language = "French";
export default class AppIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: null,
            loading: false
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        db
            .currentUser()
            .then(user => {
                let Logged = user ? true : false;
                this.setState({
                    logged: Logged,
                    loading: false
                });
            })
            .catch(err => {
                this.setState({
                    logged: false,
                    loading: false
                });
            });
    }
    render() {
        if (this.state.loading) {
            return (
                <Loading></Loading>
            );
        }
        const Index = Tabs(this.state.logged);
        return <Index />;
    }
}
