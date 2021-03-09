import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

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
    _toggleable() {
        return !this.changed && this.connected && 'on' in this.state;
    },
});

Meteor.methods({
    'devices.move'(id, floor, x, y) {
        check(floor, Number);
        check(x, Number);
        check(y, Number);

        Devices.update(id, {$set: {location: {floor: floor, x: x, y: y}}});
    },
    'devices.unmove'(id) {
        Devices.update(id, {$unset: {location: ''}});
    },
    'devices.toggle'(id) {
        let device = Devices.findOne(id);
        if (device._toggleable()) {
            Devices.update(id, {
                $set: {'changed': true, 'state.on': !device.state.on}
            });
        }
    },
});
