from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import googlemaps

mapsClient = googlemaps.Client("AIzaSyAJJ_vstzJNHUQtkYZYRvZqyBt-x0sqM8A")

def getGoogleLocation(location):
    result= mapsClient.find_place(input=location, input_type="textquery", fields=["name","place_id","photos"] )["candidates"][0]
    f = open("test.jpg", 'wb')
    photo_reference=result['photos'][0]['photo_reference']
    for chunk in mapsClient.places_photo(photo_reference, max_width=800):
        if chunk:
            f.write(chunk)
    f.close()
    return result

@csrf_exempt
def submit_form(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(getGoogleLocation("Algonquin Park"))
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'})

def main_page(request):
    return render(request,'index.html')
def planner(request):
    return render(request,'planner.html')
def results(request):
    return render(request,'results.html')
