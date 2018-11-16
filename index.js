'use strict';
const Alexa = require('alexa-sdk');

const SKILL_NAME = '';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = '';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
const northFacts = [
  {
    fact: 'Nolan North voiced Desmond Miles in the Uncharted series.'
  },
  {
    fact: 'Nolan North  was born on Oct 31st 1970.'
  },
  {
    fact: 'Nolan North  was born in New Haven, Connecticut.'
  },
  {
    fact: 'Nolan North Fact#4.'
  },
  {
    fact: 'Nolan North Fact#5.'
  },
  {
    fact: 'Nolan North Fact#6.'
  },
  {
    fact: 'Nolan North Fact#7.'
  }
];

//const numberOfFacts = northFacts.length % this.attributes.northFacts.northPoints;

/*
const nolanNorthBio = {
  'birthday': 'October 31st, 1970',
  'full name': 'Nolan Ramsey North',
  'married': true,
  'children': 2,
  'cityBorn': 'New Haven, Connecticut'
};
*/

////////////////////////////////////////////////////////////
const handlers = {
    'LaunchRequest': function () {
      if(Object.keys(this.attributes).length === 0){
        this.attributes.northFacts = {
          'northPoints': 0,
        };
        this.response.speak(`Welcome to NorthFacts, where you can learn about Nolan North, and rack up northPoints! Let's start you with your first fact. ${FactRequest(this.attributes)} Would you like another fact?`).listen('Would you like another fact?');
      }
      else{
        this.response.speak(`Welcome back to NorthFacts! You have ${this.attributes.northFacts.northPoints} northPoints. Time for the next fact! ${FactRequest(this.attributes)} Would you like another fact?`).listen('Would you like another fact?');
      }
      this.attributes.northFacts.northPoints++;
      this.emit(':responseReady');

    },
    'MoreFacts': function (){
      this.response.speak(`${FactRequest(this.attributes)} Would you like another fact?`).listen('Would you like another fact?');
      this.attributes.northFacts.northPoints++;
      this.emit(':responseReady');
    },
    'CheckScore': function (){
      this.response.speak(`You have ${this.attributes.northFacts.northPoints} northPoints. Would you like to increase your score?`).listen('Would you like to increase your score?');
      this.attributes.northFacts.northPoints++;
      this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    // Save state
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
}
};

const FactRequest = function(attributes){
  let northPoints = attributes.northFacts.northPoints;
  let factNumber = northPoints % northFacts.length;
  let currentFact = northFacts[northPoints].fact;
  return currentFact;
};


exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = 'nolanNorthFactsDB';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
