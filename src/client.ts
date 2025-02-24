const socket = io({
  auth:{
    serverOffset: 0
  }
});
const form: HTMLFormElement = document.getElementById('form') as HTMLFormElement;
const input: HTMLInputElement = document.getElementById('input') as HTMLInputElement;
const messages: HTMLElement = document.getElementById('messages') as HTMLElement;
const toggleButton: HTMLButtonElement = document.getElementById('toggle-btn') as HTMLButtonElement;
const modal = document.getElementById("nameModal") as HTMLElement;
const closeBtn = document.getElementsByClassName("close")[0] as HTMLButtonElement;
const submitNameBtn = document.getElementById("submitName") as HTMLButtonElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;

      //Disconnect button
      toggleButton.addEventListener('click', (e)=>{
        e.preventDefault();
        if(socket.connected){
          toggleButton.innerText = 'Connect';
          socket.disconnect();
        }else{
          toggleButton.innerText = 'Disconnect';
          socket.connect();
        }
      });

      //Send message button
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        if(input.value){
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });

      //li message
      socket.on('chat message', (msg: string, serverOffset: any)=>{
        const item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
        (socket as any).auth.serverOffset = serverOffset;
      });

      socket.on('connect', () => {
        console.log('Connected to the server!');
      });


    
