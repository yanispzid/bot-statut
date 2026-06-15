const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

const ROLE_ID = '1516115814837649509';
const TRIGGER_STATUS = '/kotei';

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} !`);
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
    if (!newPresence || !newPresence.member) return;

    const member = newPresence.member;
    const customActivity = newPresence.activities.find(activity => activity.type === 4); 
    const statusText = customActivity ? customActivity.state : '';

    try {
        if (statusText && statusText.includes(TRIGGER_STATUS)) {
            if (!member.roles.cache.has(ROLE_ID)) {
                await member.roles.add(ROLE_ID);
                console.log(`Rôle ajouté à ${member.user.tag}`);
            }
        } else {
            if (member.roles.cache.has(ROLE_ID)) {
                await member.roles.remove(ROLE_ID);
                console.log(`Rôle retiré à ${member.user.tag}`);
            }
        }
    } catch (error) {
        console.error(`Erreur pour ${member.user.tag}:`, error);
    }
});

client.login(process.env.DISCORD_TOKEN);
