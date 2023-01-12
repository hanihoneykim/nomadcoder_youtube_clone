import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}));   //위치 중요(route middleware 전에 위치해야 적용가능)

app.use(
    session({
        secret:process.env.COKKIE_SECRET,
        resave:false,
        saveUninitialized:false,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL  }),
    })
);     //위치 중요(꼭 Router 전에 위치!!)

/*
세션 id 확인하기위해 사용한 코드
app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
    });
});
*/

app.use(localsMiddleware);    //위치 정말 중요! session 다음 - router 전

app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;