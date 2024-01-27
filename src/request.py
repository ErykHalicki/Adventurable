from openai import OpenAI

client = OpenAI()
print("initialized OpenAI client")

def requestGPT4(request):
    print("sending request")
    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "user",
                "content": request,
            },
        ],
    )
    return completion.choices[0].message.content


print(requestGPT4("give me a list of features i should implement into my adventure planning website that uses gpt4 and web scraping to help create outdoor adventure plans for you"))
