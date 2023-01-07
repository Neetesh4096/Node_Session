const User = require("./models");

const bcrypt = require("bcrypt");
const sessions = require("express-session");

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.redirect("login", {
      message: "Please provide Email and Password",
      title: "Login",
    });
  } else {
    const user = await User.findOne({ email: email });

    if (await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;

      res.render("welcome", {
        message: "Welcome To Our Site ",
        title: "Dashboard",
      });
    } else {
      res.redirect("/login", { message: "Invalid Email or Password" });
    }
  }
};

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwd = req.body.passwd;

  if (password == passwd) {
    const hashpass = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email, password: hashpass });
    console.log(user._id);
    req.session.userId = user._id;

    res.render("welcome", { message: email, title: "Hello" });
  } else {
    res.redirect("/signup", { message: "Passwod not same" });
  }
};
