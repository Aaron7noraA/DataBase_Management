import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from "meteor/templating";

import './connectionStatus.html';

Template.connectionStatus.onCreated(function(){
    let _this = this;
    this.status = new ReactiveVar(1);
    Meteor.call("connectionStatus", {}, (err, result) => {
        console.log(result);
        _this.status.set(result);
    });
})

Template.connectionStatus.helpers({
    connetedToDB: function(){
        if(Template.instance().status.get()){
            return "Connection Success.";
        }
        else{
            return 'Error';
        }
    }
});