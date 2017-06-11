const discord = require('discord.js');
const bot = new discord.Client();
const rbx = require('roblox-js')
const prefix = '!';
const cleverbot = require("cleverbot.io");
const cleverbotclient = new cleverbot('mOJEIOmBEBzOFhyj','NGRV2Y5ECvJdrwCYwxdjLX0fxG03JUeI');



function commandIs(string, msg){
  return msg.content.toLowerCase().startsWith(prefix + string);
}

bot.on('ready', function(){
  console.log('Loaded!')
  bot.user.setGame("Menthé")
  rbx.login('MentheManagement', 'Sophia223');
})

bot.on('message', function(message){
  rbx.login('MentheManagement', 'Sophia223');
let args = message.content.split(" ").slice(1);

  if(message.content.startsWith(bot.user)){
    if(args[0]){
    cleverbotclient.setNick("MENTHE_DISCORD");
    cleverbotclient.create(function(err, session){
      cleverbotclient.ask(args.join(' '), function(err, response){
        message.channel.send(response)
      })
    })
  }
  }


if(message.author.bot) return;
if(!message.content.startsWith(prefix)) return;



function doMagic8BallVoodoo() {
    var rand = ['Yes.', 'No.', 'Why are you even trying?', 'What do you think? NO', 'Maybe.', 'Never.', 'Yep!', 'Definitely!', 'Ask me again later.'];

    return rand[Math.floor(Math.random()*rand.length)];
}

if(commandIs('8ball', message)){
  if(!args[0]){
    message.channel.send('Please ask a question!')
  } else {
    message.channel.send(doMagic8BallVoodoo())
  }
}

if(commandIs('rank', message)){
  if(message.member.hasPermission('ADMINISTRATOR')){ // Put this at the top of the script for running during initialization, since it only needs to be done once. You don't have to use a .then here because we can assume that by the time someone sends a command the login has already completed.

rbx.getIdFromUsername(args[0])
.then(function (user) {
var namu = message.content.split(" ").slice(2).join(' ')
console.log(namu)
var options = {
  group: 3280471,
  target: user,
  name: namu
}
rbx.setRank(options)
.then(function (newRole) {
  message.channel.send('The new role is: ' + JSON.stringify(newRole));
});
});
}
}

  
  if(commandIs('getroles', message)){
  rbx.getRoles(args[0])
                    .then(function (roles) {
                    message.channel.send(roles)
                    }
  }
});

bot.login('MzIzMDc5ODM4NjA2OTUwNDEw.DB17Dw.1slqAIWNwOaIIVxBMOCfV2OLiu8')
