const User = require("../models/user.model");
const mongoose = require("mongoose");
const Message = require("../models/message.model.js");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports.sendNotes = (req, res, next) => {
  let history = "";

  const userId = req.user.id;
  Message.find({ user: userId })
  //TODO sort------------------------------
    .then((messages) => {
      console.log("----asking for History");
      if (messages != undefined) {
        history = messages.reduce((accumulator, message) => {
          return accumulator + message.message + "\n";
        }, "");
      } else {
        console.log("History empty");
      }
    })
    .then(() => {
      console.log("----connecting to API");
      req.body.user = req.user.id;
      const order = "//Psychological diagnosis by the Therapist: "
      // generate response from OpenAI API
      return openai.createCompletion({
        model: "text-davinci-003",
        prompt:
          `//Elaborate, from the next conversation between a Therapist and a patient, a Psychological diagnosis//
        ` +
          history + order +
          '" \n\n',
        max_tokens: 250, // 4 characters by token, 0.75 words per token
        temperature: 0.5,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
      });
      })
      .then((response) => {
        console.log("----returning API reply");
        const diagnosis = response.data.choices[0].text;
        console.log(diagnosis);
        // update diagnosis in MongoDB
        const { name, lastName, email, password } = req.body;
        const profilePic = req.file ? req.file.path : req.user.profilePic;
        return User.findByIdAndUpdate(
          req.user.id,
          { name, lastName, profilePic, email, password, diagnosis },
          { runValidators: true }
        )
      })
      .then(() => {
        res.redirect("/profile");
      })
      .catch((error) => {
        console.error("An error occurred", error);
        res.status(500).send("An error occurred");
      });
};