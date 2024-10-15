const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const DEPARTMENTS = ['Management', 'Sales', 'Finance', 'Outreach', 'Support', 'Migration', 'Learning and Development', 'HR', 'IT','OnBoard'];
const ROLES = ['SuperAdmin', 'Admin', 'User'];

// Define team-specific attributes
const ManagementTeam = ['CEO', 'CTO', 'CFO', 'Director', 'Independent Director'];
const SalesTeam = ['Manager', 'Asst. Manager', 'Associate', 'Trainee'];
const FinanceTeam = ['Manager', 'Asst. Manager', 'Associate' ,'Trainee'];
const OutreachTeam = ['Manager', 'Asst. Manager', 'Associate', 'Trainee'];
const DataMigrationTeam = ['Tally', 'Busy', 'Marg', 'ERP'];
const LearningAndDevelopmentTeam = ['Researcher', 'Research Assistant'];
const HRTeam = ['Researcher', 'Research Assistant'];
const ITTeam = ['Backend', 'API', 'Frontend', 'UI/UX', 'Application', 'Server'];
const SupportTeam =['Manager', 'Asst. Manager', 'Associate', 'Trainee'];
const OnBoardTeam = ['Manager', 'Asst. Manager', 'Associate' ,'Trainee'];


const AddressSchema = new Schema({
  houseNumber: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Regular expression for validating Postal Code (Assuming 6-digit postal code)
        return /^[1-9][0-9]{5}$/.test(v);
      },
      message: props => `${props.value} is not a valid postal code!`
    }
  },
  country: {
    type: String,
    required: true
  }
});

const family =  new Schema({
  name: { type: String, required: true },
  age: {type: Number, required: true},
  relationship:{type:  String, required: true},
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

const localFamily = new  Schema({
  relativeName: {
    type: String,
    required: true
  },
  relativeMobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  relationship: {
    type: String,
    required: true
  }
})

const qualification = new Schema({
  highestDegree: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
});


const bankAccount = new Schema({
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  IFSC: {
    type: String,
    required: true
  }
})

const OsInternalSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true // Ensure that each user has a unique ID
  },
  name: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that email addresses are unique
    validate: {
      validator: function(v) {
        // Regular expression for validating an Email
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Regular expression for validating phone number (assuming a 10-digit number)
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ROLES,
    required: true
  },
  department: {
    type: String,
    enum: DEPARTMENTS,
    required: function() {
      return this.role === 'Admin' || this.role === 'User';
    }
  },
  img: {
    type: String
  },
  DOB: {
    type: Date,
    required: true
  },
  DateOfJoining: {
    type: Date,
    required: function() {
      return this.role === 'Admin' || this.role === 'User';
    }
  },
  // Reference to Address Schema
  permanentAddress: {
    type: AddressSchema,
    required: true
  },
  isPresentAddressSameAsPermanent: {
    type: Boolean,
    default: false // If true, present address will be the same as permanent address
  },
  presentAddress: {
    type: AddressSchema,
    required: function() { return !this.isPresentAddressSameAsPermanent; }
  },
  educationQualification: {
    type: qualification,
    require: true
  },
  bankAccountDetails: {
   type: bankAccount,
   require: true
  },
  familyDetails: {
    type: [family],
    required: true
  },
  localFamilyDetails: {
    type: localFamily,
    require: true
  },
  // Team-specific attributes
  managementTeamAttribute: {
    type: [String],
    enum: ManagementTeam,
    required: function() { return this.department === 'Management'; }
  },
  salesTeamAttribute: {
    type: [String],
    enum: SalesTeam,
    required: function() { return this.department === 'Sales'  && this.role ==='User'; }
  },
  financeTeamAttribute: {
    type: [String],
    enum: FinanceTeam,
    required: function() { return this.department === 'Finance'  && this.role ==='User'; }
  },
  outreachTeamAttribute: {
    type: [String],
    enum: OutreachTeam,
    required: function() { return this.department === 'Outreach'  && this.role ==='User'; }
  },
  dataMigrationTeamAttribute: {
    type: [String],
    enum: DataMigrationTeam,
    required: function() { return this.department === 'Migration'  && this.role ==='User'; }
  },
  learningAndDevelopmentTeamAttribute: {
    type: [String],
    enum: LearningAndDevelopmentTeam,
    required: function() { return this.department === 'Learning and Development'  && this.role ==='User'; }
  },
  hrTeamAttribute: {
    type: [String],
    enum: HRTeam,
    required: function() { return this.department === 'HR' && this.role ==='User'; }
  },
  itTeamAttribute: {
    type: [String],
    enum: ITTeam,
    required: function() { return this.department === 'IT' && this.role ==='User'; }
  },
  supportTeamAttribute:{
    type: [String],
    enum: SupportTeam,
    rquired: function(){return this.department === 'Support' && this.role === 'User'}
  },
  OnBoardTeamAttribute:{
    type: [String],
    enum:  OnBoardTeam,
    requrie: function(){return this.department === 'OnBoard' && this.role === 'User'}
  },
  proof: {
    pan: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Regular expression for validating PAN
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: props => `${props.value} is not a valid PAN number!`
      }
    },
    adharCard: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Regular expression for validating Aadhaar
          return /^\d{4}\s\d{4}\s\d{4}$/.test(v);
        },
        message: props => `${props.value} is not a valid Aadhaar number!`
      }
    }
  },
  
  PFno: {
    type: String
  },
  UAN: {
    type: String
  },
  ESIC:{
    type: String
  }
  ,
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  resignDate:{
    type:  Date

  }
});

// Middleware to ensure only one SuperAdmin
OsInternalSchema.pre('save', async function(next) {
  if (this.role === 'SuperAdmin') {
    // Find all SuperAdmins
    const superAdmins = await this.constructor.find({ role: 'SuperAdmin' });

    // Check if there are already two SuperAdmins
    if (superAdmins.length >= 2 && (this.isNew || (superAdmins.length > 2 && superAdmins.some(sa => sa._id.toString() !== this._id.toString())))) {
      return next(new Error('Only two SuperAdmins are allowed.'));
    }
  }
  next();
});


module.exports = mongoose.model('OsInternal', OsInternalSchema);
