import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/db.config.js";
import Job from "../job/job.model.js";

interface ApplicationAttributes {
  id: number;
  jobId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  dateOfBirth: string;
  totalExperience: string; 
  currentSalary: string;
  noticePeriod: number; 
  experienceDetails: any;
  educationDetails: any;
  skills: string;      
  gender: string;
  resumeUrl: string; 
  storageProvider: string;   
  status: "New" | "Screened" | "Interviewing" | "Offered" | "Rejected";
}

interface AppCreationAttributes extends Optional<ApplicationAttributes, "id" | "status" | "middleName"> {}

class Application extends Model<ApplicationAttributes, AppCreationAttributes> implements ApplicationAttributes {
  declare id: number;
  declare jobId: number;
  declare firstName: string;
  declare middleName?: string;
  declare lastName: string;
  declare email: string;
  declare mobilePhone: string;
  declare dateOfBirth: string;
  declare totalExperience: string;
  declare currentSalary: string;
  declare noticePeriod: number;
  declare experienceDetails: any;
  declare educationDetails: any;
  declare skills: string;
  declare gender: string;
  declare resumeUrl: string;
  declare storageProvider: string;
  declare status: "New" | "Screened" | "Interviewing" | "Offered" | "Rejected";
}

Application.init({
  id: { 
     type: DataTypes.INTEGER,
     autoIncrement: true, 
     primaryKey: true 
    },
  jobId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Job, key: 'id' } 
  },
  firstName: {
     type: DataTypes.STRING,
     allowNull: false },
  middleName: { 
    type: DataTypes.STRING },
  lastName: { 
    type: DataTypes.STRING, 
    allowNull: false },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  mobilePhone: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  dateOfBirth: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  totalExperience: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  currentSalary: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  noticePeriod: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  experienceDetails: { 
    type: DataTypes.JSONB, 
    defaultValue: [] 
  },
  educationDetails: { 
    type: DataTypes.JSONB, 
    defaultValue: [] 
  },
  skills: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  gender: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  resumeUrl: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  storageProvider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: { 
    type: DataTypes.ENUM("New", "Screened", "Interviewing", "Offered", "Rejected"), 
    defaultValue: "New" },
}, 
{ 
  sequelize, 
  tableName: "applications", 
  timestamps: true 
});

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applicants' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

export default Application;