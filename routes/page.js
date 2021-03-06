const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.followerCount = 0;
	res.locals.followingCount = 0;
	res.locals.followerIdList = [];
	next();
});

router.get('/profile', isLoggedIn, (req, res) => {
	res.render('profile', { title: '내 정보 - SNS_service' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
	res.render('join', { title: '회원가입 - SNS_service' });
});

router.get('/', async (req, res, next) => {
	try {
		const posts = await Post.findAll({
			include: {
				model: User,
				attributes: ['id', 'nick'],
			},
			order: [['createdAt', 'DESC']],
		});
		res.render('main', {
			title: 'SNS_service',
			twits: posts,
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
});

module.exports = router;
