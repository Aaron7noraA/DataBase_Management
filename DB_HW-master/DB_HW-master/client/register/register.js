import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/kadira:flow-router";

import './register.html';

Template.register.events({
    'submit .registerForm': async (event, instance) => {
        event.preventDefault();

        const target = event.target;
        const target_username = target.username.value;
        const target_user = target.name.value;
        const target_phone = target.phone.value;
        const target_email = target.email.value;
        const target_password = target.password.value;
        if(!target_username || !target_phone || !target_user || !target_password || !target_email){
            alert('請輸入必要資料。');
            return;
        }
        Meteor.call('register', {
            username: target_username,
            pass: target_password,
            user: target_user,
            email: target_email,
            phone: target_phone
        }, (err, result) => {
            if(err) throw err;
            if(result.registerTruth){
                alert('註冊成功');
                FlowRouter.go('login');
            }
            else{
                alert('註冊失敗，用戶名稱已存在。');
            }
        });
    }
});