const discord = require('discord.js');
const rbx = require('roblox-js');
const fs = require('fs');
const cleverbot = require("cleverbot.io");
const cleverbotclient = new cleverbot("mOJEIOmBEBzOFhyj", "NGRV2Y5ECvJdrwCYwxdjLX0fxG03JUeI");
const exec = require('child_process').exec;

const bot = new discord.Client();
var maintenance = false;


function loadSettings(gid){
  return JSON.parse(fs.readFileSync('./data/'+gid+'.json'))
}



settings = {
  prefix: '?',
  vip: false,
  annchannel: '',
  modrole: "",
  disabledcommands: ['None'],
  username: "",
  password: "",
  groupid: ""
}


debuginfo = {
  version: '1.1',
  developers: 'emily + lizzie <3',
  developmentbuild: 'false'
}



bot.on('guildCreate', function(guild){
  if(!fs.existsSync('./data/'+guild.id+'.json')){
    var set = JSON.stringify(settings)
  fs.writeFile('./data/'+guild.id+'.json', set, 'utf8')
}})


bot.on('ready', function(){
  console.log('Logged in!')
  bot.user.setGame(bot.guilds.array().length+' servers! Made by Emily#5429')
});

bot.on('warn', function(info){
  var em = new discord.RichEmbed()
  .setDescrption(info)
  .setFooter('Need help? Use the ?support command!')
  var guild = bot.guilds.find('id', '319013884478619648')
  var chan = guild.channels.find('id', '321295827312181248')
  chan.sendEmbed(em)
  }
)

bot.on('message', function(message){


  bot.user.setGame(bot.guilds.array().length+' servers! Made by Emily#5429')
const info = loadSettings(message.guild.id)

let args = message.content.split(" ").slice(1);

function commandIs(string, msg){
return msg.content.toLowerCase().startsWith(info.prefix + string)
}


  if(message.content.startsWith(bot.user)){
    if(info.vip === true){
    if(args[0]){
    cleverbotclient.setNick("emibot");
    cleverbotclient.create(function(err, session){
      cleverbotclient.ask(args.join(' '), function(err, response){
        message.channel.send(response)
        message.channel.send(err)
      })
    })
  }
}
  }


  if(message.author.bot) return;
  if (!message.content.startsWith(info.prefix)) return;



  var guild = bot.guilds.find('id', '319013884478619648')
  var channel = guild.channels.find('id', '322093705253093397')
  var emb = new discord.RichEmbed()
  emb.addField('Command', message.content, false)
  emb.addField('User', message.author + ' **(' + message.author.username + '#' + message.author.discriminator + ')**')
  emb.addField('Guild', message.guild + ', ID: ' + message.guild.id)
  emb.setColor('#C212CD')
  emb.setDescription('Command Usage')
  emb.setFooter('If you find anyone abusing report to a developer immediately.')
  channel.sendEmbed(emb)



  if(commandIs('sinfo', message)){
    var id = message.guild.id
    var ownerid = message.guild.owner.id
    var oname = message.guild.owner.user
    message.channel.send('ID: ' + id + ', OwnerID: ' + ownerid + ', Owner: ' + oname)
  }

  if(commandIs('getid', message)){
    var userid = message.mentions.users.first()
    message.channel.send('User ID: '+userid.id)
  }

  if(commandIs('ping', message)){
    message.channel.send('Ping: '+bot.ping+'ms')
  }

  if(commandIs('suggest', message)){
    var chans = bot.channels.array()
    var channel  = bot.channels.find('name', 'suggestions')
    if(channel.id === '321010680021123072'){
      var chanchan = channel
      var embed = new discord.RichEmbed()
      .setDescription('Request')
      .addField('Suggestion', args.join(' '))
      .addField('Channel ID', message.channel.id)
      .addField('Guild ID', message.guild.id)
      .addField('Guild', message.guild.name)
      .addField('User', message.member +' **(' +  message.author.username + '#' + message.author.discriminator + ')**')
      .setColor('#7512CD')
      .setFooter('This is a suggestion.')
      chanchan.sendEmbed(embed)
  }}

  if(commandIs('invite', message)){
    message.channel.send('https://discordapp.com/oauth2/authorize?client_id=320959513270157313&scope=bot&permissions=2146958591')
  }

  if(commandIs('server', message)){
    message.channel.send('https://discord.gg/vU4u578')
  }

  if(commandIs('allguilds', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '319040853983232009')){
      var guilds = bot.guilds.array()
      guilds.forEach(function(item, index, array){
        message.channel.send('Guild: ' + item)
      })
    } else {
      message.channel.send('Permission not found, sorry boo!')
    }
  }

  if(commandIs('listroles', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '321012416802586634') || mem.roles.find('id', '319040853983232009')){
      var guilds = message.guild.roles.array()
      guilds.forEach(function(item, index, array){
        message.channel.send('Role: ' + item.name)
      })
    } else {
      message.channel.send('Permission not found, sorry boo!')
    }
  }

  if(commandIs('say', message)){
    if(info.modrole){
    if(message.member.roles.find('name', info.modrole)){
      if(info.disabledcommands.indexOf('say') === -1){
      message.channel.send(args.join(' '))
    } else {
      message.channel.send("An administrator of this guild has disabled the 'say' command.")
    }}
  } else {
    if(message.member.hasPermission('ADMINISTRATOR')){
      message.channel.send(args.join(' '))
    }
  }
  }


  if(commandIs('restart', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '321012416802586634') || mem.roles.find('id', '319040853983232009')){
      message.channel.send('Restarting...')
      bot.destroy()
      var cmd = 'pm2 restart 0'
      exec(cmd, function(error, stdout, stderr) {
        message.channel.send(stdout)
        message.channel.send(error)
        message.channel.send(stderr)
      })
      bot.login('MzIwOTU5NTEzMjcwMTU3MzEz.DBXEWg.5KEz1T2HC5u8ZynncwIyWdeFztc')
      console.log('Back up!')
      message.channel.send('Successfully restarted by ' + message.author)
    } else {
      message.channel.send('Permission not found, sorry boo!')
    }
  }

  if(commandIs('announce', message)){
    var guild = message.guild
    if(info.annchannel){
      if(info.modrole){
        if(message.member.roles.find('name', info.modrole) || message.member.hasPermission('ADMINISTRATOR')){
          var chan = guild.channels.find('name', info.annchannel)
          chan.send(args.join(' '))
        }
      } else {
      if(message.member.hasPermission('ADMINISTRATOR')){
      var chan = guild.channels.find('name', info.annchannel)
      chan.send(args.join(' '))}
    }
  } else {
    message.channel.send('No channel found!')
  }
    }

  if(commandIs('setavatar', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '319040853983232009')){
      bot.user.setAvatar(args[0])
    } else {
      message.channel.send('Only bot developers can edit the avatar.')
    }
  }

  if(commandIs('prefix', message)){
    if(!args[0]){
      message.channel.send('Must specify a prefix. Current prefix is: ' + info.prefix)
    } else {
    if(message.member.hasPermission('ADMINISTRATOR')){
      newset = {
        prefix: args[0],
        vip: info.vip,
        annchannel: info.annchannel,
        modrole: info.modrole,
        disabledcommands: info.disabledcommands
      }
      var setttin = JSON.stringify(newset)
      fs.writeFile('./data/'+message.guild.id+'.json', setttin, 'utf8')
      console.log('Prefix changed!')
      message.channel.send("Prefix successfully changed to: " + args[0])
    } else {
      message.channel.send('Permission not found, sorry! Current prefix is: ' + info.prefix)
    }
    }
  }

  if(commandIs('debug', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '320964280990040076') || mem.roles.find('id', '319040853983232009') || mem.roles.find('id', '321012416802586634')){
      var gid = message.guild.id
      var content = JSON.parse(fs.readFileSync('./data/'+gid+'.json'))
      var embed = new discord.RichEmbed()
      .setDescription('Debug Information')
      .addField('Prefix', content.prefix, true)
      .addField('VIP', content.vip, false)
      if(content.annchannel){
      embed.addField('Announcement Channel', content.annchannel, false)}
      if(content.modrole){
      embed.addField('Mod Role', content.modrole, false)}
      embed.addField('Disabled Commands', content.disabledcommands, false)
      embed.setColor('#2456D1')
      embed.setFooter('Requested by ' + message.author.username + '#' + message.author.discriminator)
      message.channel.sendEmbed(embed)
    }
  }

  if(commandIs('mod', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '320964280990040076') || mem.roles.find('id', '321012416802586634') || mem.roles.find('id', '319040853983232009')){
      var emm = new discord.RichEmbed()
      .setDescription('This person is a **LEGITIMATE** moderator for EmiBot!! If they are abusing please contact Emily#5429.')
      .setColor('#16D316')
      .setFooter('Approved by EmiBot!')
      message.channel.sendEmbed(emm)
    } else {
      var emm3 = new discord.RichEmbed()
      .setDescription('This person is not a moderator for EmiBot, do not trust them.')
      .setColor('#D31616')
      .setFooter('False moderator!')
      message.channel.sendEmbed(emm3)
    }
  }

  if(commandIs('setann', message)){
    if(!args[0]){
      message.channel.send('Must specify a channel. Current channel is: ' + info.annchannel)
    } else {
    if(message.member.hasPermission('ADMINISTRATOR')){
      var guild = message.guild
      if(guild.channels.find('name', args[0])){
      newset = {
        prefix: info.prefix,
        vip: info.vip,
        annchannel: args[0],
        modrole: info.modrole,
        disabledcommands: info.disabledcommands
      }
      var setttin = JSON.stringify(newset)
      fs.writeFile('./data/'+message.guild.id+'.json', setttin, 'utf8')
      console.log('Prefix changed!')
      message.channel.send("Channel successfully changed to: " + args[0])
    } else {
      message.channel.send("Channel doesn't exist... current channel is: " + info.annchannel)
    }
  } else {
      message.channel.send('Must be administrator, sorry! Current channel is: ' + info.annchannel)
    }
    }
  }

  if(commandIs('setmod', message)){
    if(!args[0]){
      message.channel.send('Must specify a role! Current role is: ' + info.modrole)
    } else {
      if(message.member.hasPermission('ADMINISTRATOR')){
        var guild = message.guild
        if(guild.roles.find('name', args.join(' '))){
          newset = {
            prefix: info.prefix,
            vip: info.vip,
            annchannel: info.annchannel,
            modrole: args.join(' '),
            disabledcommands: info.disabledcommands
          }
          var setttin = JSON.stringify(newset)
          fs.writeFile('./data/'+message.guild.id+'.json', setttin, 'utf8')
          console.log('role changed!')
          message.channel.send("Mod role successfully changed to: " + args.join(' '))
        } else {
          if(args[0] === 'none'){
            setset = {
              prefix: info.prefix,
              vip: info.vip,
              annchannel: info.annchannel,
              modrole: ''
            }
            var abn = JSON.stringify(setset)
            fs.writeFile('./data/'+message.guild.id+'.json', abn, 'utf8')
            console.log('role changed!')
            message.channel.send('Cleared mod role!')
          } else {
            message.channel.send('Role not found!')
          }
        }
      } else {
        message.channel.send('Must be a server administrator to set a mod role!')
      }
    }
  }

  if(commandIs('guilds', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '321012416802586634')){
      var em = new discord.RichEmbed()
      .addField('Guilds', bot.guilds.array().length)
      .setColor('#D31616')
      message.channel.sendEmbed(em)
    }
  }


  if(commandIs('support', message)){
    if(args[0]){
    var guild = bot.guilds.find('id', '319013884478619648')
    var chan = guild.channels.find('id', '321295827312181248')
    var gid = message.guild.id
    var userid = message.author.id
    var chanid = message.channel.id
    var information = args.join(' ')
    var embed = new discord.RichEmbed()
    .setDescription('Support request submitted by ' + message.author + ' **(' + message.author.username + '#' + message.author.discriminator+ ')**')
    .addField('Guild ID', gid)
    .addField('Channel ID', chanid)
    .addField('User ID', chanid)
    .addField('Support Request', information)
    .setColor('#16D3D3')
    .setFooter('Please respond to this support request immediately if not taken.')
    chan.sendEmbed(embed)
    message.channel.send('Support request submitted!')
  } else {
    message.channel.send('Please add a valid support request!')
  }
}

function doMagic8BallVoodoo() {
    var rand = ['Yes.', 'No.', 'Why are you even trying?', 'What do you think? NO', 'Maybe.', 'Never.', 'Yep!', 'Definitely!', 'Ask me again later.'];

    return rand[Math.floor(Math.random()*rand.length)];
}



if(commandIs('8ball', message)){
if(!args[0]){
message.channel.send('Please ask a question then try again.')
} else {
  if(info.vip === true){
  if(info.disabledcommands.indexOf('8ball') === -1){
message.channel.send(doMagic8BallVoodoo())
} else {
  message.channel.send("An administrator of this guild has disabled the '8ball' command.")
}
} else {
  message.channel.send('**Only VIP servers have access to this command.**')
}
}
}

var commandsToDisable = ['8ball', 'say']


if(commandIs('disable', message)){
  if(!args[0]){
    message.channel.send('Must specify a command! Current commands are: ' + info.disabledcommands)
  } else {
    if(message.member.hasPermission('ADMINISTRATOR')){
      var guild = message.guild
      var commandsToDisable = ['8ball', 'say']
      if(commandsToDisable.indexOf(args.join(' ')) > -1){
        var currentcommands = info.disabledcommands
        if(currentcommands.indexOf(args.join(' ')) === -1){
        currentcommands.push(args.join(' '))} else {
          message.channel.send('That command is already disabled!')
        }

        var newcommands = currentcommands


        newset = {
          prefix: info.prefix,
          vip: info.vip,
          annchannel: info.annchannel,
          modrole: info.modrole,
          disabledcommands: newcommands
        }
        var setttin = JSON.stringify(newset)
        fs.writeFile('./data/'+message.guild.id+'.json', setttin, 'utf8')
        console.log('role changed!')
        message.channel.send("Command added: " + args.join(' '))
      } else {
        if(args[0] === 'none'){
          setset = {
            prefix: info.prefix,
            vip: info.vip,
            annchannel: info.annchannel,
            modrole: info.modrole,
            disabledcommands: ['None']
          }
          var abn = JSON.stringify(setset)
          fs.writeFile('./data/'+message.guild.id+'.json', abn, 'utf8')
          console.log('role changed!')
          message.channel.send('Enabled all commands!')
        } else {
          message.channel.send('Command not found!')
        }
      }
    } else {
      message.channel.send('Must be a server administrator to disable a command!')
    }
  }
}

  if(commandIs('makevip', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '319040853983232009')){
      setset = {
        prefix: info.prefix,
        vip: true,
        annchannel: info.annchannel,
        modrole: info.modrole,
        disabledcommands: info.disabledcommands
      }
      var abn = JSON.stringify(setset)
      fs.writeFile('./data/'+message.guild.id+'.json', abn, 'utf8')
      message.channel.send('Successfully made **' + message.guild.name + '** a VIP server!')
    }
  }

  if(commandIs('reload', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '319040853983232009')){
      loadSettings(message.guild.id)
      message.channel.send('Reloaded commands and settings successfully!')
    }
  }


  if(commandIs('exec', message)){
    var guild = bot.guilds.find('id', '319013884478619648')
    var mem = guild.members.find('id', message.member.id)
    if(!mem) return;
    if(mem.roles.find('id', '319040853983232009')){
      var cmd = args.join(' ')
      exec(cmd, function(error, stdout, stderr) {
        message.channel.send(stdout)
      })
  // command output is in stdout

    }
  }

  if(commandIs('userinfo', message)){
    var user = message.mentions.users.first()
    var emb = new discord.RichEmbed()
    emb.addField('Name', user.username + '#' + user.discriminator)
    emb.addField('Created At', user.createdAt)
    emb.addField('Status', user.presence.status)
    if(user.presence.game){
      emb.addField('Game', user.presence.game.name)
    }
    emb.setDescription('User Info')
    emb.setFooter('This is basic information for ' + user)
    emb.setColor('#12C7CD')
    message.channel.sendEmbed(emb)
  }

if(commandIs('dm', message)){
  message.member.send('Hi there, **' + message.member + '**, this is **EmiBot** a new discord bot created by Emily and Keranique.')
}

  if(commandIs('rank', message)){
    if(info.username && info.password && info.groupid){
   rbx.login(info.username, info.password); // Put this at the top of the script for running during initialization, since it only needs to be done once. You don't have to use a .then here because we can assume that by the time someone sends a command the login has already completed.

rbx.getIdFromUsername(args[0])
.then(function (user) {
  var namu = message.content.split(" ").slice(2).join(' ')
  console.log(namu)
  var options = {
    group: info.groupid,
    target: user,
    name: namu
  }
  rbx.setRank(options)
  .then(function (newRole) {
    message.channel.send('The new role is: ' + JSON.stringify(newRole));
  });
}); 
  } else {
       message.channel.send('No user account has been linked or you have not provided a group id.')
       }
} 
});

bot.login('MzIwOTU5NTEzMjcwMTU3MzEz.DB63Kg.2zNs4M0ICzHiVuYrehZj1mYZbnM')
