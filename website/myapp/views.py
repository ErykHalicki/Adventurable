from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def submit_form(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        for d in data:
            print(d)
        print(data)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'})

def main_page(request):
    return render(request,'index.html')
def planner(request):
    return render(request,'planner.html')

