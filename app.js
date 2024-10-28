const express = require('express');
const webpush = require('web-push');
const dotenv = require('dotenv').config('./config.env');

const app = express();
const PORT = 3000;

// let v=webpush.generateVAPIDKeys();

// Replace with your generated VAPID keys
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails('mailto:srinivasb.temp@gmail.com', publicVapidKey, privateVapidKey);

app.use(express.json());

let subscriptions = [];

// Endpoint to handle subscription from the frontend
app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    // Add the subscription object to the list
    subscriptions.push(subscription);

    res.status(201).json({ message: 'Subscription received' });
});

// Endpoint to send a push notification manually
app.get('/send-notification', (req, res) => {
    const notificationPayload = JSON.stringify({
        title: 'Hello from Srinivas!',
        body: 'You have a new message.'
    });

    const promises = subscriptions.map(subscription =>
        webpush.sendNotification(subscription, notificationPayload)
    );

    Promise.all(promises)
        .then(() => res.status(200).json({ message: 'Notifications sent' }))
        .catch(err => {
            console.error('Error sending notification:', err);
            res.sendStatus(500);
        });
});

app.get('/', (req, res)=>{
    res.status(200).json({'status':'Success', 'details':'HOME page'})
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${ PORT }/`);
});
