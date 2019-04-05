const {ActivityTypes} =require("botbuilder");
const { BotFrameworkAdapter, UserState, MemoryStorage,ConversationState,CardFactory } = require('botbuilder');

const {ChoicePrompt, DialogSet, TextPrompt, WaterfallDialog ,ListStyle} = require('botbuilder-dialogs');

const DIALOG_STATE_PROPERTY = 'dialogState';
const USER_NAME_PROP = 'user_name';
const WHO_ARE_YOU = 'who_are_you';
const HELLO_USER = 'hello_user';
const BIENVENIDO = 'bienvenido';
const INICIO='inicio';
const MENU_SEMANAL='menusemanal';
const DESPEDIDA='despedida';


const NAME_PROMPT = 'name_prompt';
const DNI_PROMPT = 'dni_prompt';
const RECLAMO_PROMPT = 'reclamo_prompt';
const FECHARECLAMO_PROMPT = 'fechareclamo_prompt';
const MEDIORECLAMO_PROMPT = 'medioreclamo_prompt';

const MENU_PROMPT = 'menuPrompt';
const CONTINUAR_PROMPT = 'continuarPrompt';

const SEMANAL_CONTINUAR_PROMPT='semanalContinuarPrompt';


class AbogaBot {
    
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
        this.dialogs.add(new TextPrompt(BIENVENIDO));
        this.dialogs.add(new TextPrompt(NAME_PROMPT));
        this.dialogs.add(new TextPrompt("SALUDOS"));
        this.dialogs.add(new TextPrompt(DESPEDIDA));

        let menu=new ChoicePrompt(MENU_PROMPT);
        menu.style=ListStyle.heroCard;
        this.dialogs.add(menu);

        let menuSeguir=new ChoicePrompt(CONTINUAR_PROMPT);
        menuSeguir.style=ListStyle.heroCard;
        this.dialogs.add(menuSeguir);

        let menuSeguirSemanal=new ChoicePrompt(SEMANAL_CONTINUAR_PROMPT);
        menuSeguirSemanal.style=ListStyle.heroCard;
        this.dialogs.add(menuSeguirSemanal);

        // Create a dialog that asks the user for their name.

        this.dialogs.add(new WaterfallDialog(INICIO, [
            this.WelcometoBot.bind(this),
            this.askForDNI.bind(this),
            this.askForMenuContinuar.bind(this)
            
        ]));

        this.dialogs.add(new WaterfallDialog(MENU_SEMANAL, [
            this.MenuSemanalBot.bind(this),
            this.askForOpcionSemanal.bind(this)
            
        ]));

        this.dialogs.add(new WaterfallDialog(WHO_ARE_YOU, [
            this.askForName.bind(this),
            this.promptForMenu.bind(this),
        ]));

        // Create a dialog that displays a user name after it has been collected.
        this.dialogs.add(new WaterfallDialog(HELLO_USER, [
            this.displayName.bind(this)
        ]));
    }


    async promptContinuar(dc) {

        return await dc.prompt(CONTINUAR_PROMPT, {
            prompt: 'Desea ver otros menus?',
            retryPrompt: 'Disculpa, Por favor elige una opcion de la lista.',
            choices: CardFactory.actions([{title:"1",value:"SI"},{title:"2",value:"NO"}])
        });

        
    }
  

    async askForOpcionSemanal(dc)
    {
        
        
        console.log('dsdsd');
        await dc.context.sendActivity({ attachments: [this.createHeroCard(),this.createHeroCard2()] });
        return await dc.prompt(CONTINUAR_PROMPT, {
            prompt: 'Desea ver otros menus?',
            retryPrompt: 'Disculpa, Por favor elige una opcion de la lista.',
            choices: CardFactory.actions([{title:"1",value:"SI"},{title:"2",value:"NO"}])
        });
       // return await dc.replaceDialog(MENU_SEMANAL);
    }


   async BienvenidaBot(dc)
   {
    dc.prompt("SALUDOS",'Bienvenido al bot de RRHH2323');
   }


   async despedidaBot(dc)
   {
    dc.prompt(DESPEDIDA,'Gracias por usar el bot.');
   }

    async WelcometoBot(dc)
    {
        // dc.prompt("SALUDOS",'Bienvenido al bot de RRHH');
       // dc.context.sendActivity('Bienvenido al bot de RRHH');
         return await dc.prompt(MENU_PROMPT, {
            prompt: 'Por favor elige una opcion',
            retryPrompt: 'Disculpa, Por favor elige una opcion de la lista.',
            choices: CardFactory.actions([{title:"1",value:"Menu del Dia"},{title:"2",value:"Menu de la Semana"}])
        });

    }



    async askForMenuContinuarSemanal(dc)
    {

        console.log("valor de continuar: "+dc.result.index);
        if(dc.result.index==0)
        {
            return await dc.replaceDialog(INICIO);
        }
        else
        {
            await dc.context.sendActivity('Gracias por visitar el robot de RRHH.');
           return await dc.endDialog();
        }
    }

    async askForMenuContinuar(dc)
    {

        console.log("valor de continuar: "+dc.result.index);
        if(dc.result.index==0)
        {
            return await dc.replaceDialog(INICIO);
        }
        else
        {
            await dc.context.sendActivity('Gracias por visitar el robot de RRHH.');
           return await dc.endDialog();
        }
    }


    


    async MenuSeguirBot(dc)
    {
        // dc.prompt("SALUDOS",'Bienvenido al bot de RRHH');
       // dc.context.sendActivity('Bienvenido al bot de RRHH');
         return await dc.prompt(MENU_PROMPT, {
            prompt: 'Elija un dia del menu',
            retryPrompt: 'Disculpa, Por favor elige una opcion de la lista.',
            choices: CardFactory.actions([{title:"1",value:"Lunes"},{title:"2",value:"Martes"},
            {title:"3",value:"Miercoles"},{title:"4",value:"Jueves"},{title:"5",value:"Viernes"}])
        });

    }


    async MenuSemanalBot(dc)
    {
        // dc.prompt("SALUDOS",'Bienvenido al bot de RRHH');
       // dc.context.sendActivity('Bienvenido al bot de RRHH');
         return await dc.prompt(MENU_PROMPT, {
            prompt: 'Elija un dia del menu',
            retryPrompt: 'Disculpa, Por favor elige una opcion de la lista.',
            choices: CardFactory.actions([{title:"1",value:"Lunes"},{title:"2",value:"Martes"},
            {title:"3",value:"Miercoles"},{title:"4",value:"Jueves"},{title:"5",value:"Viernes"}])
        });

    }

    async ElegirOpcion(dc)
    {
        await dc.prompt(DNI_PROMPT, `Por favor, podrias indicarme tu DNI?`);
       
    }

    async askForNomApe(dc)
    {
        await dc.prompt(DNI_PROMPT, `Por favor, podrias indicarme tu DNI?`);
    }

    async askForDNI(dc)
    {
        
        console.log(dc.result.index);
        if(dc.result.index==0)
        {
        console.log('dsdsd');
        await dc.context.sendActivity({ attachments: [this.createHeroCard(),this.createHeroCard2()] });
        return await dc.prompt(CONTINUAR_PROMPT, {
            prompt: 'Desea ver otros menus?',
            retryPrompt: 'Disculpa, Por favor elige una opcion de la lista.',
            choices: CardFactory.actions([{title:"1",value:"SI"},{title:"2",value:"NO"}])
        });
        }
        else
        {
            return await dc.beginDialog(MENU_SEMANAL);   
        }
        
        //await dc.prompt(DNI_PROMPT, `Por favor, podrias indicarme tu DNI?`);
    }

    // The first step in this waterfall asks the user for their name.
    async askForName(dc) {
        await dc.prompt(NAME_PROMPT, `What is your name, human?`);
    }

    async promptForMenu(stepContext) {
        // Record the party size information in the current dialog state.
        stepContext.values.size = stepContext.result;
    
        // Prompt for location.
        return await stepContext.prompt(MENU_PROMPT, {
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
        const dc = await this.dialogs.createContext(turnContext);
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            // Create dialog context
           // const dc = await this.dialogs.createContext(turnContext);

           //const resultado = await dc.continueDialog();
           console.log("valor in");
           console.log(resultado);

            // Continue the current dialog
            if (!turnContext.responded) {
                await dc.continueDialog();
            }

            // Show menu if no response sent
            if (!turnContext.responded) {
                console.log("no responde");
                const userName = await this.userName.get(dc.context, null);
                console.log("usuario");
                console.log(userName);
               // console.log("usuario: "+userName);
                if (userName) {
                    //await dc.beginDialog(HELLO_USER);
                    //await dc.beginDialog("BIENVENIDO");
                } else {
                   // await dc.beginDialog(WHO_ARE_YOU);
                   await turnContext.sendActivity('Bienvenido al bot de RRHH');
                       
                        await dc.beginDialog(INICIO);
                }
            }
        } else  if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {

            console.log("entro a actividad");
            // Do we have any new members added to the conversation?
            if (turnContext.activity.membersAdded.length !== 0) {
                // Iterate over all new members added to the conversation
                for (let idx in turnContext.activity.membersAdded) {
                    if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
                    
                        await turnContext.sendActivity('Bienvenido al bot de RRHH2');
                       
                        await dc.beginDialog(INICIO);
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

    createHeroCard() {
        return CardFactory.heroCard(
            'Menu 1: Arroz con Pollo',
            'Arroz con pollo, tequenhos y gelatina de postre',
            CardFactory.images(['https://images-gmi-pmc.edge-generalmills.com/8b79836e-e3b4-4099-bf3b-79a21257b759.jpg'])
            /* CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Get started',
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
                }
            ]) */
            
        );
    }
    createHeroCard2() {
        return CardFactory.heroCard(
            'Menu 2: Lomo Saltado',
            'Lomo saltado, arroz con leche y mandarina',
            CardFactory.images(['https://www.comedera.com/wp-content/uploads/2013/05/lomo-saltado-jugoso.jpg'])
            /* CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Get started',
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
                }
            ]) */
            
        );
    }

}

module.exports.AbogaBot = AbogaBot;