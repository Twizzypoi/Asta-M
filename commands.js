sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') {
        sock.sendMessage('2349027862116@c.us', {
            text: 'Hi, this is a message sent using WhiskeySockets Baileys'
        })
    }
})
sock.ev.on('messages.upsert', async (messageUpdate) => {
    const messages = messageUpdate.messages
    for (const message of messages) {
        if (!message.message || message.key.fromMe) continue
        const text = message.message.conversation
        if (text.startsWith('.') || text.startsWith('!') || text.startsWith('#') || text.startsWith('$')) {
            const command = text.split(' ')[0].slice(1)
            const args = text.slice(command.length + 2)
                .trim()
            switch (command) {
                //menu
                case 'menu':
                    sock.sendMessage(message.key.remoteJid, {
                        text: 'lol'
                    })
                    break
                    //ping bot
                case 'ping':
                    const pingStart = Date.now()
                    await sock.sendMessage(message.key.remoteJid, {
                        text: 'Pong!'
                    })
                    const pingEnd = Date.now()
                    const pingTime = pingEnd - pingStart
                    await sock.sendMessage(message.key.remoteJid, {
                        text: `Ping time: ${pingTime}ms`
                    })
                    break
                    //clear chat
                case 'clear':
                    const lastMsgInChat = await getLastMessageInChat("2349027862116@s.whatsapp.net");
                    await sock.chatModify({
                        clear: {
                            messages: [
                                {
                                    id: lastMsgInChat.id,
                                    fromMe: false,
                                    timestamp: lastMsgInChat.timestamp
                                        }
                                    , ],
                        },
                    }, "2349027862116@s.whatsapp.net", []);
                    break
                    //join group
                case 'join':
                    const groupInviteMessage = await sock.fetchStatus(args)
                    const response = await sock.groupAcceptInviteV4(args, groupInviteMessage)
                    await sock.sendMessage(message.key.remoteJid, {
                        text: "Joined to group: " + response
                    })
                    break
                    //exit group
                case 'exit':
                    await sock.groupLeave(message.key.remoteJid)
                    break
                    //edit bio
                case 'editbio':
                    await sock.updateProfile({
                        user: sock.user.id,
                        bio: args
                    })
                    break
                    //pin chat
                case 'pin':
                    await sock.sendMessage(message.key.remoteJid, {
                        action: 'pin',
                        id: message.key.id
                    })
                    break
                    //unpin chat
                case 'unpin':
                    await sock.sendMessage(message.key.remoteJid, {
                        action: 'unpin',
                        id: message.key.id
                    })
                    break
                    //unpin chats
                    case 'unpinchat':
                        const jid = message.key.remoteJid
                        const chat = sock.chats.get(jid)
                        if (chat) {
                            const unpin = {
                                action: 'unpin'
                            }
                            await sock.sendMessage(jid, unpin)
                        }
                    //archive chats
                    case 'archive':
                    const chatJid = message.key.remoteJid;
                    await sock.chatModify({ archive: true }, chatJid, []);
                    break
                    //mute chats
                    case 'mute':
                        await sock.chatModify({ mute: 8*60*60*1000 }, '123456@s.whatsapp.net', [])
                        break
                case 'echo':
                    sock.sendMessage(message.key.remoteJid, {
                        text: args
                    })
                    break
                case 'help':
                    sock.sendMessage(message.key.remoteJid, {
                        text: 'Use the following commands:\n.echo [text] - Echo the text back to you'
                    })
                    break
                default:
                    sock.sendMessage(message.key.remoteJid, {
                        text: 'Unknown command'
                    })
            }
        }
    }
})