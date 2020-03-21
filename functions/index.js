const functions = require('firebase-functions');

const admin=require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var msgData;
exports.offersTrigger=functions.firestore.document('offers/{offerId}').onCreate(async(snapshot,context)=>{
    msgData=snapshot.data();

    admin.firestore().collection('pushtokens').get().then((snapshots)=>
    {
        var tokens=[];
        if(snapshots.empty){
            console.log("No devices");
        }else{
            for (var token of snapshots.docs){
                tokens.push(token.data().devtoken);
            }
            var payload={
                "notification":{
                    "title":"From " +msgData.businessName,
                    "body":"Offer "+msgData.offer,
                    "sound":"default"
                },
               "data":{
                    "sendername": msgData.businessName,
                    "message": msgData.offer,
                    
                }
            }
            return admin.messaging().sendToDevice(tokens,payload).then((response)=>{
                console.log("pushed them all");

            }).catch((err)=>{
                console.log(err);
            })
        }
    }
    )
})
