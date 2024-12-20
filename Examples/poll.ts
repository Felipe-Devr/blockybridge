import { system, TicksPerSecond, world } from '@minecraft/server';
import { Poll } from 'builders';
import { Client } from 'client';

const channelId = '1128450108866969603';

async function pollExample(client: Client) {
  const channel = await client.channels.resolve(channelId);

  if (!channel.isTextBased()) return;
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

  // ? End the poll after 20 seconds
  system.runTimeout(async () => {
    world.sendMessage('Poll Finished!');
    const results = await poll.end();
    const mostVoted = results.highestVotedAnswer;
    const mostVotedResults = results.getResults(mostVoted);
    const optionName = poll.getOption(mostVoted)!.pollMedia.text ?? 'Unknown';

    world.sendMessage(`Server Poll! The server answered: ${optionName} with ${mostVotedResults.count} votes!`);
  }, TicksPerSecond * 5);
}

export { pollExample };
