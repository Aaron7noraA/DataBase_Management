import { FlowRouter } from "meteor/kadira:flow-router";


import './error.html';

Template.error.events({
    'click'(event, instance){
        event.preventDefault();

        FlowRouter.go('login');
    }
})