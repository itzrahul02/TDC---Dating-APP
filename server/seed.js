import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from './models/Profile.js';
import User from './models/User.js';

dotenv.config();

const clients = [
  {"profileId":"c001","gender":"male","firstName":"Arjun","lastName":"Mehta","dob":"1995-03-14","age":29,"city":"Mumbai","country":"India","height":175,"email":"arjun.mehta@example.com","phone":"+91 98765 43210","religion":"Hindu","caste":"Brahmin","maritalStatus":"Never Married","motherTongue":"Hindi","languages":["Hindi","English","Marathi"],"diet":"Vegetarian","income":22,"company":"Infosys","designation":"Senior Software Engineer","education":"B.Tech Computer Science","college":"IIT Bombay","siblings":1,"familyType":"Nuclear","wantKids":"Yes","openToRelocate":"Maybe","openToPets":"Yes","isClient":true,"status":"Searching","notes":""},
  {"profileId":"c002","gender":"female","firstName":"Priya","lastName":"Sharma","dob":"1996-07-22","age":28,"city":"Delhi","country":"India","height":162,"email":"priya.sharma@example.com","phone":"+91 99887 65432","religion":"Hindu","caste":"Kayastha","maritalStatus":"Never Married","motherTongue":"Hindi","languages":["Hindi","English"],"diet":"Vegetarian","income":18,"company":"Deloitte","designation":"Business Analyst","education":"MBA Finance","college":"IIM Ahmedabad","siblings":2,"familyType":"Nuclear","wantKids":"Yes","openToRelocate":"Yes","openToPets":"Maybe","isClient":true,"status":"Searching","notes":""},
  {"profileId":"c003","gender":"male","firstName":"Rohan","lastName":"Gupta","dob":"1993-11-05","age":31,"city":"Bangalore","country":"India","height":180,"email":"rohan.gupta@example.com","phone":"+91 98234 56789","religion":"Hindu","caste":"Agarwal","maritalStatus":"Never Married","motherTongue":"Hindi","languages":["Hindi","English","Kannada"],"diet":"Non-Vegetarian","income":35,"company":"Google","designation":"Staff Engineer","education":"M.Tech Computer Science","college":"IIT Delhi","siblings":0,"familyType":"Nuclear","wantKids":"Maybe","openToRelocate":"Yes","openToPets":"Yes","isClient":true,"status":"Intro Sent","notes":"Prefers someone from Bangalore or willing to move here."},
  {"profileId":"c004","gender":"female","firstName":"Ananya","lastName":"Iyer","dob":"1997-01-30","age":27,"city":"Chennai","country":"India","height":158,"email":"ananya.iyer@example.com","phone":"+91 97654 32109","religion":"Hindu","caste":"Brahmin","maritalStatus":"Never Married","motherTongue":"Tamil","languages":["Tamil","English","Hindi"],"diet":"Vegetarian","income":14,"company":"TCS","designation":"Systems Engineer","education":"B.E. Electronics","college":"Anna University","siblings":1,"familyType":"Joint","wantKids":"Yes","openToRelocate":"No","openToPets":"No","isClient":true,"status":"Searching","notes":""},
  {"profileId":"c005","gender":"male","firstName":"Kabir","lastName":"Khan","dob":"1994-09-18","age":30,"city":"Hyderabad","country":"India","height":178,"email":"kabir.khan@example.com","phone":"+91 96543 21098","religion":"Muslim","caste":"Pathan","maritalStatus":"Never Married","motherTongue":"Urdu","languages":["Urdu","Hindi","English","Telugu"],"diet":"Non-Vegetarian","income":28,"company":"Microsoft","designation":"Product Manager","education":"MBA Marketing","college":"ISB Hyderabad","siblings":3,"familyType":"Joint","wantKids":"Yes","openToRelocate":"Maybe","openToPets":"Yes","isClient":true,"status":"Searching","notes":""},
  {"profileId":"c006","gender":"female","firstName":"Simran","lastName":"Kaur","dob":"1995-04-12","age":29,"city":"Chandigarh","country":"India","height":165,"email":"simran.kaur@example.com","phone":"+91 95432 10987","religion":"Sikh","caste":"Jat","maritalStatus":"Never Married","motherTongue":"Punjabi","languages":["Punjabi","Hindi","English"],"diet":"Non-Vegetarian","income":20,"company":"Wipro","designation":"Project Lead","education":"B.Tech IT","college":"PEC Chandigarh","siblings":1,"familyType":"Nuclear","wantKids":"Yes","openToRelocate":"Yes","openToPets":"Yes","isClient":true,"status":"Matched","notes":"Matched with Harpreet Singh from Delhi."},
  {"profileId":"c007","gender":"male","firstName":"Vivek","lastName":"Reddy","dob":"1992-06-25","age":32,"city":"Hyderabad","country":"India","height":172,"email":"vivek.reddy@example.com","phone":"+91 94321 09876","religion":"Hindu","caste":"Kshatriya","maritalStatus":"Divorced","motherTongue":"Telugu","languages":["Telugu","Hindi","English"],"diet":"Non-Vegetarian","income":40,"company":"Amazon","designation":"Engineering Manager","education":"M.Tech Software Engineering","college":"BITS Pilani","siblings":2,"familyType":"Nuclear","wantKids":"No","openToRelocate":"Yes","openToPets":"Yes","isClient":true,"status":"Searching","notes":"Open to divorced or widowed matches."},
  {"profileId":"c008","gender":"female","firstName":"Neha","lastName":"Joshi","dob":"1994-12-08","age":30,"city":"Pune","country":"India","height":160,"email":"neha.joshi@example.com","phone":"+91 93210 98765","religion":"Hindu","caste":"Brahmin","maritalStatus":"Never Married","motherTongue":"Marathi","languages":["Marathi","Hindi","English"],"diet":"Vegetarian","income":16,"company":"Persistent Systems","designation":"Tech Lead","education":"M.Sc Computer Science","college":"Pune University","siblings":1,"familyType":"Nuclear","wantKids":"Yes","openToRelocate":"Maybe","openToPets":"Yes","isClient":true,"status":"On Hold","notes":"Taking a break — will resume in January."},
  {"profileId":"c009","gender":"male","firstName":"Aditya","lastName":"Nair","dob":"1996-02-14","age":28,"city":"Kochi","country":"India","height":170,"email":"aditya.nair@example.com","phone":"+91 92109 87654","religion":"Hindu","caste":"Nair","maritalStatus":"Never Married","motherTongue":"Malayalam","languages":["Malayalam","English","Hindi"],"diet":"Non-Vegetarian","income":15,"company":"UST Global","designation":"Software Developer","education":"B.Tech Computer Science","college":"NIT Calicut","siblings":1,"familyType":"Joint","wantKids":"Yes","openToRelocate":"Yes","openToPets":"Maybe","isClient":true,"status":"Searching","notes":""},
  {"profileId":"c010","gender":"female","firstName":"Ritu","lastName":"Agarwal","dob":"1993-08-19","age":31,"city":"Kolkata","country":"India","height":155,"email":"ritu.agarwal@example.com","phone":"+91 91098 76543","religion":"Hindu","caste":"Agarwal","maritalStatus":"Never Married","motherTongue":"Bengali","languages":["Bengali","Hindi","English"],"diet":"Vegetarian","income":25,"company":"EY","designation":"Senior Consultant","education":"CA + MBA","college":"ICAI + XLRI","siblings":0,"familyType":"Nuclear","wantKids":"Maybe","openToRelocate":"Yes","openToPets":"No","isClient":true,"status":"Intro Sent","notes":"Sent intro to Rohan G. from Bangalore."},
  {"profileId":"c011","gender":"male","firstName":"Siddharth","lastName":"Jain","dob":"1991-05-03","age":33,"city":"Jaipur","country":"India","height":176,"email":"siddharth.jain@example.com","phone":"+91 90987 65432","religion":"Jain","caste":"Digambar","maritalStatus":"Never Married","motherTongue":"Hindi","languages":["Hindi","English","Rajasthani"],"diet":"Vegetarian","income":50,"company":"Family Business (Textiles)","designation":"Director","education":"BBA + Family Business","college":"Symbiosis Pune","siblings":2,"familyType":"Joint","wantKids":"Yes","openToRelocate":"No","openToPets":"No","isClient":true,"status":"Searching","notes":"Wants Jain girl only. Family involved in decision."},
  {"profileId":"c012","gender":"female","firstName":"Zara","lastName":"Ahmed","dob":"1996-10-27","age":28,"city":"Lucknow","country":"India","height":163,"email":"zara.ahmed@example.com","phone":"+91 89876 54321","religion":"Muslim","caste":"Syed","maritalStatus":"Never Married","motherTongue":"Urdu","languages":["Urdu","Hindi","English"],"diet":"Non-Vegetarian","income":12,"company":"Teach for India","designation":"Program Manager","education":"M.A. Education","college":"Jamia Millia Islamia","siblings":3,"familyType":"Joint","wantKids":"Yes","openToRelocate":"Maybe","openToPets":"No","isClient":true,"status":"Searching","notes":""},
  {"profileId":"c013","gender":"male","firstName":"Rahul","lastName":"Deshmukh","dob":"1994-04-09","age":30,"city":"Pune","country":"India","height":174,"email":"rahul.deshmukh@example.com","phone":"+91 88765 43210","religion":"Hindu","caste":"Maratha","maritalStatus":"Never Married","motherTongue":"Marathi","languages":["Marathi","Hindi","English"],"diet":"Non-Vegetarian","income":20,"company":"Tata Motors","designation":"Deputy Manager","education":"B.E. Mechanical","college":"COEP Pune","siblings":1,"familyType":"Nuclear","wantKids":"Yes","openToRelocate":"No","openToPets":"Maybe","isClient":true,"status":"Searching","notes":""},
  {"profileId":"c014","gender":"female","firstName":"Meera","lastName":"Krishnan","dob":"1995-09-15","age":29,"city":"Bangalore","country":"India","height":161,"email":"meera.krishnan@example.com","phone":"+91 87654 32109","religion":"Hindu","caste":"Iyer","maritalStatus":"Never Married","motherTongue":"Tamil","languages":["Tamil","English","Kannada"],"diet":"Vegetarian","income":24,"company":"Flipkart","designation":"Senior Product Manager","education":"MBA Operations","college":"IIM Bangalore","siblings":1,"familyType":"Nuclear","wantKids":"Maybe","openToRelocate":"No","openToPets":"Yes","isClient":true,"status":"Searching","notes":""},
  {"profileId":"c015","gender":"male","firstName":"Harsh","lastName":"Patel","dob":"1997-07-01","age":27,"city":"Ahmedabad","country":"India","height":169,"email":"harsh.patel@example.com","phone":"+91 86543 21098","religion":"Hindu","caste":"Patel","maritalStatus":"Never Married","motherTongue":"Gujarati","languages":["Gujarati","Hindi","English"],"diet":"Vegetarian","income":12,"company":"Adani Group","designation":"Analyst","education":"B.Com + CA Inter","college":"Gujarat University","siblings":2,"familyType":"Joint","wantKids":"Yes","openToRelocate":"Maybe","openToPets":"No","isClient":true,"status":"Searching","notes":""}
];

// Generate 100 pool profiles
const firstNamesMale = ["Aarav","Vihaan","Ishaan","Reyansh","Ayaan","Dhruv","Arnav","Shaurya","Kartik","Om","Yash","Manav","Dev","Karan","Nikhil","Pranav","Aman","Rohit","Varun","Ankit","Gaurav","Abhishek","Piyush","Deepak","Ravi","Sumit","Mohit","Vishal","Tushar","Aakash","Kunal","Rajesh","Vikram","Neeraj","Ajay","Sachin","Amit","Rakesh","Suresh","Pratik","Sameer","Jayesh","Chirag","Mayank","Saurav","Akash","Harsh","Tarun","Naveen","Vinay"];
const firstNamesFemale = ["Aanya","Diya","Saanvi","Aarohi","Isha","Ananya","Kavya","Myra","Sara","Anika","Nisha","Pooja","Shruti","Tanvi","Aditi","Sneha","Kriti","Mahi","Tanya","Divya","Swati","Pallavi","Ankita","Megha","Sonal","Richa","Komal","Jyoti","Sakshi","Bhavna","Mansi","Rashmi","Preeti","Seema","Archana","Deepika","Geeta","Hema","Ira","Juhi","Kajal","Lata","Mona","Nandini","Payal","Radha","Shilpa","Usha","Vandana","Yamini"];
const lastNames = ["Sharma","Verma","Singh","Kumar","Gupta","Agarwal","Joshi","Patel","Reddy","Nair","Iyer","Mukherjee","Banerjee","Chatterjee","Das","Mishra","Pandey","Tiwari","Saxena","Chauhan","Thakur","Yadav","Jha","Srivastava","Dubey"];
const cities = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad","Jaipur","Lucknow","Chandigarh","Kochi","Indore","Nagpur","Bhopal"];
const religions = ["Hindu","Hindu","Hindu","Hindu","Hindu","Muslim","Sikh","Christian","Jain","Buddhist"];
const castes = { Hindu: ["Brahmin","Kshatriya","Kayastha","Agarwal","Patel","Maratha","Nair","Iyer","Reddy"], Muslim: ["Syed","Sheikh","Pathan","Ansari"], Sikh: ["Jat","Khatri","Arora"], Christian: ["Catholic","Protestant"], Jain: ["Digambar","Shvetambar"], Buddhist: ["Navayana","Theravada"] };
const diets = ["Vegetarian","Non-Vegetarian","Eggetarian"];
const familyTypes = ["Nuclear","Joint","Open"];
const yesNoMaybe = ["Yes","No","Maybe"];
const maritalStatuses = ["Never Married","Never Married","Never Married","Never Married","Divorced","Widowed"];
const educations = ["B.Tech Computer Science","B.E. Mechanical","MBA Finance","MBA Marketing","M.Tech","B.Com","CA","M.Sc Physics","MBBS","BBA","B.Arch","LLB","M.A. English","B.Sc Chemistry","Diploma Engineering"];
const companies = ["TCS","Infosys","Wipro","HCL","Google","Microsoft","Amazon","Flipkart","Zomato","Swiggy","Reliance","HDFC Bank","ICICI","Deloitte","EY","KPMG","PwC","Accenture","Cognizant","Tech Mahindra"];
const designations = ["Software Engineer","Senior Developer","Business Analyst","Product Manager","Data Scientist","Consultant","Manager","Team Lead","Architect","Associate","VP","Director","Analyst","Designer","Engineer"];
const colleges = ["IIT Bombay","IIT Delhi","IIT Madras","NIT Trichy","BITS Pilani","VIT","SRM","Anna University","Delhi University","Mumbai University","Pune University","BHU","JNU","Symbiosis","Christ University"];
const motherTongues = ["Hindi","Tamil","Telugu","Marathi","Bengali","Gujarati","Kannada","Malayalam","Punjabi","Urdu"];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomAge(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const pool = [];
for (let i = 1; i <= 100; i++) {
  const gender = i <= 50 ? 'female' : 'male';
  const firstName = gender === 'male' ? randomFrom(firstNamesMale) : randomFrom(firstNamesFemale);
  const lastName = randomFrom(lastNames);
  const age = randomAge(24, 35);
  const religion = randomFrom(religions);
  const caste = randomFrom(castes[religion] || ["General"]);
  const mt = randomFrom(motherTongues);

  pool.push({
    profileId: `p${String(i).padStart(3, '0')}`,
    gender,
    firstName,
    lastName,
    dob: `${2026 - age}-${String(randomAge(1,12)).padStart(2,'0')}-${String(randomAge(1,28)).padStart(2,'0')}`,
    age,
    city: randomFrom(cities),
    country: "India",
    height: gender === 'male' ? randomAge(165, 188) : randomAge(150, 172),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
    phone: `+91 ${randomAge(70000,99999)} ${randomAge(10000,99999)}`,
    religion,
    caste,
    maritalStatus: randomFrom(maritalStatuses),
    motherTongue: mt,
    languages: [mt, "English", "Hindi"].filter((v, idx, a) => a.indexOf(v) === idx),
    diet: randomFrom(diets),
    income: randomAge(8, 60),
    company: randomFrom(companies),
    designation: randomFrom(designations),
    education: randomFrom(educations),
    college: randomFrom(colleges),
    siblings: randomAge(0, 4),
    familyType: randomFrom(familyTypes),
    wantKids: randomFrom(yesNoMaybe),
    openToRelocate: randomFrom(yesNoMaybe),
    openToPets: randomFrom(yesNoMaybe),
    isClient: false,
    status: "Searching",
    notes: ""
  });
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Profile.deleteMany({});
    await User.deleteMany({});

    // Create matchmaker user
    await User.create({
      username: 'matchmaker',
      password: 'tdc2024',
      name: 'Priya Matchmaker'
    });
    console.log('User created: matchmaker / tdc2024');

    // Insert clients and pool
    await Profile.insertMany(clients);
    console.log(`Inserted ${clients.length} client profiles`);

    await Profile.insertMany(pool);
    console.log(`Inserted ${pool.length} pool profiles`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
