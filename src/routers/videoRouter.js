import  express from "express";
import { videoUpload } from "../middlewares";
import { getEdit, watch, postEdit, getUpload, postUpload, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();


videoRouter.get("/:id([0-9a-fd]{24})", watch);
videoRouter.route("/:id([0-9a-fd]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-fd]{24})/delete").get(deleteVideo)
videoRouter.route("/upload").get(getUpload).post(videoUpload.single("video"), postUpload);


export default videoRouter;
