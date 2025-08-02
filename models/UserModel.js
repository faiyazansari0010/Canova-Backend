const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },

    projects: [
      {
        projectID: { type: String },
        projectName: { type: String },
        forms: [
          {
            formName: { type: String, default: "Form Name" },
            formID: { type: String },
            isDraft: { type: Boolean },
            formPages: [
              {
                pageName: { type: String },
                pageID:{type:String},
                pageQuestions: [
                  {
                    questionType: { type: String },
                    questionNum: { type: Number },
                    questionName: { type: String },
                    questionImage: { type: String },
                    questionVideo: { type: String },
                    questionText: { type: String },
                    options: [
                      {
                        optionType: { type: String },
                        optionName: { type: String },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],

    sharedWorks: [
      {
        sharedBy: { type: String },
        accessType: { type: String, enum: ["view", "edit"], default: "view" },
        sharedType: { type: String, enum: ["form", "project"], required: true },
        formID: { type: String },
        formName: { type: String },
        projectID: { type: String },
        projectName: { type: String },
        formData: {},
        projectData: {},
      },
    ],
  },

  { timestamps: true }
);

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
