import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';


class TwilioComponent extends Component {
    constructor() {
        super();
        this.state = {
            currentTwilioSetting: {},
            newTwilioSetting: {},
            loggedIn: false,
        }
    }
    // Will retrieve the current twilio settings when the page loads.
    componentDidMount = () => {
        this.getTwilioSettings();
    }
    // Axios request to send notification via twilio
    getTwilioSettings = () => {
        console.log('getting /getTwilioSettings');
        axios({
            method: 'get',
            url: 'api/message/getTwilioSettings',
        }).then((response) => {
            this.setState({
                currentTwilioSetting: response.data[0]
            })
        }).then(() => {
            // If there is a twilio user, then this will make user "logged in"
            switch (this.state.currentTwilioSetting) {
                case undefined:
                    this.setState({
                        loggedIn: false,
                    })
                    break;
                default:
                    this.setState({
                        loggedIn: true,
                    })
            }
        }).catch(function (error) {
            console.log(error, "getTwilioSettings didnt work");
        });
    }
    // This function will display the current user if loggedIn === true
    displayCurrentReciever = () => {
        switch (this.state.loggedIn) {
            case true:
                return (
                    <div>
                        Current Twilio Setting: <br />
                        {this.state.currentTwilioSetting.admin_name + " - " + this.state.currentTwilioSetting.phone_number}
                        <button onClick={this.clearTwilio}>Reset</button>
                    </div>
                )
            default:
                return (
                    // If loggedIn === false, then this will display
                    <div>
                        Please set a phone number
                    </div>
                )
        }
    }
    // Axios request to send new twilio contact information to DB
    changeAdminTwilio = () => {
        console.log('setting Twillio');
        const newTwilio = {
            admin_name: this.state.newTwilioSetting.admin_name,
            phone_number: this.state.newTwilioSetting.phone_number,
        }
        // If the form is not filled out, then this will return an error sweetalert
        if (newTwilio.admin_name === undefined ||
            newTwilio.phone_number === undefined) {
            swal({
                icon: "error",
                title: "Invalid Entry",
                text: "Please enter a name and phone number.",
                buttons: {
                    cancel: false,
                    confirm: "Try Again"
                }
            });
        }
        // If the form is filled out, this will send the axios request
        else {
            axios({
                method: 'post',
                url: 'api/message/changeAdminTwilio',
                data: newTwilio,
            }).then((response) => {
                console.log(response);
            }).then(() => {
                // After admin is changed re-call the getTwilio settings to update dom
                swal({
                    text: "Admin Changed",
                    icon: "success",
                });
                this.getTwilioSettings();
            }).catch(function (error) {
                console.log(error, "sendNewTwilio didnt work");
            });
        }
    }
    
    // Calls both clearTwilio Functions
    clearTwilio = () => {
        this.clearTwilioAxios();
        this.clearTwilioState();
        swal({
            text: "Admin Cleared",
            icon: "success",
        });
    }
    // Axios request for deleting the current admin
    clearTwilioAxios = () => {
        axios({
            method: 'delete',
            url: 'api/message/clearTwilio',
        }).catch(function (error) {
            console.log(error, "clearTwilio didnt work");
        });
    }
    // Changes the state and loggedIn status back to default
    clearTwilioState = () => {
        this.setState({
            admin_name: "",
            loggedIn: false
        })
    }

    // Handlers for updating states based on the fields
    handlePhoneNumberChange = (event) => {
        this.setState({
            newTwilioSetting: {
                admin_name: this.state.newTwilioSetting.admin_name,
                phone_number: event.target.value
            }
        })
    }
    handleAdminNameChange = (event) => {
        this.setState({
            newTwilioSetting: {
                admin_name: event.target.value,
                phone_number: this.state.newTwilioSetting.phoneNumber
            }
        })
    }

    render() {
        return (
            <div className="viewContainer">
                <div>
                    {this.displayCurrentReciever()}
                </div>
                <hr />
                Set Admin
                    <br />
                <form onSubmit={this.changeAdminTwilio}>
                    {this.state.newTwilioSetting.admin_name}<br />
                    Name
                    <input type="tel" onChange={this.handleAdminNameChange} defaultValue={this.state.newTwilioSetting.admin_name} />

                    {this.state.newTwilioSetting.phone_number}<br />
                    Phone
                    <input type="number" onChange={this.handlePhoneNumberChange} defaultValue={this.state.newTwilioSetting.phone_number} />
                    <input type="submit" />
                </form>
            </div>
        );
    }
}

// this allows us to use <App /> in index.js
export default TwilioComponent;

