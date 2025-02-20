# -*- coding: utf-8 -*-
"""eventbrite_optimizer.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1aPqDycXltH5jCGniKuV9SzWzqhjNaUzY
"""

!pip install requests

import requests
import pandas as pd
import csv
import io
from bs4 import BeautifulSoup
import re

import google.generativeai as genai
import time
import json

from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os
from datetime import datetime, timedelta

import csv
import pytz

# Replace with your actual Eventbrite API OAuth token
oauth_token = 'G3RSICFSZ5N7LSFROJJT'

def get_event_info(event_id):
  # URL to access the event details
  url = f'https://www.eventbriteapi.com/v3/events/{event_id}/'

  # Headers for the request, including the OAuth token for authorization
  headers = {
      'Authorization': f'Bearer {oauth_token}'
  }

  # Make the GET request to the Eventbrite API
  response = requests.get(url, headers=headers)

  # Check if the request was successful (status code 200)
  if response.status_code == 200:
      event_data = response.json()
      link = (event_data.get("url"))
      start = (event_data.get("start").get("utc"))
      end = (event_data.get("end").get("utc"))
      return([link, start, end])
  else:
      print(f"Error fetching event: {response.status_code}")
      print(response.text)

def get_event_description(event_id):
  # URL to access the event details
  url = f'https://www.eventbriteapi.com/v3/events/{event_id}/'

  # Headers for the request, including the OAuth token for authorization
  headers = {
      'Authorization': f'Bearer {oauth_token}'
  }

  # Make the GET request to the Eventbrite API
  response = requests.get(url, headers=headers)

  # Check if the request was successful (status code 200)
  if response.status_code == 200:
      event_data = response.json()
      name = event_data.get("name").get("text")
      description = event_data.get("description").get("text")
      return([name, description])
  else:
      print(f"Error fetching event: {response.status_code}")
      print(response.text)

# URL of the Eventbrite page to scrape (replace with your target URL)
# Make an HTTP GET request to fetch the HTML content of the page

def get_from_url(pg):
  url = 'https://www.eventbrite.com/d/ma--worcester/all-events/?page=' + str(pg)
  response = requests.get(url)
  # print(url)
  if response.status_code == 200:
    # Parse the HTML content of the page using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Use a regular expression to find all event IDs in the URLs
    event_ids = []
    # Example pattern: Extract event IDs from URLs like '/e/event-name-tickets-1234567890'
    pattern = re.compile(r'/e/.+-tickets-(\d+)')

    # Find all anchor tags that might contain event links
    links = soup.find_all('a', href=pattern)

    # Extract event IDs from the href attribute
    for link in links:
        match = pattern.search(link['href'])
        if match:
            event_ids.append(match.group(1))  # Extract the event ID

    # Print the list of event IDs
    # print(f"Found {len(event_ids)} event IDs:")
    return event_ids
  else:
    print(f"Error: Unable to fetch the webpage (Status code: {response.status_code})")
    return []

def get_full_list_of_ids():
  curr_pg = 1
  brk = False
  full_list = []
  while brk == False:
    g = get_from_url(curr_pg)
    curr_pg += 1
    if g == [] or curr_pg == 7:
      brk = True
    else:
      full_list += g

  return list(set(full_list))

def get_type(elt):
  boole = type(elt) == list and elt != []
  return boole

def return_csv():
  header = ["link", "start", "end"]
  csv_data = [header] + list(map(get_event_info, get_full_list_of_ids()))
  csv_filtered_data = list(filter(get_type, csv_data))
  # csv_buffer = io.StringIO()

  # # Write data to the string buffer
  # csv_writer = csv.writer(csv_buffer)
  # csv_writer.writerows(csv_filtered_data)

  # # Get the CSV content as a string
  # csv_string = csv_buffer.getvalue()

  # # Close the buffer (optional but recommended)
  # csv_buffer.close()

  return csv_filtered_data

# file_path = "eventbrite.csv"

# # Write the CSV string to the file
# with open(file_path, "w", newline="") as file:
#     file.write(return_csv())

return_csv()

"""optimization stuff"""

def find_free_time_slots(events, overall_start, overall_end):
    ov_end_formatted = overall_end.replace(tzinfo=pytz.utc)
    free_slots = []
    current_time = overall_start.replace(tzinfo=pytz.utc)

    for event in events:
        event_start = datetime.fromisoformat(event['start']['dateTime'].replace('Z', '+00:00'))
        event_end = datetime.fromisoformat(event['end']['dateTime'].replace('Z', '+00:00'))

        # If there's a gap between the current time and the next event's start time
        if current_time < event_start:
            free_slots.append({"start": current_time, "end": event_start})

        # Move current time to the end of the current event
        current_time = max(current_time, event_end)

    # Add the final free slot (if there's a gap after the last event)
    if current_time < ov_end_formatted:
        free_slots.append({"start": current_time, "end": ov_end_formatted})

    return free_slots

def is_event_in_free_slot(event_start, event_end, free_slots):
    for slot in free_slots:
        free_start = slot['start']
        free_end = slot['end']

        # Check if the event is fully within a free slot
        if free_start <= datetime.strptime(event_start, "%Y-%m-%dT%H:%M:%S%z") and datetime.strptime(event_end, "%Y-%m-%dT%H:%M:%S%z") <= free_end:
            return True  # Event fits in this free slot

    return False

#here, event is a list
def eventbrite_event_works_for_calendar(event, calendar, overall_start, overall_end):

    free_slots = find_free_time_slots(pub_cal_events(calendar, "AIzaSyA8TFHR7F3fVK0JvJ6oTcgScFSqVtdN-EI"), overall_start, overall_end)
    return is_event_in_free_slot(event[1], event[2], free_slots)

def filter_calendar(event_csv, calendar, overall_start, overall_end):
    full_event_list = return_csv()[1:]

    def helper_to_1_0(event):
      if eventbrite_event_works_for_calendar(event, calendar, overall_start, overall_end):
        return 1
      else:
        return 0

    return list(map(helper_to_1_0, full_event_list))

def combine_lists(event_csv, calendars_list, overall_start, overall_end):
    combined_lists = []

    for calendar in calendars_list:
        if combined_lists == []:
            combined_lists = filter_calendar(event_csv, calendar, overall_start, overall_end)
        else:
            combined_lists = [a + b for a, b in zip(combined_lists, filter_calendar(event_csv, calendar, overall_start, overall_end))]

    max_index = combined_lists.index(max(combined_lists))

    indices = []
    maxim = max(combined_lists)
    for i, value in enumerate(combined_lists):
        if value == maxim:
            indices.append(i)

    options = []
    for i in indices:
        options.append(convert_csv_to_list(event_csv)[1+i])
    return options

def pub_cal_events(CALENDAR_ID, API_KEY):
    # Build the Calendar API service
    service = build("calendar", "v3", developerKey=API_KEY)

    # Fetch events from the public calendar
    events_result = service.events().list(
        calendarId=CALENDAR_ID,
        maxResults=10,  # Limit the number of events retrieved
        singleEvents=True,  # Expand recurring events into separate instances
        orderBy="startTime"  # Order events by start time
    ).execute()

    events = events_result.get("items", [])
    return list(map(convert_to_utc, events))

def convert_to_utc(event):
  event['start']['dateTime'] = datetime.fromisoformat(event['start']['dateTime']).astimezone(pytz.utc).isoformat()
  event['end']['dateTime'] = datetime.fromisoformat(event['end']['dateTime']).astimezone(pytz.utc).isoformat()
  return event

def return_possible(calendar_id_list):
  return combine_lists("/content/eventbrite.csv", calendar_id_list, datetime.now(), datetime.now() + timedelta(days=7))

def rate_all(event_id_list):
  r = lambda x: rate_id(x, "AIzaSyDoV7eHyA_DLu5zqQlG1YlUNcC-c3GEDQs")
  return list(map(r, event_id_list))

def rate_id(event_id, API_KEY):
  desc = get_event_description(event_id)
  return {
      "family friendly ai rating": ai_rating_family_friendly(desc[0], desc[1], API_KEY),
      "vegetarian ai rating": ai_rating_vegetarian(desc[0], desc[1], API_KEY),
      "spicy ai rating": ai_rating_spicy(desc[0], desc[1], API_KEY)
  }



def score_event(preferences, ratings):
  return preferences["vegetarian score"] * float(ratings["vegetarian ai rating"]) + preferences["family friendly score"] * float(ratings["family friendly ai rating"]) + preferences["spicy score"] * float(ratings["spicy ai rating"])

def get_url_id(url):
    # Regular expression to match numbers at the end of a URL
    pattern = r"(\d+)$"
    match = re.search(pattern, url)

    if match:
        return match.group(1)  # Extract the matched number
    else:
        return None  # Return None if no number is found

"""chatgpt"""

def ai_rating_family_friendly(title, description, API_KEY):
  genai.configure(api_key=API_KEY)
  model = genai.GenerativeModel("gemini-1.5-flash")
  response = model.generate_content(
      "give me a decimal between 0 and 1 that represents how likely an event named"
      + title + "and with description" + description + "is to be family friendly. do not elaborate, only give the number")
  return response.text

def ai_rating_vegetarian(title, description, API_KEY):
  genai.configure(api_key=API_KEY)
  model = genai.GenerativeModel("gemini-1.5-flash")
  response = model.generate_content(
      "give me a decimal between 0 and 1 that represents how likely an event named"
      + title + "and with description" + description + "is to offer vegetarian food options. do not elaborate, only give the number")
  return response.text

def ai_rating_spicy(title, description, API_KEY):
  genai.configure(api_key=API_KEY)
  model = genai.GenerativeModel("gemini-1.5-flash")
  response = model.generate_content(
      "give me a decimal between 0 and 1 that represents how likely an event named"
      + title + "and with description" + description + "is to offer spicy food options. do not elaborate, only give the number")
  return response.text

def preference_scores(list_json):
  vegetarian_score = 0
  family_friendly_score = 0
  spicy_score = 0
  for i in list_json:
    if i["vegetarian"] == True:
      vegetarian_score += 1
    if i["family_friendly"] == True:
      family_friendly_score += 1
    if i["spicy"] == True:
      spicy_score += 1
  lent = len(list_json)
  vegetarian_score /= lent
  family_friendly_score /= lent
  spicy_score /= lent
  return {
      "vegetarian score": vegetarian_score,
      "family friendly score": family_friendly_score,
      "spicy score": spicy_score
  }

def json_list_to_cal_id_list(json_list):
  return list(map(lambda x: x["calendar_email_id"], json_list))

def get_numbers_from_url(url):
    # Regular expression to match numbers at the end of a URL
    pattern = r"/(\d+)$"
    match = re.search(pattern, url)

    if match:
        return match.group(1)  # Extract the matched number
    else:
        return None  # Return None if no numbers are found

def top_3_events(list_json):
  opts = return_possible(json_list_to_cal_id_list(list_json))
  elts = []
  for sublist in opts:
      elts.append(sublist[0])
  elts
  rates = rate_all(list(map(get_url_id, elts))[:4])
  t = lambda x: score_event(preference_scores(test_list), rates[x])
  scores = list(map(t, range(len(rates))))
  sorted_indexes = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
  top_3 = []
  for i in sorted_indexes[:3]:
    top_3.append(elts[i])
  return top_3

test_1 = {
    "calendar_email_id": "h8kureivideostorage0001@gmail.com",
    "vegetarian": False,
    "family_friendly": True,
    "spicy": True
}

test_2 = {
    "calendar_email_id": "h8kureivideostorage0002@gmail.com",
    "vegetarian": True,
    "family_friendly": False,
    "spicy": True
}

test_3 = {
    "calendar_email_id": "h8kureivideostorage0004@gmail.com",
    "vegetarian": True,
    "family_friendly": False,
    "spicy": True
}

test_list = [test_1, test_2, test_3]

def link_to_info(url):
  return get_event_info(get_url_id(url))+get_event_description(get_url_id(url))

def link_to_dict(url):
  keys = ["link", "start", "end", "title", "description"]
  values = link_to_info("https://www.eventbrite.com/e/power-time-x-boston-tickets-1055861252429")
  result_dict = dict(zip(keys, values))
  return result_dict

def top_3_events_dict(list_json):
  return json.dumps(list(map(link_to_dict, top_3_events(list_json))))

def main(json_file):
  return top_3_events_dict(json.loads(json_file))

!pip freeze > requirements.txt