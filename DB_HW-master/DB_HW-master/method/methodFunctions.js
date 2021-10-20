import moment from 'moment'

import { connection } from "../db/mysql.js";


export function loginFunction(user, pass){
    return new Promise((res, rej) => {
        connection.query(
            `SELECT * FROM susers WHERE username = ? AND password = ?`,
            [user, pass],
            (err, result) => {
                if (!result.length) {
                    res({
                        truth: false,
                    });
                } else {
                    res({
                        truth: true,
                        id: result[0].userid,
                        userPhone: result[0].phone,
                        name: result[0].name, 
                        username: result[0].username,
                        email: result[0].email,
                    });
                }   
            }
        );
    });
}

export function checkDuplicateRegister(user){
    return new Promise((res, rej) => {
        connection.query(
            `SELECT * FROM susers WHERE username=?`,
            [user],
            (err, result) => {
                if(!result.length){
                    res(false);
                }
                else{
                    res(true);
                }
            }
        )
    });
}

export function registerFunction(username, pass, email, user, phone){
    return new Promise((res, rej) => {
        connection.query(
            'INSERT INTO `susers` (`userid`, `username`, `email`, `password`, `name`, `phone`) VALUES (NULL, ?, ?, ?, ?, ?)',
            [username, email, pass, user, phone],
            (err, result) => {
                if(err) throw err;
                res();
            });
    })
}

export function getAllMeal(){
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * FROM `meals`',
            [],
            (err, result) => {
                res(result);
            }
        )
    });
}

export function newOrders(orderBy, orderArray, orderDetail, orderPrice, orderByName){
    return new Promise((res, rej) => {
        connection.query(
          "INSERT INTO `orders` (`orderID`, `orderBy`, `orderArray`, `orderDetail`, `orderAt`, `orderPrice`, `orderIsBilled`, `orderByName`) VALUES (NULL, ?, ?, ?, ?, ?, False, ?)",
          [orderBy, orderArray, orderDetail, moment().format("MM-DD hh:mm:ss"), orderPrice, orderByName],
          (err, result) => {
            if (err) throw err;
            res();
          }
        );
    });
}

export function getOrderRecord(id){
    return new Promise((res, rej) => {
        connection.query(
            "SELECT * FROM `orders` WHERE `orderBY` = ?",
            [id],
            (err, result) => {
                res(result);
            })
    });
}

export function cancelOrder(id, orderID){
    return new Promise((res, rej) => {
        connection.query(
            'DELETE FROM `orders` WHERE `orderID` = ? AND `orderBy` = ?',
            [orderID, id],
            (err, result) => {
                if(err) throw err;
                res(); 
            });
    });
}

export function updateName(id, newName){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `susers` SET `name` = ? WHERE `userid` = ?',
            [newName, id],
            (err, result) => {
                if(err) throw err;
                res();
            }
        )
    });
}

export function updatePhone(id, newPhone){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `susers` SET `phone` = ? WHERE `userid` = ?',
            [newPhone, id],
            (err, result) => {
                if(err) throw err;
                res();
            }
        )
    });
}

export function updateEmail(id, newEmail){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `susers` SET `Email` = ? WHERE `userid` = ?',
            [newEmail, id],
            (err, result) => {
                if(err) throw err;
                res();
            }
        )
    });
}

export function updatePassword(id, newPass){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `susers` SET `password` = ? WHERE `userid` = ?',
            [newPass, id], 
            (err, result) => {
                if(err) throw err;
                res()
            }
        )
    });
}

export function customerConfirmPay(orderID){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `orders` SET `orderIsBilled` = 1 WHERE `orderID` = ?',
            [orderID],
            (err, result) => {
                if(err) throw err;
                res();
            });
    });
}

export function adminLogin(user, pass){
    
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * FROM `adminusers` WHERE `admin` = ? AND `passwd` = ?',
            [String(user), String(pass)],
            (err, result) => {
                if(err) throw err;
                if(!result.length){
                    res({
                        truth: false
                    })
                }
                else{
                    res({
                        truth: true,
                        id: result[0].index
                    });
                }
            });
    });
}

export function adminAddMeal(mealName, mealDesc, mealPrice, mealPic){
    return new Promise((res, rej) => {
        connection.query(
            'INSERT INTO `meals` (`mealID`, `mealName`, `mealDesc`, `mealPrice`, `mealPic`) VALUES (NULL, ?, ?, ?, ?)',
            [mealName, mealDesc, mealPrice, mealPic],
            (err, result) => {
                if (err) throw err;
                res();
            })
    });
}

export function adminEditMeal(mealName, mealDesc, mealPrice, mealID){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `meals` SET `mealName` = ?, `mealDesc` = ?, `mealPrice` = ? WHERE `mealID` = ?',
            [mealName, mealDesc, mealPrice, mealID],
            (err, result) => {
                if(err) throw err;
                res();
            });
    })
}

export function adminViewAllOrders(){
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * FROM `orders`',
            [],
            (err, result) => {
                res(result);
            });
    });
}

export function adminViewInv(){
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * FROM `inventory`',
            [],
            (err, result) => {
                res(result);
            });
    });
}

export function adminViewInvOrder(){
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * FROM `invorder`',
            [],
            (err, result) => {
                if(err) throw err;
                res(result);
            });
    });
}

export function adminAddInvOrder(invID, invAmount, invUnit, invName, invCost){
    return new Promise((res, rej) => {
        connection.query(
            'INSERT INTO `invOrder` (`invOrderIndex`, `invOrderID`, `invOrderAmount`, `invOrderUnit`, `invOrderIssuedAt`, `invOrderName`, `invOrderCost`) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
            [invID, invAmount, invUnit, moment().format('MM/DD hh:mm:ss'), invName, invCost],
            (err, result) => {
                if(err) throw err;
                res();
            })
    });
}

export function adminConfirmBuy(invOrderID){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `invorder` SET `invOrderFinishedAt` = ? WHERE `invOrderIndex` = ?',
            [moment().format('MM/DD hh:mm:ss'), invOrderID],
            (err, result) => {
                if(err) throw err;
                res();
            });
    });
}

export function adminConfirmNewInv(invOrderID, invOrderAmount){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `inventory` SET `ingredientAmount`  = `ingredientAmount` + ? WHERE `ingredientID` = ?',
            [invOrderAmount, invOrderID],
            (err, result) => {
                if(err) throw err;
                res();
        });
    });
}

export function adminViewAllCustomers(){
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * FROM `susers`',
            [],
            (err, result) => {
                if(err) throw err;
                res(result);
            });
    })
}

export function adminAddNewIng(ingName, ingUnit) {
    return new Promise((res, rej) => {
        connection.query(
            "INSERT INTO `inventory` (`ingredientID`, `ingredientName`, `ingredientAmount`, `ingredientUnit`) VALUES (NULL, ?, 0, ?)",
            [ingName, ingUnit],
            (err, result) => {
                if(err) throw err;
                res();
            });
        });
}

export function adminViewFinanceFlow(){
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * FROM `financeflow` ORDER BY `financeID` DESC',
            [],
            (err, result) => {
                res(result);
            });
    });
}

export function adminCofirmFinanceFlow(financeTitle, financeInOut, financeAmount) {
    return new Promise((res, rej) => {
        connection.query(
            "INSERT INTO `financeflow` (`financeID`, `financeTitle`, `financeInOut`, `financeAmount`, `financeDateTime`) VALUES (NULL, ?, ?, ?, ?)",
            [financeTitle, financeInOut, financeAmount, moment().format('YYYY-MM-DD hh:mm:ss')],
            (err, result) => {
                if(err) throw err;
                res();
            });
    });
}

export function adminConfirmSendMeal(orderID){
    return new Promise((res, rej) => {
        connection.query(
            'UPDATE `orders` SET `orderIsProcessed` = 1 WHERE `orderID` = ?',
            [orderID],
            (err, result) => {
                if(err) throw err;
                res();
            });
    });
}