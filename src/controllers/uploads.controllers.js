import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Group} from "../models/group.js"
import {Hostel} from "../models/hostel.js"
import csv from "csv-parser"
import path from "path"
import fs from "fs"

const uploadCSV= asyncHandler(async(req,res)=>{
    const UPLOAD_DIR = path.join(__dirname, '../uploads');

        if (!req.files) {
            return res.status(400).json (400,ApiResponse(400,'No files were uploaded'));
        }
    
        // Process files and allocate rooms
        processFiles(res);
    
    function processFiles(res){
        let groups = [];
        let hostels = [];
    
        // Read groups CSV
try {
            fs.createReadStream(path.join(UPLOAD_DIR, 'groups.csv'))
                .pipe(csv())
                .on('data', row => {
                    groups.push(new Group(row.GroupID, row.Members, row.Gender));
                })
                .on('end', () => {
                    // Read hostels CSV
                    fs.createReadStream(path.join(UPLOAD_DIR, 'hostels.csv'))
                        .pipe(csv())
                        .on('data', row => {
                            hostels.push(new Hostel(row.HostelName, row.RoomNumber, row.Capacity, row.Gender));
                        })
                        .on('end', () => {
                            // Process allocation
                            let allocations = allocateRooms(groups, hostels);
                            // Render result view with allocations
                            res.render('result', { allocations });
                        });
                });
} catch (error) {
    throw new ApiError(400, "Failed to read files")
}
    }
    function allocateRooms(groups, hostels) {
        // Sort groups and hostels
try {
            groups.sort((a, b) => b.members - a.members);
            hostels.sort((a, b) => b.capacity - a.capacity);
        
            let allocations = [];
        
            function allocateGroup(members, gender, groupId) {
                let allocated = false;
                for (let hostel of hostels) {
                    if (hostel.gender === gender && hostel.capacity >= members) {
                        allocations.push({
                            GroupID: groupId,
                            HostelName: hostel.hostelName,
                            RoomNumber: hostel.roomNumber,
                            MembersAllocated: members
                        });
                        hostel.capacity -= members;
                        allocated = true;
                        break;
                    }
                }
                if (!allocated) {
                    // Handle cases where a group cannot be accommodated
                    allocations.push({
                        GroupID: groupId,
                        HostelName: 'Not Allocated',
                        RoomNumber: 'N/A',
                        MembersAllocated: members
                    });
                }
            }
        
            for (let group of groups) {
                if (group.gender.includes('&')) {
                    let [boysCount, girlsCount] = group.gender.split(' & ').map(g => parseInt(g.split(' ')[0]));
                    allocateGroup(boysCount, 'Boys', group.groupID);
                    allocateGroup(girlsCount, 'Girls', group.groupID);
                } else {
                    allocateGroup(group.members, group.gender, group.groupID);
                }
            }
        
            return allocations;
} catch (error) {
    throw new ApiError(400, "Failed to allocate rooms")
}
    }
})

export{
    uploadCSV
}