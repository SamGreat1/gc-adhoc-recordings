# Place a Call
This extension allow to be embedded into PureCloud interface and via Place a Call button initiate new Call

## Installation steps
Follow below steps to enable this functionality in your org

* Create a new OAuth for SendSMS functionality (Token Implicit Grant)
* Set Authorized URIs to `https://szlaskidaniel.github.io/purecloud-send-sms/index.html`
* Copy created clientId.
* Create / reuse Inbound Script for Calls
* Add new WebComponent and set it's url to the `https://szlaskidaniel.github.io/purecloud-place-call/index.html?queueId={{Scripter.Queue ID}}&phoneNumber={{Scripter.Customer Formatted Number}}`

* It's good that width of the image takes 100% of the window (notification messages) and heigh should be at least 200px.

