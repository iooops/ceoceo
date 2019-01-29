var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'about';
	locals.page.title = 'About CEO';

	locals.organisers = [
		{ name: '谢天宇',    image: '/images/organiser-xty.jpg',    linkedin: '',   field: '人类学博士', title: 'Co-President' },
		{ name: '王博闻(April)',     image: '/images/organiser-april.jpg',     linkedin: '',   field: 'MBA', title: 'Co-President' }
	]

	locals.vporganisers1 = [
		{ name: 'Eric Zhang',    image: '/images/organiser-eric.jpg',    linkedin: '',   field: 'MBA', title: 'CFO' },
		{ name: '郑怡(Alice)', image: '/images/organiser-alice.jpg', linkedin: '', field: 'Product Design & Computer Science', title: 'VP (Marketing)' },
		{ name: 'Yanyan Tong',    image: '/images/organiser-yanyan.jpg',    linkedin: '',   field: 'MS in Computer Science', title: 'VP (Operations)' }
	]

	locals.vporganisers2 = [
		{ name: '张霄',    image: '/images/organiser-zx.jpg',    linkedin: '',   field: 'Applied Physics PhD', title: 'VP (Innovation Mixer)' },
		{ name: '周亦同', image: '/images/organiser-zyt.jpg', linkedin: '', field: 'MS in Materials Science and Engineering', title: 'VP (BD)' }
	]

	view.render('site/about');

}
