# @refractjs/framework

## Not production ready

This framework is still in development and I wouldn't recommend using it in production yet (or ever?).
I made this framework for a private bot years ago, but it just sit in an old repository for a long time. I decided to rewrite it and make it public.

## Credits

This framework has been inspired by [Sapphire Framework](https://github.com/sapphiredev/framework/).
I've used some of their code and ideas to create this framework.

## Terms

### RefractClient

The main class of the framework. Extends the Discord.js Client class.

### Piece

A piece is a class that can be loaded. It can have multiple commands, listeners, etc.

### Plugin

A plugin is like a category. Each piece is stored in a global store, but it can/should be assigned to a plugin.
The idea is that pieces should be split into different plugins. For example, a leveling plugin would have all the commands, listeners, etc. related to leveling.

## Example

### Command

```ts
@Command({
  name: "slap",
  description: "Slap someone",
})
public async command(
  interaction: ChatInputCommandInteraction,
  @UserOption({
    name: "user",
    description: "The user to slap",
  })
  user: User
) {
  await interaction.reply(`You slapped ${user.username}!`);
}
```

### Listener

```ts
@Listener({
  name: "messageCreate",
})
public async listener(message: Message) {
  console.log(`${message.author.username}: ${message.content}`);
}
```

### Cron

```ts
@Cron("* * * * *")
public async cron() {
  this.client.logger.info("I run every minute!");
}
```

### Button/SelectMenu/ModalSubmit

```ts
@Button({
  customId: "test",
  // or
  filter: (interaction) => interaction.customId === "test",
})
public async button(interaction: ButtonInteraction) {
  await interaction.reply("You clicked the button!");
}
```

### Future plans

- [ ] Scheduled tasks
- [ ] User/Message context commands
- [ ] More extendability (contexts, etc.)
- [ ] Dependency injection (maybe?)
- [ ] Documentation and guides
