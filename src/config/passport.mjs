import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/Users.mjs';

export default function initialize(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Пользователь не найден' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Неверный пароль' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
