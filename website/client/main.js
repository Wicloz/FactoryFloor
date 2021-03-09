import {Template} from 'meteor/templating';
import {Devices} from '../imports/collections/devices';
import '../imports/templates/device';
import './main.html';
import {Session} from 'meteor/session';

Template.body.onCreated(function () {
    Meteor.subscribe('devices');
    Session.set('EditMode', false);
});

Template.body.helpers({
    devices(floor) {
        return Devices.find({'location.floor': floor});
    },
});

Template.body.events({
    'change #editModeToggle'(event) {
        Session.set('EditMode', event.target.checked);
    },
});
