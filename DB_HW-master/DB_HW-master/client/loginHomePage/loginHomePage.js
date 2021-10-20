import { Meteor } from "meteor/meteor";
import { BlazeLayout } from "meteor/kadira:blaze-layout";
import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from "meteor/kadira:flow-router";


import './loginHomePage_myData/loginHomePage_myData.js';
import './loginHomePage_myOrders/loginHomePage_myOrders.js';
import './loginHomePage_viewMeal/loginHomePage_viewMeal.js';
import '../error/error.js';

import './loginHomePage.html';

Template.loginHomePage.onCreated(function() {
    this.meals = new ReactiveVar([]);
    this.mealsCount = new ReactiveVar();
    this.orderRecord = new ReactiveVar();
    if(!Session.get('token')){
        FlowRouter.go('error');
    }
    Meteor.call('getAllMeal', {id: Session.get('token')}, (err, result) => {
        //console.log(result);
        this.meals.set(result);
        this.mealsCount.set(result.length);
        //console.log(this.meals.get());
    });
    Meteor.call('getOrderRecord', {id: Session.get('token')}, (err, result) => {
        this.orderRecord.set(result);
    });
});

Template.loginHomePage.events({
    'click #loginHomePage_viewMeal'(event, instance){
        event.preventDefault();
        instance.find("#descRegion_viewMeal").style.display = "block";
        instance.find("#descRegion_myOrders").style.display = "none";
        instance.find("#descRegion_myData").style.display = "none";

    },
    'click #loginHomePage_myOrders'(event, instance){
        instance.find("#descRegion_viewMeal").style.display = "none";
        instance.find("#descRegion_myOrders").style.display = "block";
        instance.find("#descRegion_myData").style.display = "none";
    },
    'click #loginHomePage_myData'(event, instance){
        instance.find("#descRegion_viewMeal").style.display = "none";
        instance.find("#descRegion_myOrders").style.display = "none";
        instance.find("#descRegion_myData").style.display = "block";
    },
    'click #loginHomePage_logOut'(event, instance){
        Session.set('token','');
        FlowRouter.go('login');
    },
    'click #viewMeal_refresh'(event, instance){
        event.preventDefault();
        Meteor.call('getAllMeal', {id: Session.get('token')}, (err, result) => {
        //console.log(result);
        instance.meals.set(result);
        instance.mealsCount.set(result.length);
        //console.log(this.meals.get());
    });
    },
    'click #viewMeal_sendOrder'(event, instance) {
        event.preventDefault();
        let orderArray = [];
        let flag = false;
        for(let h=0; h < instance.mealsCount.get(); h++){
            let amount = Number(instance.find(`#viewMeal_mealAmount_${h + 1}`).value);
            //console.log(amount);
            if(!amount) continue;
            flag = true;
            orderArray.push([h + 1, amount]);
        }
        if(!flag){
            alert('請選擇餐點數量');
            return;
        }
        for(let h=0; h < instance.mealsCount.get(); h++){
            instance.find(`#viewMeal_mealAmount_${h + 1}`).value = '0'
        }
        Meteor.call('pushNewOrder', {orderArray: orderArray, orderBy: Session.get('token'), orderByName: Session.get('userInfo').name}, (err, result) => {
            if(result){
                alert('訂單已送出。');
                instance.find("#descRegion_viewMeal").style.display = 'none';
                instance.find("#descRegion_myOrders").style.display = 'block';
            }
            Meteor.call('getOrderRecord', {id: Session.get('token')}, (err, result) => {
                instance.orderRecord.set(result);
            });
        });
    },
    'click #myOrders_refresh'(event, instance){
        event.preventDefault();
        Meteor.call('getOrderRecord', {id: Session.get('token')}, (err, result) => {
            instance.orderRecord.set(result);
        });
    },
    'click .myOrders_cancel'(event, instance){
        event.preventDefault();
        let confirmDelete = confirm('確定刪除此筆訂單?');
        if (!confirmDelete) {
          return;
        }
        console.log(this);
        Meteor.call('cancelOrder', {id: Session.get('token'), orderID: this.orderID}, (err, result) => {
            Meteor.call('getOrderRecord', {id: Session.get('token')}, (err, result) => {
                instance.orderRecord.set(result);
            });
        });
    },
    'click #myData_table_modifyName'(event, instance){
        event.preventDefault();
        let newName = prompt('請輸入姓名');
        if(!newName){
            alert('請輸入姓名');
            return;
        }
        Meteor.call('updateName', {id: Session.get('token'), newName: newName}, (err, result) => {
            let temp = Session.get('userInfo');
            temp.name = newName;
            Session.set('userInfo', temp);
        });
    },
    'click #myData_table_modifyPhone'(event, instance){
        event.preventDefault();
        let newPhone = prompt('請輸入手機號碼');
        if(!newPhone){
            alert('請輸入手機號碼');
            return;
        }
        Meteor.call('updatePhone', {id: Session.get('token'), newPhone: newPhone}, (err, result) => {
            let temp = Session.get('userInfo');
            temp.userPhone = newPhone;
            Session.set('userInfo', temp);
        });
    },
    'click #myData_table_modifyEmail'(event, instance){
        event.preventDefault();
        let newEmail = prompt('請輸入電子郵件');
        if (!newEmail) {
          alert("請輸入手機號碼");
          return;
        }
        Meteor.call('updateEmail', {id: Session.get('token'), newEmail: newEmail}, (err, result) => {
            let temp = Session.get('userInfo');
            temp.email = newEmail;
            Session.set('userInfo', temp);
        });
    },
    'click #myData_modifyPass'(event, instance){
        event.preventDefault();
        let oldPass = prompt('請輸入舊密碼');
        Meteor.call("login", {user: Session.get('userInfo').username, pass: oldPass}, (err, result) => {
            if(result.truth){
                let newPass = prompt('請輸入新密碼');
                let confirmPass = prompt('請確認密碼');
                if(newPass == confirmPass){
                    Meteor.call('updatePassword', {id: Session.get('token'), passwd: newPass}, (err, result) => {
                        if(err) throw err;
                        else{
                            alert('密碼已更新');
                        }
                    })
                }
                else{
                    alert('輸入的密碼不相同');
                }
            }
            else{
                alert('密碼錯誤');
            }
        });
    },
    'click .myOrders_pay'(event, instance){
        event.preventDefault();
        let confirmPay = confirm('確認支付此訂單?');
        if(!confirmPay) return;
        console.log(this);
        let orderobj = {
            orderID: this.orderID,
            orderPrice: this.orderPrice
        }
        Meteor.call('customerConfirmPay', orderobj, (err, result) => {
            Meteor.call('getOrderRecord', {id: Session.get('token')}, (err, result) => {
                instance.orderRecord.set(result);
            });
        });
    }
});

Template.loginHomePage.helpers({
    showAllMeal: function(){
        console.log(Template.instance().meals.get());
        return Template.instance().meals.get();
    },
    showAllOrder: function(){
        return Template.instance().orderRecord.get();
    },
    userInfo: function(){
        return Session.get('userInfo');
    }
});