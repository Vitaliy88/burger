import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
const burger = (props) =>{
    let transformedIndredients = Object.keys(props.ingredients)
        .map(ingKey =>{
            return [...Array(props.ingredients[ingKey])].map((_, i) =>{
               return <BurgerIngredient key={ingKey + i} type={ingKey}/>
            });
        }).reduce((arr, el) => {
            return arr.concat(el);
        },[])
        if(transformedIndredients.length === 0 ){
            transformedIndredients = <p>Please start adding indredients </p>
        }
        // console.log(transformedIndredients);
    return (
        <div className = {classes.Burger} >
        <BurgerIngredient type='bread-top'/>
        {transformedIndredients}
        <BurgerIngredient type='bread-bottom'/>
        </div>
    );
};

export default burger;