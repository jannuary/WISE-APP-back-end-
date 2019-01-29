
const dbname = "wise"

const MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = `mongodb://localhost:27017/${dbname}`;

collection = "site";


// // 查询数据
// curd.find = async (collection,whereStr=null)=>{
//     // let insertOne = this;
//     // let findData = this;
//     var result = [];
//     MongoClient.connect(DB_CONN_STR, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbname);
//         console.log("a");
//            dbo.collection(collection). find({whereStr}).toArray(function(err, results) { // 返回集合中所有数据
//                 if (err) throw err;
//                 else{
//                     result = results;
//                     console.log( "查询数据条数："+results.length);
//                 }
//                 db.close();
//             });
//         console.log('b');
//         return result;
//     });
//     console.log(result);
// };


// // 插入数据
// data = {"name":'sdf'}
// curd.insertOne = (collection,data=null)=>{
//     let result = 0;
//     MongoClient.connect(DB_CONN_STR, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbname);

//         dbo.collection(collection).insertOne(data, function(err, res) {
//             if (err) throw err;
//             else{
//                 result = res.insertedCount;
//                 console.log("插入的文档数量为: " + res.insertedCount);
//             }
//             db.close();
//         });
//     });
//     return result;
// }


// curd.insertMany = (collection,datas=null)=>{
//     let result = 0;
//     MongoClient.connect(DB_CONN_STR, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbname);

//         dbo.collection(collection).insertMany(datas, function(err, res) {
//             if (err) throw err;
//             else{
//                 result = res.insertedCount;
//                 console.log("插入的文档数量为: " + res.insertedCount);
//             }
//             db.close();
//         });
//     });
//     return result;
// }

let MongoClient_connect = (callback)=>MongoClient.connect(DB_CONN_STR, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbname);
    callback(dbo);
    db.close();
});

let curd = {
    find : (collection, whereStr, callback)=>MongoClient_connect(
      (dbo)=>dbo.collection(collection). find(whereStr).toArray(callback)
    ),

    insertOne : (collection, data, callback)=>MongoClient_connect(
        (dbo)=>dbo.collection(collection).insertOne(data,callback)
    ),

    updateOne : (collection, whereStr, updateStr, callback)=>MongoClient_connect(
        (dbo)=>dbo.collection(collection).updateOne(whereStr, updateStr, callback)
    ),
}


module.exports = curd;






