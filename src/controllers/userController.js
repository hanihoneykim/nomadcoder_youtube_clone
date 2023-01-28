import User from "../models/User";
import bcrypt from "bcrypt";

const HTTP_BAD_REQUEST = 400;

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

export const logout = (req,res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req,res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"})
};

export const postEdit = async(req,res) => {
    const { 
        session: {user :{ _id, email:sessionEmail, name:sessionName }},  //middleware 에서 console.log(req.session.user)해보니 해당 목록이 id 가 아닌 _id 였음
        body: { name, email, location },  //form 의 name 에서 오는 것
    } = req;
                /*
                위의 ES6 코드는 아래 코드와 같은 뜻임
                const { user:{id} } = req.session;
                const { name, email, location, submit } = req.body;
                */
    //코드챌린지(수정 시 이메일, 이름 중복 확인) - 학생 코드
    let searchParam = [];
    if (sessionEmail !== email) {
        searchParam.push({email});
    }
    if (sessionName !== name) {
        searchParam.push({name});
    }
    if (searchParam.length > 0 ) {
        const foundUser = await User.findOne({ $or: searchParam });
        if (foundUser && foundUser._id.toString() !== _id) {
            return res.status(HTTP_BAD_REQUEST).render("edit-profile", {pageTitle:"Edit Profile", errorMessage:"Thos email/name is already taken."})
        }
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        email,
        location,
    }, { new: true });
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};

export const getChangePassword = (req,res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
        } // 깃허브 로그인일 경우 redirect
    return res.render("users/change-password", {pageTitle: "Change Password"});
}

export const postChangePassword = async(req,res) => {
    const { 
        session: {user :{ _id, password }},
        body: { oldPassword, newPassword, newPasswordConfirm },  //form 의 name 에서 오는 것
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
        return res.status(400).render("users/change-password", {pageTitle: "Change Password", errorMessage:"The current password is incorrect."})
    }
    if (newPassword !== newPasswordConfirm){
        return res.status(400).render("users/change-password", {pageTitle: "Change Password", errorMessage:"The password does not match the confirmation"})
    }
    if (oldPassword === newPassword) {
        return res.status(400).render('users/change-password', {pageTitle: "Change Password", errorMessage: 'The old password equals new password',});
    }
    user.password = newPassword;
    await user.save();  //User 모델 속 pre save 가 활성화되어 비밀번호 hash 해줌
    req.session.destroy(); //해킹방지 위해 이 전 세션 삭제
    return res.redirect("/users/logout");
}

export const see = (req,res) => {
    return res.send(`See User #${req.params.id}`);}