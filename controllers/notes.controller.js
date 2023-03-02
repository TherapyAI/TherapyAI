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
  //TODO sort
    .then((messages) => {
      if (messages != undefined) {
        history = messages.reduce((accumulator, message) => {
          return accumulator + message.message + "\n";
        }, "");
      } else {
        console.log("History empty");
      }
    })
    .then(() => {
      req.body.user = req.user.id;
      const order = "//Psychological diagnosis: "
      // create new message document in MongoDB
      return Message.create({ user: req.user.id })
        .then(() => {
          // generate response from OpenAI API
          return openai.createCompletion({
            model: "text-davinci-003",
            prompt:
              `//Elaborate, from the next conversation between a Therapist and a patient, a Psychological diagnosis//
            ` +
              history + order +
              '" \n\n',
            max_tokens: 120, // 4 characters by token, 0.75 words per token
            temperature: 0.5,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["\n"],
          });
        })
        .then((response) => {
          const reply = response.data.choices[0].text;
          // create new reply message document in MongoDB
          return Message.create({ message: reply, user: req.user.id });
        })
        .then(() => {
          // load all messages and render chat UI
          return Message.find({ user: userId });
        })
        .then((messages) => {
          res.render("users/profile", { messages, profilePic: req.user.profilePic });
        })
        .catch((error) => {
          console.error("An error occurred", error);
          res.status(500).send("An error occurred");
        });
    });
};

module.exports.loadNotes = (req, res, next) => {
  const userId = req.user.id;
  Message.find({ user: userId })
    .then((messages) => {
      res.render("users/profile", { messages, profilePic: req.user.profilePic });
    })
    .catch((error) => {
      console.error("An error occurred", error);
    });
};
