import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Devices = new Mongo.Collection('devices');

if (Meteor.isServer) {
    Meteor.publish('devices', () => {
        return Devices.find();
    });
}
