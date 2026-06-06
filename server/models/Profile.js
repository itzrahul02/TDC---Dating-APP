import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  profileId: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: String },
  age: { type: Number, required: true },
  city: { type: String },
  country: { type: String, default: 'India' },
  height: { type: Number },
  email: { type: String },
  phone: { type: String },
  religion: { type: String },
  caste: { type: String },
  maritalStatus: { type: String },
  motherTongue: { type: String },
  languages: [String],
  diet: { type: String },
  income: { type: Number },
  company: { type: String },
  designation: { type: String },
  education: { type: String },
  college: { type: String },
  siblings: { type: Number },
  familyType: { type: String },
  wantKids: { type: String },
  openToRelocate: { type: String },
  openToPets: { type: String },
  isClient: { type: Boolean, default: false },
  status: { type: String, enum: ['Searching', 'Intro Sent', 'Matched', 'On Hold'], default: 'Searching' },
  notes: { type: String, default: '' }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
