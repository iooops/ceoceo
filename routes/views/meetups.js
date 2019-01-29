var keystone = require('keystone'),
	moment = require('moment'),
	RSVP = keystone.list('RSVP');

var Meetup = keystone.list('Meetup');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'meetups';
	locals.page.title = 'Meetups - CEO';

	view.query('upcomingMeetup',
		Meetup.model.findOne()
			.where('state', 'active')
			.sort('-startDate')
	, 'talks[who]');

	view.query('upcomingMeetups',
		Meetup.model.find()
			.where('state', 'active')
			.sort('-startDate')
	, 'talks[who]');

	view.query('pastMeetups',
		Meetup.model.find()
			.where('state', 'past')
			.sort('-startDate')
	, 'talks[who]');

	view.on('render', function(next) {

		if (!req.user || !locals.upcomingMeetups) return next();

		RSVP.model.find()
			.where('who', req.user._id)
			.where('meetup')
			.in(locals.upcomingMeetups)
			.exec(function(err, rsvps) {
				// locals.rsvpStatus = {
				// 	rsvped: rsvp ? true : false,
				// 	attending: rsvp && rsvp.attending ? true : false
				// }
				locals.upcomingMeetups = locals.upcomingMeetups.map(function(meetup) {
					rsvps.forEach(function(rsvp) {
						if (rsvp.meetup === meetup.id) {
							meetup.rsvpStatus = {
								rsvped: rsvp ? true : false,
								attending: rsvp && rsvp.attending ? true : false
							}
						}
					})
					if (!meetup.rsvpStatus) {
						meetup.rsvpStatus = {
							rsvped: false,
							attending: false
						}
					}
					return meetup
				})
				return next();
			});

	});

	view.render('site/meetups');

}
