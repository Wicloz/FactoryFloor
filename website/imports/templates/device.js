import './device.html';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

Template.device.onRendered(function () {
    this.$('[data-toggle="tooltip"]').tooltip()
});

Template.device.onCreated(function () {
    Template.makeState({
        dragging: false,
        offsetX: undefined,
        offsetY: undefined,
        left: undefined,
        top: undefined,

        cardShow: false,
    });

    this.drop = () => {
        document.onmouseup = undefined;
        document.onmousemove = undefined;
        Meteor.call('devices.move', this.data._id, this.state.get('left'), this.state.get('top'));
        this.state.set('dragging', false);
    };
    this.drag = (event) => {
        this.state.set('left', event.clientX - this.state.get('offsetX'));
        this.state.set('top', event.clientY - this.state.get('offsetY'));
    };

    this.autorun(() => {
        if (!this.state.get('dragging')) {
            this.state.set('left', Template.currentData().x);
            this.state.set('top', Template.currentData().y);
        }
    });
});

Template.device.events({
    'mousedown .device'(event, instance) {
        if (Session.get('EditMode')) {
            event.preventDefault();

            instance.state.set('offsetX', event.clientX - Template.currentData().x || 0)
            instance.state.set('offsetY', event.clientY - Template.currentData().y || 0)
            instance.state.set('dragging', true)

            document.onmouseup = instance.drop;
            document.onmousemove = instance.drag;
        }
    },
    'click .device'(event, instance) {
        event.preventDefault();
        instance.state.set('cardShow', !instance.state.get('cardShow'));
    },
});

Template.device.helpers({
    left() {
        return Template.instance().state.get('left');
    },
    top() {
        return Template.instance().state.get('top');
    },
    hideCard() {
        return !Template.instance().state.get('cardShow');
    },
});
