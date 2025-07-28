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
            formName:{type:String, default:"Form Name"},
            isDraft:{type:Boolean},
            pages:[
              {
                pageName:{type:String},
                pageQuestions:[
                  {
                    questionType:{type:String},
                    questionNum:{type:Number},
                    questionName:{type:String},
                    questionImage:{type:String},
                    questionVideo:{type:String},
                    questionText:{type:String},
                    options:[
                      {
                        optionType:{type:String},
                        optionName:{type:String}
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
  },

  { timestamps: true }
);

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
