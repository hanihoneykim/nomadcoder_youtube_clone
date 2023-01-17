import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim:true, mexLength:80},
    fileUrl:{ type:String, required:true},
    description: { type: String, required: true, trim:true, mexLength:140, minLength:15},
    createdAt: { type: Date, required: true, default: Date.now }, //Date.now() 하면 함수 즉각 실행되므로 주의! //defult 값 주는 이유는 매번 Date.now 쓰기 번거로우므로!
    hashtags: [{ type: String, trim:true}],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
});

videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
})

const Video = mongoose.model("Video", videoSchema);
export default Video;
