const hbs = require("hbs");

hbs.registerPartials(`${__dirname}/../views/partials`);

hbs.registerHelper("contains", function (str, substr) {
  return str.indexOf(substr) !== -1;
});

hbs.registerHelper("removePrefix", function (message) {
  if (message.startsWith("Patient: ")) {
    return message.substring(9);
  } else if (message.startsWith("Therapist: ")) {
    return message.substring(11);
  } else {
    return message;
  }
});
