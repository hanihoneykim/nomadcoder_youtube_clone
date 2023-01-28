import e from "express";
import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};  // || (or) {} (빈 object) 로그인하지 않은 유저가 url통해 들어와도 일단 정보는 {}로 넘기고 아래 미들웨어로 protect 할 것임
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    } else {
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn){
        return next();
    } else {
        return res.redirect("/");
    }
    
};

export const uploadFiles = multer({ dest: "uploads/" });

export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
        fileSize: 10000000,
    },
});