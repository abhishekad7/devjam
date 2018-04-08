from django.urls import path, re_path

from . import views

urlpatterns = [
	path('', views.home, name='home'),
	path('game/', views.game, name='game'),
	path('game/host/', views.host_game, name='host_game'),
	path('game/join/', views.join_game, name='join_game'),
	path('game/unhost/', views.unhost_game, name='unhost_game'),
	path('game/unjoin/', views.unjoin_game, name='unjoin_game'),
	path('game/search', views.search, name='search'),
    path('chat/', views.index, name='index'),
    re_path(r'^chat/(?P<room_name>[^/]+)/$', views.room, name='room'),
]