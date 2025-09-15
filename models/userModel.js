import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
  type: String,
  required: true,
  minlength: 8  
},
  gender: {
    type: String,
    enum: ["male", "female", "other", "none"],
    default: "male"
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  timeOfBirth: {
    type: String,
    required: true
  },
  placeOfBirth: {
    type: String,
    required: true
  },
  currentLocation: {
    type: String,
    required: true
  },
  maritalStatus: {
    type: String,
    enum: ["single", "married", "divorced", "widowed", "separated", "none"],
    default: "single"
  },
  religion: {
    type: String,
    enum: ["hindu", "muslim", "christian", "sikh", "jain", "buddhist", "none"],
    default: "hindu"
  },
 focusArea: {
  type: [String],            
  enum: [
    "relationship",
    "career",
    "business",
    "health & fitness",
    "family & children",
    "spiritual growth",
    "foreign settlement",
    "life purpose",
    "marital status"
  ],
  default: []               
},
  purposeOfVisit: {
    type: String,
    enum: [
      "love",
      "marriage",
      "career",
      "health",
      "wealth",
      "peace of mind",
      "family",
      "other"
    ],
    default: "other" 
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
