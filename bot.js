const {ActivityTypes} =require("botbuilder");
const { BotFrameworkAdapter, UserState, MemoryStorage,ConversationState } = require('botbuilder');

const {ChoicePrompt, DialogSet, TextPrompt, WaterfallDialog ,ListStyle} = require('botbuilder-dialogs');

const DIALOG_STATE_PROPERTY = 'dialogState';
const USER_NAME_PROP = 'user_name';
const WHO_ARE_YOU = 'who_are_you';
const HELLO_USER = 'hello_user';

const NAME_PROMPT = 'name_prompt';
const DNI_PROMPT = 'dni_prompt';
const LOCATION_PROMPT = 'locationPrompt';


class MyBot {
    
     /**
     *
     * @param {Object} conversationState
     * @param {Object} userState
     */

    constructor(conversationState, userState) {
        // creates a new state accessor property.
        // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors
        this.conversationState = conversationState;
        this.userState = userState;

        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);

        this.userName = this.userState.createProperty(USER_NAME_PROP);

        this.dialogs = new DialogSet(this.dialogState);

        // Add prompts

        this.dialogs.add(new TextPrompt(DNI_PROMPT));

        this.dialogs.add(new TextPrompt(NAME_PROMPT));

        let elegir=new ChoicePrompt('locationPrompt');
        elegir.style=ListStyle.heroCard;

        this.dialogs.add(elegir);

        // Create a dialog that asks the user for their name.

        this.dialogs.add(new WaterfallDialog("BIENVENIDO", [
            this.askForDNI.bind(this),
            this.promptForLocation.bind(this)
        ]));

        this.dialogs.add(new WaterfallDialog(WHO_ARE_YOU, [
            this.askForName.bind(this),
            this.promptForLocation.bind(this),
        ]));

        // Create a dialog that displays a user name after it has been collected.
        this.dialogs.add(new WaterfallDialog(HELLO_USER, [
            this.displayName.bind(this)
        ]));
    }


    async askForDNI(dc)
    {
        await dc.prompt(DNI_PROMPT, `Por favor, podrias indicarme tu DNI?`);
    }

    // The first step in this waterfall asks the user for their name.
    async askForName(dc) {
        await dc.prompt(NAME_PROMPT, `What is your name, human?`);
    }

    async promptForLocation(stepContext) {
        // Record the party size information in the current dialog state.
        stepContext.values.size = stepContext.result;
    
        // Prompt for location.
        return await stepContext.prompt(LOCATION_PROMPT, {
            prompt: 'Por favor elige una opcion',
            retryPrompt: 'Disculpa, Por favor elige una opcion de la lista.',
            choices: ['Menu del dia', 'Menu de la semana']
        });
    }

    // The second step in this waterfall collects the response, stores it in
    // the state accessor, then displays it.
    async collectAndDisplayName(step) {
        await this.userName.set(step.context, step.result);
        await step.context.sendActivity(`Got it. You are ${ step.result }.`);
        await step.endDialog();
    }

    // This step loads the user's name from state and displays it.
    async displayName(step) {
        const userName = await this.userName.get(step.context, null);
        await step.context.sendActivity(`Your name is ${ userName }.`);
        await step.endDialog();
    }

    async onTurn(turnContext)
    {

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            // Create dialog context
            const dc = await this.dialogs.createContext(turnContext);

            // Continue the current dialog
            if (!turnContext.responded) {
                await dc.continueDialog();
            }

            // Show menu if no response sent
            if (!turnContext.responded) {
                const userName = await this.userName.get(dc.context, null);
                if (userName) {
                    await dc.beginDialog(HELLO_USER);
                    //await dc.beginDialog("BIENVENIDO");
                } else {
                   // await dc.beginDialog(WHO_ARE_YOU);
                   await dc.beginDialog("BIENVENIDO");
                }
            }
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            // Do we have any new members added to the conversation?
            if (turnContext.activity.membersAdded.length !== 0) {
                // Iterate over all new members added to the conversation
                for (let idx in turnContext.activity.membersAdded) {
                    // Greet anyone that was not the target (recipient) of this message.
                    // Since the bot is the recipient for events from the channel,
                    // context.activity.membersAdded === context.activity.recipient.Id indicates the
                    // bot was added to the conversation, and the opposite indicates this is a user.
                    if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
                        // Send a "this is what the bot does" message to this user.
                        await turnContext.sendActivity('Bienvenido al chat del comedor de Falabella');
                    }
                }
            }
        }

        // Save changes to the user name.
        await this.userState.saveChanges(turnContext);

        // End this turn by saving changes to the conversation state.
        await this.conversationState.saveChanges(turnContext);


        /* if(turnContext.activity.type===ActivityTypes.Message)
        {
           // await turnContext.sendActivity("tu dijiste: "+turnContext.activity.text);
            await turnContext.sendActivity("Bievenido al menu de Falabella");
        }
        else
        {
            await turnContext.sendActivity('otra actividad');

        }
 */
    }

}

module.exports.MyBot = MyBot;