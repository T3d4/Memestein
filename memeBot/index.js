require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });
const TOKEN = process.env.TOKEN;
const channelID = '1085546136548421652';
const memeURL = 'https://api.imgur.com/3/gallery/search/?q=programming%20humor&type=image';
const headers = { 'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}` };

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  postContent();
  // Set the interval to 24 hours (in milliseconds)
  setInterval(postContent, 24 * 60 * 60 * 1000);
});

async function postContent() {
  try {
    const response = await axios.get(memeURL, { headers, responseType: 'json' });
    const data = response.data.data;
    const meme = data[Math.floor(Math.random() * data.length)];
    
    const embed = new Discord.EmbedBuilder()
      .setTitle(meme.title)
      .setImage(meme.images[0].link)
      .setFooter({text:`Posted by ${meme.account_url} on ${new Date(meme.datetime * 1000)}`});
    
    const channel = await client.channels.fetch(channelID);
    channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(error);
  }
}
client.login(TOKEN);
