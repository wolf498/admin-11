//  Copyright © 2018 DIG Development Team. All rights reserved.

// REPLACE THE BELOW WITH YOUR CONFIG! This file shouldn't be version controlled.

(function() {
    module.exports = {
        mappings: {
            chitChatVoice: '486323117686390789',
            developers: '486324227142713344',
            digbot: '486324268137840649',
            digBotLog: '486324290665578526',
            events: '486324076017745967',
            general: '486324123069579274',
            herebedragons: '486324191868747777',
            staff: '486324059311833089',
            streams: '486324208515678228'
        },
        //Array and Object configs
        /*
            Text Channel ordering:
            Primary generals (general, staff, announcments)
            Community games (ps2, overwatch)
            Secondary generals (media, herebedragons)
            Recreational games (stellaris, eu4, doesn't have to be official recreational)
            Event channels (-e-)
            Temp channels (-t-)
            Whatever else (should be nothing)

            Voice:
            General
            Community games
            Recreational games
            Event channels (-e-)
            Temp channels (-t-)
            Whatever else (should be nothing)
        */
        positions: {
            text: {
                announcements: {
                    id: '486323315401818112',
                    name: 'announcements',
                    position: 1
                },
                rulesinfo: {
                    id: '486324041095839754',
                    name: 'rules-info',
                    position: 2
                },
                staff: {
                    id: '486324059311833089',
                    name: 'staff',
                    position: 3
                },
                events: {
                    id: '486324076017745967',
                    name: 'events',
                    position: 4
                },
                general: {
                    id: '486324123069579274',
                    name: 'entrance-general',
                    position: 5
                },
                ps2: {
                    id: '486324138940825610',
                    name: 'ps2',
                    position: 6
                },
                tts: {
                    id: '486324151838179349',
                    name: 'tts',
                    position: 15
                },
                media: {
                    id: '486324167113834498',
                    name: 'media',
                    position: 16
                },
                hereBeDragons: {
                    id: '486324191868747777',
                    name: 'herebedragons',
                    position: 17
                },
                streams: {
                    id: '486324208515678228',
                    name: 'streams',
                    position: 18
                },
                developers: {
                    id: '486324227142713344',
                    name: 'developers',
                    position: 19
                },
                developersArt: {
                    id: '486324245916418049',
                    name: 'developers-art',
                    position: 20
                },
                digbotspam: {
                    id: '486324268137840649',
                    name: 'digbot',
                    position: 21
                },
                digbotLog: {
                    id: '486324290665578526',
                    name: 'digbot-log',
                    position: 22
                },
                stellaris: {
                    id: '486324305915936769',
                    name: 'stellaris',
                    position: 23
                }
            },
            voice: {
                general: {
                    id: '486323117686390789',
                    name: '💬 Chit Chat',
                    position: 1
                },
                staff: {
                    id: '486324472836522004',
                    name: '👔 Staff',
                    position: 2
                },
                ps2DigMCS: {
                    id: '486324517279629322',
                    name: '🎮 PS2/DIG/1',
                    position: 3
                },
                ps2DigtMCS: {
                    id: '486324583062962201',
                    name: '🎮 PS2/DIGT/1',
                    position: 103
                },
                recMCS: {
                    id: '486324659134922752',
                    name: '🎮 Rec/1',
                    position: 406
                },
                afk: {
                    id: '486324707126411266',
                    name: '💤 AFK',
                    position: null
                }
            }
        }
    };
}());
