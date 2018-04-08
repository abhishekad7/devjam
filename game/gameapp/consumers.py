from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Hosted

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        #Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )



        await self.accept()

    async def disconnect(self, close_code):
        #Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'name': message,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        name = event['name']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'name': name,
        }))



class HostGame(AsyncWebsocketConsumer):


    async def connect(self):
        self.host_id = self.scope['url_route']['kwargs']['host_id']
        self.game_name = 'game_%s' % self.host_id

        #Join room group

        self.game=Hosted.objects.filter(id=int(self.host_id)).first()
        if self.game.two<2:
            await self.channel_layer.group_add(
                self.host_id,
                self.channel_name
            )

            await self.accept()
            self.game.two+=1
            self.game.save()



    async def disconnect(self, close_code):
        #Leave room group
        await self.channel_layer.group_discard(
            self.host_id,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        data_type = data['type']
        avatar = data['avatar']
        user=data['user']

        if data_type=="connect":

            await self.channel_layer.group_send(
                self.host_id,
                {
                    'type': "connected",
                    'avatar': avatar,
                    'user':user,
                }
            )

        if data_type=="disconnect":

            await self.channel_layer.group_send(
                self.host_id,
                {
                    'type': "disconnected",
                    'avatar': avatar,
                    'user':user,
                }
            )

        if data_type=="host_disconnect":

            await self.channel_layer.group_send(
                self.host_id,
                {
                    'type': "host_disconnected",
                    'avatar': avatar,
                    'user':user,
                }
            )

        if data_type=="ready":
            readygame=data["ready"]

            await self.channel_layer.group_send(
                self.host_id,
                {
                    'type': "ready",
                    'avatar': avatar,
                    'user':user,
                    'ready':readygame,
                }
            )

        if data_type=="startgame":
            print("group")

            await self.channel_layer.group_send(
                self.host_id,
                {
                    'type': "startgame",
                    'avatar': avatar,
                    'user':user,
                }
            )



    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    #on game joining

    async def connected(self, event):
        avatar = event['avatar']
        user = event['user']
        context = {'type':"connect", 'avatar':avatar, 'user':"guest"}
        await self.send(text_data=json.dumps(context))


        #on leaving game
    async def disconnected(self, event):
        avatar = event['avatar']
        user = event['user']
        context = {'type':"disconnect", 'avatar':avatar, 'user':"guest"}
        await self.send(text_data=json.dumps(context))
        
        #on disconnecting host
    async def host_disconnected(self, event):
        avatar = event['avatar']
        user = event['user']
        context = {'type':"host_disconnect", 'avatar':avatar, 'user':"host"}
        await self.send(text_data=json.dumps(context))


        #on ready to play
    async def ready(self, event):
        avatar = event['avatar']
        user = event['user']
        readygame=event['ready']
        context = {'type':"ready", 'avatar':avatar, 'user':user, 'readygame':readygame}
        await self.send(text_data=json.dumps(context))



    async def startgame(self, event):
        print("consume")
        avatar = event['avatar']
        user = event['user']
        context = {'type':"startgame", 'avatar':avatar, 'user':user}
        await self.send(text_data=json.dumps(context))

    
