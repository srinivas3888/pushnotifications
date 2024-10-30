const express = require('express');
const webpush = require('web-push');
const dotenv = require('dotenv').config('./config.env');
const cors = require('cors');

const app = express();
const PORT = 3000;

let corsOptions = {
    origin: '*',
    methods: ['*'],
    allowedHeaders: ['*'],
    credentials: true
};
app.use(cors(corsOptions));

// let v=webpush.generateVAPIDKeys();

// Replace with your generated VAPID keys
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails('mailto:srinivasb.temp@gmail.com', publicVapidKey, privateVapidKey);

app.use(express.json());

let subscriptions=[];

// Endpoint to handle subscription from the frontend
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);

    const notificationPayload = JSON.stringify({
        title: 'Hello from Srinivas!',
        body: 'You have a new message.',
        icon: '/fav.png',
        badge: '/fav.png'
    });

    try{
        for(let i=0; i<subscriptions.length; i++){
            webpush.sendNotification(subscriptions[i], notificationPayload);
        }
        console.log("Notifications sent to... "+subscriptions)
        res.status(201).json({ 'status': "Success in sending Notification" ,'message': "Subscription received and Notification sent..." })
    }
    catch(err){
        console.log("Error while sending Notification : "+err);
        res.status(500).json({ 'status': "Failed in sending Notification" ,'message': err });
    }
});

//Test route
app.get('/', (req, res)=>{
    res.status(200).json({'status':'Success', 'details':'HOME page'})
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${ PORT }/`);
});
