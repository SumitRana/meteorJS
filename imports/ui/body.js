import { Template } from 'meteor/templating';
import './body.html';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.body.helpers({
	tasks(){
		return Tasks.find({});
	},
	
});

Template.body.events({
	'submit .new-task'(event){
		event.preventDefault();

		const target = event.target;
		const comment = target.text.value;
		console.dir(Meteor.user());
		Tasks.insert({
			comment,
			createdate: new Date(),
			owner: Meteor.userId(),
			email: Meteor.user().emails[0].address,
		});

		target.text.value = '';
	},
});