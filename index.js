const restify=require('restify');
const { MyBot } = require('./bot');
const { AbogaBot } = require('./abogabot');
const { BotFrameworkAdapter, UserState, MemoryStorage,ConversationState } = require('botbuilder');

const conversationstate= new ConversationState(new MemoryStorage());

var adapter=new BotFrameworkAdapter(
{
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);


//const bot = new MyBot(conversationState, userState);
const abogbot = new AbogaBot(conversationState, userState);

let server=restify.createServer();
server.listen(process.env.port||process.env.PORT||3978,()=>
{
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
}
);
server.post('/api/messages',(req,res)=>{
    adapter.processActivity(req,res,async(turncontext)=>{
       

       // await bot.onTurn(turncontext);
       await abogbot.onTurn(turncontext);
    });

});



var menuItems = {
    //this menu item will indicate that the user has completed their order
    "Done - Check Out":{
        title: "Check Out",
        price: 0
    },
    "Large Pepperoni Pizza  - $7.99": {
        title: "Large Pepperoni Pizza",
        price: 7.99
    },
    "Philly Cheese Sub - $5.99": {
        title: "Philly Cheese Sub",
        price: 5.99
    },
    "Joyful Pasta - $7.75": {
        title: "Joyful Pasta",
        price: 7.75
    }
};



