from django.urls import path, re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', consumers.ChatConsumer),
    re_path(r'^ws/game/(?P<host_id>[^/]+)/$', consumers.HostGame),
]

