import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxx/Aux'
// import axios from '../../axios-orders';
import { error } from 'util';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component{
        state = {
            error: null,
        }
        componentWillMount(){
           this.reqInteceptor = axios.interceptors.request.use(req =>{
                console.log(req);
                this.setState({ error: null });
                return req;
            });
            this.resInteceptor = axios.interceptors.response.use(res => res, error =>{
                console.log(error);
                this.setState({ error: error });
            });
        }

        componentWillUnmount(){
            axios.interceptors.request.eject(this.reqInteceptor);
            axios.interceptors.request.eject(this.resInteceptor);
        }
        
        errorConfirmedHandler = () => {
            this.setState({ error: null });
        }

        render(){
            return (
                <Aux>
                    <Modal show={this.state.error}
                            modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
};

export default withErrorHandler;