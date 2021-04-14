// Import requirements
require("dotenv").config();
const Discord = require("discord.js");
const fetch = require("node-fetch");

// Initialize discord client
const client = new Discord.Client();

// Call bot using $ or keyword
let formRegex = /^\$[a-z]+/i;
let stonkRegex = /(stonk)|(stock)/ig;

// Activate bot
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Bot functionality
client.on("message", msg => {

  // Catch error in fetch request 
  function errorHandle(response) {
    if (response.ok) {
      return response.json();
    }
    else {
      msg.reply("Invalid symbol");
      throw Error("Invalid symbol");
    }
    } 

  // Handle symbol lookups
  if (formRegex.test(msg.content)) {

    // Parse input 
    let quote = (msg.content).slice(1).toUpperCase();
    console.log(quote);

    // Contact API
    fetch(`https://cloud.iexapis.com/stable/stock/${quote}/quote?token=${process.env.API}`)
      .then(errorHandle)
      .then(data => {
        data["changePercent"] > 0 ? msg.reply(`${data["symbol"]} | ${data["companyName"]} | $${data["latestPrice"].toFixed(2)} ▲`)
          : msg.reply(`${data["symbol"]} | ${data["companyName"]} | $${data["latestPrice"].toFixed(2)} ▼`)
      })
      .catch(error => console.log(`${error} provided`));
  }

  // Handle keyword reactions
  else if (stonkRegex.test(msg.content)) {
    console.log(msg.content)
    msg.react('🚀')
      .then(console.log("TO THE MOON"))
      .catch(console.error);
  }
});

// Bot login
client.login(process.env.TOKEN);
