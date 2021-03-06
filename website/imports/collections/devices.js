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
        let defaults = {
            light: 'bi-lightbulb',
            plug: 'bi-plug',
        };

        let icon = this.icon || defaults[this.type] || 'bi-question-circle'
        if (!this.active || this.state[this.active]) {
            icon += '-fill'
        }

        return icon
    },
});

Meteor.methods({
    'devices.move'(id, x, y) {
        check(x, Match.Integer);
        check(y, Match.Integer);

        Devices.update(id, {$set: {x: x, y: y}})
    },
});
