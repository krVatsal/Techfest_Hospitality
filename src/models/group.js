// models/Group.js

class Group {
    constructor(groupID, members, gender) {
        this.groupID = groupID;
        this.members = parseInt(members);
        this.gender = gender;
    }
}

export default Group
