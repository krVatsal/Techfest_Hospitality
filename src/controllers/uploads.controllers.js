import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Group from "../models/group.js";
import Hostel from "../models/hostel.js";
import csv from "csv-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const uploadCSV = asyncHandler(async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const UPLOAD_DIR = path.join(__dirname, '../uploads');

    if (!req.files || !req.files.groupCSV || !req.files.hostelCSV) {
        return res.status(400).json(new ApiResponse(400, 'Both the files are required'));
    }

    const groupsFilePath = path.join(UPLOAD_DIR, req.files.groupCSV[0].filename);
    const hostelsFilePath = path.join(UPLOAD_DIR, req.files.hostelCSV[0].filename);

    try {
        const groups = await parseCSV(groupsFilePath, Group);
        const hostels = await parseCSV(hostelsFilePath, Hostel);

        const allocations = allocateRooms(groups, hostels);
        res.render('result', { allocations });
    } catch (error) {
        res.status(500).json(new ApiResponse(500, 'Error processing CSV files'));
    }
});

function parseCSV(filePath, Model) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (Model === Group) {
                    results.push(new Group(row.GroupID, parseInt(row.Members), row.Gender));
                } else if (Model === Hostel) {
                    results.push(new Hostel(row.HostelName, row.RoomNumber, parseInt(row.Capacity), row.Gender));
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function allocateRooms(groups, hostels) {
    try {
        let boysGroups = [];
        let girlsGroups = [];

        // Separate the groups into boys and girls
        for (let group of groups) {
            if (group.gender.includes('&')) {
                let [boysCount, girlsCount] = group.gender.split(' & ').map(g => parseInt(g.split(' ')[0]));
                boysGroups.push({ groupID: group.groupID, members: boysCount, gender: 'Boys' });
                girlsGroups.push({ groupID: group.groupID, members: girlsCount, gender: 'Girls' });
            } else if (group.gender === 'Boys') {
                boysGroups.push(group);
            } else if (group.gender === 'Girls') {
                girlsGroups.push(group);
            }
        }

        // Sort boys and girls groups by the number of members in descending order
        boysGroups.sort((a, b) => b.members - a.members);
        girlsGroups.sort((a, b) => b.members - a.members);

        // Sort hostels by capacity in descending order
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
                allocations.push({
                    GroupID: groupId,
                    HostelName: 'Not Allocated',
                    RoomNumber: 'N/A',
                    MembersAllocated: members
                });
            }
        }

        // Allocate boys groups
        for (let group of boysGroups) {
            allocateGroup(group.members, group.gender, group.groupID);
        }

        // Allocate girls groups
        for (let group of girlsGroups) {
            allocateGroup(group.members, group.gender, group.groupID);
        }

        return allocations;
    } catch (error) {
        throw new ApiError(400, "Failed to allocate rooms");
    }
}
 
export { uploadCSV };
