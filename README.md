# BlockyBridge

## About the project

BlockyBridge is a discord API wrapper for the @server/minecraft-net module of BDS, which tries to provide almost every feature of the API.

### Example

```ts
const poll = await new Poll(client)
  .setDuration(1)
  .setQuestion('Do you like Minecraft?')
  .addOption({
    pollMedia: { text: 'Yes!' },
  })
  .addOption({
    pollMedia: { text: 'No.' },
  })
  .send(channel);

system.runTimeout(async () => {
  world.sendMessage('Poll Finished!');
  const results = await poll.end();
  const mostVoted = results.highestVotedAnswer;
  const mostVotedResults = results.getResults(mostVoted);
  const optionName = poll.getOption(mostVoted)!.pollMedia.text ?? 'Unknown';

  world.sendMessage(`The server answered: ${optionName} with ${mostVotedResults.count} votes!`);
}, TicksPerSecond * 30);
```

## Getting Started

### TypeScript

If your project is wrote in TypeScript, you can clone this repository and use it as a library, since the library will build with your project.

### JavaScript

Otherwise if your project is written in JavaScript, you can go to [releases](https://github.com/Felipe-devr/BlockyBridge/releases) and download the latest version of the library.

### TODO List

| Concept              |                                                     Description                                                      |    Status |
| :------------------- | :------------------------------------------------------------------------------------------------------------------: | --------: |
| Login                |                                  Checks for discord authentication and valid token                                   |   :chart: |
| Events               | NOTE: Beware of discord rate limit. Because Scripting-API does not have websockets we cant actually listen to events | :warning: |
| Guilds               |                                      Guild management and data: Missing Fields                                       | :warning: |
| Channels             |        Channels types and structures, Missing types: Voice Channels and not text based, and missing raw data         | :warning: |
| Messages             |                                     Message builder and raw data: missing fields                                     | :warning: |
| Embeds               |                                       Embed creation and addition to messages                                        |   :chart: |
| Attachments          |                                       Including files, images, etc to messages                                       |       :x: |
| Polls                |                                              Poll builder, poll results                                              |   :chart: |
| Users                |                                         DM creation, user data, guild member                                         |   :chart: |
| Role                 |                            Modify, create and remove roles: Only get roles at the moment                             |       :x: |
| Emoji Managment      |                                     Modify, add and remove emojis in the server                                      |       :x: |
| Invite               |                                         Get and remove invites in the server                                         |       :x: |
| Discord Monetization |                                              Not planned implementation                                              |       :x: |
| Sticker Managment    |                                    Modify, add and remove stickers in the server                                     |       :x: |
| Soundboard           |                              Modify, add and remove sounds in the server (Not planned)                               |       :x: |
