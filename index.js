const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require('input');
require('dotenv').config();

let array_of_text = require('../empty2/data.json');
let array_of_text_new = [];

const apiID = parseInt(process.env.api_id);
const apiHash = process.env.api_hash;

const session = new StringSession(""); // You should put your string session here

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(session, apiID, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("number ?"),
    password: async () => await input.text("password?"),
    phoneCode: async () => await input.text("Code ?"),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again
  
  const c_o_n = await client.connect();// This assumes you have already authenticated with .start()

  function postMessage (){
    if (!array_of_text.length == 0){
      client.invoke(new Api.messages.SendMessage({
        peer: process.env.peer,
        message: array_of_text[0]
    }))
    array_of_text_new.push(array_of_text[0]);
    array_of_text.shift();
    
    } else {
      array_of_text = array_of_text_new
    }
 }

// Posts the messages to the group after every 5 minutes
setInterval(postMessage, 300000)
})();

