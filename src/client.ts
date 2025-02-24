const socket = io({
  auth:{
    serverOffset: 0
  }
});
const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('input') as HTMLInputElement;
const messages = document.getElementById('messages') as HTMLElement;
const toggeleButton = document.getElementById('toggele-btn') as HTMLButtonElement;

      toggeleButton.addEventListener('click', (e)=>{
        e.preventDefault();
        if(socket.connected){
          toggeleButton.innerText = 'Connect';
          socket.disconnect();
        }else{
          toggeleButton.innerText = 'Disconnect';
          socket.connect();
        }
      });

      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        if(input.value){
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });

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