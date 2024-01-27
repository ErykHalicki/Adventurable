from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from .models import Item

def index(request):
    items = Item.objects.all()
    return render(request, 'index.html', {'items': items})
