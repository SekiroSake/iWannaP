# iWannaP
For Udacity Front-End Developer Nanodegree

## Test run
go to http://wang-hang.com/
and click on iWannaP

## About
* This app helps you to find local restrooms in San Francisco area.
* Up to three most visited nearby places around the restroom.

## How To Run
Clone this branch to your localhost and run index.html

## API used
* Google Maps JavaScript API
* Google Street View Image API
* Foursquare API

### Update log
* Rewrote the whole javascript file for googlemaps async style
* Added foursquare api fail loading msg inside the infowindow of googlemap
* Fiexed css for mobile screen
* Added a third party API - Foursquare API
* New login art design
* Cleaned code
* Marker animated
* Deleted drop down recommendation box and merged it into googlemap info box.
* Fixed login animation


### How to make Google maps async style STEP BY STEP
* Add "async defer" and "allback=initMap" in html
* Merge viewModel into initMap function
* Call viewModel.init() & ko.applyBindings inside initMap 
* Redefine some key variables
* Delete document ().ready functions
* Some minor changes base on cases
