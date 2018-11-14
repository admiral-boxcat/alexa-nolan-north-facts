'use strict';
const Alexa = require('alexa-sdk');

const SKILL_NAME = '';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = '';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
/*const northFacts = {
  {
    question: 'What character did Nolan North voice in the Uncharted series?',
    answer: 'Desmond Miles'
  },
  {
    question: 'What character did Nolan North voice in the Batman: Arkham series?',
    answer: 'The Penguin'
  },
  {
    question: 'What character did Nolan North voice in Star Trek Into Darkness?',
    answer: 'A Helmsman on the USS Vengeance'
  },
  {
    question: 'What character did Nolan North voice in ',
    answer: ''
  },
  {
    question: 'What character did Nolan North voice in ',
    answer: ''
  },

}


const nolanNorthData = {
  'birthday': 'October 31st, 1970',
  'full name': 'Nolan Ramsey North',
  'married': true,
  'children': 2,
  'cityBorn': 'New Haven, Connecticut'
}
*/
////////////////////////////////////////////////////////////
const handlers = {
    'LaunchRequest': function () {
      if(Object.keys(this.attributes).length === 0){
        this.attributes.northFacts = {
          'northPoints': 0,
        };
        this.response.speak('Welcome to NorthFacts, where you can learn about Nolan North, and rack up northPoints!');
      }
      else{
        this.response.speak('Welcome back to NorthFacts! Your score is ' + this.attributes.northFacts.northPoints'.');
      }
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


exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = 'nolanNorthFactsDB';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
