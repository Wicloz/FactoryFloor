import {Template} from 'meteor/templating';
import {Devices} from '../imports/collections/devices';
import '../imports/templates/device';
import './main.html';

Template.body.onCreated(function () {
    Meteor.subscribe('devices');
});

Template.body.helpers({
    devices() {
        return Devices.find();
    },
});
