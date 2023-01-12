import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req,res) => res.render("join", {pageTitle:"Join"})
export const postJoin = async(req,res) => {
    const { name, email, username, password, password2, location } = req.body;
    const pageTitle = "Join";
    if(password !== password2) {
        return res.status(400).render("join", {pageTitle, errorMessage:"Password confirmation does not match.",})
    }
    const exists = await User.exists({ $or: [{username}, {email}] });
    if(exists) {
        return res.status(400).render("join", {pageTitle, errorMessage:"This username/email is already taken.",})
    }
    try {
        await User.create({
        name,
        email,
        username,
        password,
        location,
        })
        return res.redirect("/login")
    }catch(error) {
        return res.status(400).render("join", {pageTitle, errorMessage:error._message});
    }
}

export const getLogin = (req,res) => res.render("login", {pageTitle:"Login"});

export const postLogin = async(req,res) => {
    const {username, password} = req.body;
    const pageTitle = "Login"
    const user = await User.findOne({username});
    //check if account exists
    if(!user){
        return res.status(400).render("login", {pageTitle, errorMessage:"An account with this username doesn't exists."})
    }
    //check if password correct
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {pageTitle, errorMessage:"Wrong Password"});
    }
    req.session.loggedIn = true;
    req.session.user = user;  //여기 user은 위의 const user 로 찾은 db 속 user
    res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: "4c42fa7faf51841a1737",
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const edit = (req,res) => res.send("User Edit");
export const remove = (req,res) => res.send("User Remove");
export const logout = (req,res) => res.send("User Logout");
export const see = (req,res) => {
    return res.send(`See User #${req.params.id}`);}