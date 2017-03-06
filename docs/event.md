# eZchat Event
What does the server returns upon receiving an event from the client.

## New Message
When a clients emit a *new message* event the server returns an object with the username and the content of the message.

**Note:** The following events are reserved and should not be used as event names by your application:
- `error`
- `connect`
- `disconnect`
- `disconnecting`
- `newListener`
- `removeListener`
- `ping`
- `pong`
