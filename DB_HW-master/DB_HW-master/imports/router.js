import { FlowRouter } from "meteor/kadira:flow-router";
import { BlazeLayout } from "meteor/kadira:blaze-layout";

import '../client/main.html';
import "../client/connectionStatus/connectionStatus.js";
import '../client/loginHomePage/loginHomePage.js';
import '../client/register/register.js';
import '../client/error/error.js';

import '../client/adminLogin/adminLogin.js';
import '../client/adminLogin/adminLoginHomePage/adminLoginHomePage.js';

FlowRouter.route("/", {
    name: "login",
    action() {
        BlazeLayout.render("hello", {});
    },
});

FlowRouter.route('/connectionStatus', {
    name: 'connectionStatus',
    action(){
        BlazeLayout.render("connectionStatus", {});
    }
});

FlowRouter.route("/loginHomePage", {
    name: "loginHomePage",
    action(){
        BlazeLayout.render("loginHomePage", {});
    }
});

FlowRouter.route("/register", {
    name: 'register',
    action(){
        BlazeLayout.render("register", {});
    }
});

FlowRouter.route('/error',{
    name: 'error',
    action(){
        BlazeLayout.render("error", {});
    }
});

FlowRouter.route("/adminLogin", {
    name: "adminLogin",
    action() {
        BlazeLayout.render("adminLogin", {});
    },
});

FlowRouter.route('/adminLoginHomePage', {
    name: 'adminLoginHomePage',
    action(){
        BlazeLayout.render('adminLoginHomePage', {});
    }
});