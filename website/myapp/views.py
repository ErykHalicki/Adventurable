from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import apis

@csrf_exempt
def submit_form(request):
    if request.method == 'POST':
        #data = json.loads(request.body)
        locations=apis.createLocationList(request.body)
        #locations is a python dicttionary containing info about the reccomend places to visit        
        return JsonResponse(locations)
    return JsonResponse({'status': 'error'})

def main_page(request):
    return render(request,'index.html')
def planner(request):
    return render(request,'planner.html')
def results(request):
    return render(request,'results.html')
