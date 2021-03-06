import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

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
