'use strict';
const Alexa = require('alexa-sdk');

const HELP_MESSAGE = 'Confirm that you would like to hear facts about Nolan North.';
const HELP_REPROMPT = 'Do you want more Nolan North facts?';
const STOP_MESSAGE = 'Goodbye!';

////////////////////////////////////////////////////////////////////////////////
// NORTH FACT DATA
////////////////////////////////////////////////////////////////////////////////

const northCreditsList = [
  {
    mediaType: 'game',
    mediaName: 'Destiny 2',
    credit: 'Ghost'
  },
  {
    mediaType: 'game',
    mediaName: 'Batman: Arkham Series',
    credit: 'The Penguin'
  },
  {
    mediaType: 'game',
    mediaName: 'Uncharted',
    credit: 'Nathan Drake'
  },
  {
    mediaType: 'game',
    mediaName: 'DotA 2',
    credit: 'Meepo'
  },
  {
    mediaType: 'game',
    mediaName: 'Diablo 3',
    credit: 'Monster Voices and Additional Monster Sounds'
  },
  /*
  {
    mediaType: 'TBD',
    mediaName: 'TBD',
    credit: 'TBD'
  },
  */
];

////////////////////////////////////////////////////////////////////////////////
// RESPONSE LOGIC
////////////////////////////////////////////////////////////////////////////////
const handlers = {
  // when the skill is first launched
    'LaunchRequest': function () {
      if(Object.keys(this.attributes).length === 0){
        this.attributes.northFacts = {
          'northPoints': 0,
          'factNumber': 0
        };
        // if they're a new user, introduce them
        this.response.speak(`Welcome to NorthFacts, where you can learn about Nolan North, and rack up northPoints! Let's start you with your first fact. ${FactRequest(this.attributes)} Would you like another fact?`).listen('Would you like another fact?');
      }
      else{
        // if they're returning, let them know their score and begin the facts!
        this.response.speak(`Welcome back to NorthFacts! You have ${this.attributes.northFacts.northPoints} northPoints. Time for the next fact! ${FactRequest(this.attributes)} Would you like another fact?`).listen('Would you like another fact?');
      }
      this.attributes.northFacts.northPoints++;
      this.emit(':responseReady');

    },
    // user wants more facts
    'MoreFacts': function (){
      this.response.speak(`${FactRequest(this.attributes)} Would you like another fact?`).listen('Would you like another fact?');
      this.attributes.northFacts.northPoints++;
      this.emit(':responseReady');
    },
    // user declines facts. they are confused
    'UserDecline': function (){
      this.response.speak(`One northPoint has been deducted from your total. Here is your next fact: ${FactRequest(this.attributes)} Would you like another fact?`).listen('Would you like another fact?');
      this.attributes.northFacts.northPoints--;
      this.emit(':responseReady');
        },
    // user wants to know what their northPoints score is
    'CheckScore': function (){
      this.response.speak(`You have ${this.attributes.northFacts.northPoints} northPoints. Would you like to increase your score?`).listen('Would you like to increase your score?');
      this.attributes.northFacts.northPoints++;
      this.emit(':responseReady');
    },
    // user is confused
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    // why would anyone ever want this?
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    // who would want to stop getting these wonderful facts?
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    // Save state to dynamoDB if user exits
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
}
};

// function to handle fact requests
const FactRequest = function(attributes){
  // if user has not reached the end of the facts, keep going
  if (attributes.northFacts.factNumber < northCreditsList.length) {
    let factNumber = attributes.northFacts.factNumber;
    let currentGame = northCreditsList[factNumber].mediaName;
    let currentCredit = northCreditsList[factNumber].credit;
    let mediaType = northCreditsList[factNumber].mediaType;
    attributes.northFacts.factNumber++;
    return `Nolan North voiced ${currentCredit} in the ${mediaType} ${currentGame}`;
  }
  else {
    // if user has heard all the facts, start over
    attributes.northFacts.factNumber = 0;
    let factNumber = attributes.northFacts.factNumber;
    let currentGame = northCreditsList[factNumber].mediaName;
    let currentCredit = northCreditsList[factNumber].credit;
    let mediaType = northCreditsList[factNumber].mediaType;
    attributes.northFacts.factNumber++;
    return `Nolan North voiced ${currentCredit} in the ${mediaType} ${currentGame}`;
  }

};

// do it, Amazon. DO YOUR CLOUD MAGIC!
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = 'nolanNorthFactsDB';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
