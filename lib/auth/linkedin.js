var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var passport = require('passport');
var passportLinkedInStrategy = require('passport-linkedin').Strategy;
var User = keystone.list('User');

var credentials = {
	consumerKey: process.env.LINKEDIN_API_KEY,
	consumerSecret: process.env.LINKEDIN_SECRET_KEY,
	callbackURL: process.env.LINKEDIN_CALLBACK_URL,
	profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'picture-url', 'public-profile-url', 'summary']
};

exports.authenticateUser = function(req, res, next) {
	var self = this;

	var redirect = '/auth/confirm';
	if (req.cookies.target && req.cookies.target == 'app') redirect = '/auth/app';

	// Begin process
	console.log('============================================================');
	console.log('[services.linkedin] - Triggered authentication process...');
	console.log('------------------------------------------------------------');

	// Initalise Linkedin credentials
	var linkedInStrategy = new passportLinkedInStrategy(credentials, function(accessToken, refreshToken, profile, done) {
		done(null, {
			accessToken: accessToken,
			refreshToken: refreshToken,
			profile: profile
		});
	});

	// Pass through authentication to passport
	passport.use(linkedInStrategy);

	// Save user data once returning from Linkedin
	if (_.has(req.query, 'cb')) {

		console.log('[services.linkedin] - Callback workflow detected, attempting to process data...');
		console.log('------------------------------------------------------------');

		passport.authenticate('linkedin', { session: false }, function(err, data, info) {
			console.log('err::', err)
			// console.log('data::', data)
			if (err || !data) {
				console.log("[services.linkedin] - Error retrieving Linkedin account data - " + JSON.stringify(err));
				return res.redirect('/signin');
			}

			console.log('[services.linkedin] - Successfully retrieved Linkedin account data, processing...');
			console.log('------------------------------------------------------------');

			var auth = {
				type: 'linkedin',

				name: {
					first: data.profile.name.givenName || '',
					last: data.profile.name.familyName || ''
				},

				profileId: data.profile.id,

				profileLink: data.profile._json.publicProfileUrl,

				username: data.profile.username,
				avatar: data.profile._json.pictureUrl.replace('_normal', ''),

				email: data.profile._json.emailAddress,

				bio: {
					headline: data.profile._json.headline,
					summary: data.profile._json.summary
				},

				accessToken: data.accessToken,
				refreshToken: data.refreshToken
			}

			req.session.auth = auth;

			// console.log('auth::', auth)
			// console.log('req.session.auth::', req.session.auth)

			return res.redirect(redirect);

		})(req, res, next);

	// Perform inital authentication request to Linkedin
	} else {

		console.log('[services.linkedin] - Authentication workflow detected, attempting to request access...');
		console.log('------------------------------------------------------------');

		passport.authenticate('linkedin')(req, res, next);

	}

};
