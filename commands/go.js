const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('go')
        .setDescription('Start a new game')
        .addUserOption(option =>
            option.setName('opponent')
                .setDescription('Who do you want to play with?')
                .setRequired(true)
        ),
    async execute(interaction) {
    // Defer first so Discord knows we’re handling it
    await interaction.deferReply({ ephemeral: true });

    const player1 = interaction.user;
    const player2 = interaction.options.getUser('opponent');

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`accept_${player1.id}_${player2.id}`)
                .setLabel('Accept Game')
                .setStyle(ButtonStyle.Primary)
        );

    try {
        // DM the other player
        await player2.send({ content: `${player1.username} wants to play Go with you. Accept?`, components: [row] });

        // Edit deferred reply
        await interaction.editReply({ content: `Invitation sent to ${player2.username}.` });
    } catch (err) {
        console.error(err);
        await interaction.editReply({ content: `Could not send DM to ${player2.username}. They might have DMs closed.` });
    }
}

};
