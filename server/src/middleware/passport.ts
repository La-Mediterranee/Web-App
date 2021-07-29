import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';

import { discord } from '@util/consts';

interface FirebaseUser extends Express.User {
	uid: string;
}

passport.serializeUser((user, done) => {
	console.log('user', user);
	done(null, (user as FirebaseUser).uid);
});

passport.deserializeUser(async (uid, done) => {
	console.log('uid', uid);
	done(null, uid as Express.User);
});

passport.use(
	new DiscordStrategy(
		{
			clientID: discord.clientID,
			clientSecret: discord.clientSecret,
			callbackURL: discord.redirectURL,
			scope: discord.scopes
		},
		async function (accessToken, refreshToken, profile, done) {
			return done(null, profile);
		}
	)
);

export default passport;
