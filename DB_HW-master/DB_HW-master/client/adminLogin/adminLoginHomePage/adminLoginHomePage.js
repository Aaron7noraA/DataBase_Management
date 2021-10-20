import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { FlowRouter } from "meteor/kadira:flow-router";

import './adminLoginHomePage_viewMeal/adminLoginHomePage_viewMeal.js';
import './adminLoginHomePage_viewOrders/adminLoginHomePage_viewOrders.js';
import './adminLoginHomePage_manageInv/adminLoginHomePage_manageInv.js';
import './adminLoginHomePage_buyInv/adminLoginHomePage_buyInv.js';
import './adminLoginHomePage_viewCustomers/adminLoginHomePage_viewCustomers.js'
import './adminLoginHomePage_financeFlow/adminLoginHomePage_financeFlow.js';

import "./adminLoginHomePage.html";

Template.adminLoginHomePage.onCreated(function() {
    if(!Session.get(`adminToken`)){
        FlowRouter.go('error');
    }
    this.meals = new ReactiveVar([]);
    this.mealsCount = new ReactiveVar();
    this.orderRecord = new ReactiveVar();
    this.inventory = new ReactiveVar();
    this.invOrder = new ReactiveVar();
    this.customers = new ReactiveVar();
    this.keyword = new ReactiveVar();
    this.financeFlow = new ReactiveVar();
    
    Meteor.call('getAllMeal', {id: Session.get('token')}, (err, result) => {
        //console.log(result);
        this.meals.set(result);
        this.mealsCount.set(result.length);
        //console.log(this.meals.get());
    });
    Meteor.call("adminViewAllOrders", {}, (err, result) => {
        this.orderRecord.set(result);
    });
    Meteor.call("adminViewInv", {}, (err, result) => {
        this.inventory.set(result);
    });
    Meteor.call('adminViewInvOrder', {}, (err, result) => {
        this.invOrder.set(result);
    });
    Meteor.call("adminViewAllCustomers", {}, (err, result) => {
        console.log(result);
        this.customers.set(result);
    });
    Meteor.call('adminViewFinanceFlow', {}, (err, result) => {
        this.financeFlow.set(result)
    });
});

Template.adminLoginHomePage.helpers({
    showAllMeal: function(){
        return Template.instance().meals.get();
    },
    showAllOrders: function(){
        if(!Template.instance().keyword.get()){
            return Template.instance().orderRecord.get();

        }
        else{
            let temp = Template.instance().orderRecord.get();
            let newReg = new RegExp(Template.instance().keyword.get());
            //console.log(newReg);
            let newTemp = temp.filter((element) => element.orderByName.match(newReg));
            return newTemp;
        }
    },
    showAllInv: function(){
        return Template.instance().inventory.get();
    },
    showAllInvOrders: function(){
        return Template.instance().invOrder.get();
    },
    showAllCustomer: function(){
        return Template.instance().customers.get();
    },
    financeFlow: function(){
        return Template.instance().financeFlow.get()
    }
});

Template.adminLoginHomePage.events({
    'click #adminLoginHomePage_viewMeal'(event, instance){
        event.preventDefault();

        instance.find("#descRegion_adminViewMeal").style.display = 'block';
        instance.find("#descRegion_adminViewOrders").style.display = 'none';
        instance.find("#descRegion_adminViewCustomers").style.display = 'none';
        instance.find("#descRegion_manageInv").style.display = 'none';
        instance.find("#descRegion_buyInv").style.display = 'none';
        instance.find("#descRegion_financeFlow").style.display = "none";
    },
    'click #adminLoginHomePage_viewOrders'(event, instance){
        event.preventDefault();
        
        instance.find("#descRegion_adminViewMeal").style.display = "none";
        instance.find("#descRegion_adminViewOrders").style.display = "block";
        instance.find("#descRegion_adminViewCustomers").style.display = "none";
        instance.find("#descRegion_manageInv").style.display = "none";
        instance.find("#descRegion_buyInv").style.display = "none";
        instance.find("#descRegion_financeFlow").style.display = "none";

        Meteor.call("adminViewAllOrders", {}, (err, result) => {
            instance.orderRecord.set(result);
        });
    },
    'click #adminLoginHomePage_viewCustomers'(event, instance){
        event.preventDefault();

        instance.find("#descRegion_adminViewMeal").style.display = "none";
        instance.find("#descRegion_adminViewOrders").style.display = "none";
        instance.find("#descRegion_adminViewCustomers").style.display = "block";
        instance.find("#descRegion_manageInv").style.display = "none";
        instance.find("#descRegion_buyInv").style.display = "none";
        instance.find("#descRegion_financeFlow").style.display = "none";


    },
    'click #adminLoginHomePage_manageInv'(event, instance){
        event.preventDefault();

        instance.find("#descRegion_adminViewMeal").style.display = "none";
        instance.find("#descRegion_adminViewOrders").style.display = "none";
        instance.find("#descRegion_adminViewCustomers").style.display = "none";
        instance.find("#descRegion_manageInv").style.display = "block";
        instance.find("#descRegion_buyInv").style.display = "none";
        instance.find("#descRegion_financeFlow").style.display = "none";


    },
    'click #adminLoginHomePage_buyInv'(event, instance){
        event.preventDefault();

        instance.find("#descRegion_adminViewMeal").style.display = "none";
        instance.find("#descRegion_adminViewOrders").style.display = "none";
        instance.find("#descRegion_adminViewCustomers").style.display = "none";
        instance.find("#descRegion_manageInv").style.display = "none";
        instance.find("#descRegion_buyInv").style.display = "block";
        instance.find("#descRegion_financeFlow").style.display = "none";

    },
    'click #adminLoginHomePage_financeFlow'(event, instance){
        event.preventDefault();

        instance.find("#descRegion_adminViewMeal").style.display = "none";
        instance.find("#descRegion_adminViewOrders").style.display = "none";
        instance.find("#descRegion_adminViewCustomers").style.display = "none";
        instance.find("#descRegion_manageInv").style.display = "none";
        instance.find("#descRegion_buyInv").style.display = "none";
        instance.find("#descRegion_financeFlow").style.display = 'block';

        Meteor.call("adminViewFinanceFlow", {}, (err, result) => {
            instance.financeFlow.set(result);
        });
    },
    'click #adminLoginHomePage_logOut'(event, instance){
        event.preventDefault();

        Session.set("adminToken", '');
        FlowRouter.go("adminLogin");
    },
    'click .editMeal'(event, instance){
        event.preventDefault();
        console.log(this);
        const editMealName = prompt('請輸入新餐點名稱', this.mealName);
        if(!editMealName) return;
        const editMealDesc = prompt('請輸入餐點介紹', this.mealDesc);
        if(!editMealDesc) return;
        const editMealPrice = prompt('請輸入餐點價格', this.mealPrice);
        if(!editMealPrice) return;

        Meteor.call('adminEditMeal', {mealName: editMealName, mealDesc: editMealDesc, mealPrice: editMealPrice, mealID: this.mealID}, (err, result) => {
            if(err) throw err;
            Meteor.call('getAllMeal', {id: Session.get('token')}, (err, result) => {
                instance.meals.set(result);
                instance.mealsCount.set(result.length);
            });
        });
    },

    'click #adminAddMeal'(event, instance){
        event.preventDefault();

        const newMealName = prompt('請輸入餐點名稱');
        if(!newMealName) return;
        const newMealDesc = prompt('請輸入餐點介紹');
        if(!newMealDesc) return;
        const newMealPrice = prompt('請輸入餐點價格');
        if(!newMealPrice) return;
        const newMealPic = prompt('請輸入圖片網址');
        if(!newMealPic) return;

        Meteor.call('adminAddMeal', {newMealName: newMealName, newMealDesc: newMealDesc, newMealPrice: newMealPrice, newMealPic: newMealPic}, (err, result) => {
            if(err) throw err;
            Meteor.call('getAllMeal', {id: Session.get('token')}, (err, result) => {
                instance.meals.set(result);
                instance.mealsCount.set(result.length);
            });
        });
    },
    'click .assignProcessor'(event, instance){
        event.preventDefault();
    },
    'click .buyInv'(event, instance){
        event.preventDefault();

        const amount = prompt('請輸入數量');
        if(!amount) {
            alert('請輸入數量');
            return;
        }
        const cost = prompt('請輸入總價格');
        if(!cost){
            alert('請輸入總價格');
            return
        }
        const callObj = {
            invId: this.ingredientID,
            invAmount: Number(amount),
            invUnit: this.ingredientUnit,
            invName: this.ingredientName,
            invCost: Number(cost)
        };
        console.log();
        
        Meteor.call("adminAddInvOrder", callObj, (err, result) => {
            Meteor.call("adminViewInvOrder", {}, (err, result) => {
                instance.invOrder.set(result);
            });
        });
        return;
        
    },
    'click .buyInv_confirmBuy'(event, instance){
        event.preventDefault();
        console.log(this);

        const confirmBuy = confirm('確認此訂單已完成?');
        if(!confirmBuy){
            return;
        }

        let id = this.invOrderIndex;
        let invOrderID = this.invOrderID;
        let invOrderAmount = this.invOrderAmount;
        let invCost = this.invOrderCost
        Meteor.call('adminConfirmBuy', {invOrderId: id, invOrderID: invOrderID, invOrderAmount: invOrderAmount, invOrderCost: invCost}, (err, res) => {
            Meteor.call('adminViewFinanceFlow', {}, (err, result) => {
                instance.financeFlow.set(result)
            });
            Meteor.call("adminViewInvOrder", {}, (err, result) => {
                instance.invOrder.set(result);
            });
        });
    },
    'click #viewOrders_filter'(event, instance){
        event.preventDefault();

        let keyword = instance.find('#searchBox').value;
        console.log(keyword);
        instance.keyword.set(keyword);
    },
    'click #invAddNewIngredient'(event, instance){
        event.preventDefault();

        let ingName = prompt('請輸入原料名稱');
        if(!ingName){
            alert('請輸入原料名稱!');
            return;
        }
        let ingUnit = prompt('請輸入原料單位');
        if(!ingUnit){
            alert("請輸入原料單位");
            return;
        }
        Meteor.call('adminAddNewIng', {ingName: ingName, ingUnit: ingUnit}, (err, result) => {
            alert('已成功新增!');
            Meteor.call("adminViewInv", {}, (err, res) => {
                instance.inventory.set(res);
            });
        });
    },
    'click .confirmSendMeal'(event, instance){
        event.preventDefault();

        console.log(this);
        let mumi = {
            orderID: this.orderID
        }
        Meteor.call('adminConfirmSendMeal', mumi, (err, result) => {
            Meteor.call("adminViewAllOrders", {}, (err, result) => {
                instance.orderRecord.set(result);
            });
        });
    }
});