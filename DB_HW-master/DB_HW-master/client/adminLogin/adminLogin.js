import { FlowRouter } from "meteor/kadira:flow-router";

import './adminLogin.html';

Template.adminLogin.events({
    "submit .login-form":async  (event, instance) => {
        event.preventDefault();

        const target = event.target;
        const text_user = target.username.value;
        const text_pass = target.password.value;
        console.log(text_user, text_pass);
        const result = await Meteor.callPromise("adminLogin", {
            user: text_user,
            pass: text_pass
        });

        if (!result.truth) {
            alert("Either username or password is wrong.");
            throw new Meteor.Error("Either username or password is wrong.");
        } else {
            console.log(result);
            Session.set('adminToken', result.id);
            
        }
        FlowRouter.go('adminLoginHomePage');
    },
});