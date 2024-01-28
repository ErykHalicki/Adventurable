import json
import googlemaps
import pathlib
from openai import OpenAI
import re
import subprocess

jsonFile=open("../keys.json","r")
dataJson = json.load(jsonFile)
gptClient = OpenAI()

mapsClient = googlemaps.Client(dataJson["google"])
photoDir="myapp/static/photos/"
photoDirShort="/static/photos/"

prompt1="You are a website designed to help users find incredibly fun adventures. When data is given to you, you recommend locations someone could visit, taking into account all the restrictions given, while trying to make sure the adventure is as fun as possible. Output only the names of the locations, in json format. in the json format you will also include the 'area' that the location is in, this shouldnt be the area that the user provided, but rather a more specific/local description; for example if the returned location was La Push beach, the area would be Quileute Indian Reservation, Washngton, USA. Make sure to give me exactly 3 options. Here is your data: "

prompt2="Generate a comprehensive and user-friendly adventure guide for [Desired Location], ensuring detailed information on how to prepare for the trip, must-try activities, and key attractions. Provide a balanced mix of practical tips and exciting recommendations to make the guide engaging and informative. Aim for clarity and brevity, presenting the information in a format that is easy to read and digest. Include insights on weather considerations, recommended gear, local cuisine, top landmarks, and any unique experiences that make [Desired Location] a must-visit adventure destination. The goal is to create a guide that sparks the reader's excitement while equipping them with all the essential information for an unforgettable adventure.\nExample: [Desired Location]\n[Rating]: [Insert Stars]\n[Best Time to Go]: [Insert Best Time of Year]\nActivities:\n[Activity 1] - [Brief description]\n[Activity 2] - [Brief description]\n[Activity 3] - [Brief description]\n[Activity 4] - [Brief description]\n[Activity 5] - [Brief description]\nPreparation:\n[Preparation Tip 1] - [Brief explanation]\n[Preparation Tip 2] - [Brief explanation]\n[Preparation Tip 3] - [Brief explanation]\n[Preparation Tip 4] - [Brief explanation]\n[Preparation Tip 5] - [Brief explanation]\nkeep the guide human like, avoiding robotic or cold sounding text. here is your location: "

def getGoogleLocation(location):
    result= mapsClient.find_place(input=location, input_type="textquery", fields=["name","place_id","photos"] )["candidates"][0]
    files = [f for f in pathlib.Path().glob("myapp/static/photos/"+result["place_id"]+".jpg") if f.is_file()]
    if(len(files)==0):
        print("create new image file")
        f = open(photoDir+result["place_id"]+".jpg", 'wb')
        photo_reference=result['photos'][0]['photo_reference']
        for chunk in mapsClient.places_photo(photo_reference, max_width=800):
            if chunk:
                f.write(chunk)
        f.close()
    return result

def requestInfo(request):
    print("sending request")
    temp=prompt2+str(request)
    completion = gptClient.chat.completions.create(
        model="gpt-4-0125-preview",
               messages=[
            {
                "role": "user",
                "content": temp,
            },
        ],
    )
    return completion.choices[0].message.content

def requestGPT4(request):
    print("sending request")
    temp=prompt1+str(request)
    completion = gptClient.chat.completions.create(
        model="gpt-4-0125-preview",
               messages=[
            {
                "role": "user",
                "content": temp,
            },
        ],
    )
    return completion.choices[0].message.content

def createLocationList(request):
    locations={}
    gptResponse=requestGPT4(request)
    json_match = re.search(r'\[.*\]', gptResponse, re.DOTALL)
    if json_match:
        json_data = json.loads(json_match.group(0))
        for location in json_data:
            googleResponse=getGoogleLocation(location["name"])
            locations[googleResponse["place_id"]]={
                                                    "name":googleResponse["name"],
                                                    "area":location["area"],
                                                    "image_url":photoDirShort+googleResponse["place_id"]
                                                    }
    else:
        print("No JSON data found.")
    return locations
