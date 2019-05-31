const moment = require('moment');
const {ActivityTypes} =require("botbuilder");
const { BotFrameworkAdapter, UserState, MemoryStorage,ConversationState,CardFactory } = require('botbuilder');

const {ChoicePrompt, DialogSet, TextPrompt, WaterfallDialog ,ListStyle} = require('botbuilder-dialogs');

const query=require('./querys');

const DIALOG_STATE_PROPERTY = 'dialogState';
const USER_NAME_PROP = 'user_name';
const WHO_ARE_YOU = 'who_are_you';
const HELLO_USER = 'hello_user';
const BIENVENIDO = 'bienvenido';
const INICIO='inicio';
const MENU_SEMANAL='menusemanal';
const MENU_INICIO='menuinicio';
const MENU_PAGO='menupago';
const DESPEDIDA='despedida';


const NAME_PROMPT = 'name_prompt';
const DNI_PROMPT = 'dni_prompt';
const RECLAMO_PROMPT = 'reclamo_prompt';
const FECHARECLAMO_PROMPT = 'fechareclamo_prompt';
const MEDIORECLAMO_PROMPT = 'medioreclamo_prompt';

const MENU_PROMPT = 'menuPrompt';
const CONTINUAR_PROMPT = 'continuarPrompt';

const SEMANAL_CONTINUAR_PROMPT='semanalContinuarPrompt';

const  myData = ['01/01/2019','01/02/2019','01/03/2019','01/04/2019','28/05/2019','27/06/2019','26/07/2019','28/08/2019','26/09/2019','28/10/2019','27/11/2019','27/12/2019']; 

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
            this.MostrarOpcionesGenerales.bind(this),
            this.askForOpcionGeneral.bind(this),
            //this.WelcometoBot.bind(this),
            //this.askForDNI.bind(this),
            //this.askForMenuContinuar.bind(this)
            
        ]));

        this.dialogs.add(new WaterfallDialog(MENU_INICIO,[
            this.WelcometoBot.bind(this),
            this.askForDNI.bind(this),
            this.askForMenuContinuar.bind(this)
        ]));

        this.dialogs.add(new WaterfallDialog(MENU_PAGO,[
            this.showMostrar.bind(this),
            this.askforMenuPago.bind(this)
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
            prompt: '¿Quieres ver otros menús?',
            retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
            choices: CardFactory.actions([{title:"1",value:"SI"},{title:"2",value:"NO"}])
        });

        
    }
  

    async askForOpcionSemanal(dc)
    {
 
var now =  moment();
var tarjeta=await query.buscarMenuDia(dc.result.value);
//console.log(tarjeta);
var ArrayHeroCard = [];
var self=this;
var contador=1;
tarjeta.forEach(function(value){
    ArrayHeroCard.push(self.createHeroCard(contador,value['plato fondo'],value['entrada'],value['postre'],value['refresco'],value['url']));
    contador++;
  });


        if(ArrayHeroCard.length>0)
        await dc.context.sendActivity({ attachments: ArrayHeroCard });
        else
        await dc.context.sendActivity('No se han registrado menus para este día');
        
        return await dc.prompt(CONTINUAR_PROMPT, {
            prompt: '¿Quieres ver otros menús?',
            retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
            choices: CardFactory.actions([{title:"1",value:"SI"},{title:"2",value:"NO"}])
        });
      
    }


   async BienvenidaBot(dc)
   {
    dc.prompt("SALUDOS",'Bienvenido al bot de RRHH2323');
   }


   async despedidaBot(dc)
   {
    dc.prompt(DESPEDIDA,'Gracias por usar el bot.');
   }

   async showMostrar(dc)
   {
       console.log(myData);
       console.log(moment().month());
       var mesPos=(moment().month());
       console.log('32432423');
       console.log(mesPos);
       console.log('asdsad');
       await dc.context.sendActivity('El día de pago para el mes actual es: '+myData[mesPos]);
       return await dc.prompt(CONTINUAR_PROMPT, {
        prompt: '¿Desea regresar al menu principal?',
        retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
        choices: CardFactory.actions([{title:"1",value:"SI"},{title:"2",value:"NO"}])
    });


   }

    async WelcometoBot(dc)
    {

      
        // dc.prompt("SALUDOS",'Bienvenido al bot de RRHH');
       // dc.context.sendActivity('Bienvenido al bot de RRHH');
         return await dc.prompt(MENU_PROMPT, {
            prompt: 'Por favor, elige una opción',
            retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
            choices: CardFactory.actions([{title:"1",value:"Menú del Día"},{title:"2",value:"Menú de la Semana"},{title:"3",value:"Salir"}])
        });

    }


    async MostrarOpcionesGenerales(dc)
    {

      
        // dc.prompt("SALUDOS",'Bienvenido al bot de RRHH');
       // dc.context.sendActivity('Bienvenido al bot de RRHH');
         return await dc.prompt(MENU_PROMPT, {
            prompt: 'Por favor, elige una opción',
            retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
            choices: CardFactory.actions([{title:"1",value:"Menús"},{title:"2",value:"Fecha de Pago"}])
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
            await dc.context.sendActivity('Gracias por visitarme.');
           return await dc.endDialog();
        }
    }

    async askForMenuContinuar(dc)
    {

        console.log("valor de continuar: "+dc.result.index);
        if(dc.result.index==0)
        {
            return await dc.replaceDialog(MENU_INICIO);
        }
        else
        {
           // await dc.context.sendActivity('Gracias por visitarme.');
           //return await dc.endDialog();
            return await dc.replaceDialog(INICIO);
        }
    }

    async askforMenuPago(dc)
    {

        console.log("valor de continuar: "+dc.result.index);
        if(dc.result.index==0)
        {
            return await dc.replaceDialog(INICIO);
        }
        else
        {
            await dc.context.sendActivity('Gracias por visitarme.');
           return await dc.endDialog();
           // return await dc.replaceDialog(INICIO);
        }
    }
    


    async MenuSeguirBot(dc)
    {
        
        // dc.prompt("SALUDOS",'Bienvenido al bot de RRHH');
       // dc.context.sendActivity('Bienvenido al bot de RRHH');
         return await dc.prompt(MENU_PROMPT, {
            prompt: 'Elija un día del menú',
            retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
            choices: CardFactory.actions([{title:"1",value:"Lunes"},{title:"2",value:"Martes"},
            {title:"3",value:"Miércoles"},{title:"4",value:"Jueves"},{title:"5",value:"Viernes"}])
        });

    }


    async MenuSemanalBot(dc)
    {
        // dc.prompt("SALUDOS",'Bienvenido al bot de RRHH');
       // dc.context.sendActivity('Bienvenido al bot de RRHH');
         return await dc.prompt(MENU_PROMPT, {
            prompt: 'Elija un día del menú',
            retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
            choices: CardFactory.actions([{title:"1",value:"Lunes"},{title:"2",value:"Martes"},
            {title:"3",value:"Miércoles"},{title:"4",value:"Jueves"},{title:"5",value:"Viernes"},
            {title:"6",value:"Sabado"},{title:"5",value:"Domingo"}])
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


    async askForOpcionGeneral(dc)
    {
        if(dc.result.index==0)
        {
            return await dc.beginDialog(MENU_INICIO);   
        }
        else
        {

            return await dc.beginDialog(MENU_PAGO);   

        }
    }

    async askForDNI(dc)
    {
       
     
        
        //console.log(dc.result.index);
        if(dc.result.index==0)
        {
            var now =  moment();
           // moment.locale('es');
            var inicio =  moment(now).locale('es').format("dddd");
       // console.log('dia actual');
//console.log(inicio);
var tarjeta=await query.buscarMenuDia(inicio);

var ArrayHeroCard = [];
var self=this;
var contador=1;
//console.log(ArrayHeroCard);
tarjeta.forEach(function(value){
    //console.log(contador);
   // console.log(value['Id']);
    //console.log(value['titulo']);
    ArrayHeroCard.push(self.createHeroCard(contador,value['plato fondo'],value['entrada'],value['postre'],value['refresco'],value['url']));
    contador++;
  });


        //console.log('dsdsd');
        //await dc.context.sendActivity({ attachments: [this.createHeroCard(),this.createHeroCard2()] });
        if(ArrayHeroCard.length>0)
        await dc.context.sendActivity({ attachments: ArrayHeroCard });
        else
        await dc.context.sendActivity('No se han registrado menus para este dia');

        return await dc.prompt(CONTINUAR_PROMPT, {
            prompt: '¿Quieres ver otros menús?',
            retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
            choices: CardFactory.actions([{title:"1",value:"SI"},{title:"2",value:"NO"}])
        });
        }
        else if(dc.result.index==1)
        {
            return await dc.beginDialog(MENU_SEMANAL);   
        }
        else
        {
           // return await dc.beginDialog(MENU_SEMANAL);
           return await dc.replaceDialog(INICIO);
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
            prompt: 'Por favor, elige una opción',
            retryPrompt: 'Disculpa, Por favor elige una opción de la lista.',
            choices: ['Menu del dia', 'Menu de la semana','Salir']
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

    async addDelayStep() {
        //console.log('timer start--let's wait');
        await timeout(13000);
        console.log('timer end--let');
       // return step.beginDialog(SOME_OTHER_DIALOG);
    }



    async onTurn(turnContext)
    {
        const dc = await this.dialogs.createContext(turnContext);
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            //console.log('cantidad ');
            //console.log(turnContext.activity.membersAdded.length);
            //console.log('------------------------');
           // console.log(turnContext);
            // Create dialog context
           // const dc = await this.dialogs.createContext(turnContext);

           //const resultado = await dc.continueDialog();
           //console.log("valor in");
           //console.log(resultado);
        
            // Continue the current dialog
            if (!turnContext.responded) {
                await dc.continueDialog();
            }

            // Show menu if no response sent
            if (!turnContext.responded) {
                //console.log("no responde");
                //console.log(turnContext);
                //await turnContext.sendActivity('Bienvenido al bot de RRHH4');
                
                const userName = await this.userName.get(dc.context, null);
                //console.log("usuario");
                //console.log(userName);
               // console.log("usuario: "+userName);
                if (userName) {
                    //await dc.beginDialog(HELLO_USER);
                    //await dc.beginDialog("BIENVENIDO");
                } else {
                   // await dc.beginDialog(WHO_ARE_YOU);
                
                  // savedAddress = session.message.address;
                   //console.log(dc);
                   await turnContext.sendActivity('Hola, soy Amanda tu asistente virtual');
                       
                        await dc.beginDialog(INICIO);
                }
            }

            //await addDelayStep();
        } 
        /*else  if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {

            console.log("entro a actividad");
            console.log(turnContext.activity.type);
            // Do we have any new members added to the conversation?
            if (turnContext.activity.membersAdded.length !== 0) {
                // Iterate over all new members added to the conversation
                for (let idx in turnContext.activity.membersAdded) {
                    if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
                    
                        await turnContext.sendActivity('Bienvenido al bot de RRHH');
                       
                        await dc.beginDialog(INICIO);
                    }
                }node i
            }
        }*/


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

    createHeroCard(posicion,plato_fondo,entrada,postre,refresco,url) {
        return CardFactory.heroCard(
            'Menu ' + posicion+ ': '+ plato_fondo,
            plato_fondo+', '+entrada+', '+postre+' y '+refresco,
            CardFactory.images([url])
    
        );
    }
  

}

module.exports.AbogaBot = AbogaBot;