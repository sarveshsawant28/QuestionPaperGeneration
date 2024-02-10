const User = require('../models/user');
const passport = require('passport');
const util = require('util');
const { cloudinary } = require('../cloudinary');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    getRegister(req, res, next) {
        if (req.isAuthenticated()) {
          req.session.error = 'Please logout before ';
          return res.redirect('back');
        }
        res.render('register', { title: 'Register', email: '', first: "", last: "", code: "" });
    },
    postRegister: async (req, res, next) => {
        try {
          if (req.file) {
            const { path:url, filename } = req.file;
            req.body.avatar = { url, filename };
          }
          const user = await User.register(new User(req.body), req.body.password);
          if(req.body.code === "secret123") {
            user.isAdmin = true;
            await user.save();
          }
          req.login(user, function(err) {
            if (err) return next(err);
            req.session.success = `Welcome to QP Maker, ${user.first} ${user.last}!`
            res.redirect('/');
          });
        } catch(err) {
          console.log(err);
          const { email, first, last, code } = req.body;
          let error = err.message;
          if (error.includes('A user with the given username')) {
            error = 'A user with the given email is already registered';
          }
          res.render('register', { title: 'Register', email, first, last, code, error });
        }
      },
      getLogin(req, res, next) {
        if (req.isAuthenticated()) return res.redirect('/');
        if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
        res.render('login', { title: 'Login' });
      },
      async postLogin(req, res, next) {
        const { email, password } = req.body;
        const { user, error } = await User.authenticate()(email, password);
        if (!user && error) return next(error);
        req.login(user, function(err) {
          if (err) return next(err);
          req.session.success = `Welcome back, ${user.first} ${user.last}!`;
          let redirectTo;
          if(user.isAdmin) {
            redirectTo = "/admin";
          } else {
            redirectTo = "/subjects"
          }
          const redirectUrl = redirectTo || '/';
          delete req.session.redirectTo;
          res.redirect(redirectUrl);
        });
      },
      getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
      },
      getForgotPw(req, res, next) {
        res.render('users/forgot');
      },
      async postForgotPw(req, res, next) {
        const token = await crypto.randomBytes(20).toString('hex');
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          req.session.error = 'No account with that email.';
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
    
        const msg = {
          to: email,
          from: 'akshaysarmalkar74@gmail.com',
          subject: 'QP Maker - Forgot Password / Reset',
          text: `You are receiving this because you (or someone else)
          have requested the reset of the password for your account.
          Please click on the following link, or copy and paste it
          into your browser to complete the process:
          http://${req.headers.host}/reset/${token}
          If you did not request this, please ignore this email and
          your password will remain unchanged.`.replace(/     /g, ''),
          // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        await sgMail.send(msg);
    
        req.session.success = `An email has been sent to ${email} with further instructions.`;
        res.redirect('/forgot');
      },
      async getReset(req, res, next) {
        const { token } = req.params;
        const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
        });
    
        if (!user) {
          req.session.error = 'Password reset token is invalid or has expired.';
          return res.redirect('/forgot');
        }
    
        res.render('users/reset', { token });
      },
      async putReset(req, res, next) {
        const { token } = req.params;
        const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
        });
    
        if (!user) {
          req.session.error = 'Password reset token is invalid or has expired.';
          return res.redirect('/forgot');
        }
    
        if (req.body.password === req.body.confirm) {
          console.log(req.body);
          await user.setPassword(req.body.password);
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;
          await user.save();
          const login = util.promisify(req.login.bind(req));
          await login(user);
        } else {
          req.session.error = 'Passwords do not match.';
          return res.redirect(`/reset/${ token }`);
        }
    
        const msg = {
          to: user.email,
          from: 'akshaysarmalkar74@gmail.com',
          subject: 'QP Maker - Password Changed',
          text: `Hello,
          This email is to confirm that the password for your account has just been changed.
          If you did not make this change, please hit reply and notify us at once.`.replace(/     /g, '')
        };
    
        await sgMail.send(msg);
    
        req.session.success = 'Password successfully updated!';
        res.redirect('/');
      }
}