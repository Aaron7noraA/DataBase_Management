import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from "meteor/kadira:flow-router";
import { Session } from 'meteor/session';

import './connectionStatus/connectionStatus.js';
import '../imports/router.js';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
    'linkToConnectionStatus': function(){
        return FlowRouter.path('connectionStatus');
    }
});

Template.hello.events({
    "submit .login-form":async  (event, instance) => {
        event.preventDefault();

        const target = event.target;
        const text_user = target.username.value;
        const text_pass = target.password.value;

        const result = await Meteor.callPromise("login", {
            user: text_user,
            pass: text_pass
        });

        if (!result.truth) {
            alert("Either username or password is wrong.");
            throw new Meteor.Error("Either username or password is wrong.");
        } else {
            console.log(result);
            Session.set('token', result.id);
            Session.set('userInfo', {
                userPhone: result.userPhone,
                name: result.name,
                email: result.email,
                username: result.username
            })
        }
        FlowRouter.go('loginHomePage');
    },
    'click #register': (event, instance) => {
        FlowRouter.go('register');
    }   
});

