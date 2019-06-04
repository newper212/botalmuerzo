const restify=require('restify');
const { MyBot } = require('./bot');
const { AbogaBot } = require('./abogabot');
const { BotFrameworkAdapter, UserState, MemoryStorage,ConversationState,PrivateConversationState} = require('botbuilder');

const conversationstate= new ConversationState(new MemoryStorage());

var adapter=new BotFrameworkAdapter(
{
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);
privateConversationState=new PrivateConversationState(memoryStorage);

//const bot = new MyBot(conversationState, userState);
const abogbot = new AbogaBot(conversationState, userState,privateConversationState);

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




