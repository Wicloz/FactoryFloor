import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check, Match} from 'meteor/check';

export const Devices = new Mongo.Collection('devices');

if (Meteor.isServer) {
    Meteor.publish('devices', () => {
        return Devices.find();
    });
}

Devices.helpers({
    _icon() {
        if (!this.active) {
            return this.icon ? this.icon : 'fa-question-circle'
        }

        if (this.state[this.active]) {
            return this.icon ? this.icon.active : 'fa-question-circle'
        } else {
            return this.icon ? this.icon.inactive : 'fa-question-circle'
        }
    },
});

Meteor.methods({
    'devices.move'(id, x, y) {
        check(x, Match.Integer);
        check(y, Match.Integer);

        Devices.update(id, {$set: {x: x, y: y}})
    },
});
