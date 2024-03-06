
const { Schema, model} = require('mongoose');

const CaseSchema = Schema({

    caseID: {
        type: String,
        required: true,
        unique: true
    },
    operator: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
    }
});

CaseSchema.method('toJSON', function(){
    const {...object} =this.toObject();
    
    return object;
})

module.exports = model('Case', CaseSchema);