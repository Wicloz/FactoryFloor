import './device.html';
import {Template} from 'meteor/templating';

Template.device.events({
    'mousedown .device'(event) {
        console.log(event);
    },
});
