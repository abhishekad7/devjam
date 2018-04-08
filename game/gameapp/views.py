from django.shortcuts import render
from django.utils.safestring import mark_safe
import json
from django.http import *
from .models import Hosted

# Create your views here.


def index(request):
    return render(request, 'gameapp/index.html', {})



def room(request, room_name):
    return render(request, 'gameapp/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name))
    })

def home(request):
	hostname=request.META['HTTP_HOST'].strip().split(':')[0]
	return render(request, 'gameapp/home.html',{'host':hostname})


def game(request):
	avatar=request.GET.get("avatar")
	if not avatar:
		return HttpResponseRedirect("/")
	hostname=request.META['HTTP_HOST'].strip().split(':')[0]
	return render(request, 'gameapp/game.html', {'host': hostname, 'avatar': avatar})


def host_game(request):
	context={'success': False}
	name=request.GET.get("avatar")
	if not name:
		return JsonResponse(context)
	u=Hosted.objects.create(hostname=name)
	context["host_id"]=u.id;
	context["success"]=True
	return JsonResponse(context)


def search(request):
	context={"success":False}
	plays=Hosted.objects.filter(ingame=False)
	plis=[]
	for pl in plays:
		plis.append([pl.hostname,pl.id])

	context["players"]=plis
	context["success"]=True
	return JsonResponse(context)


def unhost_game(request):
	context={'success': False}
	name=request.GET.get("id")
	if not name:
		return JsonResponse(context)
	Hosted.objects.filter(id=int(name)).delete()
	context["success"]=True
	return JsonResponse(context)

def unjoin_game(request):
	context={'success': False}
	name=request.GET.get("id")
	if not name:
		return JsonResponse(context)
	h=Hosted.objects.filter(id=int(name)).first()
	h.two=1
	h.save()
	context["success"]=True
	return JsonResponse(context)


def join_game(request):
	context={'success': False}
	join_id=request.GET.get("id")
	if not join_id:
		return JsonResponse(context)
	u=Hosted.objects.filter(id=int(join_id)).first()
	if not u:
		context["error"]="Invalid Room Id"
		return JsonResponse(context)
	if(u.two>=2):
		return JsonResponse(context)
	context["success"]=True
	context["host_name"]=u.hostname
	return JsonResponse(context)
