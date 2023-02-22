const Message = require("../models/message.model.js");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports.sendChat = (req, res, next) => { // TODO: 1st phase without user. 2nd phase with 1 user. 3rd phase 2 users
  let history = "";

  const userId = req.user.id;
  Message.find({ user: userId })
    .then((messages) => {
      if( messages != undefined) {
        history = messages.reduce((accumulator, message) => {
          return accumulator + message.message + '\n';
        }, '');
        console.log(history);
      } else {
        console.log("History empty");
      }
    })
    .then(() => {
      const patientPrefix = 'Patient: '
      req.body.message = patientPrefix + req.body.message  ;
      const { message } = req.body;
      
      req.body.user = req.user.id;
      // create new message document in MongoDB
      Message.create({ message, user: req.user.id })
        .then(() => {
          // generate response from OpenAI API
          return openai.createCompletion({
            model: "text-davinci-003",
            prompt:
              `//Imagine a conversation between a therapist (called "TherapyAi") and a patient. I will provide the patient's dialogue and you only will provide the therapist dialogue. Don't autocomplete the patient's dialogue. Create only the dialogue for the therapist taking in count the patient's answer and the patient's info. If the patient shows any kind of harmful behaviour, please advise the patient to seek for professional real help.//
            ` +
              history + 
              message +
              '" \n\n',
            max_tokens: 64,
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
          return Message.create({ message: reply, user: req.user.id  });
        })
        .then(() => {
          // load all messages and render chat UI
          return Message.find({ user: userId });
        })
        .then((messages) => {
          res.render("chat", { messages });
        })
        .catch((error) => {
          console.error("An error occurred", error);
          res.status(500).send("An error occurred");
        });
    })
};

module.exports.loadChat = (req, res, next) => {
  const userId = req.user.id;
  Message.find({ user: userId })
    .then((messages) => {
      res.render("chat", { messages });
    })
    .catch((error) => {
      console.error("An error occurred", error);
    });
};
