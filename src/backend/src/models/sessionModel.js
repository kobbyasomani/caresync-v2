const mongoose = require('mongoose');

// TODO: Note — functions cannot be serialised to JSON, so navUtils will be excluded from the session data model.
const sessionSchema = mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    sessionData: {}
}, {
    timestamps: true
});

module.export = mongoose.model('Session', sessionSchema);