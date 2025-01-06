import {io} from './app2.js';

import MemoryCard from './Models/MemoreyCards.js';

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// export const memoryGame=()=> {
    
   let rooms=[];
   let memoryCards=[]
    export const enterToGame=()=> {
        io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        
        socket.on('join-game',(chatId,currentUser)=>{
        // const {chatId,currentUser}=req.body;
        const room=`0${chatId}`;
        if(rooms.has(room)){
            const cell=rooms.get(room);
            if(cell[0]===currentUser && cell[1]===null){ //אם היוזר הנוכחי הוא השחקן הראשון שנכנס
                io.to(room).emit("loading");
            }
            else if((cell[0]!=currentUser && cell[0]!=null) && cell[1]===null) //  השני אם נכנס 
            {
                cell[1]=currentUser
                io.to(room).emit("gameStart","game start",memoryCards,cell[0],cell[1] ); //מחזיר את היוזרים
                console.log(cell[0],cell[1]);
                res.status(200);
            }
        }
        else{
            rooms.add({[room]:[currentUser,null]});
            memoryCards=MemoryCard.toArray();
            memoryCards=shuffleArray(memoryCards);

        } })//מכיל אובייקט שהKEY הוא החדר והValue הוא מערך של יוזרים שמשתתפים

        socket.on('currentGuess',(card1,card2)=>{
            memoryCards.splice(memoryCards.indexOf(card1),1);
            memoryCards.splice(memoryCards.indexOf(card2),1);
            io.to(room).emit('updateCards',memoryCards);
       })
    })}
    // io.on('connection', (socket) => {
    //     let memoryCards=[];
    //     console.log('user connected');
    //     // socket.on('join-game',(user1,user2)=>{
    //         console.log(user1,user2);
    //         memoryCards=MemoryCard.toArray();
    //         const room=`${user1.id}-${user2.id}`;
    //         socket.join(room);
    //         memoryCards=shuffleArray(memoryCards);
    //         io.to(room).emit('gameStart',"game start",memoryCards);
        
      
    // })
// }