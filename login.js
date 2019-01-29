const db = require('./db.js');
const app = require('./route.js');
const ObjectID = require('mongodb').ObjectID;

let result = {  // 返回的数据
    status: 0,
    info: null,
    userID: null
};

let info = {    // 信息
    err: 'Err',
    err_key: 'Err key',
    user_exists: 'User already exists',
    user_not_exists: 'User not exists',
    err_password: 'Err password',
    ok: 'Ok',
    fail: 'fail',   // 注销信息
}

const collection = "site";  // 集合
let res_result;     // 返回结果
let query;          // post的数据

// 字段判断
var legal_key = (req, res, next)=>{
    result = {  // 初始数据
        status: 0,
        info: null,
        userID: undefined
    };

    query = req.query;
    console.log(req);

    res_result = ()=> res.json(JSON.stringify(result));

    // 字段判断
    if(query.userName == undefined || query.password == undefined) {
        result.info = info.err_key;
        res_result();
        return;
    }
    next();
}


// 注册===========
{
app.post('/register', legal_key, (req, res, next)=>{
    // 是否已存在用户
    let whereStr = {"userName" : query.userName};
    
    db.find(collection,whereStr,(err, results)=>{ // 返回集合中所有数据
        if (err) {
            res.send(502);
        }
        else{
            if(results.length !=0){
                result.info = info.user_exists;
                res_result();
            }else next()
        }
    })
},(res, req)=>{
    let data = {"userName": query.userName,"password": query.password,"status":"1"};
    db.insertOne(collection, data, (err, results)=>{
        if (err) {
            res.send(502);
        }else{
            if(results.insertedCount ==1){
                result.status = 1;
                result.info = info.ok;
                result.userID = results.ops.shift()._id;
                res_result();
            }else{
                result.info = info.err;
                res_result();
            }
        }
    })
}
);
}

// 登陆============
{
app.post('/login', legal_key, (res, req, next)=>{
    // 查询是否存在
    let whereStr = {'userName': query.userName};

    db.find(collection,whereStr,(err, results)=>{ 
        if (err) {
            res.send(502);
        }
        else{
            if(results.length !=0){ 
                // 登陆成功，更新登陆状态
                let rsl = results.shift();
                if(query.password != rsl.password){
                    result.info = info.err_password;
                    res_result();
                }else{
                    let updateStr = {$set: { "status" : "1" }};
                    
                    db.updateOne(collection, whereStr, updateStr,(err, _results)=>{
                        if (err) {
                            res.send(502);
                        } 
                        else{
                            result.status = 1;
                            result.info = info.ok;
                            result.userID = rsl._id;
                            res_result();
                        }
                    })
                }
                
            }else {
                result.info = info.user_not_exists;
                res_result();
            }
        }
    });
});
}

// 注销=============
{
// 注销返回的数据
let r = {
    status : 0,
    info: 'fail',
}


app.all("/logout",(res, req, next)=>{   // 字段判断
    r = {
        status : 0,
        info: 'fail',
    }

    query = res.query;
    
    if(query.userID == undefined){
        r.info = info.err_key;
        req.json(JSON.stringify(r));
    }
    else next()
},(res, req)=>{ // 注销
    let whereStr = { _id:ObjectID(query.userID) };
    
    db.find(collection,whereStr,(err, results)=>{ 
        if (err) {
            res.send(502);
        }
        else{
            if(results.length !=0){ 
                // 登陆成功，更新登陆状态
                let updateStr = {$set: { "status" : "0" }};
                db.updateOne(collection, whereStr, updateStr,(err, _results)=>{
                    if (err) {
                        res.send(502);
                    } 
                    else{
                        r.status = 1;
                        r.info = 'ok';
                        req.json(JSON.stringify(r));
                    }
                })
            }else {
                req.json(JSON.stringify(r));
            }
        }
    });
   
});
}



app.all("./show",(req, res)=>{
    
    db.find(collection,null,(err, results)=>{ // 返回集合中所有数据
        if (err) {
            res.send(502);
        }
        else{
            if(results.length !=0){
                result.info = info.user_exists;
                res_result();
            }else next()
        }
    })
    res.send('ok')
})