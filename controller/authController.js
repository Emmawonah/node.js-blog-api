const passport = require('passport');
const jwt = require('jsonwebtoken');

const Login = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                const error = new Error();
                error.status = 404
                error.message = info
                return next(error);
            }

            req.login(user, { session: false },
                async (error) => {
                    if (error) return next(error);

                    const body = { _id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname };
                    const token = jwt.sign({ user: body }, process.env.SECRET_KEY, { expiresIn: "1hr" });

                    return res.json({ token });
                }
            );
        } catch (error) {
            return next(error);
        }
    }
    )(req, res, next);
}

const SignUp = async (req, res, next) => {
    res.status(201).json({
        message: 'Signup successful',
        user: req.user
    });
}

module.exports = { Login, SignUp }