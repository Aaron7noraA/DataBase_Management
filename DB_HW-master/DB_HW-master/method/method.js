import { Meteor } from 'meteor/meteor';
import {
    loginFunction, 
    checkDuplicateRegister, 
    registerFunction,
    getAllMeal,
    newOrders,
    getOrderRecord,
    updateName,
    updatePhone,
    updateEmail,
    updatePassword,
    cancelOrder,
    adminLogin,
    adminAddMeal,
    adminEditMeal,
    adminViewAllOrders,
    adminViewInv,
    adminAddInvOrder,
    adminViewInvOrder,
    adminConfirmBuy,
    adminViewAllCustomers,
    adminConfirmNewInv,
    adminAddNewIng,
    adminViewFinanceFlow,
    adminCofirmFinanceFlow,
    customerConfirmPay,
    adminConfirmSendMeal
} from './methodFunctions.js';

Meteor.methods({
    
    async login({user, pass}){

        return await loginFunction(user, pass);
        
    },
    async register({username, pass, email, user, phone}){
        let checkDuplicate = await checkDuplicateRegister(username);
        if(!checkDuplicate){
            await registerFunction(username, pass, email, user, phone);
            return {registerTruth: true};
        }
        else{
            return {registerTruth: false};
        }
    },
    async getAllMeal({id}){
        return await getAllMeal();
    },
    async pushNewOrder({orderArray, orderBy, orderByName}){
        let meals = await getAllMeal();
        //console.log(meals, orderArray);
        let totalPrice = 0;
        let detail = '';
        for(let h=0;h<orderArray.length; h++){
            //console.log(meals[orderArray[h][0] - 1].mealPrice);
            let subtotal = meals[orderArray[h][0] - 1].mealPrice * Number(orderArray[h][1]);
            totalPrice += subtotal;
            detail += `${meals[orderArray[h][0] - 1].mealName} ${orderArray[h][1]}份\n`;
        }

        console.log(totalPrice);
        console.log(detail);
        await newOrders(orderBy, String(orderArray), detail, totalPrice, orderByName);
        return true;
    },
    async getOrderRecord({id}){
        return await getOrderRecord(id);
    },
    async cancelOrder({id, orderID}){
        return await cancelOrder(id, orderID);
    },

    //PersonalData
    async updateName({id, newName}){
        await updateName(id, newName);
        return;
    },
    async updatePhone({id, newPhone}){
        await updatePhone(id, newPhone);
        return;
    },
    async updateEmail({id, newEmail}){
        await updateEmail(id, newEmail);
        return;
    },
    async updatePassword({id, passwd}){
        await updatePassword(id, passwd);
        return;
    },
    async customerConfirmPay({orderID, orderPrice}){
        await customerConfirmPay(orderID);
        await adminCofirmFinanceFlow(`客戶付款`, `收入`, orderPrice);
        return
    },

    async adminLogin({user, pass}){
        console.log(user, pass);
        return await adminLogin(user, pass);
    },
    async adminAddMeal({newMealName, newMealDesc, newMealPrice, newMealPic}){
        console.log('invoked');
        await adminAddMeal(newMealName, newMealDesc, newMealPrice, newMealPic);
        return;
    },
    async adminEditMeal({mealName, mealDesc, mealPrice, mealID}){
        await adminEditMeal(mealName, mealDesc, mealPrice, mealID);
        return;
    },
    async adminViewAllOrders({}){
        return await adminViewAllOrders();
    },
    async adminViewInv({}){
        return await adminViewInv();
    },
    async adminViewInvOrder(){
        return await adminViewInvOrder();
    },
    async adminAddInvOrder({invId, invAmount, invUnit, invName, invCost}){
        return await adminAddInvOrder(invId, invAmount, invUnit, invName, invCost);
    },
    async adminConfirmBuy({invOrderId, invOrderID, invOrderAmount, invOrderCost}){
        await adminConfirmNewInv(invOrderID, invOrderAmount);
        await adminCofirmFinanceFlow(`原料支出`, `支出`, invOrderCost);
        return await adminConfirmBuy(invOrderId);
    },
    async adminViewAllCustomers(){
        return await adminViewAllCustomers();
    },
    async adminAddNewIng({ingName, ingUnit}){
        return await adminAddNewIng(ingName, ingUnit);
    },
    async adminViewFinanceFlow({}){
        return await adminViewFinanceFlow();
    },

    async adminConfirmSendMeal({orderID}){
        return adminConfirmSendMeal(orderID);
    }
});