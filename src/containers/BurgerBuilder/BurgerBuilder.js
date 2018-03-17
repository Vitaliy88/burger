import React, { Component } from 'react';

import Aux from '../../hoc/Auxx/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummery from '../../components/Burger/OrderSummery/OrderSummery';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';

// import { stat } from 'fs';
import Spinner from '../../components/UI/Spinner/Spinner' 

const INGREDIENT_PRICE = {
    salad: 0.3,
    cheese: 0.7,
    meat: 1.3,
    bacon: 0.8,
}

class BurgerBuilger extends Component{
    // constructor(props){
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients:null,
        totalPrice: 3,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false,
    }

    componentDidMount (){
        axios.get('https://qwertysite-e07b3.firebaseio.com/ingredients.json')
                .then(response => {
                    this.setState({ingredients: response.data})
                })
                .catch(error => {
                    this.setState({error: true})
                });
    }

    updatePurchaseState(ingredients){
        // const ingredients ={
        //     ...this.state.ingredients
        // };
        const sum = Object.keys(ingredients)
            .map(igKey =>{
                return ingredients[igKey];
            })
            .reduce((sum, el) =>{
                return sum + el;
            }, 0)
            this.setState({purchasable: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients,
        });
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients,
        });
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        // console.log('You continue!');
        this.setState({loading: true});
        const order ={
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            costomer:{
                name: 'Vitaliy Shulgin',
                address:{
                    street:'TestStreet 88',
                    zipCode: '123456',
                    country: 'Ukraine',
                },
                email: 'test@tset.com',
            },
            deliveryMethod: 'fastest',
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false});
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
            });
    }

    render(){
        const disableInfo ={
            ...this.state.ingredients
        };
        for(let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }
        let  orderSummery = null;
        
           let burger = this.state.error ?<p style ={{textAlign: 'center'}}>Ingredients can not be loaded</p> : < Spinner/>;
        if(this.state.ingredients){
            burger = (
                <Aux> 
                   <Burger ingredients = {this.state.ingredients} />
                   <BuildControls
                   ingredientAdded={this.addIngredientHandler}
                   ingredientRemoved={this.removeIngredientHandler}
                   disabled ={disableInfo}
                   purchasable={this.state.purchasable}
                   orderd={this.purchaseHandler}
                   price={this.state.totalPrice}/>
               </Aux>
             );
             orderSummery = <OrderSummery 
                            ingredients={this.state.ingredients}
                            purchaseCancelled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler}
                            price={this.state.totalPrice}/>;
        };
        if(this.state.loading){
            orderSummery = < Spinner/>
        }

        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                   {orderSummery}
                </Modal>
                {burger}
            </Aux>
        );
    }
};

export default withErrorHandler(BurgerBuilger, axios);
