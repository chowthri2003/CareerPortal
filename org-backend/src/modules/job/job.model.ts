import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/db.config.js";

interface JobAttributes {
  id: number;
  title: string;
  location: string;
  experienceRequired: string; 
  workMode: "On-site" | "Hybrid" | "Remote";
  jobType: "Full-time" | "Contract" | "Internship";
  roleOverview: string;
  keyRequirements: string;
  coreRequirements: string;
  status: "Published" | "Draft" | "Closed";
}

interface JobCreationAttributes extends Optional<JobAttributes, "id" | "status"> { }

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  declare id: number;
  declare title: string;
  declare location: string;
  declare experienceRequired: string;
  declare workMode: "On-site" | "Hybrid" | "Remote";
  declare jobType: "Full-time" | "Contract" | "Internship";
  declare roleOverview: string;
  declare keyRequirements: string;
  declare coreRequirements: string;
  declare status: "Published" | "Draft" | "Closed";
}

Job.init({
  id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true 
    },
  title: {
     type: DataTypes.STRING, 
     allowNull: false 
    },
  location: {
     type: DataTypes.STRING, 
     allowNull: false 
    },
  experienceRequired: { 
     type: DataTypes.STRING, 
     allowNull: false
     },
  workMode: {
     type: DataTypes.ENUM("On-site", "Hybrid", "Remote"), 
     defaultValue: "Hybrid" 
    },
  jobType: { 
    type: DataTypes.ENUM("Full-time", "Contract", "Internship"),
    defaultValue: "Full-time"
    },
  roleOverview: { 
    type: DataTypes.TEXT, 
    allowNull: false 
   },
  keyRequirements: { 
    type: DataTypes.TEXT, 
    allowNull: false 
   },
  coreRequirements: {
     type: DataTypes.TEXT, 
     allowNull: false 
    },
  status: { 
    type: DataTypes.ENUM("Published", "Draft", "Closed"), 
    defaultValue: "Draft" },
},
 { 
  sequelize, 
  tableName: "jobs", 
  timestamps: true 
});

export default Job;