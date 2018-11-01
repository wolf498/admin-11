//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('config');
const subBots = require('../../../../src/lib/sub-bots/sub-bots.js');

describe('sub-bots/sub-bots.js', function() {
    const original = config.get('subBots');

    it('should have the function "logout"', function() {
        subBots.should.have.property('logout');
        subBots.logout.should.be.a('function');
    });

    it('should have the function "passBot"', function() {
        subBots.should.have.property('passBot');
        subBots.passBot.should.be.a('function');
    });

    it('should have the function "ready"', function() {
        subBots.should.have.property('ready');
        subBots.ready.should.be.a('function');
    });

    it('subBots should be an object', function() {
        original.should.be.a('object');
    });

    it('subBots object should have multiple subBots', function() {
        Object.keys(original).length.should.be.above(1);
    });

    it('subBots should have id and token properties', function() {
        if (!Object.keys(original).length) { this.skip(); }
        for (let x in original) {
            original[x].should.have.property('id');
            original[x].should.have.property('token');
        }
    });

    it('subBots object should have id and token strings', function() {
        if (!Object.keys(original).length) { this.skip(); }
        for (let x in original) {
            original[x].id.should.be.a('string');
            original[x].token.should.be.a('string');
        }
    });

    describe('log a subBot in and out', function() {
        let bot = false;

        before(function(done) {
            this.timeout(10000);
            subBots.passBot()
                .then(passed => {
                    bot = passed;
                    done();
                })
                .catch(err => {
                    console.log(err);
                    done();
                });
        });

        it('bot should have logged in correctly', function() {
            bot.should.not.be.false;
            bot.user.id.should.be.a('string');
        });

        it('subBot module should accept bot to log out', function() {
            subBots.logout(bot).should.be.true;
        });
    });

    // Test doesn't work as subbots object in the config is not the same object
    // as the one used in sub-bots.js file anymore due to config being immutable
    //
    // describe('test passBot rejection due to disabled feature', function() {
    //     let result = false;
    //
    //     before(function(done) {
    //         result = false;
    //         Faker.setFakeProperty('subBots', {});
    //         subBots.passBot()
    //             .then(passed => {
    //                 subBots.logout(passed);
    //                 done();
    //                 Faker.resetFake();
    //             })
    //             .catch(err => {
    //                 result = err;
    //                 done();
    //                 Faker.resetFake();
    //             });
    //     });
    //
    //     it('should reject if feature disabled', function() {
    //         result.should.not.be.false;
    //         result.should.eql('The sub bot feature is disabled or there are no subBots on file');
    //     });
    // });

    describe('test passBot rejection due to exceeded limit', function() {
        const limit = config.get('subBotLimit');
        let result = false;

        before(function(done) {
            result = false;
            Faker.setFakeProperty('subBotLimit', -1);
            subBots.passBot()
                .then(passed => {
                    subBots.logout(passed);
                    done();
                    Faker.resetFake();
                })
                .catch(err => {
                    result = err;
                    done();
                    Faker.resetFake();
                });
        });

        it('should reject if feature disabled', function() {
            result.should.not.be.false;
            result.should.eql('The maximum number of subBots are currently running');
        });
    });
});
