const exec = require('child_process').exec;
const axios = require('axios');
const nstatus = require('../serverStatus');
const nUsage = require('../serverUsage');
const db = require("quick.db");
const pretty = require('prettysize');

module.exports = async(client) => {

    function formatFileSize(bytes, decimalPoint) {
        if (bytes === 0) return "0 Bytes";
        let k = 1024,
            dm = decimalPoint || 2,
            sizes = ["Bytes", "KB", "MB", "GB", "TB"],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    let guild = client.guilds.cache.get("639477525927690240");

    global.browser = await puppeteer.launch({
        args: ["--no-sandbox" /*openvz*/ ]
    });
    console.log(chalk.magenta('[DISCORD] ') + chalk.green("Chromium launched"));

    let checkNicks = () => {
        guild.members.cache.filter(member => member.displayName.match(/^[a-z0-9]/i) == null).forEach(x => {
            x.setNickname('HOISTER ALERT');
        })

        guild.members.cache.filter(member => ['hilter', 'jew', 'discord.gg', 'discordapp'].some(r => member.displayName.includes(r))).forEach(x => {
            x.setNickname('No, No name for you');
        })
    }

    checkNicks()

    console.log(chalk.magenta('[DISCORD] ') + chalk.green(client.user.username + " has logged in!"));
    //getUsers()

    //Check make sure create account channels are closed after a hour
    guild.channels.cache.filter(x => x.parentID === '898041816367128616' && (Date.now() - x.createdAt) > 1800000).forEach(x => x.delete())

    // setInterval(() => {
    //     let _codes = codes.fetchAll();
    //     client.guilds.cache.get('639477525927690240').channels.cache.get('795884677688721448').setTopic(`There's a total of ${_codes.length} active codes (${_codes.map(x => typeof x.data == 'string'? JSON.parse(x.data).balance : x.data.balance).reduce((a, b) => a + b, 0)} servers)`)
    // }, 60000);

    //Auto Activities List
    const activities = [{
        "text": "over DanBot Hosting",
        "type": "WATCHING"
    }, {
        "text": "DanBot FM",
        "type": "LISTENING"
    }];

    //Initializing Cooldown
    client.cooldown = {};

    //Automatic 30second git pull.
    setInterval(() => {
        exec(`git pull`, (error, stdout) => {
            let response = (error || stdout);
            if (!error) {
                if (response.includes("Already up to date.")) {
                    //console.log('Bot already up to date. No changes since last pull')
                } else {
                    client.channels.cache.get('898041843902742548').send('**[AUTOMATIC]** \nNew update on GitHub. Pulling. \n\nLogs: \n```' + response + "```" + "\n\n\n**Restarting bot**")
                    setTimeout(() => {
                        process.exit();
                    }, 1000)
                }
            }
        })
    }, 30000)

    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.text, {
            type: activity.type
        });
    }, 30000);

    // Voice-Channels:

    client.pvc = new Discord.Collection();

    // end of Voice-Channels

    global.invites = {};
    client.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });

    //Music stuffs
    global.guilds = {};

    //Node status channel embed
    if (enabled.NodeStats === true) {
        let channel = client.channels.cache.get("898041845878247487");
        setInterval(async() => {
            let embed = await nstatus.getEmbed();

            let messages = await channel.messages.fetch({
                limit: 10
            })
            messages = messages.filter(x => x.author.id === client.user.id).last();
            if (messages == null) channel.send(embed)
            else messages.edit(embed)

        }, 15000)
    }

    if (enabled.NodeStats === true) {
        let channel = client.channels.cache.get("898041847363035157");
        setInterval(async() => {
            let embed = await nUsage.getEmbed();

            let messages = await channel.messages.fetch({
                limit: 10
            })
            messages = messages.filter(x => x.author.id === client.user.id).last();
            if (messages == null) channel.send(embed)
            else messages.edit(embed)

        }, 15000)
    }

    //Voice channel stats updator
    setInterval(async() => {
        let DBHGuild = client.guilds.cache.get("639477525927690240");
        let roleID1 = '898041751099539497';
        let staffCount = DBHGuild.roles.cache.get(roleID1).members.size;
        client.channels.cache.get("898041828870348800").edit({
            name: `Staff: ${staffCount}`,
            reason: "Staff count update"
        });

        let roleID2 = '898041757168697375';
        let memberCount = DBHGuild.roles.cache.get(roleID2).members.size;
        client.channels.cache.get("898041827561730069").edit({
            name: `Members: ${memberCount}`,
            reason: "Member count update"
        });

        let roleID3 = '898041770082959432';
        let botCount = DBHGuild.roles.cache.get(roleID3).members.size;
        client.channels.cache.get("898041830241882112").edit({
            name: `Bots: ${botCount}`,
            reason: "Bot count update"
        });

        client.channels.cache.get("898041826810949632").edit({
            name: `Total Members: ${DBHGuild.memberCount}`,
            reason: "TMembers count update"
        });

        /*
        Node Stats Channels
        */

        const cpucores =
            parseFloat(nodeData.fetch("Node1.cputhreads")) +
            parseFloat(nodeData.fetch("Node2.cputhreads")) +
            parseFloat(nodeData.fetch("Node3.cputhreads")) +
            parseFloat(nodeData.fetch("Node4.cputhreads")) +
            parseFloat(nodeData.fetch("Node5.cputhreads")) +
            parseFloat(nodeData.fetch("Node6.cputhreads")) +
            parseFloat(nodeData.fetch("Node7.cputhreads")) +
            parseFloat(nodeData.fetch("Node8.cputhreads")) +
            parseFloat(nodeData.fetch("Node9.cputhreads")) +
            parseFloat(nodeData.fetch("Node10.cputhreads")) +
            parseFloat(nodeData.fetch("Node11.cputhreads")) +
            parseFloat(nodeData.fetch("Node12.cputhreads")) +
            parseFloat(nodeData.fetch("Node13.cputhreads")) +
            parseFloat(nodeData.fetch("Node14.cputhreads")) +
            parseFloat(nodeData.fetch("Node15.cputhreads")) +
            parseFloat(nodeData.fetch("Node16.cputhreads")) +
            parseFloat(nodeData.fetch("Storage1.cputhreads"));
        const getMemory =
            formatFileSize(
                parseFloat(nodeData.fetch("Node1.memusedraw")) +
                parseFloat(nodeData.fetch("Node2.memusedraw")) +
                parseFloat(nodeData.fetch("Node3.memusedraw")) +
                parseFloat(nodeData.fetch("Node4.memusedraw")) +
                parseFloat(nodeData.fetch("Node5.memusedraw")) +
                parseFloat(nodeData.fetch("Node6.memusedraw")) +
                parseFloat(nodeData.fetch("Node7.memusedraw")) +
                parseFloat(nodeData.fetch("Node8.memusedraw")) +
                parseFloat(nodeData.fetch("Node9.memusedraw")) +
                parseFloat(nodeData.fetch("Node10.memusedraw")) +
                parseFloat(nodeData.fetch("Node11.memusedraw")) +
                parseFloat(nodeData.fetch("Node12.memusedraw")) +
                parseFloat(nodeData.fetch("Node13.memusedraw")) +
                parseFloat(nodeData.fetch("Node14.memusedraw")) +
                parseFloat(nodeData.fetch("Node15.memusedraw")) +
                parseFloat(nodeData.fetch("Storage1.memusedraw"))
            ) +
            " / " +
            formatFileSize(
                Math.floor(
                    parseFloat(nodeData.fetch("Node1.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node2.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node3.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node4.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node5.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node6.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node7.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node8.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node9.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node10.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node11.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node12.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node13.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node14.memtotalraw")) +
                    parseFloat(nodeData.fetch("Node15.memtotalraw")) +
                    parseFloat(nodeData.fetch("Storage1.memtotalraw"))
                ),
                1
            );

        const getDisc1 = formatFileSize(
            parseFloat(nodeData.fetch("Node1.diskusedraw")) +
            parseFloat(nodeData.fetch("Node2.diskusedraw")) +
            parseFloat(nodeData.fetch("Node3.diskusedraw")) +
            parseFloat(nodeData.fetch("Node4.diskusedraw")) +
            parseFloat(nodeData.fetch("Node5.diskusedraw")) +
            parseFloat(nodeData.fetch("Node6.diskusedraw")) +
            parseFloat(nodeData.fetch("Node7.diskusedraw")) +
            parseFloat(nodeData.fetch("Node8.diskusedraw")) +
            parseFloat(nodeData.fetch("Node9.diskusedraw")) +
            parseFloat(nodeData.fetch("Node10.diskusedraw")) +
            parseFloat(nodeData.fetch("Node11.diskusedraw")) +
            parseFloat(nodeData.fetch("Node12.diskusedraw")) +
            parseFloat(nodeData.fetch("Node13.diskusedraw")) +
            parseFloat(nodeData.fetch("Node14.diskusedraw")) +
            parseFloat(nodeData.fetch("Node15.diskusedraw")) +
            parseFloat(nodeData.fetch("Storage1.diskusedraw")),
            2
        );
        const getDisc2 = formatFileSize(
            parseFloat(nodeData.fetch("Node1.disktotalraw")) +
            parseFloat(nodeData.fetch("Node2.disktotalraw")) +
            parseFloat(nodeData.fetch("Node3.disktotalraw")) +
            parseFloat(nodeData.fetch("Node4.disktotalraw")) +
            parseFloat(nodeData.fetch("Node5.disktotalraw")) +
            parseFloat(nodeData.fetch("Node7.disktotalraw")) +
            parseFloat(nodeData.fetch("Node8.disktotalraw")) +
            parseFloat(nodeData.fetch("Node9.disktotalraw")) +
            parseFloat(nodeData.fetch("Node10.disktotalraw")) +
            parseFloat(nodeData.fetch("Node11.disktotalraw")) +
            parseFloat(nodeData.fetch("Node12.disktotalraw")) +
            parseFloat(nodeData.fetch("Node13.disktotalraw")) +
            parseFloat(nodeData.fetch("Node14.disktotalraw")) +
            parseFloat(nodeData.fetch("Node15.disktotalraw")) +
            parseFloat(nodeData.fetch("Storage1.disktotalraw")),
            2
        );

        //CPU
        client.channels.cache.get("898041823392587846").edit({
            name: `CPU: ${cpucores} cores`,
            reason: "CPU Cores update"
        });

        //RAM
        client.channels.cache.get("898041824730574848").edit({
            name: `RAM: ${getMemory}`,
            reason: "Total Ram Update"
        });

        //SSD
        client.channels.cache.get("898041825816879114").edit({
            name: `SSD: ${getDisc1} / ${getDisc2}`,
            reason: "Total Disk Update"
        });

        //END

        const ticketcount = DBHGuild.channels.cache.filter(x => x.name.endsWith("-ticket")).size
        client.channels.cache.get("898041832569700362").edit({
            name: `Tickets: ${ticketcount}`,
            reason: "Ticket count update"
        })

        axios({
            url: config.Pterodactyl.hosturl + "/api/application/servers",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            client.channels.cache.get("898041817503760444").edit({
                name: `Servers Hosting: ${response.data.meta.pagination.total}`,
                reason: "Server count update"
            })
        });

        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            client.channels.cache.get("898041820309778462").edit({
                name: `Clients Hosting: ${response.data.meta.pagination.total}`,
                reason: "Client count update"
            })
        });
        client.channels.cache.get("898041831495974983").edit({
            name: `Boosts: ${DBHGuild.premiumSubscriptionCount}`,
            reason: "Boosts count update"
        })
    }, 30000);
};
