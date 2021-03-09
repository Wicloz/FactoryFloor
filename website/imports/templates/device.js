import './device.html';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

Template.device.onCreated(function () {
    Template.makeState({
        moving: false,
    });

    this.drop = (event) => {
        this.state.set('moving', false);
        document.onclick = undefined;

        if ('floor' in event.target.dataset) {
            Meteor.call(
                'devices.move',
                this.data._id,
                parseInt(event.target.dataset.floor),
                100 * (event.offsetX - this.$('.device').width() / 2) / event.target.width,
                100 * (event.offsetY - this.$('.device').height() / 2) / event.target.height,
            );
        } else {
            Meteor.call('devices.unmove', this.data._id);
        }
    };
});

Template.device.events({
    'click .device'(event, instance) {
        if (Session.get('EditMode')) {
            instance.state.set('moving', true);
            _.delay(() => {
                document.onclick = instance.drop;
            });
        }
        if (!Session.get('EditMode') && Template.currentData()._toggleable()) {
            Meteor.call('devices.toggle', Template.currentData()._id);
        }
    },
});

Template.device.helpers({
    moving() {
        return Template.instance().state.get('moving');
    },
});
