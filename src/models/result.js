import mongoose from "mongoose";
const allocationSchema = new mongoose.Schema({
    GroupID: String,
    HostelName: String,
    RoomNumber: String,
    MembersAllocated: Number
});

const resultSchema = new mongoose.Schema({
    result: [allocationSchema]
}, { timestamps: true });

export const resultModel = mongoose.model('resultModel', resultSchema);

