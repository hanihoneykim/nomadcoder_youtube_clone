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
    res.redirect("/");
}

export const edit = (req,res) => res.send("User Edit");
export const remove = (req,res) => res.send("User Remove");
export const logout = (req,res) => res.send("User Logout");
export const see = (req,res) => {
    return res.send(`See User #${req.params.id}`);}