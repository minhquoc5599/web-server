import request from 'request';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import courseResponseEnum from '../../utils/enums/courseResponseEnum.js';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const chatbotService = {
  async postWebHook(req, res) {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);


        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }

      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  },

  async getWebHook(req, res) {
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);

      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  },

  async setupProfile(req, res) {
    // Construct the message body
    let request_body = {
      "get_started": { "payload": "GET_STARTED" },
      "whitelisted_domains": ["https://academy--web.herokuapp.com/"]
    }

    // Send the HTTP request to the Messenger Platform
    request({
      "uri": `https://graph.facebook.com/v11.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      console.log("####");
      console.log(request_body);
      console.log("#####");
      console.log(body);
      if (!err) {
        console.log('Setup user profile succeeded!');
      } else {
        console.error("Unable to setup profile:" + err);
      }
    });
  },
  async setupPersistentMenu(req, res) {
    // Construct the message body
    let request_body = {
      "persistent_menu": [{
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [{
          "type": "postback",
          "title": "Restart chatbot",
          "payload": "RESTART_CHATBOT"
        }]
      }]
    }

    // Send the HTTP request to the Messenger Platform
    request({
      "uri": `https://graph.facebook.com/v11.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      console.log("####");
      console.log(request_body);
      console.log("#####");
      console.log(body);
      if (!err) {
        console.log('Setup persistent menu succeeded!');
      } else {
        console.error("Unable to setup persistent menu:" + err);
      }
    });
  }
}

export default chatbotService;