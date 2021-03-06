import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

Template.makeState = function (content) {
    let instance = Template.instance();
    instance.state = new ReactiveDict();
    instance.state.setDefault(content);
};
